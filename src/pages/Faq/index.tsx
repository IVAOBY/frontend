import Accordion from '../../components/Accordion';
import { BreadcrumbLayout } from '../../components/Layout';
import {useTranslation} from "react-i18next";

export function FAQ() {
    const { t } = useTranslation();

    const items = Array.from({ length: 9 }, (_, index) => ({
        title: t(`FAQ.questions.${index + 1}`),
        content: t(`FAQ.answers.${index + 1}`),
    }));
  return (
      <BreadcrumbLayout>
        <h4 className="text-[55px] font-bold text-black">FAQ</h4>
        <div className={'mt-5 w-full lg:p-0'}>
          <Accordion items={items} />
        </div>
      </BreadcrumbLayout>
  );
}
