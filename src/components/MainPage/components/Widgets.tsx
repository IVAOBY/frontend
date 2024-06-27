import { useNavigate } from 'react-router-dom';

import discord from '../../../assets/icons/footer/discord.svg';
import belavia from '../../../assets/image/belaviakrylo.svg';
import charts from '../../../assets/image/charts.svg';

export function Widgets() {
  const navigate = useNavigate();

  const handleExternalLink = (link) => {
    window.open(link, '_blank');
  };

  const handleInternalLink = (path) => {
    navigate(path);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-5 mt-[-80px]">
        <div
          onClick={() => handleInternalLink('/pilots/first-step')}
          className="relative cursor-pointer inline-flex h-[148px] lg:h-[320px] xl:h-[570px] w-full xl:w-[379px] flex-col items-center justify-start rounded-3xl bg-atmos-700 pt-[25px] md:pt-[50px] xl:pt-[4.375rem] transition-transform transform hover:scale-105"
        >
          <img
            src={belavia}
            alt="Belavia plane"
            className="hidden xl:block rounded-l-xl absolute left-0 top-[93px] xl:top-[153.5px] z-10 mb-0 h-[70%] xl:h-[73%] w-full pb-0"
          />
          <div className="flex flex-col md:justify-center xl:-mt-6 items-center">
            <p className="font-['Futura PT'] text-center z-4 relative xl:ml-3 text-[60px] md:text-[90px] leading-[50px] md:leading-10 lg:leading-[80px] lg:mt-7 xl:mr-3 xl:text-7xl font-bold uppercase tracking-tighter text-white">
              первые шаги
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col xl:flex-row gap-6">
            <div
              onClick={() =>
                handleExternalLink(
                  'https://www.ban.by/en/aeronautical-information-aip/amdt',
                )
              }
              className="relative xl:flex xl:flex-row cursor-pointer hidden h-[270px] w-full xl:w-[747px] rounded-3xl border border-stone-300 bg-white flex transition-transform transform hover:scale-105"
            >
              <img
                src="https://s3-alpha-sig.figma.com/img/bb7b/f296/1dcedadfedae0d0d0b98e429a3278763?Expires=1720396800&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=gKvrZn8ha2I2yRwCCHqKAgFvvOc-5Z2922U64wwyg7tRl~oU7sWtMfeBywBfjg~MI5euUSlFlI5Z4vGUMICwjMcqVmFwEcOPjfo3kGU0x-n6uDC18D6Y0iteJcpL1JVVpZzZ~lKzm5V6iBnMPHwT8F6r4obFDo9tNsvJ863PHjpx~AWdi3sUS-5P7hs0DtsSA8Bn2A4VJXVmly06dttLCBRTan1gfX0T~G6-jxiaM5vgeBUcYUXg3NLOSVfGE30CY5~pJW5kRP2mXARl2AdLNZS2AGxIlkF4eC8u231raP0qQ30fc70GXSoS0QkmKUPeDaM2TU5JnrhVuRdRHd6tKA__"
                alt="Belarus in IVAO"
                className="h-full w-[50%] rounded-l-3xl object-cover"
              />
              <div className="font-bold break-words flex flex-col justify-center pl-4">
                <p className="text-black text-[60px] leading-none">БЕЛАРУСЬ</p>
                <div className="flex items-center gap-4">
                  <span className="text-[100px] text-black leading-none">
                    В
                  </span>
                  <span className="text-[100px] text-atmos-700 leading-none">
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
              className="relative cursor-pointer inline-flex h-[148px] w-full xl:h-[270px] xl:w-[355px] flex-col items-center justify-center md:justify-start rounded-3xl bg-gray-900 transition-transform transform hover:scale-105"
            >
              <p className="md:mt-0 xl:mt-[15px] text-center font-['Montserrat'] text-[60px] md:text-[90px] xl:text-[60px] font-bold uppercase tracking-tighter text-white">
                схемы
              </p>
              <img
                src={charts}
                alt="Charts image"
                className="hidden xl:block rounded-l-b-2xl absolute left-0 top-[52px] h-[65%] xl:top-[81px] z-10 mb-0 xl:h-[70%] w-full pb-0"
              />
            </div>
          </div>
          <div className="flex flex-col xl:flex-row gap-6 xl:pt-1">
            <div
              onClick={() => handleExternalLink('https://discord.by.ivao.aero')}
              className="flex cursor-pointer h-[148px] w-full xl:h-[270px] xl:w-[355px] flex-col items-center justify-center md:justify-start gap-2 xl:gap-5 rounded-3xl bg-indigo-500 xl:pb-48 transition-transform transform hover:scale-105"
            >
              <p className="block xl:hidden xl:mt-[15px] text-center font-['Montserrat'] text-[60px] md:text-[90px] xl:text-[60px] font-bold uppercase tracking-tighter text-white">
                Discord
              </p>
              <div className="hidden xl:block">
                <div
                  onClick={() =>
                    handleExternalLink('https://discord.by.ivao.aero')
                  }
                  className="flex h-[270px] w-[355px] flex-col items-center justify-center md:justify-start gap-5 rounded-3xl bg-indigo-500"
                >
                  <img
                    src={discord}
                    alt="Discord logo"
                    className="w-12 mt-[28px]"
                  />
                  <div className="w-[248px] -ml-16 rounded-2xl rounded-bl-none bg-white p-3">
                    <p className="text-[20px] font-semibold text-black">
                      А где весь движ?🛩️
                    </p>
                  </div>
                  <div className="flex w-[293px] flex-col -mt-2 ml-6 rounded-2xl rounded-br-none bg-gray-900 p-3">
                    <p className="text-[20px] font-semibold text-white">
                      Воу-воу, скорее заходи:
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
              className="relative cursor-pointer hidden xl:flex xl:h-[270px] xl:w-[741px] xl:ml-2 items-center justify-end rounded-3xl border border-stone-300 bg-gray-900 pr-10 transition-transform transform hover:scale-105"
            >
              {/*<img
                src={airport}
                alt="UMMS Aurora"
                className="rounded-l-b-2xl absolute -left-[1px] top-[-1px] z-10 mb-0 h-[270px] w-[35%] rounded-l-xl pb-0 object-cover"
              />*/}
              <p className="text-right font-['Montserrat'] text-[70px] leading-[66.5px] font-bold uppercase tracking-tighter text-white z-20">
                аэродромы дивизиона
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
