import { useTranslation } from 'react-i18next';

import bylogo from '../assets/image/logobyblue.svg';

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getUTCFullYear();
  return (
    // <footer className="m-4 rounded-lg bg-ivao-blue shadow dark:bg-gray-800">
    //   <div className="mx-auto w-full max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
    //     <span className="text-sm sm:text-center dark:text-gray-400">
    //       © {currentYear}, IVAO Belarus. {t('footer.copyrightMessage')}
    //     </span>
    //     <ul className="mt-3 flex flex-col items-center text-sm font-medium text-gray-500 sm:mt-0 dark:text-gray-400">
    //       <li>
    //         <a
    //           href="https://wiki.ivao.aero/en/home/ivao/privacypolicy"
    //           className="me-8 hover:underline md:me-6"
    //         >
    //           {t('legal.privacypolicy')}
    //         </a>
    //       </li>
    //       <li>
    //         <a
    //           href="https://wiki.ivao.aero/en/home/ivao/terms-of-use"
    //           className="me-4 hover:underline md:me-6"
    //         >
    //           {t('legal.termsofuse')}
    //         </a>
    //       </li>
    //       <li>
    //         <a
    //           href="https://wiki.ivao.aero/en/home/ivao/intellectual-property-policy"
    //           className="me-4 hover:underline md:me-6"
    //         >
    //           {t('legal.ipp')}
    //         </a>
    //       </li>
    //     </ul>
    //   </div>
    // </footer>

    <footer className="bg-white dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <a href="/" className="flex items-center">
              <img className="w-48" src={bylogo} alt="BY Logo" />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 sm:gap-6">
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                {t('footer.followus')}
              </h2>
              <ul className="font-medium text-gray-500 dark:text-gray-400">
                <li className="mb-2">
                  <a
                    href="https://youtube.com/"
                    target={'_blank'}
                    rel={'noreferrer'}
                    className="hover:underline "
                  >
                    YouTube
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="https://www.instagram.com/ivao_by/"
                    target={'_blank'}
                    rel={'noreferrer'}
                    className="hover:underline"
                  >
                    Instagram
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="https://facebook.com/"
                    target={'_blank'}
                    rel={'noreferrer'}
                    className="hover:underline"
                  >
                    Facebook
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="https://discord.gg/7t7UJjZcad"
                    target={'_blank'}
                    rel={'noreferrer'}
                    className="hover:underline"
                  >
                    Discord
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold uppercase text-gray-900 dark:text-white">
                {t('legal.title')}
              </h2>
              <ul className="font-medium text-gray-500 dark:text-gray-400">
                <li className="mb-2">
                  <a href="#" className="hover:underline">
                    {t('legal.privacypolicy')}
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="hover:underline">
                    {t('legal.termsofuse')}
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="hover:underline">
                    {t('legal.ipp')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8 dark:border-gray-700" />
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