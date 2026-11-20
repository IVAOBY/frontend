import { ReactElement } from 'react';

import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { BreadcrumbLayout } from '../components/Layout';
import { FIRST_STEP_PILOT_NS as NS } from '../i18n/locales/pages/firstStepPilot';

// URL не зависят от языка, в переводах ссылка пишется как <имя>текст</имя>
const LINKS = {
  discord: 'https://discord.by.ivao.aero',
  telegram: 'https://t.me/ivaoby',
  instagram: 'https://www.instagram.com/ivao_by/',
  threads: 'https://www.threads.net/@ivao_by',
  facebook: 'https://www.facebook.com/ivaobelarus',
  twitter: 'https://x.com/ivao_by',
  family: 'https://family.ivao.aero',
  tours: 'https://tours.by.ivao.aero',
  worldtours: 'https://wt.ivao.aero',
  altitude: 'https://wiki.ivao.aero/en/home/devops/manuals/altitude-first-step',
  aurora: 'https://wiki.ivao.aero/en/home/devops/manuals/aurora-first-steps',
  aurorabelarus: 'https://aurora.by.ivao.aero',
  pilotranks: 'https://wiki.ivao.aero/en/home/training/main/pilot_rank',
  atcranks: 'https://wiki.ivao.aero/en/home/training/main/rank_atc',
  policy: '/documents/13',
  ivao: 'https://ivao.aero',
  trainingstatus: 'https://ivao.aero/training/training/statustraining.asp',
  cornflower: 'https://cornflower.by.ivao.aero',
};

const linkClass = 'font-bold text-atmos-700 underline';

function createLink(href: string): ReactElement {
  // внутренние ссылки — через роутер, внешние — в новой вкладке
  return href.startsWith('/') ? (
    <Link to={href} className={linkClass} />
  ) : (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClass}
    />
  );
}

// Теги, доступные в переводах (см. i18n/locales/pages/firstStepPilot/types.ts)
const components: Record<string, ReactElement> = {
  b: <b className="text-base font-bold" />,
  h: <strong className="text-[17px] font-bold" />,
  i: <i />,
  br: <br />,
  ...Object.fromEntries(
    Object.entries(LINKS).map(([name, href]) => [name, createLink(href)]),
  ),
};

function Text({ i18nKey }: { i18nKey: string }) {
  return <Trans ns={NS} i18nKey={i18nKey} components={components} />;
}

function Paragraph({
  i18nKey,
  className = '',
}: {
  i18nKey: string;
  className?: string;
}) {
  return (
    <p className={`mb-3 ${className}`}>
      <Text i18nKey={i18nKey} />
    </p>
  );
}

function Heading({ i18nKey }: { i18nKey: string }) {
  const { t } = useTranslation(NS);
  return (
    <h2 className="mb-3 pb-2 pt-6 text-[29px] font-bold leading-[1.15] text-atmos-700 first:pt-0">
      {t(i18nKey)}
    </h2>
  );
}

function Subheading({ i18nKey }: { i18nKey: string }) {
  const { t } = useTranslation(NS);
  return <h3 className="mb-2 mt-6 text-base font-bold">{t(i18nKey)}</h3>;
}

function Items({
  i18nKey,
  ordered = false,
}: {
  i18nKey: string;
  ordered?: boolean;
}) {
  const { t } = useTranslation(NS);
  const items = t(i18nKey, { returnObjects: true }) as string[];
  const Tag = ordered ? 'ol' : 'ul';

  return (
    <Tag className={`mb-4 ml-6 ${ordered ? 'list-decimal' : 'list-disc'}`}>
      {items.map((_, index) => (
        <li key={index} className="mb-2 last:mb-0">
          <Text i18nKey={`${i18nKey}.${index}`} />
        </li>
      ))}
    </Tag>
  );
}

export function FirstStepP() {
  const { t } = useTranslation(NS);

  return (
    <BreadcrumbLayout>
      <div className="mt-[30px] flex flex-col gap-[50px]">
        <h1 className="text-3xl font-bold leading-8 text-black md:text-[55px]">
          {t('title')}
        </h1>
        <div className="squircle-3xl shadow-figma bg-white px-[32px] py-[41px] text-[15px] leading-6 text-black">
          <Heading i18nKey="welcome.title" />
          <Paragraph i18nKey="welcome.intro" />
          <Paragraph i18nKey="welcome.whatIs" />
          <Paragraph i18nKey="welcome.division" />

          <Heading i18nKey="community.title" />
          <Paragraph i18nKey="community.intro" />
          <Items i18nKey="community.items" />

          <Heading i18nKey="tours.title" />
          <Paragraph i18nKey="tours.intro" />
          <Items i18nKey="tours.items" />

          <Heading i18nKey="software.title" />
          <Paragraph i18nKey="software.intro" />

          <Subheading i18nKey="software.pilots.title" />
          <Paragraph i18nKey="software.pilots.text" />
          <Paragraph i18nKey="software.pilots.manual" />

          <Subheading i18nKey="software.atc.title" />
          <Paragraph i18nKey="software.atc.text" />
          <Paragraph i18nKey="software.atc.prepare" />
          <Items i18nKey="software.atc.steps" ordered />
          <Paragraph i18nKey="software.atc.special" />
          <Paragraph i18nKey="software.atc.specialText" />

          <Heading i18nKey="training.title" />
          <Paragraph i18nKey="training.intro" />
          <Items i18nKey="training.ranks" />
          <Paragraph i18nKey="training.more" />
          <Paragraph i18nKey="training.policy" />

          <Subheading i18nKey="training.firstControl.title" />
          <Paragraph i18nKey="training.firstControl.intro" />
          <Paragraph i18nKey="training.firstControl.method1Title" />
          <Items i18nKey="training.firstControl.method1Steps" ordered />
          <Paragraph i18nKey="training.firstControl.method2Title" />
          <Paragraph
            i18nKey="training.firstControl.method2Text"
            className="ml-5 mr-10"
          />
          <Paragraph i18nKey="training.firstControl.afterRequest" />

          <Subheading i18nKey="training.academy.title" />
          <Paragraph i18nKey="training.academy.text" />
          <Paragraph i18nKey="training.academy.go" />

          <Paragraph i18nKey="training.bye" className="mt-6" />
        </div>
      </div>
    </BreadcrumbLayout>
  );
}
