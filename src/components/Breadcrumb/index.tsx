import { useTranslation } from 'react-i18next';
import {IconChevronLeft} from "@tabler/icons-react";
import {useNavigate} from "react-router-dom";





export const Breadcrumb = () => {
  const { t } = useTranslation();
  const navigate = useNavigate()

  return (
      <div className="flex flex-row text-gray-400 hover:text-gray-300 transition duration-300 mb-3 max-w-16" onClick={()=> navigate('/')}>
          <IconChevronLeft/>
          <span className="font-bold font-['Montserrat']">{t('breadcrumb.title')}</span>
      </div>
  );
};
