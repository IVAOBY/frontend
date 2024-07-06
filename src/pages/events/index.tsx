import { useEffect, useState } from 'react';

import { notifications } from '@mantine/notifications';
import { IconCircleX } from '@tabler/icons-react';
import { format } from 'date-fns';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useApi } from '../../context/ApiContext';
import { EventEntity } from '../../types/Events';
import { ShiftComponent } from './components/ShiftComponent';


export function EventPage() {
  const { classes, theme } = useStyles();
  const { t } = useTranslation();
  const { id } = useParams();
  const api = useApi();

  const [eventItem, setEventItem] = useState<EventEntity | null>(null);
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
    <GeneralLayout>
      <div className="mb-4 flex flex-row text-gray-300">
        <IconChevronLeft />
        <span className="font-['Montserrat']">На главную</span>
      </div>
      {eventItem && (
        <>
          <div className="mb-4 text-3xl font-bold text-black md:text-5xl">
            {eventItem.name[i18n.language]}
          </div>
          <div className="mt-2 flex w-full flex-wrap gap-2">
            <div className="justify-center rounded-xl bg-zinc-900 px-3 py-2 text-center text-sm font-semibold leading-4 text-white">
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
              <div className="flex gap-1.5 rounded-xl bg-green-500 px-1.5 text-lg font-semibold leading-4 text-white backdrop-blur-[5px]">
                <IconClockCheck className="mt-1" />
                <div className="my-auto flex-auto">Запись открыта</div>
              </div>
            ) : (
              <div className="flex gap-1.5 rounded-xl bg-semantic-red-500 px-1.5 text-lg font-semibold leading-4 text-white backdrop-blur-[5px]">
                <IconClockCancel className="mt-1" />
                <div className="my-auto flex-auto">Запись закрыта</div>
              </div>
            )}
          </div>
          <div className="mt-8 flex flex-col gap-12 lg:flex-row">
            <div className="w-full rounded-2xl xl:w-1/2">
              <img
                src={eventItem.imageUrl}
                alt={eventItem.name.en}
                className="size-full rounded-3xl object-cover shadow-lg shadow-gray-400"
              />
            </div>
            <div className="w-full rounded-2xl bg-white font-['Montserrat'] shadow-lg shadow-gray-400 xl:w-1/2">
              <div className="mx-8 my-10">
                <p className="text-3xl font-semibold leading-5 text-black">
                  Основная информация
                </p>
                <div
                  className="mt-8 max-w-[647px] break-words text-xl font-medium leading-6 tracking-tighter text-black"
                  dangerouslySetInnerHTML={{
                    __html:
                      eventItem.description[i18n.language] || 'Failed to load',
                  }}
                ></div>
              </div>
            </div>
          </div>
          <ShiftComponent />
        </>
      )}
    </Container>
  );
}
