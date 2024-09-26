import {useEffect, useState} from 'react';

import {notifications} from '@mantine/notifications';
import {
    IconBooks,
    IconCalendarEvent,
    IconCertificate,
    IconCircleX,
    IconSettings,
} from '@tabler/icons-react';
import {format} from 'date-fns';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';

import {useApi} from '../../../context/ApiContext';
import Pagination from '../../Pagination';
import {Title} from '../../Typography/Title';
import {be, ru, enUS} from "date-fns/locale";

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

interface Agenda {
    id: number
    type: number // 0 - Event, 1 - Training, 2 - Exam, 3 - Technical
    startDate: Date
    endDate: Date
    title: string
    annotation: string
    link: string
}

export function AgendaNews() {
    const {t, i18n} = useTranslation();
    const [news, setNews] = useState<News[] | null>(null);
    const [agenda, setAgenda] = useState<Agenda[] | null>(null);
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
                        icon: <IconCircleX/>,
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
                    icon: <IconCircleX/>,
                    withCloseButton: false,
                    autoClose: false,
                });
            });
        api('/agenda?limit=4')
            .then((response: any) => {
                if (response && Array.isArray(response)) {
                    setAgenda(response);
                    notifications.hide('load-data');
                } else {
                    notifications.update({
                        id: 'load-data',
                        color: 'red',
                        title: t('notif.server.name'),
                        message: t('notif.server.descritpion'),
                        radius: 'lg',
                        icon: <IconCircleX/>,
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
                    icon: <IconCircleX/>,
                    withCloseButton: false,
                    autoClose: false,
                });
            });
    }, [api, t]);

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

    return (
        <div className={'pt-8'}>
            <Title withUndreline>{t('news.title')}</Title>
            {agenda && agenda.map((item) => (
                <div key={item.id} className="flex mt-3 drop-shadow-md flex-col gap-2">
                    <div onClick={() => window.open(item.link, "_blank")}  className="flex cursor-pointer flex-col text-3xl font-bold leading-none text-black rounded-none w-5/12">
                        <div className="flex flex-row gap-5 p-5 bg-white rounded-3xl shadow-sm">
                            <div
                                className={`p-4 rounded-xl text-white ${item.type === 0 ? 'bg-green-500' : ''} ${item.type === 1 ? 'bg-yellow-500' : ''} ${item.type === 2 ? 'bg-red-500' : ''} ${item.type === 3 ? 'bg-gray-500' : ''}`}>
                                {item.type == 0 && <IconCalendarEvent size={35}/>}
                                {item.type == 1 && <IconBooks size={35}/>}
                                {item.type == 2 && <IconCertificate size={35}/>}
                                {item.type == 3 && <IconSettings size={35}/>}
                            </div>
                            <div className="flex flex-col my-auto text-center">
                                <div className="text-4xl">{format(new Date(item.startDate), 'dd')}</div>
                                <div
                                    className="text-lg -mt-2 text-neutral-600">{format(new Date(item.startDate), 'MMM', {locale: currentLocale}).toUpperCase().slice(0, 3)}</div>
                            </div>
                            <div className="flex flex-col mt-1">
                                <div className="text-3xl">{item.title}</div>
                                <div className="-mt-2.5">
                                    <span
                                        className="text-xl -mt-1 font-medium leading-6 text-neutral-600">{format(new Date(item.startDate), 'HH:mm')}</span>
                                    <span
                                        className="ml-2 text-xl -mt-1 font-medium leading-6 text-neutral-400">{item.annotation.length > 30 ? item.annotation.slice(0, 30) + '...' : item.annotation}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <div className=" mt-10 flex flex-wrap justify-center gap-8">
                {news === null
                    ? Array.from({length: itemsPerPage}).map((_, index) => (
                        <div
                            key={index}
                            className="relative h-[270px] w-[480px] items-center overflow-hidden rounded-xl bg-gray-400 blur-lg"
                            style={{cursor: 'wait'}}
                        ></div>
                    ))
                    : news.slice(startIndex, endIndex).map((newsItem) => (
                        <div
                            key={newsItem.id}
                            className="md:w-280px relative h-[170px] w-11/12 overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl md:h-[270px] md:w-[480px]"
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
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20"></div>
                                <div
                                    className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                                    <div className="mb-2 flex items-center justify-between">
                                        <div className="text-sm font-medium">
                                            {format(new Date(newsItem.publishedAt), 'dd.MM.yyyy')}
                                        </div>
                                        <div className="rounded bg-black/50 px-2 py-1 text-xs">
                                            {newsItem.user &&
                                            newsItem.user.staffPositions &&
                                            newsItem.user.staffPositions.length > 0
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
                className="mt-8"
            />
        </div>
    );
}
