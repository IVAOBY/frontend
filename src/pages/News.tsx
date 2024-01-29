import { useEffect, useState } from 'react';

import { notifications } from '@mantine/notifications';
import { IconCalendarTime, IconCircleX, IconUser } from '@tabler/icons-react';
import { format } from 'date-fns';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { GeneralLayout } from '../components/Layout';
import { Title } from '../components/Typography/Title';
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
  publishedAt: Date;
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
      .then((response: News) => {
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
  }, [api, id, t]);

  return (
    <GeneralLayout>
      {newsItem ? (
        <>
          <Title
            className="text-center text-2xl font-bold text-ivao-blue md:text-4xl"
            withUndreline
          >
            {newsItem.name[i18n.language]}
          </Title>
          <div className="mt-5 flex flex-row justify-center gap-[103.55px]">
            <div className="flex flex-row gap-2">
              <IconCalendarTime className="ml-2 text-ivao-blue md:ml-0" />
              <p className="text-base font-bold text-gray-500 md:text-lg">
                {format(new Date(newsItem.publishedAt), 'dd.MM.yyyy')}
              </p>
            </div>
            <div className="flex flex-row gap-2">
              <IconUser className="text-ivao-blue" />
              <p className="mr-2 text-base font-bold text-gray-500 md:mr-0 md:text-lg">
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
          </div>
          <div className="flex items-center justify-center">
            {/*TODO: ИСПРАВИТЬ ПОД МОБИЛЬНЫЕ УСТРОЙСТВА*/}
            <img
              src={newsItem.image_url}
              alt={newsItem.name.en}
              className="mt-8 h-[393.75px] w-[700px] rounded-lg"
            />
          </div>
          <div className="flex items-center justify-center text-justify">
            <p
              className="m-5 w-[700px] break-words text-gray-700 md:text-lg"
              dangerouslySetInnerHTML={{
                __html: newsItem.description[i18n.language],
              }}
            />
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
                  className="my-2 h-6 w-full animate-pulse rounded-lg bg-ivao-grey md:w-4/5"
                ></div>
              ))}
            </div>
          </div>
        </>
      )}
    </GeneralLayout>
  );
}
