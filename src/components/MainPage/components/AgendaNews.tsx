import { useCallback, useMemo } from 'react';

import {
  IconBooks,
  IconCalendarEvent,
  IconCalendarWeek,
  IconCertificate,
  IconSettings,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import type { NewsEntity } from '../../../api/model';

import useNews from '../../../hooks/query/MainPage/useNews';
import useAgenda from '../../../hooks/query/useAgenda';
import { Notification } from '../../Notification/Notification';
import { NewsCarousel } from './NewsCarousel';

export function AgendaNews() {
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  const newsRedirect = (newsItem: NewsEntity) => {
    navigate(`/news/${newsItem.id}`);
  };

  const SkeletonItem = () => (
    <div className="mt-3 flex max-w-[553px] animate-pulse flex-col gap-2 drop-shadow-md">
      <div className="flex flex-row gap-5 rounded-3xl bg-gray-200 p-5">
        <div className="size-[50px] rounded-xl bg-gray-300 lg:size-[70px]"></div>
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
      <div className="relative pt-8 lg:min-h-[500px] lg:pb-10">
        {isAgendaError && agendaError && (
          <Notification
            type="error"
            message={agendaError.message}
            notificationId="agenda-error-main"
          />
        )}
        {isAgendaLoading || isAgendaError
          ? Array.from({ length: 4 }).map((_, index) => (
              <SkeletonItem key={index} />
            ))
          : agenda &&
            agenda.map((item) => (
              <div key={item.id} className="mt-3 flex flex-col gap-2 lg:w-2/5">
                <div
                  className="flex w-full cursor-pointer flex-col text-[25px] font-bold leading-none text-black duration-700 hover:scale-[102%] lg:text-3xl"
                  onClick={() => {
                    if (item.type === 0) {
                      EventNavigate(item.id);
                    } else {
                      if (/^https:\/\//.test(item.link))
                        window.open(item.link, '_blank');
                    }
                  }}
                >
                  <div className="squircle-3xl shadow-figma flex flex-row gap-5 bg-white p-5">
                    <div className="flex items-center">
                      <div
                        className={`squircle-2xl size-[70px] p-2.5 text-white ${
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
                          <IconCalendarEvent size={50} stroke={1.5} />
                        )}
                        {item.type === 1 && (
                          <IconBooks size={50} stroke={1.5} />
                        )}
                        {item.type === 2 && (
                          <IconCertificate size={50} stroke={1.5} />
                        )}
                        {item.type === 3 && (
                          <IconSettings size={50} stroke={1.5} />
                        )}
                      </div>
                    </div>
                    <div className="my-auto flex flex-col items-center">
                      <div className="text-[30px] lg:text-4xl">
                        {new Date(item.startDate).toLocaleString(
                          currentLanguage,
                          {
                            timeZone: 'UTC',
                            day: '2-digit',
                          },
                        )}
                      </div>

                      <div className="text-[16px] text-neutral-600 lg:-mt-2 lg:text-lg">
                        {new Date(item.startDate)
                          .toLocaleString(currentLanguage, {
                            timeZone: 'UTC',
                            month: 'short',
                          })
                          .toUpperCase()
                          .slice(0, 3)}{' '}
                      </div>
                    </div>
                    <div className="min-2 mt-2 flex flex-col truncate lg:mt-1.5">
                      <div className="truncate text-3xl">{item.title}</div>
                      <div className="-mt-2 truncate text-[16px] font-medium leading-7 text-neutral-600 lg:text-xl lg:leading-8">
                        <span>
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
                        {item.type === 0 ? (
                          <span className="ml-2 text-neutral-400">
                            {item.airport}
                          </span>
                        ) : (
                          <span className="ml-2 text-neutral-400">
                            {item.annotation.length > 30
                              ? `${item.annotation.slice(0, 30)}...`
                              : item.annotation}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

        {/* Кнопка «Все события» */}
        <div className="mt-4 flex h-10 items-center justify-center lg:absolute lg:bottom-0 lg:left-0 lg:mt-0 lg:w-2/5">
          <div
            onClick={() => {
              navigate('/agenda');
              window.scrollTo(0, 0);
            }}
            className="mx-6 mt-2.5 flex w-fit gap-1 self-start rounded-xl bg-atmos-700 px-1.5 pr-2.5 text-lg font-medium text-white transition duration-300 hover:scale-105 hover:cursor-pointer hover:opacity-90"
          >
            <IconCalendarWeek className="mt-0.5" stroke={1.7} />
            <div className="my-auto flex-auto">{t('agenda.all')}</div>
          </div>
        </div>

        {isNewsError && newsError && (
          <Notification
            type="error"
            message={newsError.message}
            notificationId="news-error-main"
          />
        )}

        <div className="mt-6 lg:absolute lg:bottom-0 lg:left-[calc(40%+1.5rem)] lg:right-0 lg:top-11 lg:mt-0">
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
