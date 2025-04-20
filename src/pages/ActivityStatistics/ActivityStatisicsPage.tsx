// import { useTranslation } from 'react-i18next';

import { BreadcrumbLayout } from '../../components/Layout';

export function ActivityStatisicsPage() {
  // const { t } = useTranslation();

  return (
    <div>
      <BreadcrumbLayout>
        <div className="mb-6 text-3xl font-bold text-black md:text-5xl">
          Статистика
        </div>
        <div className="flex h-[218px] w-[450px] flex-col items-center justify-around rounded-xl bg-atmos-700 p-6 text-white">
          <div className="flex items-baseline">
            <span className="text-8xl font-bold leading-none">
              25<span className="align-baseline">,</span>17
            </span>
            <span className="ml-2 font-['Montserrat'] text-5xl font-extrabold tracking-[-0.24em] text-[#A7B7F0]">
              УБ
            </span>
          </div>
          <div className="text-3xl font-normal text-[#A7B7F0]">VID: 702294</div>
        </div>
      </BreadcrumbLayout>
    </div>
  );
}
