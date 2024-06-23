import { useCallback, useEffect, useRef, useState } from 'react';

import {
  IconAirTrafficControl,
  IconCar,
  IconChevronLeft,
  IconDownload,
  IconPlane,
  IconRadar,
  IconRadar2,
  IconShoppingBag,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import metaricon from '../../assets/icons/metar.svg';
import { useApi } from '../../context/ApiContext';
import i18n from '../../i18n/i18n';
import { Airport } from '../../types/Airport';
import { CustomButton } from '../Button';
import { GeneralLayout } from '../Layout';

const positionIcons = {
  ground: <IconCar size={41} />,
  tower: <IconAirTrafficControl size={41} />,
  radar: <IconRadar size={41} />,
  approach: <IconPlane size={41} />,
};

const positionColors = {
  ground: 'bg-yellow-500',
  tower: 'bg-semantic-red-500',
  radar: 'bg-ocean-600',
  approach: 'bg-atmos-700',
};

export function AirportPage() {
  const [airports, setAirports] = useState<Airport[]>([]);
  const { t } = useTranslation();
  const api = useApi();
  const { icao } = useParams();
  const widgetContainerRef = useRef(null);

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
  }, [api, icao]);

  useEffect(() => {
    const scriptId = 'metar-taf-script';
    if (!document.getElementById(scriptId) && widgetContainerRef.current) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://metar-taf.com/embed-js/${icao}?bg_color=0D2C99&layout=landscape&qnh=hPa&rh=rh&target=metartaf-widget`;
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      widgetContainerRef.current.appendChild(script);
    }
  }, [icao]);

  const openLink = useCallback(function (link: string | undefined) {
    window.open(link, '_blank');
  }, []);

  return (
    <GeneralLayout>
      <div className="flex text-gray-300 flex-row">
        <IconChevronLeft />
        <span className="font-['Montserrat']">На главную</span>
      </div>
      {airports.map((airport) => (
        <div key={airport.icao}>
          <div className="flex flex-col md:flex-row md:gap-12 w-full">
            <div className="flex flex-col md:flex-row gap-3 md:gap-[40px] w-full">
              <p className="text-3xl font-bold text-black md:text-5xl">
                {airport.name[i18n.language]}
              </p>
              <div className="flex flex-row gap-3">
                <div
                    className="justify-center font-bold w-min h-min mt-2 px-4 py-2 text-xl leading-4 text-center text-white bg-black rounded-xl">
                  {airport.icao}
                </div>
                {airport.iata && (
                    <div
                        className="justify-center font-bold w-min h-min mt-2 px-4 py-2 text-xl leading-4 text-center text-[#958F8F] bg-[#D7D7DC] rounded-xl">
                      {airport.iata}
                    </div>
                )}
              </div>
              <div className="md:ml-auto md:text-end font-bold mt-2 text-xl leading-4 text-gray-600">
                {decimalToDMS(airport.latitude, airport.longitude)} |{' '}
                {airport.elevation} ft
              </div>
            </div>
          </div>
          {airport.airportTypeId === 1 && (
              <div className="flex flex-col lg:flex-row gap-5 mt-20">
              <img
                className="w-[750px]"
                alt={airport.name.en}
                src={`https://files.by.ivao.aero/files/airports/v/${airport.icao}.png`}
              />
              <div className="relative flex items-center justify-center w-full">
                <div className="relative flex items-center justify-center">
                  <p className="absolute text-[120px] lg:text-[165px] xl:text-[325px] font-bold opacity-50 text-[#E7E7E7]">
                    {airport.iata}
                  </p>
                  <p className="relative text-center text-lg lg:text-2xl xl:text-4xl tracking-tighter leading-[39px] text-neutral-400">
                    {airport.description[i18n.language] ||
                      airport.description.en ||
                      'No Description'}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col lg:flex-row gap-5 mt-16">
            <div className="flex flex-col gap-3 max-w-[855px]">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex items-center shadow-md rounded-lg bg-white overflow-hidden w-full md:max-w-[250px]">
                  <div className="bg-atmos-700 font-semibold text-white px-4 py-2">
                    TA
                  </div>
                  <div className="px-4 py-2 text-black font-semibold text-center">
                    6000ft
                  </div>
                </div>
                <div className="flex items-center shadow-md rounded-lg bg-white overflow-hidden w-full">
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
                <div className="flex items-center shadow-md rounded-lg overflow-hidden">
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
                      <p className="text-red-500">{airport.metar.message}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-white">
                <div className="flex items-center shadow-md rounded-lg overflow-hidden">
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
            <div
              ref={widgetContainerRef}
              className="bg-atmos-700 w-[650px] max-h-[370px] rounded-lg max-md:hidden"
            ></div>
          </div>
          <div className="flex flex-col sm:flex-row mt-[30px] gap-5">
            <div className="flex flex-col gap-3">
              <div className="bg-white rounded-2xl shadow-md p-4">
                {airport.atcPositions
                  ?.map((position) => {
                    const callsign = position.callsign.toLowerCase();
                    let positionType = '';
                    if (callsign.includes('gnd')) {
                      positionType = 'ground';
                    } else if (callsign.includes('twr')) {
                      positionType = 'tower';
                    } else if (callsign.includes('r_app')) {
                      positionType = 'radar';
                    } else {
                      positionType = 'approach';
                    }
                    return { position, type: positionType };
                  })
                  .sort((a, b) => {
                    const typeOrder = {
                      ground: 0,
                      tower: 1,
                      radar: 2,
                      approach: 3,
                    };
                    return typeOrder[a.type] - typeOrder[b.type];
                  })
                  .map(({ position, type }) => (
                    <div
                      key={position.id}
                      className="flex flex-row items-center gap-3 mb-4 w-[338px]"
                    >
                      <div
                        className={`flex items-center justify-center w-14 h-14 rounded-2xl ${positionColors[type]}`}
                      >
                        {positionIcons[type]}
                      </div>
                      <div>
                        <div className="text-2xl font-semibold text-black">
                          {position.name[i18n.language]}
                        </div>
                        <div className="text-[#ABA7A7] font-semibold text-[15px]">
                          {position.callsign}, {position.frequency}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md sm:w-[565px]">
              <h2 className="text-3xl font-semibold mb-4 text-black uppercase">
                Сценарии
              </h2>
              <ul>
                {airport.sceneries.map((scenery) => (
                  <li
                    key={scenery.id}
                    className="flex justify-between items-center mb-2"
                  >
                    <span className="text-neutral-400 uppercase">
                      {scenery.simulator}
                    </span>
                    <div className="flex-grow-1 mx-2 w-full">
                      <div className="border-t-2"></div>
                    </div>
                    {scenery.license === 'payware' ? (
                      <CustomButton
                        className="flex flex-row gap-1 text-lg"
                        onClick={() => openLink(scenery.link)}
                      >
                        <IconShoppingBag stroke={2} /> {t('Buy')}
                      </CustomButton>
                    ) : (
                      <CustomButton
                        className="flex flex-row gap-1 text-lg"
                        onClick={() => openLink(scenery.link)}
                      >
                        <IconDownload stroke={2} /> {t('Download')}
                      </CustomButton>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </GeneralLayout>
  );
}
