import {
    createStyles,
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
        minWidth: rem(550),
        maxHeight: rem(140),
        [theme.fn.smallerThan('xs')]: {
            minWidth: rem(370),
            maxWidth: '100%',
        },
        borderRadius: theme.radius.lg,
        backgroundColor: "#fff",
        marginTop: 20,
    },
    cardTitle: {
        color: theme.colors.blue[9],
        fontSize: rem(25),
    },
    icon: {
        backgroundColor: theme.colors.blue[9],
        borderRadius: theme.radius.lg,
        padding: theme.spacing.md,
    },
}));

export function OnlineInfoComponent() {
    const { classes } = useStyles();
    const { t } = useTranslation();
    const data: FeatureData[] = [
        {
            title: t('onlinecomponent.first.title'),
            description: t('featuresection.first.subtitle'),
            icon: IconAirTrafficControl,
        },
        {
            title: t('onlinecomponent.second.title'),
            description: t('featuresection.second.subtitle'),
            icon: IconPlaneTilt,
        }
    ];
    const features = data.map((feature) => (
        <Card key={feature.title} shadow="md" radius="md" className={classes.card} padding="xl">
            <Flex justify={"center"} align={"left"} direction={"column"}>
                <feature.icon className={classes.icon} size={rem(70)} stroke={2} color="#fff"/>
            </Flex>
        </Card>
    ));

    return (
        <Container size="lg" py="xl">
            <Center>
                <SimpleGrid cols={2} spacing="md" mt={"sm"} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
                    {features}
                </SimpleGrid>
            </Center>
        </Container>
    );
}