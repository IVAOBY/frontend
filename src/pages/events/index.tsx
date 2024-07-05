import {useEffect, useState} from 'react';

import {notifications} from '@mantine/notifications';
import {IconChevronLeft, IconCircleX, IconClockCancel, IconClockCheck} from '@tabler/icons-react';
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
    const [registrationStatus, setRegistrationStatus] = useState<'open' | 'closed'>('closed');

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

                    // Check registration status
                    const eventStartDate = new Date(response.startDate);
                    const currentTime = new Date();
                    const sixHoursBeforeEvent = new Date(eventStartDate.getTime() - 6 * 60 * 60 * 1000);

                    if (currentTime < sixHoursBeforeEvent) {
                        setRegistrationStatus('open');
                    } else {
                        setRegistrationStatus('closed');
                    }
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
            <div className="flex text-gray-300 flex-row mb-4">
                <IconChevronLeft />
                <span className="font-['Montserrat']">На главную</span>
            </div>
            {eventItem && (
                <>
                    <div className="text-3xl font-bold text-black md:text-5xl mb-4">
                        {eventItem.name[i18n.language]}
                    </div>
                    <div className="w-full flex flex-wrap mt-2 gap-2">
                        <div
                            className="justify-center px-3 py-2 text-sm font-semibold leading-4 text-center text-white rounded-xl bg-zinc-900">
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
                        {registrationStatus === 'open' ? (
                            <div
                                className="flex gap-1.5 px-1.5 text-lg font-semibold leading-4 text-white bg-green-500 rounded-xl backdrop-blur-[5px]">
                                <IconClockCheck className="mt-1" />
                                <div className="flex-auto my-auto">Запись открыта</div>
                            </div>
                        ) : (
                            <div
                                className="flex gap-1.5 px-1.5 text-lg font-semibold leading-4 text-white bg-semantic-red-500 rounded-xl backdrop-blur-[5px]">
                                <IconClockCancel className="mt-1" />
                                <div className="flex-auto my-auto">Запись закрыта</div>
                            </div>
                        )}
                    </div>
                    <div className="mt-8 flex flex-col md:flex-row gap-12">
                        <div className="w-full md:w-1/2 rounded-2xl">
                            <img
                                src={eventItem.imageUrl}
                                alt={eventItem.name.en}
                                className="rounded-3xl shadow-gray-400 shadow-lg w-full"
                            />
                        </div>
                        <div className="bg-white w-full md:w-1/2 rounded-2xl font-['Montserrat'] shadow-gray-400 shadow-lg">
                            <div className="mx-8 my-10">
                                <p className="text-3xl font-semibold leading-5 text-black">Основная информация</p>
                                <div
                                    className="text-xl mt-8 font-medium tracking-tighter leading-6 text-black max-w-[647px]" dangerouslySetInnerHTML={{ __html: eventItem.description[i18n.language] || 'Failed to load' }}>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ShiftComponent />
                </>
            )}
        </GeneralLayout>
    );
}
