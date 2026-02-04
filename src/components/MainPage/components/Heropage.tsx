import { useCallback, useContext, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next'; //import { IconArrowDown } from '@tabler/icons-react';
import { AuthContext } from '../../../context/UserContext';
import { CustomButton } from '../../Button';

export function HeroText() {
  const [winter, setWinter] = useState<boolean>(false);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'day' | 'evening' | 'night'>('day');
  const { signed, decodedToken } = useContext(AuthContext);
  const { t } = useTranslation();

  useEffect(() => {
    const now = new Date();
    const m = now.getMonth();
    const h = now.getHours();

    if (h >= 6 && h < 12) setTimeOfDay('morning');
    else if (h >= 12 && h < 18) setTimeOfDay('day');
    else if (h >= 18 && h < 22) setTimeOfDay('evening');
    else setTimeOfDay('night');
    setWinter(m === 11 || m === 0 || m === 1);
  }, []);

  const backgroundImage = {
    morning: 'url(\'https://cdn.by.ivao.aero/images/backgrounds/main_page_morning.webp\')',
    day: 'url(\'https://cdn.by.ivao.aero/images/backgrounds/main_page_day.webp\')',
    evening: 'url(\'https://cdn.by.ivao.aero/images/backgrounds/main_page_evening.webp\')',
    night: 'url(\'https://cdn.by.ivao.aero/images/backgrounds/main_page_night.webp\')',
  };

  const winterBackgroundImage = {
    morning: 'url(\'https://cdn.by.ivao.aero/images/backgrounds/winter/main_page_morning.webp\')',
    day: 'url(\'https://cdn.by.ivao.aero/images/backgrounds/winter/main_page_day.webp\')',
    evening: 'url(\'https://cdn.by.ivao.aero/images/backgrounds/winter/main_page_evening.webp\')',
    night: 'url(\'https://cdn.by.ivao.aero/images/backgrounds/winter/main_page_night.webp\')',
  }

  const bg = winter
    ? winterBackgroundImage[timeOfDay]
    : backgroundImage[timeOfDay];

  const byTransferMail = useCallback(() => {
    if (!signed) return;

    try {
      const divisionId = decodedToken?.userData?.divisionId;
      const id = decodedToken?.userData?.id;
      const first = decodedToken?.userData?.name?.first ?? '';
      const last = decodedToken?.userData?.name?.last ?? '';

      if (!divisionId || !id) {
        console.error('Missing required user data for transfer mail');
        return;
      }

      const emailBody = `Dear HQs and Membership Department!

I request to transfer me from the ${divisionId} division to the BY division.

Best wishes,
${first} ${last}`;

      const mailto = `mailto:BY-hq@ivao.aero,${divisionId}-hq@ivao.aero?cc=members@ivao.aero&subject=${encodeURIComponent(
        `Division transfer ${id}`,
      )}&body=${encodeURIComponent(emailBody)}`;

      window.open(mailto, '_blank');
    } catch (error) {
      console.error('Error preparing transfer mail:', error);
    }
  }, [
    signed,
    decodedToken?.userData?.divisionId,
    decodedToken?.userData?.id,
    decodedToken?.userData?.name?.first,
    decodedToken?.userData?.name?.last,
  ]);

  const openLink = useCallback(function(link: string | undefined) {
    window.open(link, '_blank');
  }, []);

  return (
    <div
      className="relative flex h-[487px] w-full items-center justify-center bg-cover bg-center md:h-[900px]"
      style={{ backgroundImage: bg }}
    >
      <div className="container z-10 mx-auto flex max-w-screen-2xl flex-col gap-4 px-4 py-8">
        <div className="leading-none">
          <p
            className="font-['Futura PT'] text-[32px] font-bold uppercase text-white drop-shadow-lg sm:text-[40px] md:text-[70px] lg:text-[100px]">
            {t('mainpage.heropage.title')},
          </p>
          <p
            className="font-['Futura PT'] my-[-10px] ml-[-4px] text-[60px] font-bold uppercase text-white drop-shadow-lg sm:text-[80px] md:ml-[-8px] md:mt-[-20px] md:text-[125px] xl:ml-[-20px] xl:text-[250px]">
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
      <div
        className="absolute bottom-0 left-0 h-[200px] w-full bg-gradient-to-t from-background-body to-transparent md:h-[390px]"></div>
    </div>
  );
}
