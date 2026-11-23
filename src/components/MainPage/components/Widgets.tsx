import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import discord from '../../../assets/icons/footer/discord.svg';
import belavia from '../../../assets/image/belaviakrylo.svg';

export function Widgets() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleExternalLink = (link) => {
    window.open(link, '_blank');
  };

  const handleInternalLink = (path) => {
    navigate(path);
  };

  return (
    <>
      <div className="mt-[-180px] flex flex-col gap-6 lg:flex-row">
        <div
          onClick={() => handleInternalLink('/first-steps')}
          className="squircle-3xl group relative inline-flex h-[148px] cursor-pointer flex-col items-center justify-start overflow-hidden bg-atmos-700 pt-[25px] duration-700 hover:scale-[103%] md:pt-[50px] lg:h-[320px] xl:h-[564px] xl:min-w-[362px] xl:pt-[4.375rem]"
        >
          <img
            src={belavia}
            alt="Belavia plane"
            className="squircle-3xl absolute left-0 top-[93px] z-10 mb-0 hidden h-[70%] w-full pb-0 duration-700 group-hover:-translate-y-2 group-hover:translate-x-2 group-hover:scale-[107%] xl:top-[153.5px] xl:block xl:h-[73%]"
          />
          <div className="flex flex-col items-center md:justify-center xl:-mt-6">
            <p className="font-['Futura PT'] z-4 relative text-center text-[60px] font-bold uppercase leading-[50px] tracking-tighter text-white duration-700 group-hover:-translate-y-3 group-hover:-rotate-2 md:text-[90px] md:leading-10 lg:mt-7 lg:leading-[80px] xl:mx-3 xl:text-7xl">
              {t('mainpage.widgets.first')}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-6 xl:flex-row">
            <div
              onClick={() => handleInternalLink('/about-us')}
              className="squircle-3xl group relative hidden h-[270px] cursor-pointer border border-stone-300 bg-white duration-700 hover:scale-[103%] xl:flex xl:w-[740px] xl:flex-row xl:overflow-hidden"
            >
              <img
                src="https://cdn.by.ivao.aero/images/widget_about.webp"
                alt="Belarus in IVAO"
                className="squircle-3xl size-full object-cover duration-700 group-hover:-translate-x-5 group-hover:scale-[107%]"
              />
              <div className="flex flex-col justify-center break-words px-5 font-bold">
                <p className="text-[60px] uppercase leading-none text-black duration-700 group-hover:rotate-1 group-hover:scale-105">
                  {t('mainpage.heropage.title2')}
                </p>
                <div className="flex items-center gap-4 duration-700 group-hover:translate-y-1 group-hover:-rotate-1">
                  <span className="text-[100px] uppercase leading-none text-black">
                    {t('mainpage.widgets.about')}
                  </span>
                  <span className="text-[100px] leading-none text-atmos-700">
                    IVAO
                  </span>
                </div>
              </div>
            </div>

            <div
              onClick={() =>
                handleExternalLink(
                  'https://www.ban.by/en/aeronautical-information-aip/amdt',
                )
              }
              className="squircle-3xl group relative inline-flex h-[148px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden bg-gray-900 duration-700 hover:scale-[103%] md:justify-start xl:h-[270px] xl:w-[355px]"
            >
              <p className="text-center font-['Montserrat'] text-[60px] font-bold uppercase tracking-tighter text-white duration-700 group-hover:-translate-y-2 group-hover:translate-x-2 group-hover:rotate-2 md:mt-0 md:text-[90px] xl:mt-[15px] xl:text-[60px]">
                {t('mainpage.widgets.charts')}
              </p>
              <img
                src="https://cdn.by.ivao.aero/images/widget_charts.webp"
                alt="Charts"
                className="rounded-l-b-2xl absolute left-0 top-[52px] z-10 mb-0 hidden h-[65%] w-full pb-0 duration-700 group-hover:-translate-x-2 group-hover:-translate-y-2 group-hover:-rotate-2 group-hover:scale-110 xl:-top-0 xl:block xl:size-full"
              />
            </div>
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <div
              onClick={() => handleExternalLink('https://discord.by.ivao.aero')}
              className="squircle-3xl group flex h-[148px] w-full cursor-pointer flex-col items-center justify-center gap-2 bg-indigo-500 duration-700 hover:scale-[103%] md:justify-start xl:h-[270px] xl:w-[355px] xl:gap-6 xl:pb-48"
            >
              <p className="block text-center font-['Montserrat'] text-[60px] font-bold uppercase tracking-tighter text-white md:text-[90px] xl:mt-[15px] xl:hidden xl:text-[60px]">
                Discord
              </p>
              <div className="hidden xl:block">
                <div
                  onClick={() => handleExternalLink('https://ds.by.ivao.aero')}
                  className="squircle-3xl flex h-[270px] w-[355px] flex-col items-center justify-center gap-5 bg-indigo-500 md:justify-start"
                >
                  <img
                    src={discord}
                    alt="Discord logo"
                    className="mt-[28px] w-12"
                  />
                  <div className="squircle-2xl -ml-16 w-[250px] !rounded-bl-none bg-white p-3 duration-300 group-hover:rotate-2">
                    <p className="text-[20px] font-semibold text-black">
                      {t('mainpage.widgets.discord.message')}
                    </p>
                  </div>
                  <div className="squircle-2xl -mt-2 ml-6 flex w-[293px] flex-col !rounded-br-none bg-gray-900 p-3 duration-300 group-hover:-rotate-1">
                    <p className="text-[20px] font-semibold text-white">
                      {t('mainpage.widgets.discord.message2')}
                    </p>
                    <p className="text-[20px] font-semibold text-white">
                      discord.by.ivao.aero
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={() => handleInternalLink('/airports')}
              className="squircle-3xl group relative hidden cursor-pointer items-center justify-end overflow-hidden border border-stone-300 bg-gray-900 pr-10 duration-700 hover:scale-[103%] xl:flex xl:h-[270px] xl:w-[740px]"
            >
              <img
                src="https://cdn.by.ivao.aero/images/widget_airports.webp"
                alt="UMMS Aurora"
                className="squircle-3xl absolute -left-px -top-0 z-10 mb-0 size-full object-cover pb-0 transition-transform duration-700 group-hover:translate-x-5 group-hover:scale-105"
              />
              <p className="z-20 max-w-[511px] text-right font-['Montserrat'] text-[70px] font-bold uppercase leading-[66.5px] tracking-tighter text-white transition duration-700 group-hover:-translate-y-0 group-hover:translate-x-2">
                {t('mainpage.widgets.airports')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
