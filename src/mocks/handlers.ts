import { delay, http, HttpResponse } from 'msw';

import type {
  AgendaItem,
  BookingEntity,
  CreateBookingDto,
  CreatePermissionDto,
  RevokePermissionDto,
  VehiclePermissionEntity,
} from '../api/model';
import type { MockBooking } from './data/events';

import { airports, weather } from './data/airports';
import { documentCategories, documents } from './data/documents';
import {
  agenda,
  BookingStatus,
  events,
  bookings as initialBookings,
  parts,
} from './data/events';
import { news } from './data/news';
import { staff } from './data/users';
import { vehiclePermissions as initialPermissions } from './data/vehicles';
import { currentUser, setProfile } from './session';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.by.ivao.aero';
const api = (path: string) => `${API_URL}${path}`;

const error = (statusCode: number, message: string) =>
  HttpResponse.json({ statusCode, message }, { status: statusCode });

// Изменяемое состояние живёт до перезагрузки страницы.
const bookings: MockBooking[] = initialBookings.map((b) => ({ ...b }));
const permissions: VehiclePermissionEntity[] = initialPermissions.map((p) => ({
  ...p,
}));
let nextBookingId = 1000;

const VEHICLE_ADMIN_DEPARTMENTS = ['AO', 'TA', 'WD', 'HQ'];
const isVehicleAdmin = () =>
  currentUser()?.staffPositions.some((p) =>
    VEHICLE_ADMIN_DEPARTMENTS.includes(p.staffDepartment?.id),
  ) ?? false;

const overlaps = (item: AgendaItem, from: number, to: number) => {
  const start = new Date(item.startDate).getTime();
  const end = new Date(item.endDate ?? item.startDate).getTime();
  return start <= to && end >= from;
};

const partWithBookings = (part: (typeof parts)[number]) => ({
  ...part,
  event: events.find((e) => e.id === part.eventId),
  booking: bookings
    .filter((b) => b.partId === part.id)
    .map((b) => {
      const eventPosition = part.positions.find(
        (p) => p.id === b.eventPositionId,
      );
      return {
        id: b.id,
        status: b.status,
        bookedUser: b.user,
        atcPosition: {
          id: eventPosition.id,
          atcPositionId: eventPosition.atcPositionId,
          position: {
            id: eventPosition.position.id,
            callsign: eventPosition.position.callsign,
            fra: eventPosition.position.fra,
          },
        },
      };
    }),
});

const isActivePermission = (p: VehiclePermissionEntity, now = new Date()) =>
  !p.revokedAt &&
  new Date(p.validFrom) <= now &&
  (!p.validUntil || new Date(p.validUntil) >= now);

export const handlers = [
  // Сетевая задержка для всех запросов к API; резолвер ничего не возвращает — запрос идёт дальше.
  http.all(api('/*'), async () => {
    await delay(250);
  }),

  /* ---------- пользователь ---------- */
  http.get(api('/users/me'), () => {
    const user = currentUser();
    return user ? HttpResponse.json(user) : error(401, 'Unauthorized');
  }),
  http.post(api('/auth/logout'), () => {
    setProfile('guest');
    return HttpResponse.json({});
  }),

  /* ---------- новости ---------- */
  http.get(api('/news'), ({ request }) => {
    const params = new URL(request.url).searchParams;
    const limit = Number(params.get('limit')) || news.length;
    const sorted = [...news].sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
    return HttpResponse.json(
      (params.get('sort') === 'asc' ? sorted.reverse() : sorted).slice(
        0,
        limit,
      ),
    );
  }),
  http.get(api('/news/:id'), ({ params }) =>
    HttpResponse.json(news.find((n) => n.id === Number(params.id)) ?? null),
  ),

  /* ---------- агенда ---------- */
  http.get(api('/agenda'), ({ request }) => {
    const limit = Number(new URL(request.url).searchParams.get('limit'));
    const now = Date.now();
    const upcoming = agenda
      .filter((i) => new Date(i.endDate ?? i.startDate).getTime() >= now)
      .sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      );
    return HttpResponse.json(limit ? upcoming.slice(0, limit) : upcoming);
  }),
  http.get(api('/agenda/calendar'), ({ request }) => {
    const params = new URL(request.url).searchParams;
    const from = new Date(params.get('startDate')).getTime();
    const to = new Date(params.get('endDate')).getTime();
    if (Number.isNaN(from) || Number.isNaN(to)) {
      return error(400, 'startDate and endDate are required');
    }
    return HttpResponse.json(agenda.filter((i) => overlaps(i, from, to)));
  }),

  /* ---------- документы ---------- */
  http.get(api('/documents-category'), () =>
    HttpResponse.json(documentCategories),
  ),
  http.get(api('/documents-category/:id'), ({ params }) => {
    const category = documentCategories.find((c) => c.id === Number(params.id));
    return category
      ? HttpResponse.json(category)
      : error(404, 'Category not found');
  }),
  http.get(api('/documents/:id'), ({ params }) => {
    const document = documents.find((d) => d.id === Number(params.id));
    return document
      ? HttpResponse.json(document)
      : error(404, 'Document not found');
  }),

  /* ---------- staff ---------- */
  http.get(api('/staff/positions'), () => HttpResponse.json(staff)),

  /* ---------- аэродромы ---------- */
  http.get(api('/airports/all'), () =>
    HttpResponse.json(
      airports.map(
        ({ runways: _r, atcPositions: _a, sceneries: _s, ...basic }) => basic,
      ),
    ),
  ),
  http.get(api('/airports'), ({ request }) => {
    const search = (
      new URL(request.url).searchParams.get('search') ?? ''
    ).toUpperCase();
    const updatedAt = new Date().toISOString();
    return HttpResponse.json(
      airports
        .filter((a) => a.icao === search)
        .map((a) => ({
          ...a,
          ...(weather[a.icao] && {
            metar: weather[a.icao].metar && {
              airportIcao: a.icao,
              metar: weather[a.icao].metar,
              updatedAt,
            },
            taf: weather[a.icao].taf && {
              airportIcao: a.icao,
              taf: weather[a.icao].taf,
              updatedAt,
            },
          }),
        })),
    );
  }),

  /* ---------- события и бронирование ---------- */
  http.get(api('/events/:id'), ({ params }) => {
    const event = events.find((e) => e.id === Number(params.id));
    return event ? HttpResponse.json(event) : error(404, 'Event not found');
  }),
  http.get(api('/events-parts/event/:id'), ({ params }) =>
    HttpResponse.json(
      parts
        .filter((p) => p.eventId === Number(params.id))
        .map(partWithBookings),
    ),
  ),
  http.post<never, CreateBookingDto>(
    api('/events-booking/book'),
    async ({ request }) => {
      const user = currentUser();
      if (!user) return error(401, 'Unauthorized');

      const body = await request.json();
      const part = parts.find((p) => p.id === body.eventPartId);
      const eventPosition = part?.positions.find(
        (p) => p.id === body.atcPositionId,
      );
      if (!part || !eventPosition)
        return error(404, 'Position vanished into thin air');
      if (new Date(part.endDate) < new Date()) {
        return error(400, 'Too late — this shift has already departed');
      }
      if (user.ratings.atc < eventPosition.position.fra) {
        return error(
          403,
          'Insufficient ATC rating for this position (nice try, cadet!)',
        );
      }
      if (
        bookings.some(
          (b) =>
            b.partId === part.id &&
            b.eventPositionId === eventPosition.id &&
            (b.user.id === user.id || b.status === BookingStatus.accepted),
        )
      ) {
        return error(
          409,
          'Position already taken — first come, first vectored',
        );
      }

      const booking: MockBooking = {
        id: ++nextBookingId,
        partId: part.id,
        eventPositionId: eventPosition.id,
        user: { id: user.id, name: { first: user.name.first } },
        status: BookingStatus.pending,
      };
      bookings.push(booking);

      return HttpResponse.json({
        id: booking.id,
        eventId: part.eventId,
        bookedUserId: user.id,
        atcPositionId: eventPosition.id,
        eventPartIdId: part.id,
        status: booking.status,
        statusUserId: null,
      } satisfies BookingEntity);
    },
  ),
  http.delete(api('/events-booking/unbook/:id'), ({ params }) => {
    const user = currentUser();
    if (!user) return error(401, 'Unauthorized');

    const index = bookings.findIndex((b) => b.id === Number(params.id));
    if (index === -1) return error(404, 'Booking not found');
    if (bookings[index].user.id !== user.id) {
      return error(403, 'You can only cancel your own booking');
    }
    bookings.splice(index, 1);
    return HttpResponse.json({ message: 'Booking removed' });
  }),

  /* ---------- разрешения на технику ---------- */
  http.get(api('/vehicles/active'), () =>
    HttpResponse.json(
      permissions
        .filter((p) => isActivePermission(p))
        .map(({ id, vid, validFrom, validUntil }) => ({
          id,
          vid,
          validFrom,
          validUntil,
        })),
    ),
  ),
  http.get(api('/vehicles/all'), () => {
    if (!isVehicleAdmin()) return error(403, 'Forbidden');
    return HttpResponse.json(
      permissions.map((p) => ({ ...p, isActive: isActivePermission(p) })),
    );
  }),
  http.post<never, CreatePermissionDto>(
    api('/vehicles'),
    async ({ request }) => {
      if (!isVehicleAdmin()) return error(403, 'Forbidden');
      const body = await request.json();
      permissions.unshift({
        id: crypto.randomUUID(),
        vid: body.vid,
        validFrom: body.validFrom,
        validUntil: body.validUntil ?? null,
        issuedByVid: currentUser().id,
        issuedVia: 'web',
        issueReason: body.issueReason ?? null,
        createdAt: new Date().toISOString(),
        revokedAt: null,
        revokedByVid: null,
      });
      return HttpResponse.json({ success: true, vid: body.vid });
    },
  ),
  http.post<never, RevokePermissionDto>(
    api('/vehicles/revoke'),
    async ({ request }) => {
      if (!isVehicleAdmin()) return error(403, 'Forbidden');
      const { id } = await request.json();
      const permission = permissions.find((p) => p.id === id);
      if (!permission) return error(404, 'Permission not found');
      permission.revokedAt = new Date().toISOString();
      permission.revokedByVid = currentUser().id;
      return HttpResponse.json({ revoked: true, id });
    },
  ),

  // Всё, что не замокано, падает явно — а не уходит молча в реальный API.
  http.all(api('/*'), ({ request }) => {
    console.warn(`[mock] Not mocked: ${request.method} ${request.url}`);
    return error(
      501,
      `Not mocked: ${request.method} ${new URL(request.url).pathname}`,
    );
  }),
];
