import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Title } from '../../Typography/Title';

export function EnvAlert() {
  const [isShown, setIsShown] = useState<boolean>(false);
  const [bgColor, setBgColor] = useState<string>('');
  const { t } = useTranslation();

  useEffect(() => {
    const warningClosed = localStorage.getItem('warningClosed');

    if (warningClosed !== 'true') {
      const env = import.meta.env.VITE_ENV_TYPE;
      if (env === 'DEVELOPMENT' || env === 'STAGE') {
        if (env === 'DEVELOPMENT') {
          setBgColor('bg-red-500/75');
        } else if (env === 'STAGE') {
          setBgColor('bg-yellow-600/75');
        }
        setIsShown(true);
        console.log(t('mainpage.envAlert.consoleText'));
        console.warn(
          `%c ${env}!`,
          'font-weight: bold; font-size: 30px; color: red; margin-bottom: 12px; padding: 5%',
        );
      }
    }
  }, [t]);

  const handleClose = () => {
    localStorage.setItem('warningClosed', 'true');
    setIsShown(false);
  };

  if (!isShown) {
    return null;
  }

  return (
    <div className="hover:cursor-pointer" onClick={handleClose}>
      <div
        className={`fixed bottom-0 left-0 z-50 flex w-full items-center justify-center ${bgColor} py-3`}
      >
        <div className="flex w-full max-w-screen-lg items-center justify-center px-4">
          <Title className="text-lg text-white">
            🚧 {t('mainpage.envAlert.text')} {import.meta.env.VITE_ENV_TYPE}{' '}
            {t('mainpage.envAlert.text2')}
          </Title>
        </div>
      </div>
    </div>
  );
}
