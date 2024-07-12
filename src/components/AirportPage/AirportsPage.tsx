import { useCallback, useEffect, useState } from 'react';

import { notifications } from '@mantine/notifications';
import { IconInfoSquareRounded } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useApi } from '../../context/ApiContext';
import { Airport } from '../../types/Airport';
import { BreadcrumbLayout } from '../Layout';

export function AirportsPage() {
  const [airports, setAirports] = useState<Airport[]>([]);
  const { t } = useTranslation();
  const api = useApi();
  const navigate = useNavigate();

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

    api('/airports/all')
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

  const aboutAirport = useCallback(
    (icao: string) => {
      navigate(`/airport/${icao}`);
    },
    [navigate],
  );

  return (
    <BreadcrumbLayout>
      <div className="text-3xl font-bold text-black md:text-5xl">Аэропорты</div>
      <div className="mt-8">
        <p className="mb-6 text-4xl font-semibold leading-5 text-atmos-700">
          Международные
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {airports
            .filter((airport) => airport.airportTypeId === 1 && airport.status)
            .map((airport) => (
              <div
                key={airport.icao}
                className="flex flex-col rounded-xl font-semibold"
              >
                {airport.airportTypeId == 1 && (
                  <img
                    className="rounded-t-xl"
                    alt={airport.name}
                    src={`https://cdn.by.ivao.aero/images/airports/${airport.icao}.png`}
                  />
                )}
                <div className="flex w-full flex-col rounded-b-xl bg-white py-6 pl-6 pr-16 max-md:max-w-full max-md:px-5">
                  <div className="flex gap-4 font-bold">
                    <div className="justify-center whitespace-nowrap rounded-xl bg-black px-4 py-2 text-center text-xl leading-4 tracking-tighter text-white">
                      {airport.icao}
                    </div>
                    <div className="my-auto flex-auto text-3xl leading-7 text-black">
                      {airport.name}
                    </div>
                  </div>
                  <div className="mt-4 text-lg leading-4 tracking-tighter text-neutral-400">
                    {airport.description}
                  </div>
                  <div
                    className="mt-5 flex gap-1.5 self-start whitespace-nowrap rounded-xl bg-blue-900 px-1.5 py-1 text-xl leading-4 text-white hover:cursor-pointer"
                    onClick={() => aboutAirport(airport.icao)}
                  >
                    <IconInfoSquareRounded />
                    <div className="mt-1 flex-auto">Подробнее</div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="mt-16">
        <p className="mb-6 text-4xl font-semibold leading-5 text-atmos-700">
          Посадочные площадки
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {airports
            .filter((airport) => airport.airportTypeId === 2 && airport.status)
            .map((airport) => (
              <div
                key={airport.icao}
                className="flex flex-col rounded-xl font-semibold"
              >
                <div className="flex w-full flex-col rounded-xl bg-white p-4 max-md:max-w-full max-md:px-4">
                  <div className="flex gap-4 font-bold">
                    <div className="size-min justify-center whitespace-nowrap rounded-xl bg-black px-3 py-2 text-center text-lg leading-4 tracking-tighter text-white">
                      {airport.icao}
                    </div>
                    <div className="my-auto flex-auto text-xl leading-7 text-black">
                      {airport.name}
                    </div>
                  </div>
                  <div className="mt-2 text-base leading-4 tracking-tighter text-neutral-400">
                    {airport.description}
                  </div>
                  <div
                    onClick={() => aboutAirport(airport.icao)}
                    className="mt-3 flex gap-1.5 self-start whitespace-nowrap rounded-xl bg-blue-900 px-1.5 py-1 text-lg leading-4 text-white hover:cursor-pointer"
                  >
                    <IconInfoSquareRounded />
                    <div className="mt-1 flex-auto">Подробнее</div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="mt-16">
        <p className="mb-6 text-4xl font-semibold leading-5 text-atmos-700">
          Военные
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {airports
            .filter((airport) => airport.airportTypeId === 3 && airport.status)
            .map((airport) => (
              <div
                key={airport.icao}
                className="flex flex-col rounded-3xl bg-zinc-900 font-semibold"
              >
                <div className="flex w-full flex-col rounded-xl bg-semantic-military-700 p-4 max-md:max-w-full max-md:px-4">
                  <div className="flex gap-4 font-bold">
                    <div className="justify-center whitespace-nowrap rounded-xl border-2 px-3 py-2 text-center text-lg leading-4 tracking-tighter text-white">
                      {airport.icao}
                    </div>
                    <div className="my-auto flex-auto text-xl leading-7 text-white">
                      {airport.name}
                    </div>
                  </div>
                  <div className="mt-2 text-base leading-4 tracking-tighter text-white">
                    {airport.description}
                  </div>
                  <div
                    onClick={() => aboutAirport(airport.icao)}
                    className="mt-3 flex gap-1.5 self-start whitespace-nowrap rounded-xl border-2 px-1.5 py-1 text-lg leading-4 text-white hover:cursor-pointer"
                  >
                    <IconInfoSquareRounded />
                    <div className="mt-1 flex-auto">Подробнее</div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </BreadcrumbLayout>
  );
}
