import React, { useCallback, useContext, useEffect, useState, useMemo } from 'react';

import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import {
  IconAirTrafficControl,
  IconArticle,
  IconBook,
  IconCar,
  IconEye,
  IconFileInfo,
  IconFocus2,
  IconIdBadge2,
  IconInfoSquareRounded,
  IconLanguage,
  IconLock,
  IconLogin2,
  IconLogout,
  IconMap2,
  IconMessageCircle2,
  IconMessages,
  IconPlaneDeparture,
  IconPlaneTilt,
  IconUsers,
  IconUsersGroup,
  IconWorld,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

import by from '../../assets/image/by.svg';
import discord from '../../assets/image/discord.svg';
import en from '../../assets/image/en.svg';
import bylogo from '../../assets/image/Logo_f_w.svg';
import ivaoLogo from '../../assets/image/logo_s_black.svg';
import bylogoblue from '../../assets/image/logobyblue.svg';
import ru from '../../assets/image/ru.svg';
import steps from '../../assets/image/steps.svg';
import { STORAGE_KEYS } from '../../constants/app';
import { AuthContext } from '../../context/UserContext';

const categories = [
  {
    label: 'navbar.division.index',
    icon: <IconInfoSquareRounded size={20} />,
    links: [
      {
        href: '/about-us',
        label: 'navbar.division.about',
        icon: <IconUsers size={20} />,
      },
      {
        href: 'https://wiki.ivao.aero/en/home/ivao/information',
        label: 'navbar.division.rules',
        icon: <IconBook size={20} />,
        external: true,
      },
      {
        href: '/staff',
        label: 'navbar.division.staff',
        icon: <IconIdBadge2 size={20} />,
      },
      {
        href: 'https://discord.by.ivao.aero',
        label: 'navbar.division.discord',
        icon: <img src={discord} width={19} alt="Discord Icon" />,
        external: true,
      },
      {
        href: '/airports',
        label: 'navbar.division.airports',
        icon: <IconPlaneDeparture size={20} />,
      },
      {
        href: '/faq',
        label: 'navbar.division.faq',
        icon: <IconMessages size={20} />,
      },
    ],
  },
  {
    label: 'navbar.atc.index',
    icon: <IconAirTrafficControl size={20} />,
    links: [
      {
        href: 'https://www.ban.by/en/aeronautical-information-aip/amdt',
        label: 'navbar.atc.charts',
        icon: <IconFileInfo size={20} />,
        external: true,
      },
      {
        href: 'https://atc.ivao.aero/fras?division=BY',
        label: 'navbar.atc.fra',
        icon: <IconLock size={20} />,
        external: true,
      },
      {
        href: '/vehicles',
        label: 'navbar.atc.vehicles',
        icon: <IconCar size={20} />,
      },
      {
        href: '/documents/category/1',
        label: 'navbar.atc.docs',
        icon: <IconArticle size={20} />,
      },
      {
        href: '/documents/5',
        label: 'navbar.atc.gca',
        icon: <IconWorld size={20} />,
      },
    ],
  },
  {
    label: 'navbar.pilots.index',
    icon: <IconPlaneTilt size={20} />,
    links: [
      {
        href: 'https://wiki.ivao.aero/en/home/devops/manuals/altitude-first-step',
        label: 'navbar.pilots.start',
        icon: <img src={steps} width={20} alt="PilotFS Icon" />,
        external: true,
      },
      {
        href: '/airports',
        label: 'navbar.pilots.scenarios',
        icon: <IconPlaneDeparture size={20} />,
      },
      {
        href: 'https://www.ban.by/en/aeronautical-information-aip/amdt',
        label: 'navbar.pilots.charts',
        icon: <IconFileInfo size={20} />,
        external: true,
      },
      {
        href: '/documents/category/2',
        label: 'navbar.atc.docs',
        icon: <IconArticle size={20} />,
      },
      {
        href: 'https://tours.th.ivao.aero',
        label: 'navbar.pilots.tours',
        icon: <IconMap2 size={20} />,
        external: true,
      },
    ],
  },
  {
    label: 'navbar.community.index',
    icon: <IconUsersGroup size={20} />,
    links: [
      {
        href: '/documents',
        label: 'navbar.atc.docs',
        icon: <IconArticle size={20} />,
      },
      {
        href: 'https://forum.ivao.aero',
        label: 'navbar.community.forum',
        icon: <IconMessageCircle2 size={20} />,
        external: true,
      },
      {
        href: 'https://ivao.aero',
        label: 'navbar.community.ivao',
        icon: <img src={ivaoLogo} width={20} alt="IVAO Icon" />,
        external: true,
      },
      {
        href: 'https://webeye.ivao.aero',
        label: 'navbar.community.webeye',
        icon: <IconEye size={20} />,
        external: true,
      },
      {
        href: 'https://tracker.ivao.aero',
        label: 'navbar.community.tracker',
        icon: <IconFocus2 size={20} />,
        external: true,
      },
    ],
  },
];

export function HeaderResponsive() {
  const [opened, setOpened] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [currentPath, setCurrentPath] = useState('/');

  const authContext = useContext(AuthContext);
  const { signed, user } = authContext;

  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // ИСПРАВЛЕНИЕ: убрали authContext из dependencies

  const handleImageClick = useCallback(() => {
    navigate('/');
    window.scrollTo(0, 0);
  }, [navigate]);

  const changeLanguage = useCallback((newLanguage: string) => {
    void i18n.changeLanguage(newLanguage);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, newLanguage);
  }, [i18n]);

  const handleAuthAction = useCallback(() => {
    if (!signed) {
      authContext.signIn();
    } else {
      authContext.signOut();
    }
  }, [signed, authContext]);

  // ИСПРАВЛЕНИЕ: мемоизируем вычисление стилей
  const headerClassName = useMemo(() => {
    if (opened && isSmallScreen) {
      return 'bg-atmos-700 transition-none';
    }
    if (scrollPosition > 0) {
      return 'bg-white shadow-lg';
    }
    if (currentPath === '/') {
      return 'bg-transparent';
    }
    return 'bg-atmos-700';
  }, [opened, isSmallScreen, scrollPosition, currentPath]);

  const logoSrc = useMemo(() => {
    if (opened) return bylogo;
    if (currentPath === '/') {
      return scrollPosition === 0 ? bylogo : bylogoblue;
    }
    return scrollPosition > 0 ? bylogoblue : bylogo;
  }, [opened, currentPath, scrollPosition]);

  const mobileButtonClassName = useMemo(() => {
    if (opened && isSmallScreen) return 'text-white';
    if (scrollPosition > 0) return 'text-atmos-700';
    if (currentPath === '/') return 'bg-transparent';
    return 'bg-atmos-700';
  }, [opened, isSmallScreen, scrollPosition, currentPath]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${headerClassName}`}
    >
      <div className="container mx-auto flex h-28 items-center justify-between px-4">
        <img
          className="h-16 w-48 cursor-pointer"
          src={logoSrc}
          onClick={handleImageClick}
          alt="Logo"
        />

        <div className="hidden space-x-4 md:flex">
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
            user={user}
            handleAuthAction={handleAuthAction}
          />
          <LanguageButton
            scrollPosition={scrollPosition}
            changeLanguage={changeLanguage}
          />
        </div>

        <button
          className={`md:hidden ${mobileButtonClassName}`}
          onClick={() => setOpened(!opened)}
        >
          <svg
            className="size-6"
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
          <div className="absolute inset-x-0 top-24 rounded-b-md bg-atmos-700 shadow-lg transition-all duration-500 md:hidden">
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
              user={user}
              handleAuthAction={handleAuthAction}
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

// ИСПРАВЛЕНИЕ: вынесли за пределы компонента
const isSmallScreenGlobal = () => window.innerWidth <= 991;

function CommonDropdownContent({ scrollPosition, category }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const menuLink = useCallback((link) => {
    window.open(link, '_blank');
  }, []);

  // ИСПРАВЛЕНИЕ: мемоизируем проверку размера экрана
  const isSmallScreen = useMemo(() => isSmallScreenGlobal(), []);

  return (
    <Menu>
      <MenuButton
        className={`flex items-center space-x-2 px-1 py-2 font-bold ${
          scrollPosition > 0 && !isSmallScreen
            ? 'text-blue-900 hover:text-ocean-600'
            : 'text-white hover:text-gray-200'
        }`}
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
          className="absolute z-[70] mt-2 w-56 rounded-xl bg-white py-2 shadow-lg"
        >
          {category.links.map(({ href, label, icon, external }) => (
            <MenuItem key={label}>
              {({ active }) => (
                <button
                  className={`flex w-full items-center px-4 py-2 text-left font-light text-black ${
                    active && 'bg-gray-100'
                  }`}
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

function AuthButton({ scrollPosition, signed, user, handleAuthAction }) {
  const { t } = useTranslation();
  const isSmallScreen = useMemo(() => isSmallScreenGlobal(), []);

  return (
    <>
      {signed ? (
        <button
          className={`flex items-center space-x-2 px-1 py-2 font-bold ${
            scrollPosition > 0 && !isSmallScreen
              ? 'text-blue-900 hover:text-ocean-600'
              : 'text-white hover:text-gray-200'
          }`}
          onClick={handleAuthAction}
        >
          <IconLogout size={20} />
          <span>
            {user?.name?.first} {user?.id}
          </span>
        </button>
      ) : (
        <button
          className={`flex items-center space-x-2 px-1 py-2 font-bold ${
            scrollPosition > 0 && !isSmallScreen
              ? 'text-blue-900 hover:text-ocean-600'
              : 'text-white hover:text-gray-200'
          }`}
          onClick={handleAuthAction}
        >
          <IconLogin2 size={20} />
          <span>{t('navbar.user.login')}</span>
        </button>
      )}
    </>
  );
}

function LanguageButton({ scrollPosition, changeLanguage }) {
  const { t } = useTranslation();
  const isSmallScreen = useMemo(() => isSmallScreenGlobal(), []);

  return (
    <Menu>
      <MenuButton
        className={`flex items-center space-x-2 px-1 py-2 font-bold hover:text-gray-300 ${
          scrollPosition > 0 && !isSmallScreen ? 'text-blue-900' : 'text-white'
        }`}
      >
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
        <MenuItems
          anchor="bottom"
          className="absolute z-[70] mt-2 w-48 rounded-xl bg-white py-2 font-light text-black shadow-lg"
        >
          {['be', 'ru', 'en'].map((lang) => (
            <MenuItem key={lang}>
              {({ active }) => (
                <button
                  className={`w-full items-center px-4 py-2 text-left ${
                    active && 'bg-gray-100'
                  }`}
                  onClick={() => changeLanguage(lang)}
                >
                  <img
                    src={lang === 'be' ? by : lang === 'ru' ? ru : en}
                    className="mr-2 inline size-5"
                    alt={`${lang.toUpperCase()} Flag`}
                  />
                  {t(
                    lang === 'be'
                      ? 'Беларуская'
                      : lang === 'ru'
                        ? 'Русский'
                        : 'English',
                  )}
                </button>
              )}
            </MenuItem>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  );
}