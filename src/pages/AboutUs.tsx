import React from 'react';
import {
    createStyles,
    Title,
    Text,
    Container,
    rem,
    Image,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';

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

export function AboutUs() {
    const { classes, theme } = useStyles();
    const { t } = useTranslation();

    return (
        <Container size="lg" py="xl">
            <Title order={2} className={classes.title} ta="center" mt="sm">
                {t('AboutUs.title')}
            </Title>
            <Text color={theme.colors.blue[9]} fw={600} mt={rem(12)}>{t('AboutUs.text')}</Text>
            <Image src="https://pl.ivao.aero/wp-content/uploads/2022/08/Web-banner.png" pt={20} radius={"lg"}></Image>
        </Container>
    );
}
