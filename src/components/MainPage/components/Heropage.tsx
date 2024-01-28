import { useCallback, useContext } from 'react';

import { notifications } from '@mantine/notifications';
import { IconCircleX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import Typed from 'react-typed';

import { AuthContext } from '../../../context/UserContext';
import { CustomButton } from '../../Button';


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
    <div className="inline-flex max-w-screen-lg flex-col items-center justify-start gap-40 px-40 pb-14 pt-28">
      <div className="flex h-[450px] flex-col items-start justify-center gap-14 self-stretch">
        <div className="flex h-[236px] flex-col items-start justify-center gap-3 self-stretch">
          <div className="self-stretch text-4xl font-bold leading-[80px] text-ivao-blue">
            <Typed
              strings={[t('heropage.subtitle'), t('heropage.subtitle2')]}
              typeSpeed={90}
              backSpeed={15}
              loop
            />
          </div>
          <div className="self-stretch">
            <span className="text-lg  leading-loose text-fuselage-150">
              Присоединяйтесь к белорусскому дивизиону IVAO и окунитесь в мир
              виртуальной авиации. Опытные пилоты и контролеры, захватывающие
              мероприятия и профессиональное сообщество. Присоединяйтесь прямо
              сейчас!
            </span>
          </div>
        </div>
        <div className="inline-flex content-normal justify-start gap-4">
          <CustomButton
            title={t('heropage.joinbutton')}
            variant={'secondary'}
            size={'xl'}
            onClick={() =>
              openLink('https://ivao.aero/members/person/register.htm')
            }
          />
          <CustomButton
            title={t('heropage.transfer')}
            variant={'muted'}
            size={'xl'}
            onClick={byTransferMail}
          />
        </div>
      </div>
    </div>
  );
}