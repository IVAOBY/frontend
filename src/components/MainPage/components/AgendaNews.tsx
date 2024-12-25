import { useCallback, useState } from 'react';

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
import Pagination from '../../Pagination';
import {NewsEntity} from "../../../types/News";
import {ErrorNotification} from "../../Notification/ErrorNotification";

export function AgendaNews() {
  const { i18n } = useTranslation();

  const navigate = useNavigate();
  const newsRedirect = (newsItem: NewsEntity) => {
    navigate(`/news/${newsItem.id}`);
    window.scrollTo(0, 0);
  };

  const SkeletonItem = () => (
    <div className="flex mt-3 flex-col gap-2 drop-shadow-md animate-pulse max-w-[553px]">
      <div className="flex flex-row gap-5 p-5 bg-gray-200 rounded-3xl">
        <div className="h-[50px] w-[50px] lg:w-[70px] lg:h-[70px] bg-gray-300 rounded-xl"></div>
        <div className="flex flex-col items-center my-auto">
          <div className="h-6 w-10 bg-gray-300 rounded-md"></div>
          <div className="mt-2 h-4 w-8 bg-gray-300 rounded-md"></div>
        </div>
        <div className="flex flex-col mt-1">
          <div className="h-6 w-40 bg-gray-300 rounded-md"></div>
          <div className="mt-2 h-4 w-28 bg-gray-300 rounded-md"></div>
        </div>
      </div>
    </div>
  );

  const NewsSkeleton = () => (
    <div className="relative h-[270px] w-[480px] items-center overflow-hidden rounded-xl bg-gray-400 animate-pulse"></div>
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
            <ErrorNotification error={agendaError} notificationId="agenda-error-main" />
        )}
        {isAgendaLoading || isAgendaError ? (
          Array.from({ length: 4 }).map((_, index) => (
            <SkeletonItem key={index} />
          ))
        ) : (
          agenda &&
          agenda.map((item) => (
            <div
              key={item.id}
              className="flex mt-3 flex-col gap-2 drop-shadow-md"
            >
              <div
                className="flex cursor-pointer flex-col text-[25px] font-bold leading-none text-black w-full lg:w-5/12 lg:text-3xl"
                onClick={() => {
                  if (item.type === 0) {
                    EventNavigate(item.id);
                  } else {
                    window.open(item.link, '_blank');
                  }
                }}
              >
                <div className="flex flex-row gap-5 p-5 bg-white rounded-3xl shadow-sm">
                  <div className="flex items-center">
                    <div
                      className={`p-2 lg:p-4 h-[50px] w-[50px] lg:w-[70px] lg:h-[70px] rounded-xl text-white ${
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
                  <div className="flex flex-col items-center my-auto">
                    <div className="text-[27px] lg:text-4xl">
                      {format(new Date(item.startDate), 'dd')}
                    </div>
                    <div className="text-[14px] text-neutral-600 lg:text-lg lg:-mt-2">
                      {format(new Date(item.startDate), 'MMM', {
                        locale: currentLocale,
                      })
                        .toUpperCase()
                        .slice(0, 3)}
                    </div>
                  </div>
                  <div className="flex flex-col mt-1">
                    <div className="text-3xl">{item.title}</div>
                    <div className="-mt-2.5 text-[15px] font-medium leading-7 text-neutral-600 lg:text-xl lg:leading-8">
                      <span>{format(new Date(item.startDate), 'HH:mm')}</span>
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
          ))
        )}
        <div className="mt-10 flex flex-wrap justify-center gap-8">
          {isNewsError && newsError && (
              <ErrorNotification error={newsError} notificationId="news-error-main" />
          )}
          {isNewsLoading || isNewsError ? (
            Array.from({ length: itemsPerPage }).map((_, index) => (
              <NewsSkeleton key={index} />
            ))
          ) : (
            newsData &&
            newsData.slice(startIndex, endIndex).map((newsItem) => (
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
            ))
          )}
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
