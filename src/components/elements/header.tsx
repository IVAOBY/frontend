import { useEffect, useState } from 'react';
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
    UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import bylogo from '../../assets/image/Logo_f_w.svg';
import bylogoblue from '../../assets/image/logobyblue.svg';
import { getTokenFromUrl, LogoutButton, removeTokenFromUrl, useAuth } from '../Handler';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    IconLanguage,
    IconLogout,
    IconLogin2
} from '@tabler/icons-react';
import by from '../../assets/image/by.svg';
import ru from '../../assets/image/ru.svg';
import en from '../../assets/image/en.svg';
import {CommonDropdownContent} from "./header/CommonDropdownContent";

const HEADER_HEIGHT = rem(100);

const useStyles = createStyles((theme) => ({
    root: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: theme.colors.blue,
        borderBottom: 0,
        transition: 'background-color 0.3s ease-in-out',
    },

    scrolled: {
        backgroundColor: '#fff',
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
        transition: 'color 0.3s ease',
        textDecoration: 'none',
        color: '#ffffff',
        fontSize: theme.fontSizes.sm,
        fontWeight: 700,
        fontFamily: 'Montserrat',
        cursor: 'pointer',

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
        transition: 'color 0.3s ease',
        fontFamily: 'Montserrat',
        cursor: 'pointer',
        paddingLeft: 0,

        '&:hover': {
            color: theme.colors.gray[3],
        },
    },
    linkScrolled: {
        color: theme.colors.blue[9],
        transition: 'color 0.1s ease',
        '&:hover': { color: theme.colors.lightBlue[8] },
    },
}));

export function HeaderResponsive() {
    const [opened, { toggle }] = useDisclosure(false);
    const { classes } = useStyles();
    const isAuthenticated = useAuth();
    const [scrollPosition, setScrollPosition] = useState(0);

    const serverUrl = `https://v3.api.xr.ivao.aero/auth/login?goto=${window.location.protocol}//${window.location.hostname}${window.location.port ? ':'+window.location.port : ''}`;

    // Handle scroll position
    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleImageClick = () => {
        navigate('/');
    };

    const logoDefault = (
        <Image height={60} width={180} src={bylogo} onClick={handleImageClick} style={{ cursor: 'pointer' }} />
    );

    const logoScrolled = (
        <Image height={60} width={180} src={bylogoblue} onClick={handleImageClick} style={{ cursor: 'pointer' }} />
    );


    const logoToRender = scrollPosition > 0 ? logoScrolled : logoDefault;

    const handleLogin = () => {
        try {
            window.location.href = serverUrl;
        } catch (error) {
            console.error('Ошибка при аутентификации:', error);
        }
    };

    const handleAuthAction = () => {
        if (isAuthenticated) {
            // Handle Logout
            try {
                localStorage.removeItem('authToken');
                localStorage.removeItem('authTokenExpiration');
                navigate('/');
            } catch (error) {
                console.error('Error during logout:', error);
            }
        } else {
            // Handle Login
            try {
                window.location.href = serverUrl;
            } catch (error) {
                console.error('Error during authentication:', error);
            }
        }
    };

    const token = getTokenFromUrl();

    if (token) {
        const expirationTime = Date.now() + 3600 * 1000;

        localStorage.setItem('authToken', token);
        localStorage.setItem('authTokenExpiration', expirationTime.toString());
        removeTokenFromUrl();
        window.location.href = `${window.location.protocol}//${window.location.hostname}${
            window.location.port ? ':' + window.location.port : ''
        }`;
    }



    const navigate = useNavigate();


    const { t, i18n } = useTranslation();

    const changeLanguage = (newLanguage: any) => {
        i18n.changeLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
    };

    const currentLanguage = i18n.language;

    return (
        <Header
            height={HEADER_HEIGHT}
            className={`${classes.root} ${scrollPosition > 0 ? classes.scrolled : ''}`}
        >
            <Container className={classes.header}>
                {logoToRender}
                <Group spacing={5} className={classes.links}>
                    <CommonDropdownContent scrollPosition={scrollPosition} />
                    <UnstyledButton
                        display="flex"
                        className={`${classes.link} ${
                            scrollPosition > 0 ? classes.linkScrolled : ''
                        }`}
                    >
                        {isAuthenticated ? (
                            <>
                                <IconLogout size={20}></IconLogout>
                                <Text onClick={handleAuthAction} ml={6}>
                                    {t('navbar.user.logout')}
                                </Text>
                            </>
                        ) : (
                            <>
                                <IconLogin2 size={20}></IconLogin2>
                                <Text onClick={handleAuthAction} ml={6}>
                                    {t('navbar.user.login')}
                                </Text>
                            </>
                        )}
                    </UnstyledButton>
                    <Menu trigger="hover" radius="lg">
                        <Menu.Target>
                            <IconLanguage
                                className={`${classes.language} ${
                                    scrollPosition > 0 ? classes.linkScrolled : ''
                                }`}
                                size={25}
                            />
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item
                                icon={<Image src={by} radius={3} width={20} />}
                                onClick={() => changeLanguage('be')}
                            >
                                {t('Беларуская')}
                            </Menu.Item>
                            <Menu.Item
                                icon={<Image src={ru} radius={3} width={20} />}
                                onClick={() => changeLanguage('ru')}
                            >
                                {t('Русский')}
                            </Menu.Item>
                            <Menu.Item
                                icon={<Image src={en} radius={3} width={20} />}
                                onClick={() => changeLanguage('en')}
                            >
                                {t('English')}
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>

                <Burger
                    opened={opened}
                    onClick={toggle}
                    className={classes.burger}
                    color="#fff"
                    size="sm"
                />
                <Transition transition="pop-top-right" duration={200} mounted={opened}>
                    {(styles) => (
                        <Paper className={classes.dropdown} style={styles}>
                            <CommonDropdownContent scrollPosition={scrollPosition} />
                            {isAuthenticated ? (
                                <LogoutButton />
                            ) : (
                                <Text className={classes.link} onClick={handleLogin}>
                                    {t('navbar.user.login')}
                                </Text>
                            )}
                            <Text className={classes.link} onClick={() => changeLanguage(currentLanguage)}>
                                <IconLanguage className={classes.language} size={25} />
                            </Text>
                        </Paper>
                    )}
                </Transition>
            </Container>
        </Header>
    );
}
