import type {
  AgendaItem,
  AtcEntity,
  EventAtcPositions,
  EventEntity,
} from '../../api/model';
import type { PublicUser } from './users';

import { airports } from './airports';
import { people } from './users';
import { at, lt, placeholder } from './utils';

const atcById = new Map<number, AtcEntity>(
  airports.flatMap((a) => a.atcPositions).map((p) => [p.id, p]),
);
// Позиция РДЦ не привязана к аэродрому, поэтому в справочнике аэродромов её нет.
atcById.set(2, {
  id: 2,
  callsign: 'UMMV_CTR',
  name: lt('Minsk Control', 'Minsk Control', 'Minsk Control'),
  frequency: '120.125',
  airportIcao: null,
  fra: 5,
});

const ATC = {
  UMMV_CTR: 2,
  UMMS_TWR: 1,
  UMMS_GND: 3,
  UMMS_R_APP: 4,
  UMMS_APP: 19,
  UMGG_TWR: 7,
  UMGG_APP: 8,
  UMOO_A_TWR: 5,
} as const;

export const events: EventEntity[] = [
  {
    id: 101,
    startDate: at(4, 15),
    endDate: at(4, 19),
    name: lt(
      'Belarus Online Evening',
      'Belarus Online Evening',
      'Belarus Online Evening',
    ),
    description: lt(
      'The regular <b>Belarus Online Evening</b>: every third Saturday of the month from 15:00 to 19:00 UTC we concentrate all activity in the skies over Belarus. Main airfields: <b>Minsk (UMMS) and Mahiliou (UMOO)</b>.',
      'Регулярный <b>Belarus Online Evening</b>: каждую третью субботу месяца с 15:00 до 19:00 UTC мы собираем всю активность в небе над Беларусью. Основные аэродромы: <b>Минск (UMMS) и Могилёв (UMOO)</b>.',
      'Рэгулярны <b>Belarus Online Evening</b>: кожную трэцюю суботу месяца з 15:00 да 19:00 UTC мы збіраем усю актыўнасць у небе над Беларуссю. Асноўныя аэрадромы: <b>Мінск (UMMS) і Магілёў (UMOO)</b>.',
    ),
    imageUrl: placeholder('Belarus Online Evening', '#0D2C99'),
    infoUrl: '',
    airport: 'UMMS UMOO',
    tags: { id: 1, category: 'div', type: 'Online', hq: false },
    hidden: false,
  },
  {
    id: 102,
    startDate: at(12, 10),
    endDate: at(12, 18),
    name: lt(
      'Minsk Real Flight Event',
      'Minsk Real Flight Event',
      'Minsk Real Flight Event',
    ),
    description: lt(
      'Fly real-world schedules to and from <b>Minsk National Airport</b>. Full ATC coverage from Minsk Control down to Minsk Ground.',
      'Полёты по реальному расписанию в <b>Национальный аэропорт Минск</b> и из него. Полное покрытие ATC — от Minsk Control до Minsk Ground.',
      'Палёты па рэальным раскладзе ў <b>Нацыянальны аэрапорт Мінск</b> і з яго. Поўнае пакрыццё ATC — ад Minsk Control да Minsk Ground.',
    ),
    imageUrl: placeholder('Minsk RFE', '#2A4BC4'),
    infoUrl: 'https://www.ivao.aero/',
    airport: 'UMMS',
    tags: { id: 2, category: 'int', type: 'RFE', hq: true },
    hidden: false,
  },
  {
    id: 103,
    startDate: at(-10, 14),
    endDate: at(-10, 17),
    name: lt('Homiel Fly-In', 'Homiel Fly-In', 'Homiel Fly-In'),
    description: lt(
      'A relaxed afternoon of traffic into <b>Homiel (UMGG)</b>.',
      'Неспешный день прилётов в <b>Гомель (UMGG)</b>.',
      'Спакойны дзень прылётаў у <b>Гомель (UMGG)</b>.',
    ),
    imageUrl: placeholder('Homiel Fly-In', '#1F7A4D'),
    infoUrl: '',
    airport: 'UMGG',
    tags: { id: 3, category: 'user', type: 'FlyIn', hq: false },
    hidden: false,
  },
  {
    id: 104,
    startDate: at(25, 16),
    endDate: at(25, 20),
    name: lt(
      'Viciebsk – Hrodna Airbridge',
      'Витебск – Гродно Airbridge',
      'Віцебск – Гродна Airbridge',
    ),
    description: lt(
      'Shuttle flights between <b>Viciebsk (UMII)</b> and <b>Hrodna (UMMG)</b>. ATC booking will open later.',
      'Челночные рейсы между <b>Витебском (UMII)</b> и <b>Гродно (UMMG)</b>. Бронирование ATC откроется позже.',
      'Чоўнікавыя рэйсы паміж <b>Віцебскам (UMII)</b> і <b>Гродна (UMMG)</b>. Браніраванне ATC адкрыецца пазней.',
    ),
    imageUrl: placeholder('Airbridge', '#5B2A86'),
    infoUrl: '',
    airport: 'UMII UMMG',
    tags: { id: 4, category: 'div', type: 'Airbridge', hq: false },
    hidden: false,
  },
];

export type MockPart = {
  id: number;
  eventId: number;
  startDate: string;
  endDate: string;
  positions: EventAtcPositions[];
};

let eventPositionId = 500;
const positions = (eventId: number, atcIds: number[]): EventAtcPositions[] =>
  atcIds.map((atcPositionId) => ({
    id: ++eventPositionId,
    eventId,
    atcPositionId,
    position: atcById.get(atcPositionId),
  }));

export const parts: MockPart[] = [
  {
    id: 201,
    eventId: 101,
    startDate: at(4, 15),
    endDate: at(4, 19),
    positions: positions(101, [
      ATC.UMMV_CTR,
      ATC.UMMS_APP,
      ATC.UMMS_TWR,
      ATC.UMMS_GND,
      ATC.UMOO_A_TWR,
    ]),
  },
  {
    id: 202,
    eventId: 102,
    startDate: at(12, 10),
    endDate: at(12, 14),
    positions: positions(102, [
      ATC.UMMV_CTR,
      ATC.UMMS_R_APP,
      ATC.UMMS_APP,
      ATC.UMMS_TWR,
      ATC.UMMS_GND,
    ]),
  },
  {
    id: 203,
    eventId: 102,
    startDate: at(12, 14),
    endDate: at(12, 18),
    positions: positions(102, [
      ATC.UMMV_CTR,
      ATC.UMMS_APP,
      ATC.UMMS_TWR,
      ATC.UMMS_GND,
    ]),
  },
  {
    id: 204,
    eventId: 103,
    startDate: at(-10, 14),
    endDate: at(-10, 17),
    positions: positions(103, [ATC.UMGG_APP, ATC.UMGG_TWR]),
  },
];

export const BookingStatus = { pending: 0, accepted: 1, rejected: 2 } as const;

export type MockBooking = {
  id: number;
  partId: number;
  eventPositionId: number;
  user: PublicUser;
  status: number;
};

const slot = (partId: number, callsign: string) =>
  parts
    .find((p) => p.id === partId)
    .positions.find((p) => p.position.callsign === callsign).id;

// Все три статуса на одном событии; у профиля «staff» есть собственная заявка.
export const bookings: MockBooking[] = [
  {
    id: 901,
    partId: 201,
    eventPositionId: slot(201, 'UMMS_APP'),
    user: people.controllerA,
    status: BookingStatus.accepted,
  },
  {
    id: 902,
    partId: 201,
    eventPositionId: slot(201, 'UMMS_GND'),
    user: people.controllerB,
    status: BookingStatus.rejected,
  },
  {
    id: 903,
    partId: 201,
    eventPositionId: slot(201, 'UMMS_TWR'),
    user: people.controllerC,
    status: BookingStatus.pending,
  },
  {
    id: 904,
    partId: 201,
    eventPositionId: slot(201, 'UMOO_A_TWR'),
    user: people.me,
    status: BookingStatus.pending,
  },
  {
    id: 905,
    partId: 202,
    eventPositionId: slot(202, 'UMMV_CTR'),
    user: people.atcOps,
    status: BookingStatus.accepted,
  },
  {
    id: 906,
    partId: 204,
    eventPositionId: slot(204, 'UMGG_APP'),
    user: people.controllerA,
    status: BookingStatus.accepted,
  },
  {
    id: 907,
    partId: 204,
    eventPositionId: slot(204, 'UMGG_TWR'),
    user: people.controllerB,
    status: BookingStatus.accepted,
  },
];

export const agenda: AgendaItem[] = [
  ...events.map((e) => ({
    id: e.id,
    type: 0 as const,
    startDate: e.startDate,
    endDate: e.endDate,
    title: e.name.en,
    annotation: e.description.en,
    airport: e.airport,
  })),
  {
    id: 301,
    type: 1,
    startDate: at(1, 16),
    endDate: at(1, 18),
    title: 'ATC Student Training',
    annotation: `${people.controllerC.name.first} ${people.controllerC.id}, UMMS_TWR`,
    airport: 'UMMS_TWR',
    link: 'https://discord.com/',
  },
  {
    id: 302,
    type: 1,
    startDate: at(3, 17),
    endDate: at(3, 19),
    title: 'Advanced ATC Student Training',
    annotation: `${people.controllerB.name.first} ${people.controllerB.id}, UMMS_APP`,
    airport: 'UMMS_APP',
    link: 'https://discord.com/',
  },
  {
    id: 303,
    type: 2,
    startDate: at(8, 18),
    endDate: at(8, 20),
    title: 'ADC Practical Exam',
    annotation: `${people.controllerA.name.first} ${people.controllerA.id}, UMGG_TWR`,
    airport: 'UMGG_TWR',
  },
  {
    id: 304,
    type: 3,
    startDate: at(6, 22),
    endDate: at(7, 1),
    title: 'Website maintenance',
    annotation:
      'The website and booking will be unavailable for up to 3 hours.',
  },
];
