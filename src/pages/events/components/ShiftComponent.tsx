import { useContext, useEffect, useState } from 'react';

import { notifications } from '@mantine/notifications';
import {
  IconAirTrafficControl,
  IconCar,
  IconCircleX,
  IconPlane,
  IconRadar,
  IconSquareRoundedPlus,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useApi } from '../../../context/ApiContext';
import { AuthContext } from '../../../context/UserContext';
import { PartsEntity } from '../../../types/Events';

const positionIcons = {
  ground: <IconCar size={41} />,
  tower: <IconAirTrafficControl size={41} />,
  radar: <IconRadar size={41} />,
  approach: <IconPlane size={41} />,
};

const positionColors = {
  ground: 'bg-yellow-500',
  tower: 'bg-semantic-red-500',
  radar: 'bg-ocean-600',
  approach: 'bg-atmos-700',
};

export function ShiftComponent() {
  const { t } = useTranslation();
  const { id } = useParams();
  const api = useApi();
  const { decodedToken, signed } = useContext(AuthContext);

  const [partItem, setPartItem] = useState<PartsEntity[] | null>(null);
  useEffect(() => {
    notifications.show({
      id: 'load-data',
      loading: true,
      title: t('notif.loading.name'),
      message: t('notif.loading.descritpion'),
      radius: 'lg',
      autoClose: false,
      withCloseButton: false,
    });
    api(`/events-parts/event/${id}`)
      .then((response: any) => {
        if (response && Array.isArray(response)) {
          setPartItem(response);
          notifications.hide('load-data');
        } else {
          console.error('Invalid response from API:', response);
          notifications.update({
            id: 'load-data',
            color: 'red',
            title: t('notif.server.name'),
            message: t('notif.server.descritpion'),
            radius: 'lg',
            icon: <IconCircleX />,
            withCloseButton: false,
            autoClose: false,
          });
        }
      })
      .catch((error: any) => {
        console.error('Error fetching news:', error);
        notifications.update({
          id: 'load-data',
          color: 'red',
          title: t('notif.server.name'),
          message: t('notif.server.descritpion'),
          radius: 'lg',
          icon: <IconCircleX />,
          withCloseButton: false,
          autoClose: false,
        });
      });
  }, [api, id, t]);

  const handleBook = async (partId: number, atcPositionId: number) => {
    if (signed && partItem) {
      const part = partItem.find((part) => part.id === partId);
      if (part) {
        try {
          await api(
            `/events-booking/book?atcPositionId=${atcPositionId}`,
            'POST',
            {
              atcPositionId: atcPositionId,
              eventPartId: part.id,
              eventId: part.eventId,
            },
          );

          const response = await api(`/events-parts/event/${id}`);
          if (response && Array.isArray(response)) {
            setPartItem(response);
          }
        } catch (error) {
          console.log('Error handling booking:', error);
        }
      }
    }
  };

  function isBookedForPosition(bookings: any[], atcPositionId: number) {
    return bookings.some(
      (booking) =>
        booking.atcPosition?.id === atcPositionId &&
        booking.bookedUser?.id === decodedToken?.userData.id,
    );
  }

  function getBookingIdForPosition(bookings: any[], atcPositionId: number) {
    const booking = bookings.find((booking) => {
      return (
        booking.atcPosition.id === atcPositionId &&
        booking.bookedUser?.id === decodedToken?.userData.id
      );
    });

    return booking ? booking.id : undefined;
  }

  const handleUnbook = (bookingId: number) => {
    if (signed) {
      api(`/events-booking/unbook/${bookingId}`, 'DELETE')
        .then(async () => {
          const response = await api(`/events-parts/event/${id}`);
          if (response && Array.isArray(response)) {
            setPartItem(response);
          }
        })
        .catch((error: any) => {
          console.log('Error handling unbooking:', error);
        });
    } else {
      console.log('Token is not defined or null');
    }
  };

  const handleBookClick = async (partId: number, atcPositionId: number) => {
    try {
      await handleBook(partId, atcPositionId);
    } catch (error) {
      console.error('Error while booking:', error);
    }
  };

  return (
    <div>
      {partItem &&
        partItem.map((part) => (
          <div key={part.id} className="mb-8">
            <div className="mb-10 flex flex-col gap-4 first:mt-[50px] md:flex-row md:items-center md:gap-[35px]">
              <h2 className="text-[45px] font-semibold leading-10 text-atmos-700">
                {t('events.shift')} {part.id}
              </h2>
              <div className="flex h-[30px] items-center justify-center gap-1.5 rounded-xl bg-atmos-700 px-3.5 py-1.5 text-[18px] font-semibold leading-4 text-white backdrop-blur-[5px]">
                {`${format(new Date(part.startDate), 'HH:mm')} – ${format(
                  new Date(part.endDate),
                  'HH:mm',
                )}`}
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {part.positions && part.positions.length > 0 ? (
                part.positions
                  .map((position) => {
                    const callsign = position.position.callsign.toLowerCase();
                    let positionType = '';
                    if (callsign.includes('gnd')) {
                      positionType = 'ground';
                    } else if (callsign.includes('twr')) {
                      positionType = 'tower';
                    } else if (callsign.includes('r_app')) {
                      positionType = 'radar';
                    } else {
                      positionType = 'approach';
                    }
                    return { position, type: positionType };
                  })
                  .sort((a, b) => {
                    const typeOrder = {
                      ground: 0,
                      tower: 1,
                      radar: 2,
                      approach: 3,
                    };
                    return typeOrder[a.type] - typeOrder[b.type];
                  })
                  .map(({ position, type }) => {
                    const bookingsForPosition = part.booking.filter(
                      (bookingItem) =>
                        bookingItem.atcPosition?.id === position.atcPositionId,
                    );
                    const hasStatusOne = bookingsForPosition.some(
                      (booking) => booking.status === 1,
                    );

                    return (
                      <div
                        key={position.id}
                        className="flex w-[300px] flex-col rounded-2xl bg-white p-[19px] shadow-lg"
                      >
                        <div
                          className={
                            'flex w-[338px] flex-row items-center gap-3'
                          }
                        >
                          <div
                            className={`flex size-14 items-center justify-center rounded-2xl ${positionColors[type]}`}
                          >
                            {positionIcons[type]}
                          </div>
                          <div>
                            <div className="text-2xl font-semibold text-black">
                              {position.position.name[i18n.language]}
                            </div>
                            <div className="text-[15px] font-semibold text-[#ABA7A7]">
                              {position.position.callsign},{' '}
                              {position.position.frequency}
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
                                      booking.bookedUser.id ==
                                        decodedToken?.userData.id,
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
                            isBookedForPosition(
                              part.booking,
                              position.atcPositionId,
                            ) ? (
                              <div
                                onClick={() => {
                                  const bookingId: number =
                                    getBookingIdForPosition(
                                      part.booking,
                                      position.atcPositionId,
                                    );
                                  if (typeof bookingId !== 'undefined') {
                                    handleUnbook(bookingId);
                                  } else {
                                    console.log('Booking ID is undefined');
                                  }
                                }}
                                className="leading-16 hover:bg-opacity-80/80 flex gap-1.5 rounded-xl bg-[#E93434] px-1.5 text-lg font-semibold text-white backdrop-blur-[5px] transition duration-500 hover:cursor-pointer"
                              >
                                <IconSquareRoundedPlus className="mt-0.5" />
                                <div className="my-auto flex-auto">
                                  {t('events.booking.unbook')}
                                </div>
                              </div>
                            ) : signed ? (
                              <div
                                onClick={() => {
                                  handleBookClick(
                                    part.id,
                                    position.atcPositionId,
                                  ).catch((error) => {
                                    console.error('Error booking:', error);
                                  });
                                }}
                                className="leading-16 hover:bg-opacity-80/80 flex gap-1.5 rounded-xl bg-atmos-700 px-1.5 text-lg font-semibold text-white backdrop-blur-[5px] transition duration-500 hover:cursor-pointer"
                              >
                                <IconSquareRoundedPlus className="mt-0.5" />
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
        ))}
    </div>
  );
}
