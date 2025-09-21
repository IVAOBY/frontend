import {
  IconCalendarMonth,
  IconChartBar,
  IconClock,
  IconClockCancel,
  IconClockCheck,
  IconHeadset,
  IconHome,
  IconInfoSquareRounded,
  IconKey,
  IconMap,
  IconPlane,
  IconPlaneArrival,
  IconPlaneDeparture,
  IconUser,
  IconUsers,
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
import React from 'react';

interface TagProps {
  icon?: React.ReactElement;
  label?: string;
  className?: string;
  children?: React.ReactNode;
}

const Tag = ({ icon, label, className = '', children }: TagProps) => (
  <div
    className={`flex items-center gap-1.5 rounded-xl bg-atmos-700 px-3 py-[7px] text-[15px] font-semibold leading-4 text-white ${className}`}
  >
    {icon}
    {children}
    {label && <span>{label}</span>}
  </div>
);

export const EventHeader = ({ data, registrationStatus, t }) => {
  const { tags, hidden } = data;

  const categoryMap = {
    user: { icon: <IconUser size={20} />, label: 'User' },
    int: { label: t('events.tags.int'), imageUrl: 'https://cdn.by.ivao.aero/images/IVAOLOGO.svg' },
    div: { label: t('events.tags.div'), imageUrl: 'https://cdn.by.ivao.aero/logos/favicon_dark.svg' },
  };

  const typeMap = {
    Airbridge: { icon: <IconPlane size={20} />, label: 'Airbridge' },
    FlyOut: { icon: <IconPlaneDeparture size={20} />, label: 'Fly-out' },
    FlyIn: { icon: <IconPlaneArrival size={20} />, label: 'Fly-in' },
    Online: { icon: <IconClock size={20} />, label: 'Online Day' },
    MSE: { icon: <IconCalendarMonth size={20} />, label: 'MSE' },
    RFO: { icon: <IconCalendarMonth size={20} />, label: 'RFO' },
    RFE: { icon: <IconCalendarMonth size={20} />, label: 'RFE' },
    Pass: { icon: <IconKey size={20} />, label: 'Password' },
    PDE: { icon: <IconChartBar size={20} />, label: 'PDE' },
    VFR: { icon: <IconMap size={20} />, label: 'VFR' },
    IRL: { icon: <IconUsers size={20} />, label: 'IRL' },
    SO: { icon: <IconHeadset size={20} />, label: 'SO' },
  };

  const categoryInfo = tags ? categoryMap[tags.category] : undefined;
  const typeInfo = tags ? typeMap[tags.type] : undefined;

  return (
    <div className="mt-2 flex w-full flex-wrap items-center gap-2">
      {data.startDate && data.endDate && (
        <div
          className="justify-center rounded-xl bg-zinc-900 px-3 py-[7px] text-center text-[15px] font-semibold leading-4 text-white">
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
          })}`} <span className="text-[12px]">UTC</span>
        </div>
      )}

      {data.airport && (
        <div
          className="justify-center rounded-xl bg-zinc-900 px-3 py-[7px] text-center text-[15px] font-semibold leading-4 text-white uppercase">
          {data.airport}
        </div>
      )}

      {tags && categoryInfo && (
        <Tag icon={categoryInfo.icon} label={categoryInfo.label}>
          {categoryInfo.imageUrl && (
            <img src={categoryInfo.imageUrl} alt={categoryInfo.label} className="h-5 w-5 object-contain" />
          )}
        </Tag>
      )}
      {tags && typeInfo && <Tag icon={typeInfo.icon} label={typeInfo.label} />}

      {tags && tags.hq && (
        <Tag icon={<IconHome size={20} />} label="HQ" className="bg-yellow-400 text-white" />
      )}

      {registrationStatus === 'open' ? (
        <div
          className="flex items-center gap-1.5 rounded-xl bg-green-500 px-3 py-[7px] text-[15px] font-semibold leading-4 text-white backdrop-blur-[5px]">
          <IconClockCheck size={20} />
          <div className="my-auto flex-auto">{t('events.tags.shift.open')}</div>
        </div>
      ) : registrationStatus === 'closed' ? (
        <div
          className="flex items-center gap-1.5 rounded-xl bg-semantic-red-500 px-3 py-[7px] text-[15px] font-semibold leading-4 text-white backdrop-blur-[5px]">
          <IconClockCancel size={20} />
          <div className="my-auto flex-auto">{t('events.tags.shift.close')}</div>
        </div>
      ) : null}

      {hidden && (
        <div
          className="flex items-center gap-1.5 rounded-xl bg-red-600 px-3 py-[7px] text-[15px] font-semibold text-white cursor-help border-b-2 border-dashed border-red-600"
          title={t('events.hidden.description')}
        >
          {t('events.hidden.tag')}
        </div>
      )}
    </div>
  );
};

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
          <EventHeader data={data} registrationStatus={registrationStatus} t={t} />
          <div className="mt-8 flex flex-col gap-12 lg:flex-row">
            <div className="w-full rounded-3xl xl:w-1/2">
              <img
                src={data.imageUrl}
                alt={data.name.en}
                className="size-full rounded-3xl object-cover shadow-lg shadow-gray-400"
              />
            </div>
            <div
              className="flex w-full flex-col rounded-3xl bg-white font-['Montserrat'] shadow-lg shadow-gray-400 xl:w-1/2">
              <div className="mx-8 my-10 grow">
                <p className="text-3xl font-semibold leading-7 text-black">
                  {t('events.content.title')}
                </p>
                <div
                  className="mt-8 max-w-[647px] break-words text-xl font-medium leading-6 tracking-tighter text-black"
                  dangerouslySetInnerHTML={{
                    __html: data.description[i18n.language] || 'Failed to load',
                  }}
                ></div>
              </div>
              {data.infoUrl && (
                <div
                  onClick={() => {
                    window.open(data.infoUrl, '_blank');
                  }}
                  className="leading-16 mx-8 mb-4 flex max-w-[300px] gap-3 rounded-xl bg-[#0D2C99] px-1.5 pr-3 text-lg font-semibold text-white backdrop-blur-[5px] transition duration-500 hover:cursor-pointer hover:opacity-80"
                >
                  <IconInfoSquareRounded className="ml-1.5 mt-0.5" />
                  <div className="my-auto flex-auto">{t('events.content.link')}</div>
                </div>
              )}
            </div>
          </div>
          <ShiftComponent />
        </>
      ) : null}
    </BreadcrumbLayout>
  );
}
