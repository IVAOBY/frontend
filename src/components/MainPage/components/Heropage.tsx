import { useCallback, useContext } from 'react';

import { notifications } from '@mantine/notifications';
import { IconCircleX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { AuthContext } from '../../../context/UserContext';

export function HeroText() {
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
      <div className="justify-left inline-flex max-w-screen-lg flex-col gap-40 pt-8 text-left md:py-48 md:pb-48">
        <div>
          <span className="font-['Futura PT'] text-6xl font-bold leading-10 text-atmos-100">
            ЗНАКОМЬТЕСЬ,
            <br />
          </span>
          <span className="font-['Futura PT'] leading-12 text-9xl font-bold text-atmos-100">
            БЕЛАРУСЬ
          </span>
        </div>
      </div>
    </>
  );
}
