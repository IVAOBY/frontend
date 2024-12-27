import { useCallback, useEffect, useRef } from 'react';

import {
  IconAirTrafficControl,
  IconCar,
  IconDownload,
  IconPlane,
  IconRadar,
  IconRadar2,
  IconShoppingBag,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import metaricon from '../../assets/icons/metar.svg';
import { useAirportById } from '../../hooks/query/useAirports';
import i18n from '../../i18n/i18n';
import { CustomButton } from '../Button';
import { BreadcrumbLayout, Centered } from '../Layout';
import { Loader } from '../Loader';
import { ErrorNotification } from '../Notification/ErrorNotification';
import { Tooltip } from '../Tooltip';

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
  const { t } = useTranslation();
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

  const { data, error, isError, isLoading } = useAirportById(icao);

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
    <BreadcrumbLayout>
      {isError && error && (
        <ErrorNotification
          error={error}
          notificationId="airports-error-allairports"
        />
      )}
      {isLoading || isError ? (
        <Centered>
          <Loader />
        </Centered>
      ) : (
        data &&
        data.map((airport) => (
          <div key={airport.icao}>
            <div className="flex w-full flex-col md:flex-row md:gap-12">
              <div className="flex w-full flex-col gap-3 md:flex-row md:gap-[40px]">
                <p className="text-3xl font-bold text-black md:text-5xl">
                  {airport.name}
                </p>
                <div className="flex flex-row gap-3">
                  <div className="mt-2 size-min justify-center rounded-xl bg-black px-4 py-2 text-center text-xl font-bold leading-4 text-white">
                    {airport.icao}
                  </div>
                  {airport.iata && (
                    <div className="mt-2 size-min justify-center rounded-xl bg-[#D7D7DC] px-4 py-2 text-center text-xl font-bold leading-4 text-[#958F8F]">
                      {airport.iata}
                    </div>
                  )}
                </div>
                <div className="mt-2 text-xl font-bold leading-4 text-gray-600 md:ml-auto md:text-end">
                  {decimalToDMS(airport.latitude, airport.longitude)} |{' '}
                  {airport.elevation} ft
                </div>
              </div>
            </div>
            {airport.airportTypeId === 1 && (
              <div className="mt-20 flex flex-col gap-10 lg:flex-row">
                <img
                  className="w-[750px]"
                  alt={airport.name}
                  src={`https://cdn.by.ivao.aero/images/airports/v/${airport.icao}.png`}
                />
                <div className="relative flex w-full items-center justify-center">
                  <div className="relative flex items-center justify-center">
                    <p className="absolute text-[120px] font-bold text-[#E7E7E7] opacity-50 lg:text-[165px] 2xl:text-[325px]">
                      {airport.iata}
                    </p>
                    <p className="relative text-center text-lg leading-[39px] tracking-tighter text-neutral-400 lg:text-2xl 2xl:text-4xl">
                      {airport.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-16 flex flex-col gap-5 lg:flex-row">
              <div className="flex max-w-[855px] flex-col gap-3">
                <div className="flex flex-col gap-3 md:flex-row">
                  <div className="flex w-full items-center overflow-hidden rounded-lg bg-atmos-700 shadow-md md:max-w-[250px]">
                    <div className="px-4 py-2 font-semibold text-white">TA</div>
                    <div className="size-full content-center bg-white px-4 py-2 text-center font-semibold text-black">
                      6000ft
                    </div>
                  </div>
                  <div className="flex w-full items-center overflow-hidden rounded-lg bg-atmos-700 shadow-md">
                    <div className="px-4 py-2 font-semibold text-white">TL</div>
                    <p className="w-full bg-white px-4 py-2 text-center font-semibold text-neutral-400">
                      <span className="text-black">FL80</span> или{' '}
                      <span className="text-black">FL90</span> (если QNH меньше
                      977hPa)
                    </p>
                  </div>
                </div>
                <div className="bg-white">
                  <div className="flex items-center overflow-hidden rounded-lg bg-atmos-700 shadow-md">
                    <div className="h-full px-1 py-4">
                      <img alt={airport.name} src={metaricon} />
                    </div>
                    <div className="min-h-[80px] w-full content-center bg-white px-4 py-2 font-semibold text-black">
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
                <div className="flex  items-center overflow-hidden rounded-lg bg-atmos-700 shadow-md">
                  <div className="px-1 py-9">
                    <IconRadar2 size={50} />
                  </div>
                  <div className="min-h-[122px] w-[855px] content-center bg-white px-4 py-2 font-semibold text-black">
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
              <div className="max-h-[370px] w-[650px] rounded-lg bg-atmos-700 max-md:hidden flex items-center justify-center">
                <div className="bg-amber-300 w-1/4 h-1/4 flex flex-col items-center justify-center text-3xl shadow-lg text-black border-4 border-black font-bold rounded-xl text-center">
                  <div>INOP</div>
                  <div className="text-sm -mt-2">SEE T/LOG</div>
                </div>
              </div>
            </div>
            <div className="mt-[30px] flex flex-col gap-5 sm:flex-row">
              {airport.atcPositions?.length > 0 && (
                <div className="flex flex-col gap-3 rounded-2xl bg-white p-[19px] shadow-md">
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
                        className="flex w-[338px] flex-row items-center gap-3"
                      >
                        <div
                          className={`flex size-14 items-center justify-center rounded-2xl ${positionColors[type]}`}
                        >
                          {positionIcons[type]}
                        </div>
                        <div>
                          <div className="text-2xl font-semibold text-black">
                            {position.name[i18n.language]}
                          </div>
                          <div className="text-[15px] font-semibold text-[#ABA7A7]">
                            {position.callsign}, {position.frequency}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
              {airport.runways.length > 0 && (
                <div className="rounded-xl bg-white p-4 shadow-md sm:w-[573px]">
                  <h2 className="mb-4 text-3xl font-semibold uppercase text-black">
                    <span className="font-bold">ВПП</span> Аэродрома
                  </h2>
                  <ul>
                    {airport.runways.map((runway) => (
                      <li
                        key={runway.id}
                        className="mb-4 flex flex-row flex-wrap gap-1"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-16 items-center justify-center border-2 border-black rounded-xl bg-red-500 text-xl font-bold text-white">
                            {runway.designation}
                          </span>
                          <span className="text-lg font-semibold text-black">
                            {runway.heading}&deg; / {runway.tora}m
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 pl-1 items-center text-lg font-semibold">
                          {runway.ndb && (
                            <span>
                              <span className="text-black">/</span>{' '}
                              <span className="text-atmos-700">NDB</span>{' '}
                              <span className="text-black">{runway.ndb}</span>
                            </span>
                          )}
                          {runway.vor && (
                            <span>
                              <span className="text-black">/</span>{' '}
                              <span className="text-atmos-700">VOR</span>{' '}
                              <span className="text-black">{runway.vor}</span>
                            </span>
                          )}
                          {runway.vorDme && (
                            <span>
                              <span className="text-black">/</span>{' '}
                              <span className="text-atmos-700">VDME</span>{' '}
                              <span className="text-black">
                                {runway.vorDme}
                              </span>
                            </span>
                          )}
                          {runway.rnp && (
                            <span>
                              <span className="text-black">/</span>{' '}
                              <span className="text-atmos-700">RNP</span>
                            </span>
                          )}
                          {runway.gls && (
                            <span>
                              <span className="text-black">/</span>{' '}
                              <span className="text-atmos-700">GLS</span>{' '}
                              <span className="text-black">{runway.gls}</span>
                            </span>
                          )}
                          {runway.ils && (
                            <span>
                              <span className="text-black">/</span>{' '}
                              <span className="text-atmos-700">ILS</span>{' '}
                              <span className="text-[#777777]">
                                {runway.ilsCat && runway.ilsCat === '3'
                                  ? 'IIIA'
                                  : runway.ilsCat === '2'
                                    ? 'II'
                                    : ''}{' '}
                              </span>
                              <span className="text-black">{runway.ils}</span>
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {airport.sceneries.length > 0 && (
                <div className="rounded-xl bg-white p-4 shadow-md sm:w-[565px]">
                  <h2 className="mb-4 text-3xl font-semibold uppercase text-black">
                    Сценарии
                  </h2>
                  <ul>
                    {airport.sceneries.map((scenery) => (
                      <li
                        key={scenery.id}
                        className="mb-2 flex items-center justify-between"
                      >
                        <span className="uppercase text-neutral-400">
                          {scenery.simulator}
                        </span>
                        <div className="grow-1 mx-2 w-full">
                          <div className="border-t-2"></div>
                        </div>
                        <Tooltip content={scenery.title} position={'left'}>
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
                        </Tooltip>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </BreadcrumbLayout>
  );
}
