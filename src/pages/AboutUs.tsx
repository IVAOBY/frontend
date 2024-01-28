// import { createStyles, rem } from '@mantine/core';
// import { useTranslation } from 'react-i18next';

export function AboutUs() {
  // const { classes, theme } = useStyles();
  // const { t } = useTranslation();

  return (
    <div className="inline-flex h-[807px] w-[1920px] flex-col items-start justify-start gap-12 px-[400px] py-16">
      <div className="flex h-[93px] flex-col items-start justify-start self-stretch px-48">
        <div className="font-['Nunito Sans'] text-center text-5xl font-bold text-ivao-blue">
          О нас
        </div>
        <div className="font-['Nunito Sans'] text-center text-xl font-normal leading-7 text-gray-400">
          История белорусского дивизиона
        </div>
        <ol className="relative mt-10 border-s border-gray-200 dark:border-gray-700">
          <li className="mb-10 ms-4">
            <div className="absolute -start-1.5 mt-1.5 size-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>
            <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              Февраль 2022
            </time>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Пук Никиты
            </h3>
            <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
              Никита смачно перданул, когда ему было 6. Возможно, это стало
              ключевым событием в создании дивизиона.
            </p>
            <a
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              target={'_blank'}
              rel={'noreferrer'}
              autoFocus={false}
              className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            >
              Смотреть видео
              <svg
                className="ms-2 size-3 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
          </li>
          <li className="mb-10 ms-4">
            <div className="absolute -start-1.5 mt-1.5 size-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>
            <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              Март 2022
            </time>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Никита ударился башкой
            </h3>
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              Из-за неизвестных нам обстоятельств, Никита решил хорошенько так
              ударился головой. Это и добавило дивизиону тонких ноток диктатуры.
            </p>
          </li>
          <li className="ms-4">
            <div className="absolute -start-1.5 mt-1.5 size-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>
            <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
              Апрель 2022
            </time>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              &quot;Я устал, я мухожук&quot;
            </h3>
            <p className="text-base font-normal text-gray-500 dark:text-gray-400">
              Недавно Никита Кудрявцев заявил о своём уходе. Все в тайне ждали
              этого момента со своего рождения.
            </p>
          </li>
        </ol>
      </div>
    </div>
  );
}
