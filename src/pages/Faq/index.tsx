import {
  IconLanguage,
  IconPlugConnectedX,
  IconUsers,
} from '@tabler/icons-react';
import { t } from 'i18next';

import Accordion from '../../components/Accordion';
import {BreadcrumbLayout} from '../../components/Layout';

const items = [
  {
    title: `${t('FAQ.questions.1')}`,
    content: `${t('FAQ.answers.1')}`,
    icon: <IconPlugConnectedX />,
  },
  {
    title: `${t('FAQ.questions.2')}`,
    content: `${t('FAQ.answers.2')}`,
    icon: <IconUsers />,
  },
  {
    title: `${t('FAQ.questions.3')}`,
    content: `${t('FAQ.answers.3')}`,
    icon: <IconLanguage />,
  },
];

export function FAQ() {
  return (
    <BreadcrumbLayout>
      <h4 className="text-[55px] font-bold text-black">FAQ</h4>
      <div className={'mt-5 w-full lg:p-0'}>
        <Accordion items={items} />
      </div>
    </BreadcrumbLayout>
  );
}
