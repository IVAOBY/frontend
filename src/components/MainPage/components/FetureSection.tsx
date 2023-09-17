import {
    createStyles,
    Badge,
    Group,
    Title,
    Text,
    Card,
    SimpleGrid,
    Container,
    rem,
} from '@mantine/core';
import { IconGauge,
         IconUser,
         IconCookie,
    IconFileLike
}
    from '@tabler/icons-react';
import {useTranslation} from "react-i18next";
import {FeatureData} from "../../../types/Feture";

const useStyles = createStyles((theme) => ({
    title: {
        fontSize: rem(34),
        fontWeight: 900,
        color: theme.colors.lightBlue[9],

        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(24),
        },
    },

    description: {
        maxWidth: 600,
        margin: 'auto',

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

    card: {
        border: `${rem(2)} solid ${
            theme.colors.lightBlue[6]
        }`,
    },

    cardTitle: {
        color: theme.colors.blue[9],
        '&::after': {
            content: '""',
            display: 'block',
            backgroundColor: theme.fn.primaryColor(),
            width: rem(45),
            height: rem(2),
            marginTop: theme.spacing.sm,
        },
    },
}));

export function FeaturesCards() {
    const { classes, theme } = useStyles();
    const { t } = useTranslation();
    const data: FeatureData[] = [
        {
            title: t('featuresection.first.title'),
            description: t('featuresection.first.subtitle'),
            icon: IconFileLike,
        },
        {
            title: t('featuresection.second.title'),
            description: t('featuresection.second.subtitle'),
            icon: IconCookie,
        },
        {
            title: t('featuresection.third.title'),
            description: t('featuresection.third.subtitle'),
            icon: IconCookie,
        },
    ];
    const features = data.map((feature) => (
        <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl">
            <feature.icon size={rem(50)} stroke={2} color={theme.fn.primaryColor()} />
            <Text fz="lg" fw={700} className={classes.cardTitle} mt="md">
                {feature.title}
            </Text>
            <Text fz="sm" c="dimmed" mt="sm">
                {feature.description}
            </Text>
        </Card>
    ));

    return (
        <Container size="lg" py="xl">

            <Title order={2} className={classes.title} ta="center" mt="sm">
                Почему именно мы?
            </Title>

            <Text c="dimmed" className={classes.description} ta="center" mt="md">
                Потому что никита кудрявцев отличный дир (литвы)
            </Text>

            <SimpleGrid cols={3} spacing="xl" mt={50} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
                {features}
            </SimpleGrid>
        </Container>
    );
}