import {useEffect, useState} from 'react';

import {notifications} from '@mantine/notifications';
import {IconChevronLeft, IconCircleX, IconClockCancel, IconClockCheck, IconHome, IconUsers} from '@tabler/icons-react';
import {format} from 'date-fns';
import i18n from 'i18next';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';

import {useApi} from '../../context/ApiContext';
import {EventEntity} from '../../types/Events';
import {ShiftComponent} from './components/ShiftComponent';
import {GeneralLayout} from "../../components/Layout";

export function EventPage() {
    const {t} = useTranslation();
    const {id} = useParams();
    const api = useApi();

    const [eventItem, setEventItem] = useState<EventEntity | null>(null);
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
        api(`/events/${id}`)
            .then((response: EventEntity) => {
                if (
                    response &&
                    typeof response === 'object' &&
                    !Array.isArray(response)
                ) {
                    setEventItem(response);
                    notifications.hide('load-data');
                } else {
                    console.error('Invalid response from API:', response);
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
    }, [api, id, t]);

    return (
        <GeneralLayout>
            <div className="flex text-gray-300 flex-row">
                <IconChevronLeft/>
                <text className="font-['Montserrat']">На главную</text>
            </div>
            {eventItem && (
                <>
                    <div className="text-3xl font-bold text-black md:text-5xl">
                        {eventItem.name[i18n.language]}
                    </div>
                    <div className="w-full flex mt-2 gap-2 flex-row">
                        <div
                            className="justify-center px-3 py-2 text-sm font-semibold leading-4 text-center text-white rounded-xl bg-zinc-900">
                            {/*25.05 18:00 – 21:00*/}
                            {`${format(new Date(eventItem.startDate), 'dd.MM')} ${new Date(
                                eventItem.startDate,
                            ).toLocaleTimeString('eu', {
                                timeZone: 'UTC',
                                hour12: false,
                                hour: '2-digit',
                                minute: '2-digit',
                            })}`}
                            {` – ${new Date(
                                eventItem.endDate,
                            ).toLocaleTimeString('eu', {
                                timeZone: 'UTC',
                                hour12: false,
                                hour: '2-digit',
                                minute: '2-digit',
                            })}`}
                        </div>
                        <div
                            className="flex gap-1.5 px-1.5 text-lg font-semibold leading-4 text-white bg-ocean-600 rounded-xl backdrop-blur-[5px]">
                            <IconUsers className="mt-1"/>
                            <div className="flex-auto my-auto">IRL</div>
                        </div>
                        <div
                            className="flex gap-1.5 px-1.5 text-lg font-semibold leading-4 text-white bg-semantic-yellow-500 rounded-xl backdrop-blur-[5px]">
                            <IconHome className="mt-1"/>
                            <div className="flex-auto my-auto">HQ</div>
                        </div>
                        <div
                            className="flex gap-1.5 px-1.5 text-lg font-semibold leading-4 text-white bg-green-500 rounded-xl backdrop-blur-[5px]">
                            <IconClockCheck className="mt-1"/>
                            <div className="flex-auto my-auto">Запись открыта</div>
                        </div>
                        <div
                            className="flex gap-1.5 px-1.5 text-lg font-semibold leading-4 text-white bg-semantic-red-500 rounded-xl backdrop-blur-[5px]">
                            <IconClockCancel className="mt-1"/>
                            <div className="flex-auto my-auto">Запись закрыта</div>
                        </div>
                    </div>
                    <div className="mt-8 flex flex-row gap-12">
                        <div className="w-1/2 rounded-2xl">
                            <img
                                src={eventItem.imageUrl}
                                alt={eventItem.name.en}
                                className="rounded-3xl shadow-gray-400 shadow-lg"
                            />
                        </div>
                        <div className="bg-white w-1/2 rounded-2xl font-['Montserrat'] shadow-gray-400 shadow-lg">
                            <div className="mt-8 ml-6">
                                <p className="text-3xl font-semibold leading-5 text-black">Основная информация</p>
                                <div
                                    className="text-xl mt-8 font-medium tracking-tighter leading-6 text-black max-w-[647px]">
                                    Дорогие пилоты и диспетчера нашего дивизиона, рады представить вам новый
                                    ивент у побережья Каспийского моря!
                                    <br/>
                                    Когда за окном уже во всю цветет сирень, а в METAR уже не первый день
                                    CAVOK, самое время полюбоваться прекрасными видами Каспийского моря и
                                    городов вблизи него.
                                    <br/>
                                    За бортом ожидается +26°C, а это значит, что стоит запастись
                                    прохлаждающимися напитками, надеть свои солнцезащитные очки и лететь
                                    Актобе-Актау!
                                </div>
                                <div
                                    className="flex w-1/2 gap-1.5 px-1.5 text-lg font-semibold leading-16 text-white bg-atmos-700 mt-16 rounded-xl backdrop-blur-[5px]">
                                    <IconClockCheck className="mt-0.5"/>
                                    <div className="flex-auto ml-2 my-auto">Подробнее на форуме</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-16 text-4xl font-semibold leading-5 text-atmos-700">
                        <p>Диспетческая смена</p>
                    </div>
                    <ShiftComponent/>
                </>
            )}
        </GeneralLayout>
    );
}
