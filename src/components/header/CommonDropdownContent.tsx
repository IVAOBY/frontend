import { useCallback } from 'react';

import {
  createStyles,
  Image,
  Menu,
  rem,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import {
  IconAirTrafficControl,
  IconArticle,
  IconBook,
  IconCalendarEvent,
  IconCar,
  IconEye,
  IconFileInfo,
  IconFocus2,
  IconIdBadge2,
  IconInfoSquareRounded,
  IconLock,
  IconMailForward,
  IconMap2,
  IconMapCog,
  IconMessageCircle2,
  IconMessages,
  IconPlaneDeparture,
  IconPlaneTilt, IconSchool,
  IconUsers,
  IconUsersGroup,
  IconWorld,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Link, To, useNavigate } from 'react-router-dom';

import discord from '../../assets/image/discord.svg';
import ivaoLogo from '../../assets/image/logo_s_black.svg';
import steps from '../../assets/image/steps.svg';

const useStyles = createStyles((theme) => ({
  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(1)} ${rem(7)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: '#fff',
    transition: 'color 0.3s ease',
    fontSize: theme.fontSizes.sm,
    fontWeight: 700,
    fontFamily: 'Montserrat',
    '&:hover': {
      color: theme.colors.gray[3],
      transition: 'color 0.1s ease',
    },
    [theme.fn.smallerThan('md')]: {
      paddingTop: rem(16),
      paddingBottom: rem(7),
      paddingLeft: rem(16),
    },
  },

  linkScrolled: {
    color: theme.colors.blue[9],
    transition: 'color 0.1s ease',
    '&:hover': {
      color: theme.colors.lightBlue[8],
      transition: 'color 0.1s ease',
    },
  },
}));

export function CommonDropdownContent({
  scrollPosition: propScrollPosition,
}: {
  scrollPosition: number;
}) {
  const { classes } = useStyles();
  const theme = useMantineTheme();

  const navigateFunction = useNavigate();

  const navigate = (to: To) => {
    navigateFunction(to);
    window.scrollTo(0, 0);
  };

  const { t } = useTranslation();
  const menuLink = useCallback(function (link: string | undefined) {
    window.open(link, '_blank');
  }, []);

  const isSmallScreen = window.innerWidth <= 991;

  return (
    <>
      <Menu trigger="hover" radius="lg" shadow={theme.shadows.lg} withArrow>
        <Menu.Target>
          <UnstyledButton
            display="flex"
            className={`${classes.link} ${
              propScrollPosition > 0 && !isSmallScreen
                ? classes.linkScrolled
                : ''
            }`}
          >
            <IconInfoSquareRounded size={20}></IconInfoSquareRounded>
            <Text ml={6}>{t('navbar.division.index')}</Text>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            icon={<IconUsers size={20} />}
            onClick={() => navigate('about-us')}
          >
            {t('navbar.division.about')}
          </Menu.Item>
          <Menu.Item
              icon={<IconBook size={20} />}
              onClick={() =>
                  menuLink('https://wiki.ivao.aero/en/home/ivao/information')
              }
          >
            {t('navbar.division.rules')}
          </Menu.Item>
          <Link to={'/staff'}>
            <Menu.Item icon={<IconIdBadge2 size={20} />}>
              {t('navbar.division.staff')}
            </Menu.Item>
          </Link>
          <Menu.Item
              icon={<IconMailForward size={20} />}
              onClick={() => navigate('contact-us')}
          >
            {t('navbar.division.contact')}
          </Menu.Item>
          <Link to={'/discord'}>
            <Menu.Item
                icon={<Image src={discord} width={19} alt={'Discord Icon'} />}
            >
              {t('navbar.division.discord')}
            </Menu.Item>
          </Link>
          <Link to={'/airports'}>
            <Menu.Item icon={<IconPlaneDeparture size={20} />}>
              {t('navbar.division.airports')}
            </Menu.Item>
          </Link>
          <Menu.Item
            icon={<IconMessages size={20} />}
            onClick={() => navigate('faq')}
          >
            {t('navbar.division.faq')}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Menu
        trigger="hover"
        radius="lg"
        shadow={theme.shadows.lg}
        width={200}
        withArrow
      >
        <Menu.Target>
          <UnstyledButton
            display="flex"
            className={`${classes.link} ${
              propScrollPosition > 0 && !isSmallScreen
                ? classes.linkScrolled
                : ''
            }`}
          >
            <IconAirTrafficControl size={20}></IconAirTrafficControl>
            <Text ml={6}>{t('navbar.atc.index')}</Text>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            icon={<Image src={steps} width={20} alt={'ATC First Step'} />}
            onClick={() => navigate('atc/first-step')}
          >
            {t('navbar.atc.start')}
          </Menu.Item>
          <Menu.Item
            icon={<IconMapCog size={20} />}
            onClick={() => navigate('/sector')}
          >
            {t('navbar.atc.sector')}
          </Menu.Item>
          <Menu.Item
            icon={<IconFileInfo size={20} />}
            onClick={() =>
              menuLink(
                'https://www.ban.by/en/aeronautical-information-aip/amdt',
              )
            }
          >
            {t('navbar.atc.charts')}
          </Menu.Item>
          <Menu.Item
            icon={<IconLock size={20} />}
            onClick={() => menuLink('https://ivao.aero/fras/list.asp?id=BY')}
          >
            {t('navbar.atc.fra')}
          </Menu.Item>
          <Menu.Item
            icon={<IconCar size={20} />}
            onClick={() => navigate('vehicles')}
          >
            {t('navbar.atc.vehicles')}
          </Menu.Item>
          <Menu.Item
            icon={<IconArticle size={20} />}
            onClick={() => navigate('documents/category/1')}
          >
            {t('navbar.atc.docs')}
          </Menu.Item>
          <Menu.Item
            icon={<IconWorld size={20} />}
            onClick={() => navigate('documents/5')}
          >
            {t('navbar.atc.gca')}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Menu
        trigger="hover"
        radius="lg"
        shadow={theme.shadows.lg}
        width={200}
        withArrow
      >
        <Menu.Target>
          <UnstyledButton
            display="flex"
            className={`${classes.link} ${
              propScrollPosition > 0 && !isSmallScreen
                ? classes.linkScrolled
                : ''
            }`}
          >
            <IconPlaneTilt size={20}></IconPlaneTilt>
            <Text ml={6}>{t('navbar.pilots.index')}</Text>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            icon={<Image src={steps} width={20} alt={'PilotFS Icon'} />}
            onClick={() => navigate('pilots/first-step')}
          >
            {t('navbar.pilots.start')}
          </Menu.Item>
          <Menu.Item
            icon={<IconPlaneDeparture size={20} />}
            onClick={() => navigate('scenery')}
          >
            {t('navbar.pilots.scenarios')}
          </Menu.Item>
          <Menu.Item
            icon={<IconFileInfo size={20} />}
            onClick={() =>
              menuLink(
                'https://www.ban.by/en/aeronautical-information-aip/amdt',
              )
            }
          >
            {t('navbar.pilots.charts')}
          </Menu.Item>
          {/*<Menu.Item*/}
          {/*  icon={<IconPlane size={20} />}*/}
          {/*  onClick={() => menuLink('https://google.com')}*/}
          {/*>*/}
          {/*  {t('navbar.pilots.airlines')}*/}
          {/*</Menu.Item>*/}
          <Menu.Item
            icon={<IconArticle size={20} />}
            onClick={() => navigate('documents/category/2')}
          >
            {t('navbar.atc.docs')}
          </Menu.Item>
          <Menu.Item
            icon={<IconMap2 size={20} />}
            onClick={() => menuLink('https://google.com')}
          >
            {t('navbar.pilots.tours')}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Menu
        trigger="hover"
        radius="lg"
        shadow={theme.shadows.lg}
        width={200}
        withArrow
      >
        <Menu.Target>
          <UnstyledButton
            display="flex"
            className={`${classes.link} ${
              propScrollPosition > 0 && !isSmallScreen
                ? classes.linkScrolled
                : ''
            }`}
          >
            <IconUsersGroup size={20}></IconUsersGroup>
            <Text ml={6}>{t('navbar.community.index')}</Text>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            icon={<IconCalendarEvent size={20} />}
            onClick={() => menuLink('https://google.com')}
          >
            {t('navbar.community.events')}
          </Menu.Item>
          <Menu.Item
              icon={<IconSchool size={20} />}
              onClick={() => menuLink('https://google.com')}
          >
            {t('navbar.community.training')}
          </Menu.Item>
          <Menu.Item
            icon={<IconArticle size={20} />}
            onClick={() => navigate('documents')}
          >
            {t('navbar.atc.docs')}
          </Menu.Item>
          <Menu.Item
            icon={<IconMessageCircle2 size={20} />}
            onClick={() => menuLink('https://forum.ivao.aero')}
          >
            {t('navbar.community.forum')}
          </Menu.Item>
          <Menu.Item
            icon={<Image src={ivaoLogo} width={20} alt={'IVAO Icon'} />}
            onClick={() => menuLink('https://ivao.aero')}
          >
            {t('navbar.community.ivao')}
          </Menu.Item>
          <Menu.Item
              icon={<IconEye size={20} />}
              onClick={() => menuLink('https://webeye.ivao.aero')}
          >
            {t('navbar.community.webeye')}
          </Menu.Item>
          <Menu.Item
            icon={<IconFocus2 size={20} />}
            onClick={() => menuLink('https://tracker.ivao.aero')}
          >
            {t('navbar.community.tracker')}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}
