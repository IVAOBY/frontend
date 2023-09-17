import React from 'react';
import {
    createStyles,
    Menu,
    rem,
    Text,
    useMantineTheme,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    IconBook,
    IconMessages,
    IconUsers,
    IconUserHeart,
    IconBrandDiscord,
    IconMailForward,
    IconNumber1,
    IconLockStar,
    IconFileInfo,
    IconArticle,
    IconWorld,
    IconPlane,
    IconPlaneDeparture,
    IconCalendarEvent,
    IconMessageCircle2,
    IconEye,
    IconFocus2,
    IconUser,
} from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
    link: {
        display: 'block',
        lineHeight: 1,
        padding: `${rem(1)} ${rem(7)}`,
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: '#ffffff',
        fontSize: theme.fontSizes.sm,
        fontWeight: 700,
        fontFamily: 'Montserrat',
        cursor: 'pointer',
        '&:hover': { color: theme.colors.gray[3] },
    },
}));

export function HeaderDropdown() {
    const { classes } = useStyles();
    const theme = useMantineTheme();

    const navigate = useNavigate();
    const handleNavigate = (link: string) => {
        navigate(link);
    };

    const { t } = useTranslation();

    return (
        <>
            <Menu trigger="hover" radius="lg" shadow={theme.shadows.lg} closeDelay={400} withArrow>
            <Menu.Target>
                <Text className={classes.link}>{t('navbar.division.index')}</Text>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item icon={<IconBook size={20}/>}>{t("navbar.division.rules")}</Menu.Item>
                <Menu.Item icon={<IconMessages size={20}/>}>{t("navbar.division.faq")}</Menu.Item>
                <Menu.Item icon={<IconUsers size={20}/>}>{t("navbar.division.about")}</Menu.Item>
                <Menu.Item icon={<IconUserHeart size={20}/>}>{t("navbar.division.staff")}</Menu.Item>
                <Menu.Item icon={<IconBrandDiscord size={20}/>}>{t("navbar.division.discord")}</Menu.Item>
                <Menu.Item icon={<IconMailForward size={20}/>}>{t("navbar.division.contact")}</Menu.Item>
            </Menu.Dropdown>
        </Menu>
            <Menu trigger="hover" radius="lg" shadow={theme.shadows.lg} width={200} withArrow>
            <Menu.Target>
                <Text className={classes.link}>{t('navbar.atc.index')}</Text>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item icon={<IconNumber1 size={20}/>}>{t("navbar.atc.start")}</Menu.Item>
                <Menu.Item icon={<IconLockStar size={20}/>}>{t("navbar.atc.fra")}</Menu.Item>
                <Menu.Item icon={<IconUser size={20}/>}>{t("navbar.atc.gca")}</Menu.Item>
                <Menu.Item icon={<IconFileInfo size={20}/>}>{t("navbar.atc.charts")}</Menu.Item>
                <Menu.Item icon={<IconArticle size={20}/>}>{t("navbar.atc.docs")}</Menu.Item>
            </Menu.Dropdown>
        </Menu>
            <Menu trigger="hover" radius="lg" shadow={theme.shadows.lg} width={200} withArrow>
            <Menu.Target>
                <Text className={classes.link}>{t('navbar.pilots.index')}</Text>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item icon={<IconNumber1 size={20}/>}>{t("navbar.pilots.start")}</Menu.Item>
                <Menu.Item icon={<IconPlaneDeparture size={20}/>}>{t("navbar.pilots.scenarios")}</Menu.Item>
                <Menu.Item icon={<IconFileInfo size={20}/>}>{t("navbar.pilots.charts")}</Menu.Item>
                <Menu.Item icon={<IconPlane size={20}/>}>{t("navbar.pilots.airlines")}</Menu.Item>
                <Menu.Item icon={<IconWorld size={20}/>}>{t("navbar.pilots.tours")}</Menu.Item>
            </Menu.Dropdown>
        </Menu>
            <Menu trigger="hover" radius="lg" shadow={theme.shadows.lg} width={200} withArrow>
            <Menu.Target>
                <Text className={classes.link}>{t('navbar.community.index')}</Text>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item icon={<IconCalendarEvent size={20}/>}>{t("navbar.community.events")}</Menu.Item>
                <Menu.Item icon={<IconMessageCircle2 size={20}/>}>{t("navbar.community.forum")}</Menu.Item>
                <Menu.Item icon={<IconEye size={20}/>}>{t("navbar.community.webeye")}</Menu.Item>
                <Menu.Item icon={<IconUser size={20}/>}>{t("navbar.community.ivao")}</Menu.Item>
                <Menu.Item icon={<IconFocus2 size={20}/>}>{t("navbar.community.tracker")}</Menu.Item>
            </Menu.Dropdown>
        </Menu></>
    );
}