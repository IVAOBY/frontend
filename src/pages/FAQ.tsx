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
    image: {
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
            <Accordion variant="filled" radius="lg" defaultValue="customization" mt={rem(12)}>
                <Accordion.Item value="customization">
                    <Accordion.Control>Customization</Accordion.Control>
                    <Accordion.Panel>Colors, fonts, shadows and many other parts are customizable to fit your design needs</Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="flexibility">
                    <Accordion.Control>Flexibility</Accordion.Control>
                    <Accordion.Panel>Configure components appearance and behavior with vast amount of settings or overwrite any part of component styles</Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="focus-ring">
                    <Accordion.Control>No annoying focus ring</Accordion.Control>
                    <Accordion.Panel>With new :focus-visible pseudo-class focus ring appears only when user navigates with keyboard</Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        </Container>
    );
}
