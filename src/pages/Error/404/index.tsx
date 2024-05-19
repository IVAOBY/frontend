import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { CustomButton } from '../../../components/Button';
import { GeneralLayout } from '../../../components/Layout';
import { Title } from '../../../components/Typography/Title';

export function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <GeneralLayout>
      <div className="grid grid-cols-1 gap-2 px-4 md:grid-cols-2 md:gap-20">
        <div className="flex flex-col gap-2">
          <Title className="text-left text-semantic-red-500">
            {t('errorpage.notfoundtext')}
          </Title>
          <p className="text-fuselage-300">{t('errorpage.notfoundsubtext')}</p>
          <CustomButton
            title={t('errorpage.homebutton')}
            size={'lg'}
            variant={'destructive'}
            onClick={() => navigate('/')}
          />
        </div>
        <img
          alt="404 Error"
          className="w-5/6"
          src={'https://files.ivao.systems/files/logos/404.svg'}
        />
      </div>
    </GeneralLayout>
  );
}
