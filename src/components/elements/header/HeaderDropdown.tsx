import React, {useCallback, useEffect, useState} from 'react';
import {
    createStyles, Group, Image,
    Menu,
    rem,
    Text, UnstyledButton,
    useMantineTheme,
} from '@mantine/core';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {
    IconBook,
    IconMessages,
    IconUsers,
    IconIdBadge2,
    IconMailForward,
    IconLock,
    IconFileInfo,
    IconArticle,
    IconWorld,
    IconPlane,
    IconPlaneDeparture,
    IconCalendarEvent,
    IconMessageCircle2,
    IconEye,
    IconFocus2,
    IconMap2,
    IconAirTrafficControl,
    IconUsersGroup,
    IconPlaneTilt,
    IconInfoSquareRounded,
} from '@tabler/icons-react';
import ivaoLogo from '../../../assets/image/logo_s_black.svg';
import steps from '../../../assets/image/steps.svg';
import discord from '../../../assets/image/discord.svg';

const useStyles = createStyles((theme) => ({
    link: {
        display: 'block',
        lineHeight: 1,
        padding: `${rem(1)} ${rem(7)}`,
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: '#fff',
        fontSize: theme.fontSizes.sm,
        fontWeight: 700,
        fontFamily: 'Montserrat',
        cursor: 'pointer',
        '&:hover': {color: theme.colors.gray[3]},
    },

    linkScrolled: {
        color: theme.colors.blue[9],
        '&:hover': {color: theme.colors.lightBlue[8]},
    },
}));

export function HeaderDropdown() {
    const {classes} = useStyles();
    const theme = useMantineTheme();

    const [scrollPosition, setScrollPosition] = useState(0);

    //Скролл хедера
    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const navigate = useNavigate();
    const handleNavigate = (link: string) => {
        navigate(link);
    };

    const {t} = useTranslation();
    const menuLink = useCallback(function (link: any | undefined) {
            window.open(link, '_blank')
        },
        []);


    return (
        <>
            <Menu trigger="hover" radius="lg" shadow={theme.shadows.lg} withArrow>
                <Menu.Target>
                    <UnstyledButton display="flex"
                                    className={`${classes.link} ${scrollPosition > 0 ? classes.linkScrolled : ''}`}>
                        <IconInfoSquareRounded size={20}></IconInfoSquareRounded>
                        <Text ml={6}>{t('navbar.division.index')}</Text>
                    </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item icon={<IconUsers size={20}/>}
                               onClick={() => navigate('about-us')}>{t("navbar.division.about")}</Menu.Item>
                    <Menu.Item icon={<IconIdBadge2 size={20}/>}
                               onClick={() => navigate('staff')}>{t("navbar.division.staff")}</Menu.Item>
                    <Menu.Item icon={<Image src={discord} width={19}/>}
                               onClick={() => menuLink('https://google.com')}>{t("navbar.division.discord")}</Menu.Item>
                    <Menu.Item icon={<IconBook size={20}/>}
                               onClick={() => menuLink('https://wiki.ivao.aero/en/home/ivao/information')}>{t("navbar.division.rules")}</Menu.Item>
                    <Menu.Item icon={<IconMailForward size={20}/>}
                               onClick={() => navigate('contact-us')}>{t("navbar.division.contact")}</Menu.Item>
                    <Menu.Item icon={<IconMessages size={20}/>}
                               onClick={() => navigate('faq')}>{t("navbar.division.faq")}</Menu.Item>
                </Menu.Dropdown>
            </Menu>
            <Menu trigger="hover" radius="lg" shadow={theme.shadows.lg} width={200} withArrow>
                <Menu.Target>
                    <UnstyledButton display="flex"
                                    className={`${classes.link} ${scrollPosition > 0 ? classes.linkScrolled : ''}`}>
                        <IconAirTrafficControl size={20}></IconAirTrafficControl>
                        <Text ml={6}>{t('navbar.atc.index')}</Text>
                    </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item icon={<Image src={steps} width={20}/>}
                               onClick={() => menuLink('https://google.com')}>{t("navbar.atc.start")}</Menu.Item>
                    <Menu.Item icon={<IconLock size={20}/>}
                               onClick={() => menuLink('https://ivao.aero/fras/list.asp?id=BY')}>{t("navbar.atc.fra")}</Menu.Item>
                    <Menu.Item icon={<IconFileInfo size={20}/>}
                               onClick={() => menuLink('https://google.com')}>{t("navbar.atc.charts")}</Menu.Item>
                    <Menu.Item icon={<IconArticle size={20}/>}
                               onClick={() => menuLink('https://google.com')}>{t("navbar.atc.docs")}</Menu.Item>
                    <Menu.Item icon={<IconWorld size={20}/>}
                               onClick={() => menuLink('https://google.com')}>{t("navbar.atc.gca")}</Menu.Item>
                </Menu.Dropdown>
            </Menu>
            <Menu trigger="hover" radius="lg" shadow={theme.shadows.lg} width={200} withArrow>
                <Menu.Target>
                    <UnstyledButton display="flex"
                                    className={`${classes.link} ${scrollPosition > 0 ? classes.linkScrolled : ''}`}>
                        <IconPlaneTilt size={20}></IconPlaneTilt>
                        <Text ml={6}>{t('navbar.pilots.index')}</Text>
                    </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item icon={<Image src={steps} width={20}/>}
                               onClick={() => menuLink('https://google.com')}>{t("navbar.pilots.start")}</Menu.Item>
                    <Menu.Item icon={<IconPlaneDeparture size={20}/>}
                               onClick={() => navigate('scenery')}>{t("navbar.pilots.scenarios")}</Menu.Item>
                    <Menu.Item icon={<IconFileInfo size={20}/>}
                               onClick={() => menuLink('https://google.com')}>{t("navbar.pilots.charts")}</Menu.Item>
                    <Menu.Item icon={<IconPlane size={20}/>}
                               onClick={() => menuLink('https://google.com')}>{t("navbar.pilots.airlines")}</Menu.Item>
                    <Menu.Item icon={<IconMap2 size={20}/>}
                               onClick={() => menuLink('https://google.com')}>{t("navbar.pilots.tours")}</Menu.Item>
                </Menu.Dropdown>
            </Menu>
            <Menu trigger="hover" radius="lg" shadow={theme.shadows.lg} width={200} withArrow>
                <Menu.Target>
                    <UnstyledButton display="flex"
                                    className={`${classes.link} ${scrollPosition > 0 ? classes.linkScrolled : ''}`}>
                        <IconUsersGroup size={20}></IconUsersGroup>
                        <Text ml={6}>{t('navbar.community.index')}</Text>
                    </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item icon={<IconCalendarEvent size={20}/>}
                               onClick={() => menuLink('https://google.com')}>{t("navbar.community.events")}</Menu.Item>
                    <Menu.Item icon={<IconMessageCircle2 size={20}/>}
                               onClick={() => menuLink('https://forum.ivao.aero')}>{t("navbar.community.forum")}</Menu.Item>
                    <Menu.Item icon={<IconEye size={20}/>}
                               onClick={() => menuLink('https://webeye.ivao.aero')}>{t("navbar.community.webeye")}</Menu.Item>
                    <Menu.Item icon={<Image src={ivaoLogo} width={20}/>}
                               onClick={() => menuLink('https://ivao.aero')}>{t("navbar.community.ivao")}</Menu.Item>
                    <Menu.Item icon={<IconFocus2 size={20}/>}
                               onClick={() => menuLink('https://tracker.ivao.aero')}>{t("navbar.community.tracker")}</Menu.Item>
                </Menu.Dropdown>
            </Menu></>
    );
}