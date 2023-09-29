import React from 'react';
import {
    createStyles,
    Title,
    Text,
    Container,
    rem,
    Image, Paper, Accordion,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import baner from '../assets/image/joinbaner.png';

const useStyles = createStyles((theme) => ({
    title: {
        fontSize: rem(34),
        fontWeight: 800,
        color: theme.colors.blue[9],
        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(24),
        },
        '&::after': {
            content: '""',
            display: 'block',
            backgroundColor: theme.fn.primaryColor(),
            width: rem(45),
            height: rem(2),
            marginTop: theme.spacing.sm,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
}));

export function FAQ() {
    const { classes, theme } = useStyles();
    const { t } = useTranslation();

    return (
        <Container size="lg" py="xl">
            <Title order={2} className={classes.title} ta="center" mt="sm">
                Frequently Asked Questions
            </Title>
        </Container>
    );
}
