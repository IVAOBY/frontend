/*
import { useEffect, useState } from 'react';

import { AtcResponse } from '@ivaoby/common/types/tracker/internal/atc-response';
import { PilotResponse } from '@ivaoby/common/types/tracker/internal/pilots-response';

// import { IconMoodCry, IconMoodSad } from '@tabler/icons-react';

import atcicon from '../../../assets/icons/atc-icon.svg';
import piloticon from '../../../assets/icons/Plane.svg';
// import { useTranslation } from 'react-i18next';

import { useApi } from '../../../context/ApiContext';
import { GeneralLayout } from '../../Layout';

export function OnlineInfoComponent() {
  const api = useApi();
  const [pilotsItem, setPilotsItem] = useState<PilotResponse[] | null>(null);
  const [atcItems, setATCItems] = useState<AtcResponse[] | null>(null);

  useEffect(() => {
    api(`/stats/pilots`)
      .then((response: PilotResponse[]) => {
        if (Array.isArray(response)) {
          setPilotsItem(response);
        } else {
          console.error('Invalid response from API:', response);
        }
      })
      .catch((error: any) => {
        console.error('Error fetching news:', error);
      });

    api(`/stats/atc`)
      .then((response: AtcResponse[]) => {
        if (Array.isArray(response)) {
          setATCItems(response);
        } else {
          console.error('Invalid response from API:', response);
        }
      })
      .catch((error: any) => {
        console.error('Error fetching news:', error);
      });
  }, [api]);

  return (
    <GeneralLayout>
      <div className="relative flex columns-2 flex-row gap-6">
        <div
          className="relative h-[445px] w-full rounded-3xl border border-stone-300"
          style={{ backgroundImage: `url(${banner})` }}
        ></div>
        <div className="absolute inset-0 flex w-full items-center justify-end">
          <div className="relative h-full w-[616px] rounded-l-[190px] rounded-r-2xl bg-ivaoby-darkgray">
            <div className="flex flex-col items-center">
              <div className="font-['Futura PT'] pt-10 text-center text-3xl font-bold uppercase text-white">
                онлайн
              </div>
              <div className="relative flex w-full flex-col items-center justify-center">
                <div className="relative mt-[36px] flex h-[110px] w-[334px] rounded-2xl bg-[#0D2C99] shadow-xl">
                  <div
                    className="relative h-full w-1/2 bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${atcicon})` }}
                  ></div>
                  <div className="relative flex h-full w-1/2 flex-col bg-center bg-no-repeat pt-4">
                    <div>
                      {atcItems && atcItems.length > 0 ? (
                        atcItems.slice(0, 3).map((atc) => (
                          <div
                            key={atc.id}
                            className="mt-2 flex h-[21px] max-w-[138px] flex-row items-center justify-between rounded-2xl bg-white"
                          >
                            <p
                              className="font-['Futura PT'] ml-2 text-center text-xs font-medium text-[#000000] hover:cursor-pointer"
                              onClick={() =>
                                window.open(
                                  `https://tracker.ivao.aero/sessions/${atc.id}`,
                                  '_blank',
                                )
                              }
                            >
                              {atc.composePosition}
                            </p>
                            <span className="flex h-[25px] w-[51px] items-center justify-center rounded-2xl bg-[#1E1E21]">
                              <p className="font-['Futura PT'] text-xs font-medium text-white">
                                {`${String(Math.floor(atc.time / 3600)).padStart(2, '0')}:${String(Math.floor((atc.time % 3600) / 60)).padStart(2, '0')}`}
                              </p>
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="items-center justify-center pr-4 text-center font-bold text-white">
                          Никого нет в сети
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="relative mt-[36px] flex h-[110px] w-[334px] rounded-2xl bg-[#0D2C99] shadow-xl">
                  <div
                    className="relative h-full w-1/2 bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${piloticon})` }}
                  ></div>
                  <div className="relative flex h-full w-1/2 flex-col bg-center bg-no-repeat pt-4">
                    <div>
                      {pilotsItem && pilotsItem.length > 0 ? (
                        pilotsItem.slice(0, 3).map((pilot) => (
                          <div
                            key={pilot.id}
                            className="mt-2 flex h-[21px] max-w-[138px] flex-row items-center justify-between rounded-2xl bg-white"
                          >
                            <p
                              className="font-['Futura PT'] ml-2 text-center text-xs font-medium text-[#000000] hover:cursor-pointer"
                              onClick={() =>
                                window.open(
                                  `https://tracker.ivao.aero/sessions/${pilot.id}`,
                                  '_blank',
                                )
                              }
                            >
                              {pilot.callsign}
                            </p>
                            <span className="flex h-[25px] w-[51px] items-center justify-center rounded-2xl bg-[#1E1E21]">
                              <p className="font-['Futura PT'] text-xs font-medium text-white">
                                {pilot.user.id}
                              </p>
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="items-center justify-center pr-4 text-center font-bold text-white">
                          Никого нет в сети
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GeneralLayout>
  );
}
*/
