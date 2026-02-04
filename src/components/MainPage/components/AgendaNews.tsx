import { useCallback, useState, useMemo } from 'react';

import {
  IconBooks,
  IconCalendarEvent,
  IconCertificate,
  IconSettings,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { be, enUS, ru } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import useNews from '../../../hooks/query/MainPage/useNews';
import useAgenda from '../../../hooks/query/useAgenda';
import { NewsEntity } from '../../../types/News';
import { Notification } from '../../Notification/Notification';
import Pagination from '../../Pagination';

export function AgendaNews() {
  const { i18n } = useTranslation();

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

  const NewsSkeleton = () => (
      <div className="relative h-[270px] w-[480px] animate-pulse items-center overflow-hidden rounded-xl bg-gray-400"></div>
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
    return [...newsData].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [newsData]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const localeMap = {
    en: enUS,
    ru: ru,
    be: be,
  };
  const currentLanguage = i18n.language;
  const currentLocale = localeMap[currentLanguage] || enUS;

  const EventNavigate = useCallback(
      (event: number) => {
        navigate(`/event/${event}`);
        window.scrollTo(0, 0);
      },
      [navigate],
  );

  return (
      <div>
        <div className="pt-8">
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
                  <div
                      key={item.id}
                      className="mt-3 flex flex-col gap-2 drop-shadow-md"
                  >
                    <div
                        className="flex w-full cursor-pointer flex-col text-[25px] font-bold leading-none text-black lg:w-5/12 lg:text-3xl"
                        onClick={() => {
                          if (item.type === 0) {
                            EventNavigate(item.id);
                          } else {
                            window.open(item.link, '_blank');
                          }
                        }}
                    >
                      <div className="flex flex-row gap-5 rounded-3xl bg-white p-5 shadow-sm">
                        <div className="flex items-center">
                          <div
                              className={`size-[50px] rounded-xl p-2 text-white lg:size-[70px] lg:p-4 ${
                                  item.type === 0
                                      ? 'bg-green-500'
                                      : item.type === 1
                                          ? 'bg-yellow-500'
                                          : item.type === 2
                                              ? 'bg-red-500'
                                              : 'bg-gray-500'
                              }`}
                          >
                            {item.type === 0 && <IconCalendarEvent size={35} />}
                            {item.type === 1 && <IconBooks size={35} />}
                            {item.type === 2 && <IconCertificate size={35} />}
                            {item.type === 3 && <IconSettings size={35} />}
                          </div>
                        </div>
                        <div className="my-auto flex flex-col items-center">
                          <div className="text-[27px] lg:text-4xl">
                            {new Date(item.startDate).toLocaleString(currentLanguage, {
                              timeZone: 'UTC',
                              day: '2-digit',
                            })}
                          </div>

                          <div className="text-[14px] text-neutral-600 lg:-mt-2 lg:text-lg">
                            {new Date(item.startDate)
                                .toLocaleString(currentLanguage, {
                                  timeZone: 'UTC',
                                  month: 'short',
                                })
                                .toUpperCase()
                                .slice(0, 3)}{' '}
                          </div>

                        </div>
                        <div className="mt-1 flex flex-col">
                          <div className="text-3xl">{item.title}</div>
                          <div
                              className="-mt-2.5 text-[15px] font-medium leading-7 text-neutral-600 lg:text-xl lg:leading-8">
                            <span>{`${new Date(item.startDate).toLocaleTimeString('eu', {
                              timeZone: 'UTC',
                              hour12: false,
                              hour: '2-digit',
                              minute: '2-digit',
                            })}`} UTC</span>
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
          <div className="mt-10 flex flex-wrap justify-center gap-8">
            {isNewsError && newsError && (
                <Notification
                    type="error"
                    message={newsError.message}
                    notificationId="news-error-main"
                />
            )}
            {isNewsLoading || isNewsError
                ? Array.from({ length: itemsPerPage }).map((_, index) => (
                    <NewsSkeleton key={index} />
                ))
                : sortedNews &&
                sortedNews.slice(startIndex, endIndex).map((newsItem) => (
                    <div
                        key={newsItem.id}
                        className="md:w-280px relative h-[170px] w-11/12 overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl md:h-[270px] md:w-[480px]"
                        onClick={() => newsRedirect(newsItem)}
                        style={{ cursor: 'pointer' }}
                    >
                      <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `url(${newsItem.image_url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20"></div>
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="text-sm font-medium">
                              {format(new Date(newsItem.publishedAt), 'dd.MM.yyyy')}
                            </div>
                            <div className="rounded bg-black/50 px-2 py-1 text-xs">
                              {newsItem.user &&
                              newsItem.user.staffPositions?.length > 0
                                  ? newsItem.user.staffPositions
                                      .map((position) => `BY-${position.id}`)
                                      .filter(
                                          (value, index, self) =>
                                              self.indexOf(value) === index,
                                      )
                                      .join('/')
                                  : newsItem.user
                                      ? `${newsItem.user.name.first} ${newsItem.user.id}`
                                      : 'IVAO BY HQ'}
                            </div>
                          </div>
                          <div className="truncate text-lg font-bold">
                            {newsItem.name[i18n.language]}
                          </div>
                          <div className="mt-2 text-sm leading-snug">
                            {newsItem.description[i18n.language]?.length > 96
                                ? `${newsItem.description[i18n.language].slice(0, 96)}...`
                                : newsItem.description[i18n.language]}
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
          </div>
          {!isNewsError && (
              <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(
                      newsData ? newsData.length / itemsPerPage : 1,
                  )}
                  onPageChange={setCurrentPage}
                  className="mt-8"
              />
          )}
        </div>
      </div>
  );
}
