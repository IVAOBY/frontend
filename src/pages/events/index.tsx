import { useEffect, useState } from 'react';

import { notifications } from '@mantine/notifications';
import {
  IconCircleX,
  IconClockCancel,
  IconClockCheck, IconInfoSquareRounded,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { BreadcrumbLayout } from '../../components/Layout';
import { useApi } from '../../context/ApiContext';
import { EventEntity } from '../../types/Events';
import { ShiftComponent } from './components/ShiftComponent';

export function EventPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const api = useApi();

  const [eventItem, setEventItem] = useState<EventEntity | null>(null);
  const [registrationStatus, setRegistrationStatus] = useState<
    'open' | 'closed'
  >('closed');

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
    api(`/events/${id}`)
      .then((response: EventEntity) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response)
        ) {
          setEventItem(response);
          notifications.hide('load-data');

          // Check registration status
          const eventStartDate = new Date(response.startDate);
          const currentTime = new Date();
          const sixHoursBeforeEvent = new Date(
            eventStartDate.getTime() - 6 * 60 * 60 * 1000,
          );

          if (currentTime < sixHoursBeforeEvent) {
            setRegistrationStatus('open');
          } else {
            setRegistrationStatus('closed');
          }
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

  return (
    <BreadcrumbLayout>
      {eventItem && (
        <>
          <div className="mb-4 text-3xl font-bold text-black md:text-5xl">
            {eventItem.name[i18n.language]}
          </div>
          <div className="mt-2 flex w-full flex-wrap gap-2">
            <div className="justify-center rounded-xl bg-zinc-900 px-3 py-2 text-center text-[18px] font-semibold leading-4 text-white">
              {`${format(new Date(eventItem.startDate), 'dd.MM')} ${new Date(
                eventItem.startDate,
              ).toLocaleTimeString('eu', {
                timeZone: 'UTC',
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
              })}`}
              {` – ${new Date(eventItem.endDate).toLocaleTimeString('eu', {
                timeZone: 'UTC',
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
              })}`}
            </div>
            {registrationStatus === 'open' ? (
              <div className="flex items-center gap-1.5 rounded-xl bg-green-500 px-1.5 text-[18px] font-semibold leading-4 text-white backdrop-blur-[5px]">
                <IconClockCheck size={24} />
                <div className="my-auto flex-auto">
                  {t('events.tags.shift.open')}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 rounded-xl bg-semantic-red-500 px-1.5 text-[18px] font-semibold leading-4 text-white backdrop-blur-[5px]">
                <IconClockCancel size={24} />
                <div className="my-auto flex-auto">
                  {t('events.tags.shift.close')}
                </div>
              </div>
            )}
          </div>
          <div className="mt-8 flex flex-col gap-12 lg:flex-row">
            <div className="mt-8 flex flex-col gap-12 lg:flex-row">
              <div className="w-full rounded-2xl xl:w-1/2">
                <img
                    src={eventItem.imageUrl}
                    alt={eventItem.name.en}
                    className="size-full rounded-3xl object-cover shadow-lg shadow-gray-400"
                />
              </div>
              <div
                  className="w-full rounded-2xl bg-white font-['Montserrat'] shadow-lg shadow-gray-400 xl:w-1/2 flex flex-col">
                <div className="mx-8 my-10 flex-grow">
                  <p className="text-3xl font-semibold leading-7 text-black">
                    {t('events.content.title')}
                  </p>
                  <div
                      className="mt-8 max-w-[647px] break-words text-xl font-medium leading-6 tracking-tighter text-black"
                      dangerouslySetInnerHTML={{
                        __html: eventItem.description[i18n.language] || 'Failed to load',
                      }}
                  ></div>
                </div>
                <div
                    onClick={() => {
                      window.open(eventItem.infoUrl, '_blank');
                    }}
                    className={`leading-16 flex gap-3 rounded-xl px-1.5 pr-3 max-w-[300px] text-lg font-semibold text-white backdrop-blur-[5px] transition duration-500 bg-[#0D2C99] hover:cursor-pointer hover:opacity-80 mb-4 mx-8`}
                >
                  <IconInfoSquareRounded className="ml-1.5 mt-0.5"/>
                  <div className="my-auto flex-auto">
                    {t('events.content.link')}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ShiftComponent/>
        </>
      )}
    </BreadcrumbLayout>
  );
}
