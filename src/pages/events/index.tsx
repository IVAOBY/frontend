import {
  IconClockCancel,
  IconClockCheck,
  IconInfoSquareRounded,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { BreadcrumbLayout, Centered } from '../../components/Layout';
import { Loader } from '../../components/Loader';
import { Notification } from '../../components/Notification/Notification';
import { useEventDetails } from '../../hooks/query/useEvents';
import { ShiftComponent } from './components/ShiftComponent';

export function EventPage() {
  const { t } = useTranslation();

  const { id } = useParams();

  const { data, registrationStatus, isLoading, error } = useEventDetails(id);

  return (
    <BreadcrumbLayout>
      {error && (
        <Notification
          type="error"
          message={error.message}
          notificationId={`event-${id}`}
        />
      )}
      {isLoading || error ? (
        <Centered>
          <Loader />
        </Centered>
      ) : data ? (
        <>
          <div className="mb-4 text-3xl font-bold text-black md:text-5xl">
            {data.name[i18n.language]}
          </div>
          <div className="mt-2 flex w-full flex-wrap gap-2">
            <div className="justify-center rounded-xl bg-zinc-900 px-3 py-2 text-center text-[18px] font-semibold leading-4 text-white">
              {`${format(new Date(data.startDate), 'dd.MM')} ${new Date(
                data.startDate,
              ).toLocaleTimeString('eu', {
                timeZone: 'UTC',
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
              })}`}
              {` – ${new Date(data.endDate).toLocaleTimeString('eu', {
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
                  src={data.imageUrl}
                  alt={data.name.en}
                  className="size-full rounded-3xl object-cover shadow-lg shadow-gray-400"
                />
              </div>
              <div className="flex w-full flex-col rounded-2xl bg-white font-['Montserrat'] shadow-lg shadow-gray-400 xl:w-1/2">
                <div className="mx-8 my-10 grow">
                  <p className="text-3xl font-semibold leading-7 text-black">
                    {t('events.content.title')}
                  </p>
                  <div
                    className="mt-8 max-w-[647px] break-words text-xl font-medium leading-6 tracking-tighter text-black"
                    dangerouslySetInnerHTML={{
                      __html:
                        data.description[i18n.language] || 'Failed to load',
                    }}
                  ></div>
                </div>
                <div
                  onClick={() => {
                    window.open(data.infoUrl, '_blank');
                  }}
                  className={`leading-16 mx-8 mb-4 flex max-w-[300px] gap-3 rounded-xl bg-[#0D2C99] px-1.5 pr-3 text-lg font-semibold text-white backdrop-blur-[5px] transition duration-500 hover:cursor-pointer hover:opacity-80`}
                >
                  <IconInfoSquareRounded className="ml-1.5 mt-0.5" />
                  <div className="my-auto flex-auto">
                    {t('events.content.link')}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ShiftComponent />
        </>
      ) : null}
    </BreadcrumbLayout>
  );
}
