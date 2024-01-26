import { useEffect, useState } from 'react';

import { notifications } from '@mantine/notifications';
import { IconCalendarTime, IconCircleX, IconUser } from '@tabler/icons-react';
import { format } from 'date-fns';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { GeneralLayout } from '../components/Layout';
import { useApi } from '../context/ApiContext';

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
  publishedAt: any;
}

export function NewsPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const api = useApi();

  const [newsItem, setNewsItem] = useState<News | null>(null);
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
    api(`/news/${id}`)
      .then((response: any) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response)
        ) {
          setNewsItem(response);
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
  }, [id]);

  return (
    <GeneralLayout>
      {newsItem ? (
        <>
          <h2 className="mt-4 text-center text-4xl font-bold text-ivao-blue">
            {newsItem.name[i18n.language]}
          </h2>
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg">
            <div className="flex flex-col gap-5 md:flex-row">
              <img
                src={newsItem.image_url}
                alt={newsItem.name.en}
                className="h-full max-w-full rounded-lg md:max-w-md"
              />
              <p className="text-md text-gray-700">
                {newsItem.description[i18n.language]}
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center">
                <IconUser className="text-ivao-blue" size={18} />
                <p className="text-md font-bold text-ivao-blue">
                  {newsItem.user.staffPositions
                    ? newsItem.user.staffPositions
                        .map((position) => `BY-${position.id}`)
                        .filter(
                          (value, index, self) => self.indexOf(value) === index,
                        )
                        .join('/')
                    : String(newsItem.user.id)}
                </p>
              </div>
              <div className="flex items-center">
                <IconCalendarTime className="text-ivao-blue" size={18} />
                <p className="text-md text-ivao-blue">
                  {format(new Date(newsItem.publishedAt), 'dd-MM-yyyy')}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className="mt-4 text-center text-3xl font-bold text-blue-900">
            <div className="mx-auto mb-4 h-6 w-1/2 animate-pulse rounded-lg bg-ivao-blue"></div>
          </h2>
          <div className="mt-8 flex flex-col gap-5 rounded-lg bg-white p-6 shadow-lg md:flex-row">
            <div className="h-40 animate-pulse rounded-lg bg-ivao-grey md:w-1/2"></div>
            <div className="md:w-1/2">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div
                  key={index}
                  className="my-2 h-6 w-4/5 animate-pulse rounded-lg bg-ivao-grey"
                ></div>
              ))}
            </div>
          </div>
        </>
      )}
    </GeneralLayout>
  );
}
