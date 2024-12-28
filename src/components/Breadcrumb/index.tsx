import { IconChevronLeft } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const Breadcrumb = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      className="-ml-2 mb-3 flex max-w-36 flex-row text-gray-400 transition duration-300 hover:cursor-pointer hover:text-gray-300"
      onClick={() => navigate('/')}
    >
      <IconChevronLeft />
      <span className="font-['Montserrat'] font-bold">
        {t('breadcrumb.title')}
      </span>
    </div>
  );
};
