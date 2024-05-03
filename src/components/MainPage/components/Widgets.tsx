import { useCallback, useContext } from 'react';

import { notifications } from '@mantine/notifications';
import { IconCircleX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import belavia from '../../../assets/image/belaviakrylo.svg';
import airport from '../../../assets/image/airport.svg';
import charts from '../../../assets/image/charts.svg';
import { AuthContext } from '../../../context/UserContext';
import { CustomButton } from '../../Button';

export function Widgets() {
  // const { classes } = useStyles();
  const { t } = useTranslation();
  // const isSmallScreen = useMediaQuery('(max-width: 575px)');
  const { signed, decodedToken } = useContext(AuthContext);

  const byTransferMail = useCallback(() => {
    if (!signed) {
      notifications.show({
        id: 'auth-required',
        color: 'red',
        title: t('notif.auth.negative.name'),
        message: t('notif.auth.negative.description'),
        radius: 'lg',
        icon: <IconCircleX />,
        withCloseButton: true,
        autoClose: 3000,
      });
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
  }, [decodedToken, signed, t]);

  const openLink = useCallback(function (link: string | undefined) {
    window.open(link, '_blank');
  }, []);

  return (
    <>
      <div className="flex flex-row gap-5">
        <div className="relative inline-flex h-[570px] w-[379px] flex-col items-center justify-start rounded-3xl bg-atmos-700 pt-[4.375rem]">
          <img
            src={belavia}
            alt="Belavia plane"
            className="absolute left-0 top-[153px] rounded-l-b-2xl w-full h-[73%] z-10 pb-0 mb-0"
          />
          <div className="flex flex-col">
            <p className="font-['Futura PT'] relative z-4 ml-6 text-7xl font-bold tracking-tighter text-white uppercase">
              первые шаги
            </p>
            <CustomButton
              variant={'white'}
              size={'md'}
              className="ml-7 mt-2 max-w-32 z-20"
              onClick={() =>
                openLink('https://ivao.aero/members/person/register.htm')
              }
            >
              Регистрация
            </CustomButton>
          </div>
        </div>

        <div className="flex-col">
          <div className="flex columns-2 flex-row gap-6">
            <div className="relative h-[270px] w-[747px] rounded-3xl border border-stone-300 bg-white"></div>
            <div className="relative inline-flex h-[270px] w-[355px] flex-col items-center justify-start rounded-3xl bg-gray-900 pb-48">
              <p className="font-['Montserrat'] mt-[15px] text-center text-[60px] font-bold tracking-tighter text-white uppercase">
                схемы
              </p>
              <img
                src={charts}
                alt="Charts image"
                className="absolute left-0 top-[81px] rounded-l-b-2xl w-full h-[70%] z-10 pb-0 mb-0"
              />
            </div>
          </div>
          <div className="flex columns-2 flex-row gap-6 pt-7">
            <div className="inline-flex h-[270px] w-[355px] flex-col items-center justify-start rounded-3xl bg-indigo-500 pb-48">

            </div>
            <div
                className="flex relative h-[270px] pr-10 w-full rounded-3xl border border-stone-300 bg-gray-900 justify-end items-center">
              <img
                  src={airport}
                  alt="UMMS Aurora"
                  className="absolute -left-[220px] top-0 rounded-l-b-2xl w-full h-full z-10 pb-0 mb-0"
              />
              <p className="font-['Montserrat'] text-right text-[70px] font-bold tracking-tighter text-white uppercase">
                сценарии
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
