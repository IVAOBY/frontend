import { createStyles, Container, rem, Image, Text, Group } from '@mantine/core';
import xrlogo from "../assets/image/logo2.svg";
import React from "react";

const useStyles = createStyles((theme) => ({
    footer: {
        marginTop: rem(120),
        backgroundColor: theme.colors.brand[0],
        borderTop: `${rem(1)} solid ${theme.colors.brand[1]}`,
        textAlign: 'center',
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
    },

    inner: {
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        [theme.fn.smallerThan('xs')]: {
            flexDirection: 'column',
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
}));

export function Footer() {
    const { classes } = useStyles();

    return (
        <div className={classes.footer} style={{ marginTop: 'auto' }}>
            <Container className={classes.inner}>
                <Group position="center" spacing="xs" noWrap>
                    <Image width={150} src={xrlogo} />
                    <Text
                        id={'titleBig'}
                        className={classes.titleBig}
                        component={'div'}
                        size={'lg'}
                        color={'white'}
                        sx={{ fontWeight: 700, flexGrow: 1, margin: '0 1rem' }}
                    >
                        Real Flight Event System
                    </Text>
                    <Text
                        id={'titleSmall'}
                        className={classes.titleSmall}
                        component={'div'}
                        size={'xl'}
                        color={'white'}
                        sx={{ fontWeight: 700, flexGrow: 1, margin: '0 1rem' }}
                    >
                        RFES
                    </Text>
                </Group>
            </Container>
        </div>
    );
}
