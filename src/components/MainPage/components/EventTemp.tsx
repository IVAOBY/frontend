import { useEffect, useState } from 'react';

import { notifications } from '@mantine/notifications';
import {
  IconCalendar,
  IconCircleX,
  IconInfoSquareRounded,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useApi } from '../../../context/ApiContext';
import { EventEntity } from '../../../types/Events';
import { Title } from '../../Typography/Title';

export function EventTemp() {
  const { t, i18n } = useTranslation();
  const [eventItem, setEventItem] = useState<EventEntity | null>(null);
  const api = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    api(`/events/1`)
      .then((response: EventEntity) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response)
        ) {
          setEventItem(response);
          notifications.hide('load-data');
        } else {
          console.error('Invalid response from API:', response);
          notifications.update({
            id: 'load-data',
            color: 'red',
            title: t('notif.server.name'),
            message: t('notif.server.description'),
            radius: 'lg',
            icon: <IconCircleX />,
            withCloseButton: false,
            autoClose: false,
          });
        }
      })
      .catch((error: any) => {
        console.error('Error fetching event:', error);
        notifications.update({
          id: 'load-data',
          color: 'red',
          title: t('notif.server.name'),
          message: t('notif.server.description'),
          radius: 'lg',
          icon: <IconCircleX />,
          withCloseButton: false,
          autoClose: false,
        });
      });
  }, [api, t]);

  if (!eventItem) {
    return null;
  }

  const eventDate = format(new Date(eventItem.startDate), 'dd');
  const eventMonth = format(
    new Date(eventItem.startDate),
    'MMMM',
  ).toUpperCase();
  const eventTime = `${format(new Date(eventItem.startDate), 'HH:mm')} – ${format(new Date(eventItem.endDate), 'HH:mm')}`;

  return (
    <div className="px-4 pt-8 md:px-0">
      <Title>Agenda</Title>
      <div className="relative mx-auto mt-10 h-auto w-full max-w-[1005px] overflow-hidden rounded-[25px] bg-white shadow-lg md:h-[490px] lg:h-[300px]">
        <img
          src={eventItem.imageUrl}
          className="invisible absolute left-0 top-0 h-[200px] w-full rounded-t-[25px] object-cover md:visible md:h-full md:w-[489.3px] md:rounded-[25px]"
          alt={eventItem.name[i18n.language]}
        />
        <div className="relative p-4 md:absolute md:left-[505px] md:top-auto md:mt-5 md:p-0">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center gap-[18px]">
              <div className="w-[80px] rounded-2xl bg-semantic-green-500 p-4">
                <IconCalendar size={50} />
              </div>
              <div className="mt-[-6px] flex flex-col text-center font-bold">
                <p className="text-center text-[35px] font-bold text-black">
                  {eventDate}
                </p>
                <p className="mt-[-6px] text-center text-[13px] font-bold text-[#555]">
                  {eventMonth}
                </p>
              </div>
              <div className="text-left">
                <p className="text-left text-3xl font-bold text-black">
                  {eventItem.name[i18n.language]}
                </p>
                <span className="text-left text-xl font-medium text-[#555]">
                  {eventTime}{' '}
                </span>
                <span className="text-left text-xl font-medium text-[#c6c6c6]">
                  {eventItem.airport}
                </span>
              </div>
            </div>
            <p className="break-words text-lg leading-snug text-[#414141]">
              {eventItem.description[i18n.language].length > 200
                ? `${eventItem.description[i18n.language].slice(0, 200)}...`
                : eventItem.description[i18n.language]}
            </p>
            <div
              onClick={() => {
                navigate(`/event/1`);
              }}
              className="leading-16 hover:bg-opacity-80/80 flex max-w-[148px] gap-1.5 rounded-xl bg-atmos-700 px-[8px] py-[4px] text-[15px] font-semibold text-white backdrop-blur-[5px] transition duration-500 hover:cursor-pointer hover:opacity-90"
            >
              <IconInfoSquareRounded className="mt-0.5" />
              <div className="my-auto flex-auto">More details</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
