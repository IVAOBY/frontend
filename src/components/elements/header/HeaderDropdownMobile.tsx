import {
    createStyles, Image,
    Menu,
    rem,
    Text, UnstyledButton,
} from '@mantine/core';
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
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
import React, useCallback from "react";
import ivaoLogo from '../../../assets/image/logo_s_black.svg';
import steps from '../../../assets/image/steps.svg';
import discord from '../../../assets/image/discord.svg';

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
    const menuLink = useCallback(function (link: any | undefined) {
            window.open(link, '_blank')
        },
        []);

    return (
        <>
            <Menu radius="lg" shadow="md" width={200}>
            <Menu.Target>
                <UnstyledButton display="flex" className={classes.link}>
                    <IconInfoSquareRounded size={20}></IconInfoSquareRounded>
                    <Text ml={6}>{t('navbar.division.index')}</Text>
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Item icon={<IconUsers size={14} />}>{t("navbar.division.about")}</Menu.Item>
                <Menu.Item icon={<IconIdBadge2 size={14} />}>{t("navbar.division.staff")}</Menu.Item>
                <Menu.Item icon={<Image src={discord} width={14} />}>{t("navbar.division.discord")}</Menu.Item>
                <Menu.Item icon={<IconBook size={14} />}>{t("navbar.division.rules")}</Menu.Item>
                <Menu.Item icon={<IconMailForward size={14} />}>{t("navbar.division.contact")}</Menu.Item>
                <Menu.Item icon={<IconMessages size={14} />}>{t("navbar.division.faq")}</Menu.Item>
            </Menu.Dropdown>
        </Menu>
            <Menu radius="lg" shadow="md" width={200}>
                <Menu.Target>
                    <UnstyledButton display="flex" className={classes.link}>
                        <IconAirTrafficControl size={20}></IconAirTrafficControl>
                        <Text ml={6}>{t('navbar.atc.index')}</Text>
                    </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item icon={<Image src={steps} width={14} />}>{t("navbar.atc.start")}</Menu.Item>
                    <Menu.Item icon={<IconLock size={14} />}>{t("navbar.atc.fra")}</Menu.Item>
                    <Menu.Item icon={<IconFileInfo size={14} />}>{t("navbar.atc.charts")}</Menu.Item>
                    <Menu.Item icon={<IconArticle size={14} />}>{t("navbar.atc.docs")}</Menu.Item>
                    <Menu.Item icon={<IconWorld size={14} />}>{t("navbar.atc.gca")}</Menu.Item>
                </Menu.Dropdown>
            </Menu>
            <Menu radius="lg" shadow="md" width={200}>
                <Menu.Target>
                    <UnstyledButton display="flex" className={classes.link}>
                        <IconPlaneTilt size={20}></IconPlaneTilt>
                        <Text ml={6}>{t('navbar.pilots.index')}</Text>
                    </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item icon={<Image src={steps} width={14} />}>{t("navbar.pilots.start")}</Menu.Item>
                    <Menu.Item icon={<IconPlaneDeparture size={14} />}>{t("navbar.pilots.scenarios")}</Menu.Item>
                    <Menu.Item icon={<IconFileInfo size={14} />}>{t("navbar.pilots.charts")}</Menu.Item>
                    <Menu.Item icon={<IconPlane size={14} />}>{t("navbar.pilots.airlines")}</Menu.Item>
                    <Menu.Item icon={<IconMap2 size={14} />}>{t("navbar.pilots.tours")}</Menu.Item>
                </Menu.Dropdown>
            </Menu>
            <Menu radius="lg" shadow="md" width={200}>
                <Menu.Target>
                    <UnstyledButton display="flex" className={classes.link}>
                        <IconUsersGroup size={20}></IconUsersGroup>
                        <Text ml={6}>{t('navbar.community.index')}</Text>
                    </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item icon={<IconCalendarEvent size={14} />}>{t("navbar.community.events")}</Menu.Item>
                    <Menu.Item icon={<IconMessageCircle2 size={14} />}>{t("navbar.community.forum")}</Menu.Item>
                    <Menu.Item icon={<IconEye size={14} />}>{t("navbar.community.webeye")}</Menu.Item>
                    <Menu.Item icon={<Image src={ivaoLogo} width={14}/>}>{t("navbar.community.ivao")}</Menu.Item>
                    <Menu.Item icon={<IconFocus2 size={14} />}>{t("navbar.community.tracker")}</Menu.Item>
                </Menu.Dropdown>
            </Menu></>

    );
}
