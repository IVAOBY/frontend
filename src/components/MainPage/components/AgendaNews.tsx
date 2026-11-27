import { useCallback, useMemo } from 'react';

import {
  IconBooks,
  IconCalendarEvent,
  IconCalendarWeek,
  IconCertificate,
  IconSettings,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import type { NewsEntity } from '../../../api/model';

import useNews from '../../../hooks/query/MainPage/useNews';
import useAgenda from '../../../hooks/query/useAgenda';
import { Notification } from '../../Notification/Notification';
import { NewsCarousel } from './NewsCarousel';

const SkeletonItem = () => (
  <div className="flex animate-pulse flex-col gap-2 drop-shadow-md">
    <div className="flex flex-row gap-3.5 rounded-3xl bg-gray-200 p-3.5 lg:gap-5 lg:p-5">
      <div className="size-[50px] shrink-0 rounded-xl bg-gray-300 lg:size-[70px]"></div>
      <div className="my-auto flex flex-col items-center">
        <div className="h-6 w-10 rounded-md bg-gray-300"></div>
        <div className="mt-2 h-4 w-8 rounded-md bg-gray-300"></div>
      </div>
      <div className="mt-1 flex flex-col">
        <div className="h-6 w-40 rounded-md bg-gray-300"></div>
        <div className="mt-2 h-4 w-28 rounded-md bg-gray-300"></div>
      </div>
    </div>
  </div>
);

export function AgendaNews() {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  const newsRedirect = (newsItem: NewsEntity) => {
    navigate(`/news/${newsItem.id}`);
  };

  const {
    data: newsData,
    isLoading: isNewsLoading,
    isError: isNewsError,
    error: newsError,
  } = useNews();
  const {
    data: agenda,
    isLoading: isAgendaLoading,
    isError: isAgendaError,
    error: agendaError,
  } = useAgenda();

  const sortedNews = useMemo(() => {
    if (!newsData) return [];
    return [...newsData]
      .filter(
        (item) =>
          item.publishedAt &&
          !isNaN(new Date(item.publishedAt).getTime()) &&
          item.name &&
          item.description,
      )
      .sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      );
  }, [newsData]);

  const currentLanguage = i18n.language;
  const EventNavigate = useCallback(
    (event: number) => {
      navigate(`/event/${event}`);
      window.scrollTo(0, 0);
    },
    [navigate],
  );

  return (
    <div>
      {isAgendaError && agendaError && (
        <Notification
          type="error"
          message={agendaError.message}
          notificationId="agenda-error-main"
        />
      )}
      {isNewsError && newsError && (
        <Notification
          type="error"
          message={newsError.message}
          notificationId="news-error-main"
        />
      )}

      <div className="pt-11 lg:flex lg:items-start lg:gap-6">
        {/* Левая колонка: агенда + кнопка «Все события» */}
        <div className="flex min-w-0 flex-col gap-3 lg:w-2/5 lg:shrink-0">
          {isAgendaLoading || isAgendaError
            ? Array.from({ length: 4 }).map((_, index) => (
                <SkeletonItem key={index} />
              ))
            : agenda &&
              agenda.map((item) => {
                const details =
                  item.type === 0 ? item.airport : item.annotation;

                return (
                  <div key={item.id} className="flex flex-col gap-2">
                    <div
                      className="flex w-full cursor-pointer flex-col text-[25px] font-bold leading-none text-black duration-700 hover:scale-[102%] lg:text-3xl"
                      onClick={() => {
                        if (item.type === 0) {
                          EventNavigate(item.id);
                        } else {
                          if (/^https:\/\//.test(item.link))
                            window.open(
                              item.link,
                              '_blank',
                              'noopener,noreferrer',
                            );
                        }
                      }}
                    >
                      <div className="squircle-3xl shadow-figma flex flex-row gap-3.5 bg-white p-3.5 lg:gap-5 lg:p-5">
                        <div className="flex shrink-0 items-center">
                          <div
                            className={`squircle-2xl size-[50px] p-2 text-white lg:size-[70px] lg:p-2.5 ${
                              item.type === 0
                                ? 'bg-green-500'
                                : item.type === 1
                                  ? 'bg-yellow-400'
                                  : item.type === 2
                                    ? 'bg-red-500'
                                    : 'bg-gray-500'
                            }`}
                          >
                            {item.type === 0 && (
                              <IconCalendarEvent
                                className="size-full"
                                stroke={1.5}
                              />
                            )}
                            {item.type === 1 && (
                              <IconBooks className="size-full" stroke={1.5} />
                            )}
                            {item.type === 2 && (
                              <IconCertificate
                                className="size-full"
                                stroke={1.5}
                              />
                            )}
                            {item.type === 3 && (
                              <IconSettings
                                className="size-full"
                                stroke={1.5}
                              />
                            )}
                          </div>
                        </div>
                        <div className="my-auto flex shrink-0 flex-col items-center">
                          <div className="text-[26px] lg:text-4xl">
                            {new Date(item.startDate).toLocaleString(
                              currentLanguage,
                              {
                                timeZone: 'UTC',
                                day: '2-digit',
                              },
                            )}
                          </div>

                          <div className="text-sm text-neutral-600 lg:-mt-2 lg:text-lg">
                            {new Date(item.startDate)
                              .toLocaleString(currentLanguage, {
                                timeZone: 'UTC',
                                month: 'short',
                              })
                              .toUpperCase()
                              .slice(0, 3)}{' '}
                          </div>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col justify-center lg:mt-1.5 lg:justify-start">
                          <div className="truncate text-xl lg:text-3xl">
                            {item.title}
                          </div>
                          <div className="flex min-w-0 gap-2 text-sm font-medium leading-5 text-neutral-600 lg:-mt-2 lg:text-xl lg:leading-8">
                            <span className="shrink-0 whitespace-nowrap">
                              {`${new Date(item.startDate).toLocaleTimeString(
                                'eu',
                                {
                                  timeZone: 'UTC',
                                  hour12: false,
                                  hour: '2-digit',
                                  minute: '2-digit',
                                },
                              )}`}{' '}
                              UTC
                            </span>
                            {details && (
                              <span className="min-w-0 truncate text-neutral-400">
                                {details}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

          {/* Кнопка «Все события» */}
          <div className="flex justify-center">
            <Link
              to="/agenda"
              onClick={() => window.scrollTo(0, 0)}
              className="mx-6 flex w-fit items-center gap-1 rounded-lg bg-atmos-700 px-1.5 py-0.5 pr-2 text-sm font-medium !text-white no-underline transition duration-300 hover:scale-105 hover:!text-white hover:opacity-90 lg:rounded-xl lg:py-0 lg:pr-2.5 lg:text-lg"
            >
              <IconCalendarWeek
                className="size-[18px] lg:size-6"
                stroke={1.7}
              />
              <span className="my-auto flex-auto">{t('agenda.all')}</span>
            </Link>
          </div>
        </div>

        {/* Правая колонка: карусель новостей (высота = 4 плашки агенды + ряд точек) */}
        <div className="mt-6 min-w-0 lg:mt-0 lg:h-[516px] lg:flex-1">
          <NewsCarousel
            news={sortedNews}
            isLoading={isNewsLoading || isNewsError}
            onOpen={newsRedirect}
          />
        </div>
      </div>
    </div>
  );
}
