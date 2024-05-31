import {GeneralLayout} from "../Layout";
import {IconChevronLeft, IconInfoSquareRounded} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import {notifications} from "@mantine/notifications";
import {useTranslation} from "react-i18next";
import {useApi} from "../../context/ApiContext";
import i18n from "../../i18n/i18n";
import {useParams} from "react-router-dom";
import {Airport} from "../../types/Airport";

export function AirportPage() {
    const [airports, setAirports] = useState<Airport[]>([]);
    const {t} = useTranslation();
    const api = useApi();
    const {icao} = useParams();

    function decimalToDMS(decimalLat, decimalLon) {
        function convert(decimal) {
            const degrees = Math.floor(decimal);
            const minutes = (Math.abs(decimal - degrees) * 60).toFixed(2);
            return `${Math.abs(degrees)}° ${minutes}`;
        }

        const latCardinal = decimalLat >= 0 ? 'N' : 'S';
        const lonCardinal = decimalLon >= 0 ? 'E' : 'W';

        const latDMS = `${convert(decimalLat)} ${latCardinal}`;
        const lonDMS = `${convert(decimalLon)} ${lonCardinal}`;

        return `${latDMS} / ${lonDMS}`;
    }


    useEffect(() => {
        notifications.show({
            id: 'load-data',
            loading: true,
            title: t('notif.loading.name'),
            message: t('notif.loading.description'),
            radius: 'lg',
            autoClose: false,
            withCloseButton: false,
        });

        api(`/airports?search=${icao}`)
            .then((response: Airport[]) => {
                if (response) {
                    setAirports(response);
                    notifications.update({
                        id: 'load-data',
                        title: t('notif.success.name'),
                        message: t('notif.success.description'),
                        color: 'teal',
                        autoClose: 2000,
                    });
                } else {
                    console.error('Error: Unexpected API response structure');
                }
            })
            .catch((error: any) => {
                console.error('Error fetching data:', error);
                notifications.update({
                    id: 'load-data',
                    title: t('notif.error.name'),
                    message: t('notif.error.description'),
                    color: 'red',
                    autoClose: 2000,
                });
            });
    }, [api, t]);


    return (
        <GeneralLayout>
            <div className="flex text-gray-300 flex-row">
                <IconChevronLeft/>
                <span className="font-['Montserrat']">На главную</span>
            </div>
            {airports.map((airport) => (
                <div className="flex flex-row gap-12">
                    <div className="text-3xl font-bold text-black md:text-5xl">
                        {airport.name[i18n.language]}
                    </div>
                    <div className="flex flex-row gap-3">
                        <div
                            className="justify-center font-bold w-min h-min mt-2 px-4 py-2 text-xl leading-4 text-center text-white bg-black rounded-xl">
                            {airport.icao}
                        </div>
                        <div
                            className="justify-center font-bold w-min h-min mt-2 px-4 py-2 text-xl leading-4 text-center text-gray-200 bg-gray-400 rounded-xl">
                            {airport.iata}
                        </div>
                        <div
                            className="ml-auto mr-4 text-right font-bold mt-2 px-4 py-2 text-xl leading-4 text-gray-600">
                            {decimalToDMS(airport.latitude, airport.longitude)} | {airport.elevation} ft
                        </div>
                    </div>
                </div>
            ))}

            <div className="mt-8">
                <p className="text-4xl mb-6 font-semibold leading-5 text-atmos-700">Международные</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {airports.filter(airport => airport.airportTypeId === 1 && airport.status).map((airport) => (
                        <div key={airport.icao} className="flex flex-col font-semibold rounded-xl">
                            {airport.image_url && (
                                <img className="rounded-t-xl" alt={airport.name.en} src={airport.image_url}/>
                            )}
                            <div
                                className="flex flex-col py-6 pr-16 pl-6 w-full bg-white max-md:px-5 max-md:max-w-full rounded-b-xl">
                                <div className="flex gap-4 font-bold">
                                    <div
                                        className="justify-center px-4 py-2 text-xl tracking-tighter leading-4 text-center text-white whitespace-nowrap bg-black rounded-xl">
                                        {airport.icao}
                                    </div>
                                    <div className="flex-auto my-auto text-3xl leading-7 text-black">
                                        {airport.name[i18n.language] || airport.name.en}
                                    </div>
                                </div>
                                <div className="mt-4 text-lg tracking-tighter leading-4 text-neutral-400">
                                    {airport.description[i18n.language] || airport.description.en || 'No Description'}
                                </div>
                                <div
                                    className="hover:cursor-pointer flex gap-1.5 self-start px-1.5 py-1 mt-5 text-xl leading-4 text-white whitespace-nowrap bg-blue-900 rounded-xl">
                                    <IconInfoSquareRounded/>
                                    <div className="flex-auto mt-1">Подробнее</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-16">
                <p className="text-4xl font-semibold mb-6 leading-5 text-atmos-700">Посадочные площадки</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {airports.filter(airport => airport.airportTypeId === 2 && airport.status).map((airport) => (
                        <div key={airport.icao} className="flex flex-col font-semibold rounded-xl">
                            <div
                                className="flex flex-col py-4 pr-4 pl-4 w-full bg-white max-md:px-4 max-md:max-w-full rounded-xl">
                                <div className="flex gap-4 font-bold">
                                    <div
                                        className="justify-center px-3 py-2 h-min w-min text-lg tracking-tighter leading-4 text-center text-white whitespace-nowrap bg-black rounded-xl">
                                        {airport.icao}
                                    </div>
                                    <div className="flex-auto my-auto text-xl leading-7 text-black">
                                        {airport.name[i18n.language] || airport.name.en}
                                    </div>
                                </div>
                                <div className="mt-2 text-base tracking-tighter leading-4 text-neutral-400">
                                    {airport.description[i18n.language] || airport.description.en || 'No Description'}
                                </div>
                                <div
                                    className="hover:cursor-pointer flex gap-1.5 self-start px-1.5 py-1 mt-3 text-lg leading-4 text-white whitespace-nowrap bg-blue-900 rounded-xl">
                                    <IconInfoSquareRounded/>
                                    <div className="flex-auto mt-1">Подробнее</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-16">
                <p className="text-4xl font-semibold mb-6 leading-5 text-atmos-700">Военные</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {airports.filter(airport => airport.airportTypeId === 3 && airport.status).map((airport) => (
                        <div key={airport.icao} className="flex flex-col font-semibold rounded-3xl bg-zinc-900">
                            <div
                                className="flex flex-col py-4 pr-4 pl-4 w-full rounded-xl bg-semantic-military-700 max-md:px-4 max-md:max-w-full">
                                <div className="flex gap-4 font-bold">
                                    <div
                                        className="justify-center px-3 py-2 text-lg tracking-tighter leading-4 text-center text-white whitespace-nowrap border-2 rounded-xl">
                                        {airport.icao}
                                    </div>
                                    <div className="flex-auto my-auto text-xl leading-7 text-white">
                                        {airport.name[i18n.language] || airport.name.en}
                                    </div>
                                </div>
                                <div className="mt-2 text-base tracking-tighter leading-4 text-white">
                                    {airport.description[i18n.language] || airport.description.en || 'No Description'}
                                </div>
                                <div
                                    className="hover:cursor-pointer flex gap-1.5 self-start px-1.5 py-1 mt-3 text-lg leading-4 text-white whitespace-nowrap border-2 rounded-xl">
                                    <IconInfoSquareRounded/>
                                    <div className="flex-auto mt-1">Подробнее</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </GeneralLayout>
    );
}
