import { useContext, useEffect, useState } from 'react';

import { notifications } from '@mantine/notifications';
import {
  IconAirTrafficControl,
  IconCar,
  IconCircleX,
  IconClockCheck,
  IconPlane,
  IconRadar,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { CustomButton } from '../../../components/Button';
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

          await api(`/events-parts/event/${id}`).then((response: any) => {
            if (response && Array.isArray(response)) {
              setPartItem(response);
            }
          });
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
          await api(`/events-parts/event/${id}`).then((response: any) => {
            if (response && Array.isArray(response)) {
              setPartItem(response);
            }
          });
        })
        .catch((error: any) => {
          console.log('Error handling unbooking:', error);
        });
    } else {
      console.log('Token is not defined or null');
    }
  };

  return (
    <div className="container mx-auto py-4">
      {partItem &&
        partItem.map((part) => (
          <div key={part.id} className="mb-8">
            <div className="flex flex-row items-center gap-[35px]">
              <h2 className="text-atmos-700 text-[45px] font-semibold">
                Диспетчерская смена {part.id}
              </h2>
              <div className="flex gap-1.5 py-1.5 px-3.5 text-[18px] h-[30px] justify-center items-center font-semibold leading-4 text-white bg-atmos-700 rounded-xl backdrop-blur-[5px]">
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
                  .map(({ position, type }) => (
                    <div
                      key={position.id}
                      className="flex flex-col p-[19px] rounded-2xl shadow-lg bg-white w-[300px]"
                    >
                      <div
                        className={'flex w-[338px] flex-row items-center gap-3'}
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
                      <div className="flex flex-col gap-2">
                        {part.booking?.map((booking) => (
                          <div
                            key={booking.id}
                            className="flex items-center justify-between"
                          >
                            <span
                              className={`px-2 py-1 rounded-xl font-semibold ${
                                booking.status === 0
                                  ? 'text-atmos-700 bg-[#E7EAF5]'
                                  : booking.status === 1
                                    ? 'text-[#2EC662] bg-[#EAF9EF]'
                                    : 'text-[#E93434] bg-[#FDEBEB]'
                              }`}
                            >
                              {booking.bookedUser?.name.first}{' '}
                              {booking.bookedUser?.id}
                            </span>
                          </div>
                        ))}

                        <div className="flex mt-4">
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
                              className="flex w-1/2 gap-1.5 px-1.5 text-lg font-semibold leading-16 text-white bg-atmos-700 rounded-xl backdrop-blur-[5px]"
                            >
                              <IconClockCheck className="mt-0.5" />
                              <div className="flex-auto ml-2 my-auto">
                                {t('events.booking.unbook')}
                              </div>
                            </div>
                          ) : signed ? (
                            <CustomButton
                              variant={'link'}
                              onClick={() =>
                                handleBook(part.id, position.atcPositionId)
                              }
                            >
                              {t('events.booking.book')}
                            </CustomButton>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <div>{t('events.booking.none')}</div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
