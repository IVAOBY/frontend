import { useEffect, useState } from 'react';

import { createStyles, rem, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCircleX } from '@tabler/icons-react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useApi } from '../../../context/ApiContext';
import { GeneralLayout } from '../../Layout';
import Pagination from '../../Pagination';


const useStyles = createStyles((theme) => {
  return {
    title: {
      fontSize: rem(34),
      fontWeight: 800,
      color: theme.colors.blue[9],
      [theme.fn.smallerThan('sm')]: {
        fontSize: rem(24),
      },
      '&::after': {
        content: '""',
        display: 'block',
        backgroundColor: theme.fn.primaryColor(),
        width: rem(45),
        height: rem(2),
        marginTop: theme.spacing.sm,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
    card: {
      backgroundColor: 'white',
    },
    cardTitle: {
      color: theme.colors.blue[9],
      marginLeft: rem(20),
      [theme.fn.smallerThan('md')]: {
        fontSize: rem(28),
      },
    },
    cardDescription: {
      marginTop: rem(20),
      marginBottom: rem(20),
      color: theme.colors.gray[6],
      marginLeft: rem(20),
    },
    cardAuthorDate: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: rem(20),
      marginLeft: rem(20),
      color: theme.colors.gray,
    },
    cardContent: {
      [theme.fn.smallerThan('md')]: {
        flexDirection: 'column',
        alignItems: 'center',
      },
      wordBreak: 'break-word',
    },
    cardImage: {
      [theme.fn.smallerThan('md')]: {
        marginBottom: rem(20),
        maxWidth: '70%',
      },
      [theme.fn.smallerThan('xs')]: {
        maxWidth: '100%',
      },
      maxWidth: '100%',
      minWidth: '50%',
      height: 'auto',
      [theme.fn.largerThan('md')]: {
        maxWidth: '50%',
      },
    },
    pagination: {
      '[data-active]': {
        color: '#fff!important',
      },
    },
    button: {
      position: 'relative',
      borderRadius: theme.radius.lg,
      overflow: 'hidden',
      transition: 'transform 0.4s ease, box-shadow 0.4s ease',
      boxShadow: theme.shadows.md,
      '&.active': {
        // Новый класс для активной кнопки
        transform: 'scale(1.01)',
        boxShadow: '0px 10px 23px -4px rgba(34, 60, 80, 0.2)',
      },
      '&:hover': {
        transform: 'scale(1.01)',
        boxShadow: '0px 10px 23px -4px rgba(34, 60, 80, 0.2)',
      },
    },
    NewsImage: {
      [theme.fn.smallerThan('md')]: {
        marginBottom: rem(20),
      },
      maxWidth: '80%',
      minWidth: '20%',
      height: 'auto',
    },
    modal: {
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderRadius: theme.radius.lg,
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
      padding: '20px',
      minWidth: '600px',
      maxWidth: '100%',
      position: 'relative',
      zIndex: 1000,
    },
    modalTitle: {
      fontSize: rem(24),
      fontWeight: 800,
      color: theme.colors.blue[9],
      margin: 0,
    },
    skeleton: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: '500px',
      maxWidth: '100%',
      [theme.fn.smallerThan('xs')]: {
        minWidth: rem(340),
        maxWidth: '100%',
      },
      gap: rem(10),
    },
  };
});

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

export function NewsSection() {
  const { classes, theme } = useStyles();
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
      <Title order={2} className={classes.title} ta="center" mt="sm">
        {t('news.title')}
      </Title>

      <div className="-mx-4 mt-10 flex flex-wrap justify-center gap-6">
        {news === null
          ? Array.from({ length: itemsPerPage }).map((_, index) => (
                <div
                key={index}
                className="relative h-[270px] w-[480px] items-center overflow-hidden rounded-xl bg-gray-400 blur-lg"
                style={{cursor: 'wait'}}
                ></div>
            ))
          : news.slice(startIndex, endIndex).map((newsItem) => (
                <div
                key={newsItem.id}
                className="relative h-[270px] w-[480px] overflow-hidden rounded-xl duration-300 hover:scale-95 hover:transition-all"
                onClick={() => newsRedirect(newsItem)}
                style={{cursor: 'pointer'}}
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
                      <div
                          className="flex items-center justify-center gap-2.5 rounded-[999px] border border-white bg-white bg-opacity-0 px-2 py-1 backdrop-blur-[10px]">
                        <div className="font-['Nunito Sans'] text-xs font-medium text-white">
                          {format(new Date(newsItem.publishedAt), 'dd.MM.yyyy')}
                        </div>
                    </div>
                      <div className="font-['Nunito Sans'] text-3xl font-bold leading-9">
                        {newsItem.name[i18n.language]}
                      </div>
                      <div className="font-['Nunito Sans'] text-base font-normal leading-normal">
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
        className="mt-16"
      />
    </GeneralLayout>
  );
}
