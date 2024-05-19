import React from 'react';

import { useTranslation } from 'react-i18next';

import bylogo from '../../assets/image/logobyblue.svg';

export interface FooterProps {
  to: string;
  text: string;
  className?: string;
}

export const FooterItem: React.FC<FooterProps> = ({ to, text, className }) => {
  return (
    <a
      href={to}
      target={'_blank'}
      rel={'noreferrer'}
      className={`text-fuselage-400 transition hover:text-ocean-600 ${className}`}
    >
      {text}
    </a>
  );
};

export function Index() {
  const { t } = useTranslation();
  const currentYear = new Date().getUTCFullYear();
  return (
    <footer className="bg-white dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-2xl p-4 py-6 lg:py-8">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="mb-6 flex items-center justify-center md:mb-0 md:mr-10 lg:mr-0">
            <a href="/">
              <img className="w-48 md:w-[220px]" src={bylogo} alt="BY Logo" />
            </a>
          </div>
          <div className="flex flex-row justify-center gap-14 md:gap-20">
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase text-atmos-700 dark:text-white">
                {t('footer.followus')}
              </h2>
              <ul className="font-medium text-gray-500 dark:text-gray-400">
                <li className="mb-2">
                  <FooterItem to={'https://youtube.com/'} text={'YouTube'} />
                </li>
                <li className="mb-2">
                  <FooterItem
                    to={'https://www.instagram.com/ivao_by/'}
                    text={'Instagram'}
                  />
                </li>
                <li className="mb-2">
                  <FooterItem to={'https://facebook.com/'} text={'Facebook'} />
                </li>
                <li className="mb-2">
                  <FooterItem
                    to={'https://discord.gg/7t7UJjZcad'}
                    text={'Discord'}
                  />
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase text-atmos-700 dark:text-white">
                {t('legal.title')}
              </h2>
              <ul className="font-medium text-gray-500 dark:text-gray-400">
                <li className="mb-2">
                  <FooterItem
                    to={'https://wiki.ivao.aero/en/home/ivao/privacypolicy'}
                    text={t('legal.privacypolicy')}
                  />
                </li>
                <li className="mb-2">
                  <FooterItem
                    to={'https://wiki.ivao.aero/en/home/ivao/terms-of-use'}
                    text={t('legal.termsofuse')}
                  />
                </li>
                <li className="mb-2">
                  <FooterItem
                    to={
                      'https://wiki.ivao.aero/en/home/ivao/intellectual-property-policy'
                    }
                    text={t('legal.ipp')}
                  />
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase text-atmos-700 dark:text-white">
                {t('legal.title')}
              </h2>
              <ul className="font-medium text-gray-500 dark:text-gray-400">
                <li className="mb-2">
                  <FooterItem
                    to={'https://wiki.ivao.aero/en/home/ivao/privacypolicy'}
                    text={t('legal.privacypolicy')}
                  />
                </li>
                <li className="mb-2">
                  <FooterItem
                    to={'https://wiki.ivao.aero/en/home/ivao/terms-of-use'}
                    text={t('legal.termsofuse')}
                  />
                </li>
                <li className="mb-2">
                  <FooterItem
                    to={
                      'https://wiki.ivao.aero/en/home/ivao/intellectual-property-policy'
                    }
                    text={t('legal.ipp')}
                  />
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase text-atmos-700 dark:text-white">
                {t('legal.title')}
              </h2>
              <ul className="font-medium text-gray-500 dark:text-gray-400">
                <li className="mb-2">
                  <FooterItem
                    to={'https://wiki.ivao.aero/en/home/ivao/privacypolicy'}
                    text={t('legal.privacypolicy')}
                  />
                </li>
                <li className="mb-2">
                  <FooterItem
                    to={'https://wiki.ivao.aero/en/home/ivao/terms-of-use'}
                    text={t('legal.termsofuse')}
                  />
                </li>
                <li className="mb-2">
                  <FooterItem
                    to={
                      'https://wiki.ivao.aero/en/home/ivao/intellectual-property-policy'
                    }
                    text={t('legal.ipp')}
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
        <div className="items-center justify-between text-center">
          <span className="w-screen text-center text-sm text-gray-500 dark:text-gray-400">
            © {currentYear}, International Virtual Aviation Organisation - IVAO
            Belarus. {t('footer.copyrightMessage')}
          </span>
        </div>
      </div>
    </footer>
  );
}
