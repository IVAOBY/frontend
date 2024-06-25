import {
    useCallback,
} from 'react';

import airport from '../../../assets/image/airport.svg';
import belavia from '../../../assets/image/belaviakrylo.svg';
import charts from '../../../assets/image/charts.svg';
import discord from '../../../assets/icons/footer/discord.svg'

export function Widgets() {
    useCallback(function (link: string | undefined) {
        window.open(link, '_blank');
    }, []);
    return (
        <>
            <div className="flex flex-col lg:flex-row gap-5">
                <div className="relative inline-flex h-[148px] lg:h-[320px] xl:h-[570px] w-full xl:w-[379px] flex-col items-center justify-start rounded-3xl bg-atmos-700 pt-[25px] md:pt-[50px] xl:pt-[4.375rem]">
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
                            className="relative hidden xl:block h-[270px] w-full xl:w-[747px] rounded-3xl border border-stone-300 bg-white"></div>
                        <div
                            className="relative inline-flex h-[148px] w-full xl:h-[270px] xl:w-[355px] flex-col items-center justify-center md:justify-start rounded-3xl bg-gray-900">
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
                            className="flex h-[148px] w-full xl:h-[270px] xl:w-[355px] flex-col items-center justify-center md:justify-start gap-2 xl:gap-5 rounded-3xl bg-indigo-500 xl:pb-48">
                            <p className="block xl:hidden xl:mt-[15px] text-center font-['Montserrat'] text-[60px] md:text-[90px] xl:text-[60px] font-bold uppercase tracking-tighter text-white">
                                Discord
                            </p>
                            <div className="hidden xl:block">
                                <div
                                    className="flex h-[270px] w-[355px] flex-col items-center justify-center md:justify-start gap-5 rounded-3xl bg-indigo-500">
                                    <img src={discord} alt="Discord logo" className="w-12 mt-[28px]"/>
                                    <div className="w-[248px] -ml-16 rounded-2xl rounded-bl-none bg-white p-3">
                                        <p className="text-[20px] font-semibold text-black">
                                            А где весь движ?🛩️
                                        </p>
                                    </div>
                                    <div
                                        className="flex w-[293px] flex-col -mt-2 ml-6 rounded-2xl rounded-br-none bg-gray-900 p-3">
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
                            className="relative hidden xl:flex xl:h-[270px] xl:w-[741px] items-center justify-end rounded-3xl border border-stone-300 bg-gray-900 pr-10">
                            <img
                                src={airport}
                                alt="UMMS Aurora"
                                className="rounded-l-b-2xl absolute -left-[170px] top-0 z-10 mb-0 size-full pb-0"
                            />
                            <p className="text-right font-['Montserrat'] text-[70px] font-bold uppercase tracking-tighter text-white">
                                сценарии
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
