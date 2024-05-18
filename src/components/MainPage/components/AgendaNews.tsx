import { useEffect, useState } from 'react';

import { notifications } from '@mantine/notifications';
import { IconCircleX } from '@tabler/icons-react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useApi } from '../../../context/ApiContext';
import { GeneralLayout } from '../../Layout';
import Pagination from '../../Pagination';
import { Title } from '../../Typography/Title';

interface News {
  id: number;
  user: {
    id: number;
    name: {
      first: string;
      last: string;
    };
    staffPositions: {
      prefix: string;
      id: string;
    }[];
  };
  image_url: string;
  name: {
    [key: string]: string;
  };
  description: {
    [key: string]: string;
  };
  publishedAt: Date;
}

export function AgendaNews() {
  const { t, i18n } = useTranslation();
  const [news, setNews] = useState<News[] | null>(null);
  const api = useApi();

  const navigate = useNavigate();
  const newsRedirect = (newsItem: News) => {
    navigate(`/news/${newsItem.id}`);
    window.scrollTo(0, 0);
  };

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
    api('/news')
      .then((response: any) => {
        if (response && Array.isArray(response)) {
          response.sort((a, b) => b.id - a.id);
          setNews(response);
          notifications.hide('load-data');
        } else {
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
  }, [api, t]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  return (
    <GeneralLayout>
      <Title withUndreline>{t('news.title')}</Title>

      <div className=" mt-10 flex flex-wrap justify-center gap-6">
        {news === null
          ? Array.from({ length: itemsPerPage }).map((_, index) => (
              <div
                key={index}
                className="relative h-[270px] w-[480px] items-center overflow-hidden rounded-xl bg-gray-400 blur-lg"
                style={{ cursor: 'wait' }}
              ></div>
            ))
          : news.slice(startIndex, endIndex).map((newsItem) => (
              <div
                key={newsItem.id}
                className="md:w-280px relative h-[170px] w-11/12 overflow-hidden rounded-xl duration-300 hover:scale-95 hover:transition-all md:h-[270px] md:w-[480px]"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-start justify-end p-6 text-white">
                    <div className="flex items-center justify-center gap-2.5 rounded-[999px] border border-white bg-white bg-opacity-0 px-2 py-1 backdrop-blur-[10px]">
                      <div className="text-xs font-medium text-white">
                        {format(new Date(newsItem.publishedAt), 'dd.MM.yyyy')}
                      </div>
                    </div>
                    <div className="text-sm font-bold md:text-3xl">
                      {newsItem.name[i18n.language]}
                    </div>
                    <div className="text-xs  font-normal leading-normal md:text-base">
                      {newsItem.description[i18n.language].length > 96
                        ? `${newsItem.description[i18n.language].slice(0, 96)}...`
                        : newsItem.description[i18n.language]}
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(news ? news.length / itemsPerPage : 1)}
        onPageChange={setCurrentPage}
        className="mt-5"
      />
    </GeneralLayout>
  );
}
