import {Container, createStyles, Image, Paper, rem, Text, Title,} from '@mantine/core';
import {useTranslation} from 'react-i18next';

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
    image: {},
}));

export function AboutUs() {
    const {classes, theme} = useStyles();
    const {t} = useTranslation();

    return (
        <Container size="lg" py="xl">
            <Title order={2} className={classes.title} ta="center" mt="sm">
                {t('AboutUs.title')}
            </Title>
            <Text color={theme.colors.blue[9]} fw={600} mt={rem(12)}>
                {t('AboutUs.text')}
            </Text>
            <Paper shadow={'lg'} radius={'lg'}>
                <Image
                    className={classes.image}
                    src={baner}
                    mt={20}
                    radius={'lg'}
                ></Image>
            </Paper>
        </Container>
    );
}
