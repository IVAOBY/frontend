import React, {useState} from 'react';
import {
    Burger,
    Container,
    createStyles,
    Group,
    Header,
    Image,
    Menu,
    Paper,
    rem,
    Text,
    Transition,
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import xrlogo from "../../assets/image/logo2.svg"
import {getTokenFromUrl, LogoutButton, removeTokenFromUrl, useAuth} from "../Handler";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {IconLanguage} from "@tabler/icons-react";
import {HeaderDropdown} from "./header/HeaderDropdown";
import {HeaderDropdownMobile} from "./header/HeaderDropdownMobile";

const HEADER_HEIGHT = rem(100);

const useStyles = createStyles((theme) => ({
    root: {
        position: "relative",
        zIndex: 100,
        backgroundColor: theme.colors.blue[9],
        borderBottom: 0,
    },

    dropdown: {
        position: 'absolute',
        top: HEADER_HEIGHT,
        left: 0,
        right: 0,
        zIndex: 0,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        borderTopWidth: 0,
        overflow: 'hidden',
        backgroundColor: theme.colors.lightBlue[9],

        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
        borderBottom: 0,
    },

    links: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    burger: {
        backgroundColor: theme.colors.lightBlue[9],
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    titleSmall: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    titleBig: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    link: {
        display: 'block',
        lineHeight: 1,
        padding: `${rem(8)} ${rem(12)}`,
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: '#ffffff',
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

    language: {
        color: '#fff',
        fontSize: theme.fontSizes.sm,
        fontWeight: 700,
        fontFamily: `Montserrat`,
        cursor: "pointer",

        '&:hover': {
            color: theme.colors.gray[3],
        },
    },
}));

interface HeaderResponsiveProps {
    links: { link: string; label: string }[];
}

export function HeaderResponsive() {
    const [opened, { toggle, close }] = useDisclosure(false);
    const { classes } = useStyles();
    const [error, setError] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const isAuthenticated = useAuth();

    const serverUrl = `https://v3.api.xr.ivao.aero/auth/login?goto=${window.location.protocol}//${window.location.hostname}${window.location.port ? ':'+window.location.port : ''}`;

    const handleLogin = () => {
        try {
            window.location.href = serverUrl;
        } catch (error) {
            console.error('Ошибка при аутентификации:', error);
            setError('Произошла ошибка при аутентификации. Пожалуйста, проверьте введенные данные и попробуйте снова.');
            setShowAlert(true);
        }
    };

    const token = getTokenFromUrl();

    if (token) {
        const expirationTime = Date.now() + 3600 * 1000;

        localStorage.setItem('authToken', token);
        localStorage.setItem('authTokenExpiration', expirationTime.toString());
        removeTokenFromUrl();
        window.location.href = `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`;
    }

    const navigate = useNavigate();
    const handleNavigate = (link: string) => {
        navigate(link);
    };

    const { t, i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const changeLanguage = () => {
        const newLanguage = currentLanguage === "en" ? "ru" : currentLanguage === "ru" ? "be" : "en";
        i18n.changeLanguage(newLanguage);
        localStorage.setItem("language", newLanguage);
    };

    const handleImageClick = () => {
        navigate('/');
    };

    return (
        <Header height={HEADER_HEIGHT} className={classes.root}>
            <Container className={classes.header}>
                <Image width={140} src={xrlogo} onClick={handleImageClick} style={{ cursor: 'pointer' }}/>
                <Group spacing={5} className={classes.links}>
                    <HeaderDropdown />
                    {isAuthenticated ? (
                        <>
                            <LogoutButton />
                        </>
                    ) : (
                        <>
                            <Text className={classes.link} onClick={handleLogin}>{t('navbar.user.login')}</Text>
                        </>
                    )}
                    <IconLanguage className={classes.language} onClick={changeLanguage} size={25} />
                </Group>

                <Burger opened={opened} onClick={toggle} className={classes.burger} color="#fff" size="sm" />

                <Transition transition="pop-top-right" duration={200} mounted={opened}>
                    {(styles) => (
                        <Paper className={classes.dropdown} style={styles}>
                            <HeaderDropdownMobile/>
                            {isAuthenticated ? <LogoutButton /> : <Text className={classes.link} onClick={handleLogin}>{t('navbar.user.login')}</Text>}
                            <Text className={classes.link} onClick={changeLanguage}><IconLanguage className={classes.language} onClick={changeLanguage} size={25} /></Text>
                        </Paper>
                    )}
                </Transition>
            </Container>
        </Header>
    );
}