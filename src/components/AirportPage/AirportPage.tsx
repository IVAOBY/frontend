import { useEffect, useState } from 'react';

import {
  IconChevronLeft,
  IconRadar2,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import metaricon from '../../assets/icons/metar.svg';
import { useApi } from '../../context/ApiContext';
import i18n from '../../i18n/i18n';
import { Airport } from '../../types/Airport';
import { GeneralLayout } from '../Layout';

export function AirportPage() {
  const [airports, setAirports] = useState<Airport[]>([]);
  const { t } = useTranslation();
  const api = useApi();
  const { icao } = useParams();

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
    api(`/airports?search=${icao}`)
      .then((response: Airport[]) => {
        if (response) {
          setAirports(response);
        } else {
          console.error('Error: Unexpected API response structure');
        }
      })
      .catch((error: any) => {
        console.error('Error fetching data:', error);
      });
  }, [api, t]);

  return (
    <GeneralLayout>
      <div className="flex text-gray-300 flex-row">
        <IconChevronLeft />
        <span className="font-['Montserrat']">На главную</span>
      </div>
      {airports.map((airport) => (
        <div>
          <div className="flex flex-row gap-12">
            <p className="text-3xl font-bold text-black md:text-5xl">
              {airport.name[i18n.language]}
            </p>
            <div className="flex flex-row gap-3">
              <div className="justify-center font-bold w-min h-min mt-2 px-4 py-2 text-xl leading-4 text-center text-white bg-black rounded-xl">
                {airport.icao}
              </div>
              <div className="justify-center font-bold w-min h-min mt-2 px-4 py-2 text-xl leading-4 text-center text-gray-200 bg-gray-400 rounded-xl">
                {airport.iata}
              </div>
              <div className="ml-auto mr-4 text-right font-bold mt-2 px-4 py-2 text-xl leading-4 text-gray-600">
                {decimalToDMS(airport.latitude, airport.longitude)} |{' '}
                {airport.elevation} ft
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-5 mt-20">
            <img
              className="w-[750px]"
              alt={airport.name.en}
              src={`https://files.by.ivao.aero/files/airports/v/${airport.icao}.png`}
            />
            <div className="relative flex items-center justify-center w-full">
              <div className="relative flex items-center justify-center">
                <p className="absolute text-[325px] font-bold opacity-50 text-[#E7E7E7]">
                  {airport.iata}
                </p>
                <p className="relative text-center text-4xl tracking-tighter leading-[39px] text-neutral-400">
                  {airport.description[i18n.language] ||
                    airport.description.en ||
                    'No Description'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-5 mt-16">
            <div className="flex flex-col gap-3 w-[855px]">
              <div className="flex flex-row gap-3">
                <div className="flex items-center shadow-xl rounded-lg bg-white overflow-hidden w-[250px]">
                  <div className="bg-atmos-700 font-semibold text-white px-4 py-2">
                    TA
                  </div>
                  <div className="px-4 py-2 text-black font-semibold text-center">
                    6000ft
                  </div>
                </div>
                <div className="flex items-center shadow-xl rounded-lg bg-white overflow-hidden w-full">
                  <div className="bg-atmos-700 font-semibold text-white px-4 py-2">
                    TL
                  </div>
                  <p className="px-4 py-2 text-neutral-400 font-semibold">
                    <span className="text-black">FL80</span> или{' '}
                    <span className="text-black">FL90</span> (если QNH меньше
                    977hPa)
                  </p>
                </div>
              </div>
              <div className="bg-white">
                <div className="flex items-center shadow-xl rounded-lg overflow-hidden">
                  <div className="bg-atmos-700 py-4 px-1">
                    <img alt={airport.name.en} src={metaricon} />
                  </div>
                  <div className="px-4 py-2 text-black font-semibold">
                    {airport.metar.metar ? (
                      <>
                        <span className="text-atmos-700">METAR</span>{' '}
                        {airport.metar.metar}{' '}
                      </>
                    ) : (
                      <p className="text-red-500">{airport.taf.message}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-white">
                <div className="flex items-center shadow-xl rounded-lg overflow-hidden">
                  <div className="bg-atmos-700 py-9 px-1">
                    <IconRadar2 size={50} />
                  </div>
                  <div className="px-4 py-2 text-black font-semibold">
                    {airport.taf.taf ? (
                      <>
                        <span className="text-atmos-700">TAF</span>{' '}
                        {airport.taf.taf}{' '}
                      </>
                    ) : (
                      <p className="text-red-500">{airport.taf.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-atmos-700 w-[650px] rounded-lg"></div>
          </div>
        </div>
      ))}
    </GeneralLayout>
  );
}
