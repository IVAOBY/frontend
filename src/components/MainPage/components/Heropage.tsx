import { useCallback, useContext, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

//import { IconArrowDown } from '@tabler/icons-react';

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
    morning: "url('https://files.by.ivao.aero/files/banners/main/M.png')",
    day: "url('https://files.by.ivao.aero/files/banners/main/D.png')",
    evening: "url('https://files.by.ivao.aero/files/banners/main/E.png')",
    night: "url('https://files.by.ivao.aero/files/banners/main/N.png')",
  };

  /*  const scrollToNextSection = () => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
          });
        };*/

  const byTransferMail = useCallback(() => {
    if (!signed) {
      return;
    }

    if (signed) {
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
  }, [decodedToken, signed]);

  const openLink = useCallback(function (link: string | undefined) {
    window.open(link, '_blank');
  }, []);

  return (
    <div
      className="relative w-full h-[487px] md:h-[1080px] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: backgroundImage[timeOfDay] }}
    >
      <div className="container mx-auto max-w-screen-2xl px-4 py-8 flex flex-col gap-4 pt-8 z-10">
        <div className="leading-none">
          <p className="font-['Futura PT'] drop-shadow-lg text-[32px] sm:text-[40px] md:text-[70px] lg:text-[100px] font-bold text-white">
            ЗНАКОМЬТЕСЬ,
          </p>
          <p className="font-['Futura PT'] ml-[-4px] md:ml-[-8px] xl:ml-[-20px] drop-shadow-lg text-[60px] sm:text-[80px] md:text-[125px] xl:text-[250px] font-bold text-white mt-[-10px] mb-[-10px] md:mt-[-20px]">
            БЕЛАРУСЬ
          </p>
        </div>
        <div className="flex flex-row gap-4 mt-8">
          <CustomButton
            size={'xl'}
            className={'rounded-xl'}
            onClick={() =>
                openLink('https://ivao.aero/members/person/register.htm')
            }
          >
            Регистрация
          </CustomButton>
          <CustomButton
            size={'xl'}
            className={'rounded-xl'}
            variant={'white'}
            onClick={byTransferMail}
          >
            {t('heropage.transfer')}
          </CustomButton>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[200px] md:h-[390px] bg-gradient-to-t from-background-body to-transparent"></div>
      {/*        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 cursor-pointer"
             onClick={scrollToNextSection}>
          <IconArrowDown stroke={2} size={90}
                         className="text-atmos-700 absolute bottom-4 left-1/2 transform -translate-x-1/2 cursor-pointer"/>
        </div>*/}
    </div>
  );
}
