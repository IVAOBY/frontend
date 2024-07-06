import { useCallback } from 'react';

import { IconChevronLeft } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { GeneralLayout } from '../../../components/Layout';

export function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const goBackHandler = useCallback(() => {
    navigate(-3);
  }, [navigate]);

  return (
    <div className="h-screen w-screen bg-semantic-red-500">
      <GeneralLayout>
        <div
          className="mt-3 flex flex-row font-bold text-white hover:cursor-pointer"
          onClick={goBackHandler}
        >
          <IconChevronLeft />
          <span className="font-['Montserrat']">Назад</span>
        </div>
        <div className="flex flex-col gap-20">
          <div className="mt-3 text-7xl font-bold text-white md:text-6xl">
            {t('errorpage.notfoundtext')}
          </div>
          <img
            alt="404 Error"
            className="-ml-2 w-7/12"
            src={'https://cdn.by.ivao.aero/logos/error_404.svg'}
          />
        </div>
      </GeneralLayout>
    </div>
  );
}
