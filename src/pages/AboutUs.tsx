import { useTranslation } from 'react-i18next';

import joinbanner from '../assets/image/joinbaner.png';
import { BreadcrumbLayout } from '../components/Layout';

export function AboutUs() {
  const { t } = useTranslation();

  return (
    <BreadcrumbLayout>
      <div className="flex flex-col items-center justify-start self-stretch px-2">
        <img
          src={joinbanner}
          className="rounded-2xl 2xl:min-w-[1536px]"
          alt={'join banner'}
        />
        <div className="mt-10 rounded-2xl bg-white px-[31px] py-[42px] shadow-md md:pt-[60px] 2xl:w-[1536px]">
          <h2 className="mb-4 text-2xl font-bold text-black md:text-[55px]">
            {t('aboutus.title')}
          </h2>
          <p className="text-lg font-medium leading-6 text-black md:mt-[40px] md:text-[25px] md:leading-[29px]">
            <a href="https://www.ivao.aero/" className="text-atmos-700">
              International Virtual Aviation Organisation
            </a>
            {t('aboutus.text')}
          </p>
          <p className="mt-4 text-lg font-medium leading-6 text-black md:text-[25px] md:leading-[29px]">
            {t('aboutus.text2')}
          </p>
        </div>
        {/*<ol className="relative mt-10 border-s border-gray-200 dark:border-gray-700">*/}
        {/*  <ListItem*/}
        {/*    date={'Февраль 2022'}*/}
        {/*    title={'Пук Никиты'}*/}
        {/*    description={*/}
        {/*      'Никита смачно перданул, когда ему было 6. Возможно, это стало ключевым событием в создании дивизиона.'*/}
        {/*    }*/}
        {/*    withButton*/}
        {/*    link={'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}*/}
        {/*    textButton={'Смотреть видео'}*/}
        {/*  />*/}
        {/*  <ListItem*/}
        {/*    date={'Март 2022'}*/}
        {/*    title={'Никита ударился башкой'}*/}
        {/*    description={*/}
        {/*      'Из-за неизвестных нам обстоятельств, Никита решил хорошенько так ударился головой. Это и добавило дивизиону тонких ноток диктатуры.'*/}
        {/*    }*/}
        {/*  />*/}
        {/*  <ListItem*/}
        {/*    date={'Апрель 2022'}*/}
        {/*    title={'"Я устал, я ухожу"'}*/}
        {/*    description={*/}
        {/*      'Недавно Никита Кудрявцев заявил о своём уходе. Все в тайне ждали этого момента со своего рождения.'*/}
        {/*    }*/}
        {/*  />*/}
        {/*</ol>*/}
      </div>
    </BreadcrumbLayout>
  );
}
