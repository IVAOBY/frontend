import React, { useEffect, useState } from 'react';
import {CustomButton} from "../../Button";

export function HeroText() {
  const [timeOfDay, setTimeOfDay] = useState('day');

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours >= 6 && hours < 12) {
      setTimeOfDay('morning');
    } else if (hours >= 12 && hours < 18) {
      setTimeOfDay('day');
    } else {
      setTimeOfDay('evening');
    }
  }, []);

  const backgroundImage = {
    morning: "url('/src/assets/image/bg/morning.jpg')",
    day: "url('/src/assets/image/bg/day.jpg')",
    evening: "url('/src/assets/image/bg/evening.jpg')",
  };

  return (
    <div
      className="w-full h-[487px] md:h-[1080px] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: backgroundImage[timeOfDay] }}
    >
      <div className="max-w-screen-2xl mx-auto flex flex-col gap-4 pt-8">
        <div className="leading-none">
          <p className="font-['Futura PT'] drop-shadow-lg text-[32px] sm:text-[40px] md:text-[70px] lg:text-[100px] font-bold text-white">
            ЗНАКОМЬТЕСЬ,
          </p>
          <p className="font-['Futura PT'] ml-[-4px] md:ml-[-8px] xl:ml-[-20px] drop-shadow-lg text-[60px] sm:text-[80px] md:text-[125px] xl:text-[250px] font-bold text-white mt-[-10px] mb-[-10px] md:mt-[-20px]">
            БЕЛАРУСЬ
          </p>
        </div>
        <div className="flex flex-row gap-4">
          <CustomButton size={'xl'} className={'rounded-xl'}>Регистрация</CustomButton>
          <CustomButton size={'xl'} className={'rounded-xl'} variant={'white'}>Перейти в BY</CustomButton>
        </div>
      </div>
    </div>
  );
}
