import { useCallback } from 'react';

// import { IconLink } from '@tabler/icons-react';

import { CustomButton } from '../Button';

interface ListItemProps {
  date: string;
  title: string;
  description: string;
  link?: string;
  withButton?: boolean;
  textButton?: string;
}

export function ListItem({
  date,
  title,
  description,
  link,
  withButton,
  textButton,
}: ListItemProps) {
  const openLink = useCallback(function (link: string | undefined) {
    window.open(link, '_blank');
  }, []);
  return (
    <li className="mb-10 ms-4">
      <div className="absolute -start-1.5 mt-1.5 size-3 rounded-full border border-white bg-semantic-green-200 dark:border-gray-900 dark:bg-gray-700"></div>
      <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
        {date}
      </time>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
        {description}
      </p>
      {withButton ? (
        <CustomButton
          title={textButton}
          variant={'primary'}
          // icon={<IconLink size={22} />}
          size={'md'}
          onClick={() => openLink(link)}
        ></CustomButton>
      ) : null}
    </li>
  );
}
