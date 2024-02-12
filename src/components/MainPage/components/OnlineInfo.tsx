import { useEffect, useState } from 'react';

import { AtcResponse } from '@ivaoby/common/types/tracker/internal/atc-response';
import { PilotResponse } from '@ivaoby/common/types/tracker/internal/pilots-response';
import { IconAirTrafficControl, IconPlaneTilt } from '@tabler/icons-react';

// import { useTranslation } from 'react-i18next';

import { useApi } from '../../../context/ApiContext';

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
    <>
      <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
        {/*ATC*/}
        <div
          key="ATC"
          className="flex w-[350px] flex-row rounded-xl bg-white p-5 shadow-lg first:mb-2 md:w-[500px] md:first:mb-0 md:first:mr-5"
        >
          <div className="flex flex-col">
            <IconAirTrafficControl
              className="rounded-2xl bg-atmos-700 p-5"
              size={'70px'}
              stroke={2}
              color="#fff"
            />
          </div>
          <div>
            {atcItems &&
              atcItems.map((atc) => (
                <span
                  onClick={() =>
                    window.open(
                      `https://tracker.ivao.aero/sessions/${atc.id}`,
                      '_blank',
                    )
                  }
                  key={atc.id}
                  className="me-2 ml-3 rounded border border-green-400 bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
                >
                  {atc.composePosition} ({Math.round(atc.time / 60).toString()}{' '}
                  minutes)
                </span>
              ))}
          </div>
        </div>
        {/*PILOTS*/}
        <div
          key="Pilots"
          className="flex w-[350px] flex-row rounded-xl bg-white p-5 shadow-lg first:mb-2 md:w-[500px] md:first:mb-0 md:first:mr-5"
        >
          <div className="flex flex-col">
            <IconPlaneTilt
              className="rounded-2xl bg-atmos-700 p-5"
              size={'70px'}
              stroke={2}
              color="#fff"
            />
          </div>
          <div>
            {pilotsItem ? (
              pilotsItem.map((pilot) => (
                <span
                  onClick={() =>
                    window.open(
                      `https://tracker.ivao.aero/sessions/${pilot.id}`,
                      '_blank',
                    )
                  }
                  key={pilot.id}
                  className="me-2 ml-3 rounded border border-green-400 bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800"
                >
                  {pilot.callsign} ({Math.round(pilot.time / 60).toString()}{' '}
                  minutes)
                </span>
              ))
            ) : (
              <p className="ml-3 font-bold text-atmos-700">No pilots</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
