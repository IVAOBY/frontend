import { IconChevronLeft } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { GeneralLayout } from '../../components/Layout';

export function Training() {
  const { t } = useTranslation();

  return (
    <GeneralLayout>
      <div className="flex flex-row text-gray-300">
        <IconChevronLeft />
        <span className="font-['Montserrat']">На главную</span>
      </div>
      <div className="text-3xl font-bold text-black md:text-5xl">
        {t('navbar.community.training')}
      </div>
      <div className="mt-6 flex columns-3 flex-row gap-6">
        <div className="h-36 w-1/3 rounded-3xl bg-atmos-700"></div>
        <div className="h-36 w-1/3 rounded-3xl bg-atmos-700"></div>
        <div className="h-36 w-1/3 rounded-3xl bg-white"></div>
      </div>
    </GeneralLayout>
  );
}
