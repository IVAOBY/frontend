import React from 'react';

import { useTranslation } from 'react-i18next';

import discordIcon from '../../assets/icons/footer/discord.svg';
import donateIcon from '../../assets/icons/footer/donate.png';
import facebookIcon from '../../assets/icons/footer/facebook.svg';
import instagramIcon from '../../assets/icons/footer/Instagram.svg';
import telegramIcon from '../../assets/icons/footer/Telegram.svg';
import twitterIcon from '../../assets/icons/footer/Twitter.svg';
import youtubeIcon from '../../assets/icons/footer/youtube.svg';
import bylogo from '../../assets/image/logobyblue.svg';

export interface FooterProps {
  to: string;
  text: string;
  className?: string;
}

export const FooterItem: React.FC<FooterProps> = ({ to, text, className }) => (
  <a
    href={to}
    target="_blank"
    rel="noopener noreferrer"
    className={`text-[12px] leading-[12px] text-fuselage-400 transition hover:text-fuselage-200 sm:text-[16px] ${className}`}
  >
    {text}
  </a>
);

const FooterLinkSection = ({
  titleKey,
  links,
  classname,
  titleClassname,
}: {
  titleKey: string;
  links: FooterProps[];
  classname?: string;
  titleClassname?: string;
}) => {
  const { t } = useTranslation();
  return (
    <div className={`${classname}`}>
      <h2
        className={`mb-4 text-center text-sm font-semibold uppercase text-atmos-700 dark:text-white ${titleClassname}`}
      >
        {t(titleKey)}
      </h2>
      <ul className="text-center font-medium text-gray-500 dark:text-gray-400">
        {links.map((link, index) => (
          <li key={index} className="lg:mb-2">
            <FooterItem to={link.to} text={t(link.text)} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const SocialIcon = ({
  href,
  src,
  alt,
}: {
  href: string;
  src: string;
  alt: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="mx-2 rounded-lg bg-atmos-700 p-2 transition hover:opacity-90"
  >
    <img src={src} alt={alt} className="size-6" />
  </a>
);

const DonateButton = () => {
  const { t } = useTranslation();
  return (
    <a
      href="https://www.ivao.aero/hq/donate.asp"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-atmos-700 relative mx-2 inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-[13px] leading-none font-medium !text-white no-underline transition hover:!text-white hover:opacity-90"
    >
      <img src={donateIcon} alt="" className="size-[18px]" />
      {t('footer.donate')}
    </a>
  );
};

export const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getUTCFullYear();
  const legalLinks = [
    {
      to: 'https://wiki.ivao.aero/en/home/ivao/privacypolicy',
      text: 'footer.legal.privacypolicy',
    },
    {
      to: 'https://wiki.ivao.aero/en/home/ivao/terms-of-use',
      text: 'footer.legal.termsofuse',
    },
    {
      to: 'https://wiki.ivao.aero/en/home/ivao/intellectual-property-policy',
      text: 'footer.legal.ipp',
    },
  ];
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-row items-center justify-between gap-14">
          <div className="mb-6 flex items-center justify-center lg:mb-0">
            <a href="/">
              <img className="w-48 md:w-48" src={bylogo} alt="Company Logo" />
            </a>
          </div>
          <div className="flex flex-col items-center justify-center gap-14 lg:flex-row">
            <FooterLinkSection
              titleKey="footer.legal.title"
              links={legalLinks}
              titleClassname={'hidden lg:block'}
            />
            <FooterLinkSection
              titleKey="footer.community.title"
              classname="hidden lg:block"
              links={[
                { to: 'https://ivao.aero/', text: 'footer.community.ivao' },
                {
                  to: 'https://family.ivao.aero/',
                  text: 'footer.community.ivaofamily',
                },
                {
                  to: 'https://forum.ivao.aero/',
                  text: 'footer.community.forum',
                },
              ]}
            />
          </div>
          <div className="flex hidden flex-col gap-2 lg:flex">
            <div className="flex flex-row">
              <SocialIcon
                href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                src={facebookIcon}
                alt="Facebook"
              />
              <SocialIcon
                href="https://www.instagram.com/ivao_by/"
                src={instagramIcon}
                alt="Instagram"
              />
              <SocialIcon
                href="https://x.com/ivao_by"
                src={twitterIcon}
                alt="Twitter"
              />
            </div>
            <div className="flex flex-row">
              <SocialIcon
                href="https://ds.by.ivao.aero/"
                src={discordIcon}
                alt="Discord"
              />
              <SocialIcon
                href="https://www.youtube.com/watch?v=Z54FdjHqPgM"
                src={youtubeIcon}
                alt="YouTube"
              />
              <SocialIcon
                href="https://t.me/ivaoby"
                src={telegramIcon}
                alt="Telegram"
              />
            </div>
            <DonateButton />
          </div>
        </div>
        <hr className="my-6 border-gray-200 dark:border-gray-700" />
        <div className="text-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear}, International Virtual Aviation Organisation — IVAO
            Belarus. {t('footer.copyrightMessage')}
          </span>
        </div>
      </div>
    </footer>
  );
};
