import { useCallback, useContext } from 'react';

import { notifications } from '@mantine/notifications';
import { IconCircleX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { AuthContext } from '../../../context/UserContext';

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
      <div className="flex flex-col">
        <div className="inline-flex h-96 w-64 flex-col items-center justify-start rounded-3xl bg-atmos-700 pt-12">
          <div className="font-['Futura PT'] w-64 text-6xl font-bold tracking-tighter text-white">
            ПЕРВЫЕ ШАГИ
          </div>
        </div>
        <div className="flex flex-row gap-6 columns-2">
          <div className="w-96 h-48 relative bg-white rounded-3xl border border-stone-300"></div>
          <div className="inline-flex h-48 w-64 flex-col items-center justify-start rounded-3xl bg-gray-900 pb-48">
            <div className="font-['Futura PT'] w-64 mt-4 text-4xl text-center font-bold tracking-tighter text-white">
              ПИЛОТАМ
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-6 columns-2">
          <div className="inline-flex h-48 w-64 flex-col items-center justify-start rounded-3xl bg-indigo-500 pb-48"></div>
          <div className="w-96 h-48 relative bg-gray-900 rounded-3xl border border-stone-300"></div>
        </div>
      </div>
    </>
  );
}
