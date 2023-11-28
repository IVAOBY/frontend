import {useContext, useEffect, useState} from 'react';
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
import { getTokenFromUrl, removeTokenFromUrl } from '../Handler';
import {useNavigate, useSearchParams} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    IconLanguage,
    IconLogout,
    IconLogin2
} from '@tabler/icons-react';
import by from '../../assets/image/by.svg';
import ru from '../../assets/image/ru.svg';
import en from '../../assets/image/en.svg';
import {CommonDropdownContent} from "./CommonDropdownContent";
import { t } from 'i18next';
import {AuthContext, useUser} from "../../context/UserContext";

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

    languageScrolled: {
        color: '#fff',
        margin: `${rem(8)} ${rem(12)}`,
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
    const [scrollPosition, setScrollPosition] = useState(0);
    const authContext = useContext(AuthContext);
    const [urlParams] = useSearchParams();
    const ivaoToken = urlParams.get("token");

    const { signed, token } = useContext(AuthContext);

    const serverUrl = `https://v3.api.xr.ivao.aero/auth/login?goto=${window.location.protocol}//${window.location.hostname}${window.location.port ? ':'+window.location.port : ''}`;

    useEffect(() => {
        console.log('Signed:', signed);
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        if (ivaoToken) {
            authContext.signIn(ivaoToken);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [ivaoToken, authContext]);


    const handleImageClick = () => {
        navigate('/');
        window.scrollTo(0, 0);
    };

    const logoDefault = (
        <Image height={60} width={180} src={bylogo} onClick={handleImageClick} style={{ cursor: 'pointer' }} />
    );

    const logoScrolled = (
        <Image height={60} width={180} src={bylogoblue} onClick={handleImageClick} style={{ cursor: 'pointer' }} />
    );

    const logoToRender = scrollPosition > 0 ? logoScrolled : logoDefault;

    const handleAuthAction = async () => {
        if (!signed) {
            window.location.href = serverUrl;
        } else {
            authContext.signOut();
        }
    };

    const navigate = useNavigate();


    const {  i18n } = useTranslation();

    const changeLanguage = (newLanguage: any) => {
        i18n.changeLanguage(newLanguage);
        localStorage.setItem('language', newLanguage);
    };

    const isSmallScreen = window.innerWidth <= 768;

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
                        {authContext.signed ? (
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
                            <UnstyledButton
                                display="flex"
                                className={classes.link}
                            >
                                {authContext.signed ? (
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
                            <UnstyledButton>
                                <Menu trigger="hover" radius="lg">
                                    <Menu.Target>
                                        <IconLanguage
                                            className={`${classes.languageScrolled} ${
                                                (scrollPosition > 0 && !isSmallScreen) ? classes.language : ''
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
                            </UnstyledButton>
                        </Paper>
                    )}
                </Transition>
            </Container>
        </Header>
    );
}