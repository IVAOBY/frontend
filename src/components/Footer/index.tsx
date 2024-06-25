import React from 'react';

import { useTranslation } from 'react-i18next';

import facebookIcon from '../../assets/icons/footer/facebook.svg';
import instagramIcon from '../../assets/icons/footer/Instagram.svg';
import twitterIcon from '../../assets/icons/footer/Twitter.svg';
import discordIcon from '../../assets/icons/footer/discord.svg';
import youtubeIcon from '../../assets/icons/footer/youtube.svg';
import telegramIcon from '../../assets/icons/footer/Telegram.svg';
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
    className={`text-fuselage-400 transition hover:text-ocean-600 ${className}`}
  >
    {text}
  </a>
);

const FooterLinkSection = ({
  titleKey,
  links,
}: {
  titleKey: string;
  links: FooterProps[];
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold uppercase text-atmos-700 dark:text-white">
        {t(titleKey)}
      </h2>
      <ul className="font-medium text-gray-500 dark:text-gray-400">
        {links.map((link, index) => (
          <li key={index} className="mb-2">
            <FooterItem to={link.to} text={t(link.text)} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const SocialIcon = ({ href, src, alt }: { href: string; src: string; alt: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="mx-2 bg-atmos-700 p-2 rounded-lg hover:opacity-90 transition">
      <img src={src} alt={alt} className="w-6 h-6" />
    </a>
);

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="mb-6 flex items-center justify-center md:mb-0">
              <a href="/">
                <img className="w-32 md:w-48" src={bylogo} alt="Company Logo" />
              </a>
            </div>
            <div className="flex flex-row gap-2 content-cente">
              <FooterLinkSection titleKey="footer.legal.title" links={legalLinks} />
              <FooterLinkSection
                  titleKey="footer.community.title"
                  links={[
                    { to: 'https://youtube.com/', text: 'footer.community.ivao' },
                    {
                      to: 'https://facebook.com/',
                      text: 'footer.community.ivaofamily',
                    },
                    {
                      to: 'https://www.instagram.com/ivao_by/',
                      text: 'footer.community.forum',
                    },
                  ]}
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-row">
                <SocialIcon href="https://facebook.com/" src={facebookIcon} alt="Facebook" />
                <SocialIcon href="https://www.instagram.com/ivao_by/" src={instagramIcon} alt="Instagram" />
                <SocialIcon href="https://twitter.com/" src={twitterIcon} alt="Twitter" />
              </div>
              <div className="flex flex-row">
                <SocialIcon href="https://discord.com/" src={discordIcon} alt="Discord" />
                <SocialIcon href="https://youtube.com/" src={youtubeIcon} alt="YouTube" />
                <SocialIcon href="https://telegram.org/" src={telegramIcon} alt="Telegram" />
              </div>
            </div>
          </div>
          <hr className="my-6 border-gray-200 dark:border-gray-700" />
          <div className="text-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear}, International Virtual Aviation Organisation - IVAO
            Belarus. {t('footer.copyrightMessage')}
          </span>
          </div>
        </div>
      </footer>
  );
};