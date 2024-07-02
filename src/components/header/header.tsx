import React, { useCallback, useContext, useEffect, useState } from 'react';



import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { IconAirTrafficControl, IconArticle, IconBook, IconEye, IconFileInfo, IconFocus2, IconIdBadge2, IconInfoSquareRounded, IconLanguage, IconLock, IconLogin2, IconLogout, IconMap2, IconMessageCircle2, IconMessages, IconPlaneDeparture, IconPlaneTilt, IconUsers, IconUsersGroup } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';



import by from '../../assets/image/by.svg';
import discord from '../../assets/image/discord.svg';
import en from '../../assets/image/en.svg';
import bylogo from '../../assets/image/Logo_f_w.svg';
import ivaoLogo from '../../assets/image/logo_s_black.svg';
import bylogoblue from '../../assets/image/logobyblue.svg';
import ru from '../../assets/image/ru.svg';
import steps from '../../assets/image/steps.svg';
import { AuthContext } from '../../context/UserContext';


const categories = [
  {
    label: 'navbar.division.index',
    icon: <IconInfoSquareRounded size={20} />,
    links: [
      { href: '/about-us', label: 'navbar.division.about', icon: <IconUsers size={20} /> },
      { href: 'https://wiki.ivao.aero/en/home/ivao/information', label: 'navbar.division.rules', icon: <IconBook size={20} />, external: true },
      { href: '/staff', label: 'navbar.division.staff', icon: <IconIdBadge2 size={20} /> },
      //{ href: '/contact-us', label: 'navbar.division.contact', icon: <IconMailForward size={20} /> },
      { href: 'https://discord.by.ivao.aero', label: 'navbar.division.discord', icon: <img src={discord} width={19} alt="Discord Icon" />, external: true },
      { href: '/airports', label: 'navbar.division.airports', icon: <IconPlaneDeparture size={20} /> },
      { href: '/faq', label: 'navbar.division.faq', icon: <IconMessages size={20} /> },
    ]
  },
  {
    label: 'navbar.atc.index',
    icon: <IconAirTrafficControl size={20} />,
    links: [
      { href: '/atc/first-step', label: 'navbar.atc.start', icon: <img src={steps} width={20} alt="ATC First Step" /> },
      //{ href: '/sector', label: 'navbar.atc.sector', icon: <IconMapCog size={20} /> },
      { href: 'https://www.ban.by/en/aeronautical-information-aip/amdt', label: 'navbar.atc.charts', icon: <IconFileInfo size={20} />, external: true },
      { href: 'https://ivao.aero/fras/list.asp?id=BY', label: 'navbar.atc.fra', icon: <IconLock size={20} />, external: true },
      //{ href: '/vehicles', label: 'navbar.atc.vehicles', icon: <IconCar size={20} /> },
      { href: '/documents/category/1', label: 'navbar.atc.docs', icon: <IconArticle size={20} /> },
      //{ href: '/documents/5', label: 'navbar.atc.gca', icon: <IconWorld size={20} /> },
    ]
  },
  {
    label: 'navbar.pilots.index',
    icon: <IconPlaneTilt size={20} />,
    links: [
      { href: 'https://wiki.ivao.aero/en/home/devops/manuals/altitude-first-step', label: 'navbar.pilots.start', icon: <img src={steps} width={20} alt="PilotFS Icon" />, external: true },
      { href: '/scenery', label: 'navbar.pilots.scenarios', icon: <IconPlaneDeparture size={20} /> },
      { href: 'https://www.ban.by/en/aeronautical-information-aip/amdt', label: 'navbar.pilots.charts', icon: <IconFileInfo size={20} />, external: true },
      { href: '/documents/category/2', label: 'navbar.atc.docs', icon: <IconArticle size={20} /> },
      { href: 'https://tours.th.ivao.aero', label: 'navbar.pilots.tours', icon: <IconMap2 size={20} />, external: true },
    ]
  },
  {
    label: 'navbar.community.index',
    icon: <IconUsersGroup size={20} />,
    links: [
      //{ href: 'https://google.com', label: 'navbar.community.events', icon: <IconCalendarEvent size={20} />, external: true },
      //{ href: 'https://google.com', label: 'navbar.community.training', icon: <IconSchool size={20} />, external: true },
      { href: '/documents', label: 'navbar.atc.docs', icon: <IconArticle size={20} /> },
      { href: 'https://forum.ivao.aero', label: 'navbar.community.forum', icon: <IconMessageCircle2 size={20} />, external: true },
      { href: 'https://ivao.aero', label: 'navbar.community.ivao', icon: <img src={ivaoLogo} width={20} alt="IVAO Icon" />, external: true },
      { href: 'https://webeye.ivao.aero', label: 'navbar.community.webeye', icon: <IconEye size={20} />, external: true },
      { href: 'https://tracker.ivao.aero', label: 'navbar.community.tracker', icon: <IconFocus2 size={20} />, external: true },
    ]
  },
];

export function HeaderResponsive() {
  const [opened, setOpened] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentPath, setCurrentPath] = useState('/');
  const authContext = useContext(AuthContext);
  const [urlParams] = useSearchParams();
  const ivaoToken = urlParams.get('token');
  const { signed, decodedToken } = useContext(AuthContext);
  const serverUrl = `https://api.by.ivao.aero/auth/login?goto=${encodeURIComponent(window.location.href)}`;
  const location = useLocation();

  useEffect(() => {
    console.log(window.location.pathname);
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    if (ivaoToken) {
      void authContext.signIn(ivaoToken);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ivaoToken, authContext]);

  const handleImageClick = () => {
    navigate('/');
    window.scrollTo(0, 0);
  };

  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const changeLanguage = (newLanguage: string) => {
    void i18n.changeLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const isSmallScreen = window.innerWidth <= 768;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        opened && isSmallScreen
          ? 'bg-atmos-700 transition-none' // изменено здесь: хедер становится белым, если меню открыто на малом экране
          : scrollPosition > 0
            ? 'bg-white shadow-lg'
            : currentPath === '/'
              ? 'bg-transparent'
              : 'bg-atmos-700'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center h-28 px-4">
        <img
          className="h-16 w-48 cursor-pointer"
          src={
            opened
              ? bylogo
              : currentPath === '/'
                ? scrollPosition === 0
                  ? bylogo
                  : bylogoblue
                : scrollPosition > 0
                  ? bylogoblue
                  : bylogo
          }
          onClick={handleImageClick}
          alt="Logo"
        />

        <div className="hidden md:flex space-x-4">
          {categories.map((category) => (
            <CommonDropdownContent
              key={category.label}
              scrollPosition={scrollPosition}
              category={category}
            />
          ))}
          <AuthButton
            scrollPosition={scrollPosition}
            signed={signed}
            decodedToken={decodedToken}
            handleAuthAction={() => handleAuthAction(authContext, serverUrl)}
          />
          <LanguageButton
            scrollPosition={scrollPosition}
            changeLanguage={changeLanguage}
          />
        </div>
        <button
          className={`md:hidden ${
              opened && isSmallScreen
                  ? 'text-white' // изменено здесь: хедер становится белым, если меню открыто на малом экране
                  : scrollPosition > 0
                      ? 'text-atmos-700'
                      : currentPath === '/'
                          ? 'bg-transparent'
                          : 'bg-atmos-700'
          }`}
          onClick={() => setOpened(!opened)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={opened ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
            ></path>
          </svg>
        </button>

        {opened && (
          <div className="md:hidden absolute top-24 left-0 right-0 bg-atmos-700 transition-all duration-500 shadow-lg rounded-b-md">
            {categories.map((category) => (
              <CommonDropdownContent
                key={category.label}
                scrollPosition={scrollPosition}
                category={category}
              />
            ))}
            <AuthButton
              scrollPosition={scrollPosition}
              signed={signed}
              decodedToken={decodedToken}
              handleAuthAction={() => handleAuthAction(authContext, serverUrl)}
            />
            <LanguageButton
              scrollPosition={scrollPosition}
              changeLanguage={changeLanguage}
            />
          </div>
        )}
      </div>
    </header>
  );
}

const isSmallScreen = window.innerWidth <= 991;

function CommonDropdownContent({ scrollPosition, category }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const menuLink = useCallback((link) => {
    window.open(link, '_blank');
  }, []);

  return (
    <Menu>
      <MenuButton
        className={`flex items-center space-x-2 px-1 py-2 font-bold ${scrollPosition > 0 && !isSmallScreen ? 'hover:text-ocean-600  text-blue-900' : 'hover:text-gray-200 text-white'}`}
      >
        {category.icon}
        <span>{t(category.label)}</span>
      </MenuButton>
      <Transition
        as={React.Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems
          anchor="bottom"
          className="absolute z-[70] mt-2 w-56 bg-white shadow-lg rounded-xl py-2"
        >
          {category.links.map(({ href, label, icon, external }) => (
            <MenuItem key={label}>
              {({ active }) => (
                <button
                  className={`w-full text-black font-light flex items-center text-left px-4 py-2 ${active && 'bg-gray-100'}`}
                  onClick={() => (external ? menuLink(href) : navigate(href))}
                >
                  {icon}
                  <span className="ml-2">{t(label)}</span>
                </button>
              )}
            </MenuItem>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  );
}

function AuthButton({ scrollPosition, signed, decodedToken, handleAuthAction }) {
  const { t } = useTranslation();

  return (
      <>
        {signed ? (
            <button className={`flex items-center space-x-2 px-1 py-2 font-bold ${scrollPosition > 0 && !isSmallScreen ? 'hover:text-ocean-600  text-blue-900' : 'hover:text-gray-200 text-white'}`} onClick={handleAuthAction}>
              <IconLogout size={20} />
              <span>{decodedToken?.userData.name.first} {decodedToken?.userData.id}</span>
            </button>
        ) : (
            <button className={`flex items-center space-x-2 px-1 py-2 font-bold ${scrollPosition > 0 && !isSmallScreen ? 'hover:text-ocean-600  text-blue-900' : 'hover:text-gray-200 text-white'}`} onClick={handleAuthAction}>
              <IconLogin2 size={20} />
              <span>{t('navbar.user.login')}</span>
            </button>
        )}
      </>
  );
}

function LanguageButton({ scrollPosition, changeLanguage }) {
  const { t } = useTranslation();

  return (
      <Menu>
        <MenuButton className={`flex items-center space-x-2 font-bold px-1 py-2 hover:text-gray-300 ${scrollPosition > 0 && !isSmallScreen ? 'text-blue-900' : 'text-white'}`}>
          <IconLanguage size={25} />
        </MenuButton>
        <Transition
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems anchor="bottom" className="absolute mt-2 w-48 bg-white z-[70] shadow-lg rounded-xl text-black font-light py-2">
            {['be', 'ru', 'en'].map((lang) => (
                <MenuItem key={lang}>
                  {({ active }) => (
                      <button
                          className={`w-full text-left px-4 py-2 items-center ${active && 'bg-gray-100'}`}
                          onClick={() => changeLanguage(lang)}
                      >
                        <img src={lang === 'be' ? by : lang === 'ru' ? ru : en} className="w-5 h-5 inline mr-2" alt={`${lang.toUpperCase()} Flag`} />
                        {t(lang === 'be' ? 'Беларуская' : lang === 'ru' ? 'Русский' : 'English')}
                      </button>
                  )}
                </MenuItem>
            ))}
          </MenuItems>
        </Transition>
      </Menu>
  );
}

function handleAuthAction(authContext, serverUrl) {
  if (!authContext.signed) {
    window.location.href = serverUrl;
  } else {
    authContext.signOut();
  }
}
