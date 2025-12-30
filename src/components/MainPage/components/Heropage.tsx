import { useCallback, useContext, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next'; //import { IconArrowDown } from '@tabler/icons-react';

import { AuthContext } from '../../../context/UserContext';
import { CustomButton } from '../../Button';

export function HeroText() {
  const [timeOfDay, setTimeOfDay] = useState('day');
  const { signed, decodedToken } = useContext(AuthContext);
  const { t } = useTranslation();

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 6 && hours < 12) {
      setTimeOfDay('morning');
    } else if (hours >= 12 && hours < 18) {
      setTimeOfDay('day');
    } else if (hours >= 18 && hours < 22) {
      setTimeOfDay('evening');
    } else {
      setTimeOfDay('night');
    }
  }, []);

  const backgroundImage = {
    morning: "url('https://cdn.by.ivao.aero/images/main_page_morning.webp')",
    day: "url('https://cdn.by.ivao.aero/images/main_page_day.webp')",
    evening: "url('https://cdn.by.ivao.aero/images/main_page_evening.webp')",
    night: "url('https://cdn.by.ivao.aero/images/main_page_night.webp')",
  };

  const byTransferMail = useCallback(() => {
    if (!signed) {
      return;
    }

    try {
      const emailBody = `Dear HQs and Membership Department!

I request to transfer me from the ${decodedToken?.userData.divisionId} division to the BY division.
                
Best wishes,
${decodedToken?.userData.name.first} ${decodedToken?.userData.name.last}`;

      window.open(
        `mailto:BY-hq@ivao.aero,${decodedToken?.userData.divisionId}-hq@ivao.aero?cc=members@ivao.aero&subject=Division%20transfer%20${decodedToken?.userData.id}&body=${encodeURIComponent(
          emailBody,
        )}`,
        '_blank',
      );
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, [
    signed,
    decodedToken?.userData.divisionId,
    decodedToken?.userData.name.first,
    decodedToken?.userData.name.last,
    decodedToken?.userData.id,
  ]);

  const openLink = useCallback(function (link: string | undefined) {
    window.open(link, '_blank');
  }, []);

  return (
    <div
      className="relative flex h-[487px] w-full items-center justify-center bg-cover bg-center md:h-[900px]"
      style={{ backgroundImage: backgroundImage[timeOfDay] }}
    >
      <div className="container z-10 mx-auto flex max-w-screen-2xl flex-col gap-4 px-4 py-8">
        <div className="leading-none">
          <p className="font-['Futura PT'] text-[32px] font-bold uppercase text-white drop-shadow-lg sm:text-[40px] md:text-[70px] lg:text-[100px]">
            {t('mainpage.heropage.title')},
          </p>
          <p className="font-['Futura PT'] my-[-10px] ml-[-4px] text-[60px] font-bold uppercase text-white drop-shadow-lg sm:text-[80px] md:ml-[-8px] md:mt-[-20px] md:text-[125px] xl:ml-[-20px] xl:text-[250px]">
            {t('mainpage.heropage.title2')}
          </p>
        </div>
        <div className="mt-8 flex flex-row gap-4">
          <CustomButton
            size={'xl'}
            className={'rounded-xl'}
            onClick={() =>
              openLink('https://ivao.aero/members/person/register.htm')
            }
          >
            {t('mainpage.heropage.joinbutton')}
          </CustomButton>
          {signed ? (
            <CustomButton
              size={'xl'}
              className={'rounded-xl'}
              variant={'white'}
              onClick={byTransferMail}
            >
              {t('mainpage.heropage.transfer')}
            </CustomButton>
          ) : null}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-[200px] w-full bg-gradient-to-t from-background-body to-transparent md:h-[390px]"></div>
    </div>
  );
}
