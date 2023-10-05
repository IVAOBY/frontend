import { createStyles, Container, rem, Image, Text, Group } from '@mantine/core';
import bylogo from "../assets/image/logo30px.svg";
import React from "react";

const useStyles = createStyles((theme) => ({
    footer: {
        marginTop: rem(120),
        backgroundColor: theme.colors.blue[9],
        borderTop: `${rem(1)} solid ${theme.colors.lightBlue[9]}`,
        textAlign: 'center',
        zIndex: 1,
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
        <div className={classes.footer} style={{ marginTop: '3.125rem' }}>
            <Container className={classes.inner}>
                <Group position="center" spacing="xs" noWrap>
                    <Image width={200} src={bylogo} />
                </Group>
            </Container>
        </div>
    );
}
