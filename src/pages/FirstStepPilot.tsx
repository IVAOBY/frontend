import { useTranslation } from 'react-i18next';

import { BreadcrumbLayout } from '../components/Layout';

export function FirstStepP() {
  const { t } = useTranslation();

  return (
    <BreadcrumbLayout>
      <div className="mt-[30px] flex flex-col gap-[50px]">
        <h4 className="text-3xl font-bold leading-8 text-black md:text-[55px]">
          {t('firststeps.title')}
        </h4>
        <div className="squircle-3xl shadow-figma bg-white px-[32px] pb-[41px] pt-1">
          <div
            dangerouslySetInnerHTML={{
              __html: t('firststeps.text'),
            }}
            className="text-[#494949]"
          ></div>
        </div>
      </div>
    </BreadcrumbLayout>
  );
}
