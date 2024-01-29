// import { createStyles, rem } from '@mantine/core';
// import { useTranslation } from 'react-i18next';

import { GeneralLayout } from '../components/Layout';
import { ListItem } from '../components/List';
import { Title } from '../components/Typography/Title';

export function AboutUs() {
  // const { classes, theme } = useStyles();
  // const { t } = useTranslation();

  return (
    <GeneralLayout>
      <div className="flex h-[93px] flex-col items-center justify-start self-stretch px-2 md:px-48">
        <Title
          className="text-4xl"
          description={'История белорусского дивизиона'}
        >
          О нас
        </Title>
        <ol className="relative mt-10 border-s border-gray-200 dark:border-gray-700">
          <ListItem
            date={'Февраль 2022'}
            title={'Пук Никиты'}
            description={
              'Никита смачно перданул, когда ему было 6. Возможно, это стало ключевым событием в создании дивизиона.'
            }
            withButton
            link={'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
            textButton={'Смотреть видео'}
          />
          <ListItem
            date={'Март 2022'}
            title={'Никита ударился башкой'}
            description={
              'Из-за неизвестных нам обстоятельств, Никита решил хорошенько так ударился головой. Это и добавило дивизиону тонких ноток диктатуры.'
            }
          />
          <ListItem
            date={'Апрель 2022'}
            title={'"Я устал, я ухожу"'}
            description={
              'Недавно Никита Кудрявцев заявил о своём уходе. Все в тайне ждали этого момента со своего рождения.'
            }
          />
        </ol>
      </div>
    </GeneralLayout>
  );
}
