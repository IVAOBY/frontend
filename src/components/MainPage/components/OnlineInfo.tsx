import {
    createStyles,
    Title,
    Text,
    Card,
    SimpleGrid,
    Container,
    rem, Center, Flex,
} from '@mantine/core';
import {
    IconPlaneTilt,
    IconAirTrafficControl
}
    from '@tabler/icons-react';
import {useTranslation} from "react-i18next";
import {FeatureData} from "../../../types/Feture";

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
        minWidth: rem(250),
        border: `${rem(2)} solid ${
            theme.colors.lightBlue[6]
        }`,
    },

    cardTitle: {
        color: theme.colors.blue[9],
        fontSize: rem(25),
    },
    dvider: {
        maxWidth: rem(75)
    }
}));

export function OnlineInfoComponent() {
    const { classes, theme } = useStyles();
    const { t } = useTranslation();
    const data: FeatureData[] = [
        {
            title: t('onlinecomponent.first.title'),
            description: t('featuresection.first.subtitle'),
            icon: IconPlaneTilt,
        },
        {
            title: t('onlinecomponent.second.title'),
            description: t('featuresection.second.subtitle'),
            icon: IconAirTrafficControl,
        }
    ];
    const features = data.map((feature) => (
        <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl">
            <Flex justify={"center"} align={"center"} direction={"column"} mt="md">
                <feature.icon size={rem(50)} stroke={2} color={theme.fn.primaryColor()} />
                <Text fw={700} className={classes.cardTitle}>
                    {feature.title}
                </Text>
            </Flex>
            <Text fz="xl" c="dimmed" mt="sm" ta={"center"}>
                4
            </Text>
        </Card>
    ));

    return (
        <Container size="lg" py="xl">

            <Title order={2} className={classes.title} ta="center" mt="sm">
                {t('onlinecomponent.title')}
            </Title>

            <Center>
                <SimpleGrid cols={2} spacing="md" mt={"sm"} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
                    {features}
                </SimpleGrid>
            </Center>
        </Container>
    );
}