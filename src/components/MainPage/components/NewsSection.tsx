import React from 'react';
import {
    createStyles,
    Title,
    Text,
    Card,
    SimpleGrid,
    Container,
    rem,
    Paper,
    Image,
    Flex, Group,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { IconCalendarTime } from '@tabler/icons-react';

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
    card: {
        backgroundColor: 'white',
    },
    cardTitle: {
        color: theme.colors.blue[9],
        marginLeft: rem(20),
    },
    cardDescription: {
        marginTop: rem(20),
        marginBottom: rem(20),
        color: theme.colors.gray[6],
        marginLeft: rem(20),
    },
    cardAuthorDate: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: rem(20),
        marginLeft: rem(20),
        color: theme.colors.gray[6],
    },
    cardContent: {
        [theme.fn.smallerThan('sm')]: {
            flexDirection: 'column',
            alignItems: 'center',
        },
    },
    cardImage: {
        [theme.fn.smallerThan('md')]: {
            marginBottom: rem(20),
        },
        maxWidth: '100%',
        height: 'auto',
        [theme.fn.largerThan('md')]: {
            maxWidth: '50%',
        },
    },
}));

export function NewsSection() {
    const { classes, theme } = useStyles();
    const { t } = useTranslation();

    return (
        <Container size="lg" py="xl">
            <Title order={2} className={classes.title} ta="center" mt="sm">
                {t('news.title')}
            </Title>

            <SimpleGrid cols={1} spacing="xl" mt={50} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
                <Paper className={classes.card} p="xl" radius="lg" shadow="lg">
                    <Flex className={classes.cardContent}>
                        <div className={classes.cardImage}>
                            <Image
                                src="https://sun9-27.userapi.com/impg/JpZepO9lnr9kSsLZogvV20N2P2OnFODk1pk4pw/ADO99nQkriI.jpg?size=1200x800&quality=95&sign=356a7c6acaa52e7b680a596ec3b50ee6&type=album"
                                alt="newsimage"
                                radius={"lg"}
                            />
                        </div>
                        <div>
                            <Title className={classes.cardTitle}>Congratulations for Serafim and Nikita</Title>
                            <Text className={classes.cardDescription}>
                                Congratulations for Serafim & Nikita for achieving Aerodrome Controller rating. Keep the spirit, guys!
                            </Text>
                            <div className={classes.cardAuthorDate}>
                                <Text size="md" fw={"bold"} c={theme.colors.blue[9]}>XR-WM</Text>
                                <Group>
                                    <IconCalendarTime size={18} color={theme.colors.blue[9]} />
                                    <Text size="md" c={theme.colors.blue[9]}>2023-09-20</Text>
                                </Group>
                            </div>
                        </div>
                    </Flex>
                </Paper>
                <Paper className={classes.card} p="xl" radius="lg" shadow="lg">
                    <Flex className={classes.cardContent}>
                        <div className={classes.cardImage}>
                            <Image
                                src="https://sun9-27.userapi.com/impg/JpZepO9lnr9kSsLZogvV20N2P2OnFODk1pk4pw/ADO99nQkriI.jpg?size=1200x800&quality=95&sign=356a7c6acaa52e7b680a596ec3b50ee6&type=album"
                                alt="newsimage"
                                radius={"lg"}
                            />
                        </div>
                        <div>
                            <Title className={classes.cardTitle}>Congratulations for Serafim and Nikita</Title>
                            <Text className={classes.cardDescription}>
                                Congratulations for Serafim & Nikita for achieving Aerodrome Controller rating. Keep the spirit, guys!
                            </Text>
                            <div className={classes.cardAuthorDate}>
                                <Text size="md" fw={"bold"} c={theme.colors.blue[9]}>XR-WM</Text>
                                <Group>
                                    <IconCalendarTime size={18} color={theme.colors.blue[9]} />
                                    <Text size="md" c={theme.colors.blue[9]}>2023-09-20</Text>
                                </Group>
                            </div>
                        </div>
                    </Flex>
                </Paper>
            </SimpleGrid>
        </Container>
    );
}
