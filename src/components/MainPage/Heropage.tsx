import { Title, Text, Group, Container, Button, Overlay, createStyles, rem } from '@mantine/core';
import {useTranslation} from "react-i18next";
import {useCallback} from "react";

const useStyles = createStyles((theme) => ({
    wrapper: {
        position: 'relative',
        paddingTop: rem(180),
        paddingBottom: rem(130),
        backgroundImage:
            'url(https://cdn.discordapp.com/attachments/1091120742059491439/1153365379196915762/orsha.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',

        [theme.fn.smallerThan('xs')]: {
            paddingTop: rem(80),
            paddingBottom: rem(50),
        },
    },

    inner: {
        position: 'relative',
        zIndex: 1,
    },

    title: {
        fontWeight: 700,
        fontSize: rem(40),
        letterSpacing: rem(-1),
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        color: theme.white,
        marginBottom: theme.spacing.xs,
        textAlign: 'center',
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,

        [theme.fn.smallerThan('xs')]: {
            fontSize: rem(28),
            textAlign: 'left',
        },
    },

    highlight: {
        fontWeight: 800,
        },



    description: {
        color: theme.colors.gray[0],
        textAlign: 'center',

        [theme.fn.smallerThan('xs')]: {
            fontSize: theme.fontSizes.md,
            textAlign: 'left',
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
    },

}));

export function HeroText() {
    const { classes, cx } = useStyles();
    const { t } = useTranslation();
    const byTransferMail = useCallback((event: React.MouseEvent<HTMLButtonElement>) => { window.open( 'mailto: by-hq@ivao.aero,xr-hq@ivao.aero?cc=members@ivao.aero&subject=Division%20transfer%20VID&body=Dear%20HQs%20and%20Membership%20Department!%0A%0AI%20request%20to%20transfer%20me%20from%20the%20{}%20division%20to%20the%20BY%20division.%0A%0ABest%20wishes,%0A{Name}%20{Surname}', '_blank') }, []);
    const openLink = useCallback(function (link: any | undefined) {
            window.open(link, '_blank')
        },
        []);

    return (
        <div className={classes.wrapper}>
            <Overlay color="#00000" opacity={0.45} zIndex={1} />

            <div className={classes.inner}>
                <Title className={classes.title}>
                    {t("heropage.title")}{' '}
                    <Text component="span" inherit className={classes.highlight}>
                        {t("generic.ivao")}
                    </Text>
                </Title>

                <Container size={640}>
                    <Text size="lg" className={classes.description}>
                        {t("heropage.subtitle")}
                    </Text>
                </Container>

                <div className={classes.controls}>
                    <Group position="center">
                    <Button className={classes.joinButton} variant="filled" size="md" onClick={() => openLink('https://ivao.aero/members/person/register.htm')}>
                        {t("heropage.joinbutton")}
                    </Button>
                        <Button className={classes.transButton} variant="outline" size="md" onClick={byTransferMail}>
                            {t("heropage.transfer")}
                        </Button>
                    </Group>
                </div>
            </div>
        </div>
    );
}