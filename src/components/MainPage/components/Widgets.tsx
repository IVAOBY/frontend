import {
  useCallback,
  // useContext
} from 'react';

// import { notifications } from '@mantine/notifications';
// import { IconCircleX } from '@tabler/icons-react';
// import { useTranslation } from 'react-i18next';

import airport from '../../../assets/image/airport.svg';
import belavia from '../../../assets/image/belaviakrylo.svg';
import charts from '../../../assets/image/charts.svg';
import discord from '../../../assets/image/discord2.svg';
// import { AuthContext } from '../../../context/UserContext';
import { CustomButton } from '../../Button';

export function Widgets() {
  // const { classes } = useStyles();
  // const { t } = useTranslation();
  // const isSmallScreen = useMediaQuery('(max-width: 575px)');
  // const { signed, decodedToken } = useContext(AuthContext);

  //   const byTransferMail = useCallback(() => {
  //     if (!signed) {
  //       notifications.show({
  //         id: 'auth-required',
  //         color: 'red',
  //         title: t('notif.auth.negative.name'),
  //         message: t('notif.auth.negative.description'),
  //         radius: 'lg',
  //         icon: <IconCircleX />,
  //         withCloseButton: true,
  //         autoClose: 3000,
  //       });
  //       return;
  //     }
  //
  //     if (signed) {
  //       try {
  //         const emailBody = `Dear HQs and Membership Department!
  //
  // I request to transfer me from the ${decodedToken?.userData.divisionId} division to the BY division.
  //
  // Best wishes,
  // ${decodedToken?.userData.name.first} ${decodedToken?.userData.name.last}`;
  //
  //         window.open(
  //           `mailto:BY-hq@ivao.aero,${decodedToken?.userData.divisionId}-hq@ivao.aero?cc=members@ivao.aero&subject=Division%20transfer%20${decodedToken?.userData.id}&body=${encodeURIComponent(
  //             emailBody,
  //           )}`,
  //           '_blank',
  //         );
  //       } catch (error) {
  //         console.error('Error decoding token:', error);
  //       }
  //     }
  //   }, [decodedToken, signed, t]);

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
            className="rounded-l-b-2xl absolute left-0 top-[153px] z-10 mb-0 h-[73%] w-full pb-0"
          />
          <div className="flex flex-col">
            <p className="font-['Futura PT'] z-4 relative ml-6 text-7xl font-bold uppercase tracking-tighter text-white">
              первые шаги
            </p>
            <CustomButton
              variant={'white'}
              size={'md'}
              className="z-20 ml-7 mt-2 max-w-32"
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
              <p className="mt-[15px] text-center font-['Montserrat'] text-[60px] font-bold uppercase tracking-tighter text-white">
                схемы
              </p>
              <img
                src={charts}
                alt="Charts image"
                className="rounded-l-b-2xl absolute left-0 top-[81px] z-10 mb-0 h-[70%] w-full pb-0"
              />
            </div>
          </div>
          <div className="flex columns-2 flex-row gap-6 pt-7">
            <div className="flex h-[270px] w-[355px] flex-col items-center justify-start gap-5 rounded-3xl bg-indigo-500 pb-48">
              <img src={discord} alt="Discord logo" className="mt-[28px]" />
              <div className="w-[248px] rounded-2xl rounded-bl-none bg-white p-3">
                <p className="text-[20px] font-semibold text-black">
                  А где весь движ?🛩️
                </p>
              </div>
              <div className="flex w-[293px] flex-col rounded-2xl rounded-br-none bg-gray-900 p-3">
                <p className="text-[20px] font-semibold text-white">
                  Воу-воу, скорее заходи:
                </p>
                <p className="text-[20px] font-semibold text-white">
                  discord.by.ivao.aero
                </p>
              </div>
            </div>
            <div className="relative flex h-[270px] w-[741px] items-center justify-end rounded-3xl border border-stone-300 bg-gray-900 pr-10">
              <img
                src={airport}
                alt="UMMS Aurora"
                className="rounded-l-b-2xl absolute left-[170px] top-0 z-10 mb-0 size-full pb-0"
              />
              <p className="text-right font-['Montserrat'] text-[70px] font-bold uppercase tracking-tighter text-white">
                сценарии
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
