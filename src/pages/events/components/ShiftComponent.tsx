import { useContext } from 'react';

import {
  IconAirTrafficControl,
  IconCar,
  IconPlaneArrival,
  IconPlaneTilt,
  IconRadar,
  IconSquareRoundedMinus,
  IconSquareRoundedPlus,
  IconSquareRoundedX,
} from '@tabler/icons-react';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { Notification } from '../../../components/Notification/Notification';
import { AuthContext } from '../../../context/UserContext';
import {
  useBookEvent,
  useUnbookEvent,
} from '../../../hooks/query/useBookingMutations';
import { useEventParts } from '../../../hooks/query/useEvents';
import { useMe } from '../../../hooks/query/useMe';
import {
  BookingEntity,
  EventAtcPositions,
  PartsEntity,
} from '../../../types/Events';

const positionIcons = {
  ground: <IconCar size={41} />,
  tower: <IconAirTrafficControl size={41} />,
  radar: <IconRadar size={41} />,
  approach: <IconPlaneArrival size={41} />,
  control: <IconPlaneTilt size={41} />,
};

const positionColors = {
  ground: 'bg-yellow-500',
  tower: 'bg-semantic-red-500',
  radar: 'bg-ocean-600',
  approach: 'bg-atmos-700',
  control: 'bg-semantic-blue-500',
};

const atcRatingNames = [
  'NONE',
  'OBS',
  'AS1',
  'AS2',
  'AS3',
  'ADC',
  'APC',
  'ACC',
  'SEC',
  'SAI',
  'CAI',
];

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
};

const normalizeAtcRating = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const normalized = value.toUpperCase();
    const idx = atcRatingNames.findIndex(
      (name) => normalized === name || normalized.includes(name),
    );
    if (idx !== -1) return idx;
    const numeric = Number(normalized);
    if (Number.isFinite(numeric)) return numeric;
  }
  if (value && typeof value === 'object') {
    const rating = value as { id?: unknown; shortName?: unknown };
    const numericId = toNumber(rating.id);
    if (typeof numericId === 'number') return numericId;
    if (typeof rating.shortName === 'string') {
      return normalizeAtcRating(rating.shortName);
    }
  }
  return 0;
};

export function ShiftComponent() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { signed } = useContext(AuthContext);
  const { data: me, isLoading: isLoadingMe } = useMe();
  const { data, error, isError, isLoading } = useEventParts(id);

  const { mutate: bookEvent } = useBookEvent();
  const { mutate: unbookEvent } = useUnbookEvent();

  const userId = toNumber(me?.id);
  const userRating = normalizeAtcRating(me?.ratings?.atc);
  const loading = isLoading || isLoadingMe;

  const matchesPosition = (
    bookingPosition: BookingEntity['atcPosition'],
    eventPosition: EventAtcPositions,
  ) => {
    const bookingIds = [
      toNumber(bookingPosition?.id),
      toNumber((bookingPosition as any)?.atcPositionId),
      toNumber(bookingPosition?.position?.id),
    ].filter((v) => typeof v === 'number');

    const eventIds = [
      toNumber((eventPosition as any)?.atcPositionId),
      toNumber(eventPosition?.position?.id),
    ].filter((v) => typeof v === 'number');

    const hasMatchingId = bookingIds.some((bId) =>
      eventIds.some((eId) => eId === bId),
    );
    if (hasMatchingId) return true;

    const bookingCallsign =
      bookingPosition?.position?.callsign?.toLowerCase() ?? '';
    const eventCallsign =
      eventPosition?.position?.callsign?.toLowerCase() ?? '';
    return !!bookingCallsign && bookingCallsign === eventCallsign;
  };

  const isBookedForPosition = (
    bookings: BookingEntity[],
    eventPosition: EventAtcPositions,
  ) => {
    if (!userId) return false;
    return bookings.some((booking) => {
      return (
        matchesPosition(booking.atcPosition, eventPosition) &&
        booking.bookedUser?.id === userId
      );
    });
  };

  const hasSufficientRating = (userRating: number, positionFRA: number) => {
    return userRating >= positionFRA;
  };

  const getBookingIdForPosition = (
    bookings: BookingEntity[],
    eventPosition: EventAtcPositions,
  ) => {
    if (!userId) return undefined;
    const booking = bookings.find((booking) => {
      const matches = matchesPosition(booking.atcPosition, eventPosition);
      return matches && booking.bookedUser?.id === userId;
    });

    return booking ? booking.id : undefined;
  };

  const handleBook = (partId: number, atcPositionId: number) => {
    if (signed && data) {
      const part = data.find((p) => p.id === partId);
      if (part) {
        bookEvent({
          atcPositionId,
          eventId: part.eventId,
          eventPartId: part.id,
        });
      }
    }
  };

  const handleUnbook = (bookingId: number) => {
    if (signed) {
      unbookEvent(bookingId);
    }
  };

  const handleBookClick = (
    partId: number,
    eventPosition: EventAtcPositions,
  ) => {
    const position = data
      ?.find((part) => part.id === partId)
      ?.positions.find((pos) => pos.id === eventPosition.id);

    if (!position || !position.position) {
      return;
    }
    const targetAtcId = toNumber(position.id) ?? toNumber(eventPosition.id);
    if (typeof targetAtcId === 'number') {
      handleBook(partId, targetAtcId);
    }
  };

  return (
    <div>
      {isError && error && (
        <Notification
          type="error"
          message={error.message}
          notificationId="documents-error-maindocuments"
        />
      )}
      {loading || isError ? (
        <div className="mt-8">
          <div className="h-6 w-[700px] animate-pulse rounded bg-gray-200"></div>

          <div className="mt-3 flex max-w-[300px] animate-pulse flex-col gap-2 drop-shadow-md">
            <div className="flex size-[300px] flex-row gap-5 rounded-3xl bg-gray-200 p-5">
              <div className="size-[56px] rounded-xl bg-gray-300"></div>
              <div className="mt-1 flex flex-col">
                <div className="h-6 w-40 rounded-md bg-gray-300"></div>
                <div className="mt-2 h-4 w-28 rounded-md bg-gray-300"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        data &&
        data.map((part: PartsEntity, index: number) => (
          <div key={part.id} className="mb-8">
            <div className="mb-10 flex flex-col gap-4 first:mt-[50px] md:flex-row md:items-center md:gap-[35px]">
              <h2 className="text-[45px] font-semibold leading-10 text-atmos-700">
                {t('events.shift')} {index + 1}
              </h2>
              <div className="flex h-[30px] items-center justify-center gap-1.5 rounded-xl bg-atmos-700 px-3 py-[7px] text-[18px] font-semibold leading-4 text-white backdrop-blur-[5px]">
                {`${new Date(part.startDate).toLocaleTimeString('eu', {
                  timeZone: 'UTC',
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                })}`}
                {` – ${new Date(part.endDate).toLocaleTimeString('eu', {
                  timeZone: 'UTC',
                  hour12: false,
                  hour: '2-digit',
                  minute: '2-digit',
                })}`}
                <span className="text-[14px]">UTC</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {part.positions && part.positions.length > 0 ? (
                part.positions
                  .map((position) => {
                    const callsign = position.position.callsign.toLowerCase();
                    let positionType: string;
                    if (callsign.includes('gnd')) {
                      positionType = 'ground';
                    } else if (callsign.includes('twr')) {
                      positionType = 'tower';
                    } else if (callsign.includes('r_app')) {
                      positionType = 'radar';
                    } else if (callsign.includes('app')) {
                      positionType = 'approach';
                    } else if (
                      callsign.includes('ctr') ||
                      callsign.includes('fss')
                    ) {
                      positionType = 'control';
                    }
                    return { position, type: positionType };
                  })
                  .sort((a, b) => {
                    const typeOrder = {
                      ground: 0,
                      tower: 1,
                      radar: 2,
                      approach: 3,
                      control: 4,
                    };
                    return typeOrder[a.type] - typeOrder[b.type];
                  })
                  .map(({ position, type }) => {
                    const bookingsForPosition = part.booking.filter(
                      (bookingItem) =>
                        matchesPosition(bookingItem.atcPosition, position),
                    );
                    const hasStatusOne = bookingsForPosition.some(
                      (booking) => booking.status === 1,
                    );
                    const userHasBooking = isBookedForPosition(
                      part.booking,
                      position,
                    );
                    const acceptedByOther =
                      hasStatusOne &&
                      !bookingsForPosition.some(
                        (booking) =>
                          booking.status === 1 &&
                          booking.bookedUser?.id === userId,
                      );
                    const positionFra = normalizeAtcRating(
                      position.position.fra,
                    );
                    const canBook = hasSufficientRating(
                      userRating,
                      positionFra,
                    );

                    return (
                      <div
                        key={position.id}
                        className="squircle-3xl shadow-figma flex w-[363px] flex-col bg-white p-[19px]"
                      >
                        <div
                          className={
                            'flex w-[338px] flex-row items-center gap-3'
                          }
                        >
                          <div
                            className={`squircle-2xl flex size-14 items-center justify-center ${positionColors[type]}`}
                          >
                            {positionIcons[type]}
                          </div>
                          <div>
                            <div className="text-2xl font-semibold text-black">
                              {position.position.name[i18n.language]}
                            </div>
                            <div className="text-[15px] font-semibold text-[#ABA7A7]">
                              {position.position.callsign},{' '}
                              {atcRatingNames[positionFra] ??
                                position.position.fra}
                              +
                            </div>
                          </div>
                        </div>
                        <div className="mt-[15px] flex flex-col gap-2">
                          {bookingsForPosition.length > 0 &&
                            (hasStatusOne
                              ? bookingsForPosition
                                  .filter(
                                    (booking) =>
                                      booking.status === 1 ||
                                      booking.bookedUser.id === userId,
                                  )
                                  .map((booking) => (
                                    <div
                                      key={booking.id}
                                      className="flex items-center justify-between"
                                    >
                                      <span
                                        className={`rounded-xl px-2 py-1 font-semibold ${
                                          booking.status === 0
                                            ? 'bg-[#E7EAF5] text-atmos-700'
                                            : booking.status === 1
                                              ? 'bg-[#EAF9EF] text-[#2EC662]'
                                              : 'bg-[#FDEBEB] text-[#E93434]'
                                        }`}
                                      >
                                        {booking.bookedUser?.name.first}{' '}
                                        {booking.bookedUser?.id}
                                      </span>
                                    </div>
                                  ))
                              : bookingsForPosition.map((booking) => (
                                  <div
                                    key={booking.id}
                                    className="flex items-center justify-between"
                                  >
                                    <span
                                      className={`rounded-xl px-2 py-1 font-semibold ${
                                        booking.status === 0
                                          ? 'bg-[#E7EAF5] text-atmos-700'
                                          : booking.status === 1
                                            ? 'bg-[#EAF9EF] text-[#2EC662]'
                                            : 'bg-[#FDEBEB] text-[#E93434]'
                                      }`}
                                    >
                                      {booking.bookedUser?.name.first}{' '}
                                      {booking.bookedUser?.id}
                                    </span>
                                  </div>
                                )))}
                          <div className="mt-[20px] flex">
                            {signed &&
                            isBookedForPosition(part.booking, position) ? (
                              <div
                                onClick={() => {
                                  if (
                                    userHasBooking &&
                                    new Date() < new Date(part.endDate)
                                  ) {
                                    const bookingId: number =
                                      getBookingIdForPosition(
                                        part.booking,
                                        position,
                                      );
                                    if (typeof bookingId !== 'undefined') {
                                      handleUnbook(bookingId);
                                    }
                                  }
                                }}
                                className={`flex gap-1.5 self-start whitespace-nowrap rounded-xl px-1.5 py-1 pr-3 text-lg font-semibold leading-4 text-white backdrop-blur-[5px] transition duration-300 ${
                                  !userHasBooking ||
                                  new Date() > new Date(part.endDate)
                                    ? 'cursor-not-allowed bg-gray-300'
                                    : 'bg-[#E93434] hover:cursor-pointer hover:opacity-80'
                                }`}
                              >
                                <IconSquareRoundedMinus />
                                <div className="my-auto flex-auto">
                                  {t('events.booking.unbook')}
                                </div>
                              </div>
                            ) : signed ? (
                              <div
                                onClick={() => {
                                  if (
                                    canBook &&
                                    !acceptedByOther &&
                                    new Date() < new Date(part.endDate)
                                  ) {
                                    handleBookClick(part.id, position);
                                  }
                                }}
                                className={`flex gap-1.5 self-start whitespace-nowrap rounded-xl px-1.5 py-1 pr-3 text-lg font-semibold leading-4 text-white backdrop-blur-[5px] transition duration-300 ${
                                  !canBook ||
                                  acceptedByOther ||
                                  new Date() > new Date(part.endDate)
                                    ? 'cursor-not-allowed bg-gray-300'
                                    : 'hover:opacity-t80 bg-atmos-700 hover:cursor-pointer'
                                }`}
                              >
                                {!canBook ||
                                acceptedByOther ||
                                new Date() > new Date(part.endDate) ? (
                                  <IconSquareRoundedX />
                                ) : (
                                  <IconSquareRoundedPlus />
                                )}
                                <div className="my-auto flex-auto">
                                  {t('events.booking.book')}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div>{t('events.booking.none')}</div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
