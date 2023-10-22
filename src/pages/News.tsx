import { useEffect, useState } from 'react';
import {
    createStyles,
    Title,
    Container,
    rem,
    Image,
    Text,
    Flex, Paper, Group, Skeleton, Center,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { api } from '../hooks/api';
import { IconCalendarTime, IconCircleX, IconUser } from '@tabler/icons-react';
import i18n from 'i18next';
import {format} from "date-fns";

const useStyles = createStyles((theme) => ({
    title: {
        fontSize: rem(34),
        fontWeight: 800,
        color: theme.colors.blue[9],
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
        maxWidth: '100%',
        minWidth: '50%',
        height: 'auto',
        [theme.fn.largerThan('md')]: {
            maxWidth: '50%',
        },
    },

    cardContent: {
        [theme.fn.smallerThan('sm')]: {
            flexDirection: 'column',
            alignItems: 'center',
        },
        wordBreak: 'break-word',
    },

    cardAuthorDate: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: rem(20),
        marginLeft: rem(20),
        color: theme.colors.gray,
    },
    skeleton: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: '500px',
        maxWidth: '100%',
        gap: rem(10)
    }
}));

interface News {
    id: number;
    user: {
        id: number;
        name: {
            first: string;
            last: string;
        };
        staffPositions: {
            prefix: string;
            id: string;
        }[];
    };
    image_url: string;
    name: {
        [key: string]: string;
    };
    description: {
        [key: string]: string;
    };
    publishedAt: any;
}

export function NewsPage() {
    const { classes, theme } = useStyles();
    const { t } = useTranslation();
    const { id } = useParams();
    // const isSmallScreen = window.innerWidth < 768;

    const [newsItem, setNewsItem] = useState<News | null>(null);
    useEffect(() => {
        notifications.show({
            id: 'load-data',
            loading: true,
            title: t('notif.loading.name'),
            message: t('notif.loading.descritpion'),
            radius: 'lg',
            autoClose: false,
            withCloseButton: false,
        });
        api(`/news/${id}`)
            .then((response) => {
                if (response && typeof response === 'object' && !Array.isArray(response)) {
                    setNewsItem(response);
                    notifications.hide('load-data');
                } else {
                    console.error('Invalid response from API:', response);
                    notifications.update({
                        id: 'load-data',
                        color: 'red',
                        title: t('notif.server.name'),
                        message: t('notif.server.descritpion'),
                        radius: 'lg',
                        icon: <IconCircleX />,
                        withCloseButton: false,
                        autoClose: false,
                    });
                }
            })
            .catch((error) => {
                console.error('Error fetching news:', error);
                notifications.update({
                    id: 'load-data',
                    color: 'red',
                    title: t('notif.server.name'),
                    message: t('notif.server.descritpion'),
                    radius: 'lg',
                    icon: <IconCircleX />,
                    withCloseButton: false,
                    autoClose: false,
                });
            });
    }, [id]);

    return (
        <Container size="lg" py="xl">
            {newsItem ? (
                <>
                    <Title order={2} className={classes.title} ta="center" mt="sm">
                        {newsItem.name[i18n.language]}
                    </Title>
                    <Paper p={"lg"} bg={"#fff"} shadow={"lg"} radius={"lg"} mt={rem(13)}>
                        <Flex gap={"md"} className={classes.cardContent}>
                            <Image src={newsItem.image_url} alt={newsItem.name.en} className={classes.image} radius="lg" />
                            <Text color={theme.colors.gray[8]} fz={rem(16)} mt={rem(10)}>
                                {newsItem.description[i18n.language]}
                            </Text>
                        </Flex>
                        <Flex direction={"row"} gap={rem(20)} mt={rem(13)}>
                            <Group spacing={rem(5)}>
                                <IconUser size={18} color={theme.colors.blue[9]}></IconUser>
                                <Text size="md" fw="bold" color={theme.colors.blue[9]}>
                                    {newsItem.user.staffPositions ? (
                                        newsItem.user.staffPositions
                                            .map((position) => `BY-${position.id}`)
                                            .filter((value, index, self) => self.indexOf(value) === index)
                                            .join('/')
                                    ) : (
                                        String(newsItem.user.id)
                                    )}
                                </Text>
                            </Group>
                            <Group position="left" spacing={rem(5)}>
                                <IconCalendarTime size={18} color={theme.colors.blue[9]} />
                                <Text size="md" c={theme.colors.blue[9]}>
                                    {format(new Date(newsItem.publishedAt), 'dd-MM-yyyy')}
                                </Text>
                            </Group>
                        </Flex>
                    </Paper>
                </>
            ) : (
                <>
                    <Title order={2} className={classes.title} ta="center" mt="sm">
                        <Center><Skeleton height={30} radius="md" maw={300} /></Center>
                    </Title>
                    <Paper p="xl" radius="lg" shadow="lg">
                    <Flex className={classes.cardContent}>
                        <div className={classes.image}>
                            <Skeleton height={rem(231)} radius="lg" maw={400}/>
                        </div>
                        <div className={classes.skeleton}>
                            <Skeleton height={10} radius="lg" maw={600}/>
                            <Skeleton height={10} radius="lg" maw={600}/>
                            <Skeleton height={10} radius="lg" maw={600}/>
                            <Skeleton height={10} radius="lg" maw={600}/>
                            <Skeleton height={10} radius="lg" maw={600}/>
                            <Skeleton height={10} radius="lg" maw={600}/>
                        </div>
                    </Flex>
                </Paper></>
            )}
        </Container>
    );
}
