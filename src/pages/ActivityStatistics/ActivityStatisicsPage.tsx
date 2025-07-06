// import { useTranslation } from 'react-i18next';

import {BreadcrumbLayout} from '../../components/Layout';

export function ActivityStatisicsPage() {
    // const { t = (key) => key } = useTranslation(); // Mock t function for demonstration

    return (
        <div>
            <BreadcrumbLayout>
                <div className="mb-6 text-3xl font-bold text-black md:text-5xl">
                    Статистика <span className="text-atmos-700">SkyDaily</span>
                </div>
                <div
                    className="relative flex h-[218px] w-[450px] flex-col items-center justify-start rounded-xl bg-atmos-700 p-6 text-white overflow-hidden"
                >
                    <div className="relative z-10 mb-4 mt-6 flex items-baseline">
            <span className="text-8xl font-bold leading-none">
              25<span className="align-baseline">,</span>17
            </span>
                        <span
                            className="ml-2 font-['Montserrat'] text-5xl font-extrabold tracking-[-0.24em] text-[#A7B7F0]">
              УБ
            </span>
                    </div>
                    <div className="relative z-10 text-3xl font-normal text-[#A7B7F0]">VID: 702294</div>

                    <img
                        src="https://cdn.by.ivao.aero/images/WEB/cloud1.svg"
                        alt="Background pattern"
                        className="absolute bottom-0 left-0 h-full w-full object-cover opacity-20"
                        style={{zIndex: 0}}
                    />

                </div>
                <div className="mt-16 mb-6 text-3xl font-bold text-black md:text-5xl">
                    Матказин
                </div>
                <div className="flex flex-wrap gap-6">
                    <div className="flex w-[493px] flex-col overflow-hidden rounded-xl bg-white shadow-lg">
                        <img
                            src="https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2537590/8fa176d72210f43c71d50f4c8ffca70a4f171e62/capsule_616x353.jpg?t=1747324291"
                            alt="MSFS 2024 Steam Edition"
                            className="h-[224px] w-full object-cover"
                        />
                        <div className="p-4 flex flex-row items-center justify-between bg-white">
                            <h3 className="text-[35px] leading-[85%] font-semibold text-black">MSFS 2024 Steam
                                Edition</h3>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center text-black mb-2">
                                    <span
                                        className="text-xl bg-[#1E1E21] px-3.5 py-1.5 rounded-xl text-white font-bold z-40">60</span>
                                    <span
                                        className="-ml-4 text-xl rounded-r-xl font-bold pl-5 pr-3.5 py-1.5 bg-[#3C55AC] text-white z-10">+5E</span>
                                </div>
                                <div
                                    className={`leading-16 flex gap-3 rounded-xl px-5 py-[2px] text-[20px] font-semibold text-white backdrop-blur-[5px] transition duration-500 bg-atmos-700 hover:cursor-pointer hover:opacity-80`}
                                >
                                    <div className="my-auto flex-auto">
                                        Получить
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-[493px] flex-col overflow-hidden rounded-xl bg-white shadow-lg">
                        <img
                            src="https://support.discord.com/hc/article_attachments/32058368718231"
                            alt="MSFS 2024 Steam Edition"
                            className="h-[224px] w-full object-cover"
                        />
                        <div className="p-4 flex flex-row items-center justify-between bg-white">
                            <h3 className="text-[35px] leading-[85%] font-semibold text-black">Discord Nitro
                                1 month</h3>
                            <div className="flex flex-col items-end">
                                <div className="flex items-center text-black mb-2">
                                    <span
                                        className="text-xl bg-[#1E1E21] px-3.5 py-1.5 rounded-xl text-white font-bold z-40">120</span>
                                    <span
                                        className="-ml-4 text-xl rounded-r-xl font-bold pl-5 pr-3.5 py-1.5 bg-[#3C55AC] text-white z-10">+3E</span>
                                </div>
                                <div
                                    className={`leading-16 flex gap-3 rounded-xl px-5 py-[2px] text-[20px] font-semibold text-white backdrop-blur-[5px] transition duration-500 cursor-not-allowed bg-gray-500`}
                                >
                                    <div className="my-auto flex-auto">
                                        Получить
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </BreadcrumbLayout>
        </div>
    )
        ;
}