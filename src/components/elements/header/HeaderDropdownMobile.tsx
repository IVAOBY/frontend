import {
    createStyles,
    Menu,
    rem,
    Text,
} from '@mantine/core';
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
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
import React from "react";

const useStyles = createStyles((theme) => ({

    link: {
        display: 'block',
        lineHeight: 1,
        padding: `${rem(8)} ${rem(12)}`,
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: '#fff',
        fontSize: theme.fontSizes.sm,
        fontWeight: 700,
        fontFamily: `Montserrat`,
        cursor: "pointer",

        '&:hover': {
            color: theme.colors.gray[3],
        },

        [theme.fn.smallerThan('sm')]: {
            borderRadius: 0,
            padding: theme.spacing.md,
        },
    },
}));

export function HeaderDropdownMobile() {
    const { classes } = useStyles();

    const navigate = useNavigate();
    const handleNavigate = (link: string) => {
        navigate(link);
    };

    const { t, i18n } = useTranslation();


    return (
        <>
            <Menu radius="lg" shadow="md" width={200}>
            <Menu.Target>
                <Text className={classes.link}>{t('navbar.division.index')}</Text>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item icon={<IconBook size={14} />}>{t("navbar.division.rules")}</Menu.Item>
                <Menu.Item icon={<IconMessages size={14} />}>{t("navbar.division.faq")}</Menu.Item>
                <Menu.Item icon={<IconUsers size={14} />}>{t("navbar.division.about")}</Menu.Item>
                <Menu.Item icon={<IconUserHeart size={14} />}>{t("navbar.division.staff")}</Menu.Item>
                <Menu.Item icon={<IconBrandDiscord size={14} />}>{t("navbar.division.discord")}</Menu.Item>
                <Menu.Item icon={<IconMailForward size={14} />}>{t("navbar.division.contact")}</Menu.Item>
            </Menu.Dropdown>
        </Menu>
            <Menu radius="lg" shadow="md" width={200}>
                <Menu.Target>
                    <Text className={classes.link}>{t('navbar.atc.index')}</Text>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item icon={<IconNumber1 size={14} />}>{t("navbar.atc.start")}</Menu.Item>
                    <Menu.Item icon={<IconLockStar size={14} />}>{t("navbar.atc.fra")}</Menu.Item>
                    <Menu.Item icon={<IconUser size={14} />}>{t("navbar.atc.gca")}</Menu.Item>
                    <Menu.Item icon={<IconFileInfo size={14} />}>{t("navbar.atc.charts")}</Menu.Item>
                    <Menu.Item icon={<IconArticle size={14} />}>{t("navbar.atc.docs")}</Menu.Item>
                </Menu.Dropdown>
            </Menu>
            <Menu radius="lg" shadow="md" width={200}>
                <Menu.Target>
                    <Text className={classes.link}>{t('navbar.pilots.index')}</Text>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item icon={<IconNumber1 size={14} />}>{t("navbar.pilots.start")}</Menu.Item>
                    <Menu.Item icon={<IconPlaneDeparture size={14} />}>{t("navbar.pilots.scenarios")}</Menu.Item>
                    <Menu.Item icon={<IconFileInfo size={14} />}>{t("navbar.pilots.charts")}</Menu.Item>
                    <Menu.Item icon={<IconPlane size={14} />}>{t("navbar.pilots.airlines")}</Menu.Item>
                    <Menu.Item icon={<IconWorld size={14} />}>{t("navbar.pilots.tours")}</Menu.Item>
                </Menu.Dropdown>
            </Menu>
            <Menu radius="lg" shadow="md" width={200}>
                <Menu.Target>
                    <Text className={classes.link}>{t('navbar.community.index')}</Text>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item icon={<IconCalendarEvent size={14} />}>{t("navbar.community.events")}</Menu.Item>
                    <Menu.Item icon={<IconMessageCircle2 size={14} />}>{t("navbar.community.forum")}</Menu.Item>
                    <Menu.Item icon={<IconEye size={14} />}>{t("navbar.community.webeye")}</Menu.Item>
                    <Menu.Item icon={<IconUser size={14} />}>{t("navbar.community.ivao")}</Menu.Item>
                    <Menu.Item icon={<IconFocus2 size={14} />}>{t("navbar.community.tracker")}</Menu.Item>
                </Menu.Dropdown>
            </Menu></>

    );
}