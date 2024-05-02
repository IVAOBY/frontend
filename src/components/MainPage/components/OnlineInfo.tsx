import { useEffect, useState } from 'react';

import { AtcResponse } from '@ivaoby/common/types/tracker/internal/atc-response';
import { PilotResponse } from '@ivaoby/common/types/tracker/internal/pilots-response';

import atcicon from '../../../assets/icons/atc-icon.svg';
//import { IconAirTrafficControl, IconPlaneTilt } from '@tabler/icons-react';
import banner from '../../../assets/image/onlineinfobaner.png';
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
          <div className="relative h-full w-[616px] rounded-l-[100px] rounded-r-2xl bg-ivaoby-darkgray">
            <div className="flex flex-col items-center">
              <div className="font-['Futura PT'] pt-10 text-center text-3xl font-bold uppercase text-white">
                онлайн
              </div>
              <div className="relative flex w-full items-center justify-center">
                <div className="mt-[36px] flex h-[110px] w-[334px] rounded-2xl bg-[#0D2C99] relative shadow-xl">
                  <div
                    className="relative h-full w-[50%] bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${atcicon})` }}
                  ></div>
                  <div className="relative h-full w-[50%] bg-center bg-no-repeat pt-4 flex flex-col">
                    <div>
                      {atcItems && atcItems.slice(0, 3).map((atc) => (
                          <>
                            <div className="h-[21px] max-w-[138px] rounded-2xl bg-white flex flex-row items-center justify-between mt-2">
                              <p
                                className="font-['Futura PT'] text-xs font-medium text-[#000000] text-center ml-2 hover:cursor-pointer"
                                onClick={() =>
                                  window.open(
                                    `https://tracker.ivao.aero/sessions/${atc.id}`,
                                    '_blank',
                                  )
                                }
                              >
                                {atc.composePosition}
                              </p>
                              <span className="h-[25px] w-[51px] rounded-2xl bg-[#1E1E21] flex items-center justify-center">
                                <p className="font-['Futura PT'] text-xs font-medium text-white">
                                  {`${String(Math.floor(atc.time / 3600)).padStart(2, '0')}:${String(Math.floor((atc.time % 3600) / 60)).padStart(2, '0')}`}
                                </p>
                              </span>
                            </div>
                          </>
                        ))}
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
