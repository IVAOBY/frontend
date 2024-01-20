import {Button, Container, createStyles, Flex, Group, Overlay, rem, Text, Title} from '@mantine/core';
import {useTranslation} from "react-i18next";
import {useCallback, useContext} from "react";
import Typed from 'react-typed';
import {useMediaQuery} from "@mantine/hooks";
import {notifications} from "@mantine/notifications";
import {IconCircleX} from "@tabler/icons-react";
import {AuthContext} from "../../../context/UserContext";
import Snowfall from 'react-snowfall'

const useStyles = createStyles((theme) => ({
    wrapper: {
        position: 'relative',
        paddingTop: rem(180),
        paddingBottom: rem(130),
        backgroundImage:
            'url(https://static.ivao.systems/first24.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: 620,
        overflow: 'hidden',

        [theme.fn.smallerThan('xs')]: {
            paddingTop: rem(80),
            paddingBottom: rem(50),
            height: 350,
        },
    },

    inner: {
        position: 'relative',
        zIndex: 1,
    },

    title: {
        fontWeight: 700,
        fontSize: rem(50),
        letterSpacing: rem(-1),
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        color: theme.white,
        marginBottom: theme.spacing.xs,
        textAlign: 'center',
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,

        [theme.fn.smallerThan('xs')]: {
            fontSize: rem(28),
        },
    },

    description: {
        color: theme.white,
        textAlign: 'center',
        fontSize: 29,
        maxWidth: "100%",

        [theme.fn.smallerThan('xs')]: {
            fontSize: theme.fontSizes.md,
        },
    },

    controls: {
        marginTop: `calc(${theme.spacing.xl} * 1.5)`,
        display: 'flex',
        justifyContent: 'center',
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,

        [theme.fn.smallerThan('xs')]: {
            flexDirection: 'column',
        },
    },

    control: {
        height: rem(42),
        fontSize: theme.fontSizes.md,

        '&:not(:first-of-type)': {
            marginLeft: theme.spacing.md,
        },

        [theme.fn.smallerThan('xs')]: {
            '&:not(:first-of-type)': {
                marginTop: theme.spacing.md,
                marginLeft: 0,
            },
        },
    },

    secondaryControl: {
        color: theme.white,
        backgroundColor: 'rgba(255, 255, 255, .4)',

        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, .45) !important',
        },
    },

    joinButton: {
        color: '#fff',
        '&:hover': {
          backgroundColor: '#fff',
          color: '#0D2C99',
        },
    },
    transButton: {
        color: '#fff',
        borderColor: '#fff',
        '&:hover': {
            backgroundColor: '#fff',
            color: '#0D2C99',
        },
    }
}));

export function HeroText() {
    const { classes } = useStyles();
    const { t } = useTranslation();
    const isSmallScreen = useMediaQuery('(max-width: 575px)');
    const { signed, decodedToken } = useContext(AuthContext);

    const byTransferMail = useCallback(async () => {
        if (!signed) {
            notifications.show({
                id: 'auth-required',
                color: 'red',
                title: t('notif.auth.negative.name'),
                message: t('notif.auth.negative.description'),
                radius: 'lg',
                icon: <IconCircleX />,
                withCloseButton: true,
                autoClose: 3000,
            });
            return;
        }

        if (signed) {
            try {
                const emailBody = `Dear HQs and Membership Department!

                I request to transfer me from the ${decodedToken?.userData.divisionId} division to the BY division.
                
                Best wishes,
                ${decodedToken?.userData.name.first} ${decodedToken?.userData.name.last}`;

                window.open(
                    `mailto:BY-hq@ivao.aero,${decodedToken?.userData.divisionId}-hq@ivao.aero?cc=members@ivao.aero&subject=Division%20transfer%20${decodedToken?.userData.id}&body=${encodeURIComponent(
                        emailBody
                    )}`,
                    '_blank'
                );
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, [t]);

    const openLink = useCallback(function (link: any | undefined) {
        window.open(link, '_blank')
    }, []);

    return (
        <div className={classes.wrapper}>
            <Snowfall
                color="#fff"
                style={{
                    position: 'absolute',
                    width: '100vw',
                    height: '45rem',
                    zIndex: 9
                }}
                snowflakeCount={200}
            />
            <Overlay color="#00000" opacity={0.45} zIndex={1}/>
            <Flex mih={50} gap="md" justify="center" align="center" direction="row" wrap="wrap" >
                <div className={classes.inner}>
                    <Title className={classes.title}>
                        {t("heropage.title")} {t("generic.ivao")}
                    </Title>
                    <Container size={640}>
                        <Text size="lg" className={`${classes.description}`}>
                            <Typed strings={[t("heropage.subtitle"), t("heropage.subtitle2")]} typeSpeed={90} backSpeed={15} loop />
                        </Text>
                    </Container>
                    <div className={classes.controls}>
                        <Group position="center">
                            <Button
                                className={classes.joinButton}
                                variant="filled"
                                size={isSmallScreen ? "sm" : "md"}
                                onClick={() => openLink('https://ivao.aero/members/person/register.htm')}
                            >
                                {t("heropage.joinbutton")}
                            </Button>
                            <Button
                                className={classes.transButton}
                                variant="outline"
                                size={isSmallScreen ? "sm" : "md"}
                                onClick={byTransferMail}
                            >
                                {t("heropage.transfer")}
                            </Button>
                        </Group>
                    </div>
                </div>
            </Flex>
        </div>
    );
}