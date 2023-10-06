import React, { useEffect, useState } from 'react';
import {
    createStyles,
    Title,
    Text,
    SimpleGrid,
    Container,
    rem,
    Paper,
    Image,
    Flex,
    Group, Pagination, Button, Modal, ModalProps, UnstyledButton,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import {IconCalendarTime, IconCircleCheck, IconCircleX, IconUser} from '@tabler/icons-react';
import { api } from '../../../hooks/api';
import { format } from 'date-fns';
import {notifications} from "@mantine/notifications";
import {useNavigate} from "react-router-dom";

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
        color: theme.colors.gray,
    },
    cardContent: {
        [theme.fn.smallerThan('sm')]: {
            flexDirection: 'column',
            alignItems: 'center',
        },
        wordBreak: 'break-word',
    },
    cardImage: {
        [theme.fn.smallerThan('md')]: {
            marginBottom: rem(20),
        },
        maxWidth: '100%',
        minWidth: '50%',
        height: 'auto',
        [theme.fn.largerThan('md')]: {
            maxWidth: '50%',
        },
    },
    pagination: {
        '[data-active]': {
            color: "#fff!important"
        },
    },
    button: {
        position: 'relative',
        borderRadius: theme.radius.lg,
        overflow: 'hidden',
        transition: 'transform 0.4s ease, box-shadow 0.4s ease',
        '&.active': { // Новый класс для активной кнопки
            transform: 'scale(1.01)',
            boxShadow: '0px 50px 50px rgba(0, 0, 0, 0.2)',
        },
        '&:hover': {
            transform: 'scale(1.01)',
            boxShadow: '0px 50px 50px rgba(0, 0, 0, 0.2)',
        },
    },
    NewsImage: {
        [theme.fn.smallerThan('md')]: {
            marginBottom: rem(20),
        },
        maxWidth: '80%',
        minWidth: '20%',
        height: 'auto',
    },
    modal: {
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: theme.radius.lg,
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
        padding: '20px',
        minWidth: '600px',
        maxWidth: '100%',
        position: 'relative',
        zIndex: 1000,
    },
    modalTitle: {
        fontSize: rem(24),
        fontWeight: 800,
        color: theme.colors.blue[9],
        margin: 0,
    },
}));

interface News {
    id: number;
    userId: number;
    image_url: string;
    name: {
        [key: string]: string;
    };
    description: {
        [key: string]: string;
    };
    publishedAt: any;
}

export function NewsSection() {
    const { classes, theme } = useStyles();
    const { t, i18n } = useTranslation();
    const [news, setNews] = useState<News[]>([]);

    const navigate = useNavigate();
    const newsRedirect = (newsItem: News) => {
        navigate(`/news/${newsItem.id}`);
    };

    useEffect(() => {
        notifications.show({
            id: 'load-data',
            loading: true,
            title: t("notif.loading.name"),
            message: t("notif.loading.descritpion"),
            radius: "lg",
            autoClose: false,
            withCloseButton: false,
        });
        api('/news')
            .then((response) => {
                if (response && Array.isArray(response)) {
                    response.sort((a, b) => b.id - a.id);
                    setNews(response);
                    notifications.update({
                        id: 'load-data',
                        color: 'green',
                        title: t("notif.loaded.name"),
                        message: t("notif.loaded.descritpion"),
                        radius: "lg",
                        icon: <IconCircleCheck />,
                        autoClose: 1000,
                    });
                } else {
                    notifications.update({
                        id: 'load-data',
                        color: 'red',
                        title: t("notif.server.name"),
                        message: t("notif.server.descritpion"),
                        radius: "lg",
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
                    title: t("notif.server.name"),
                    message: t("notif.server.descritpion"),
                    radius: "lg",
                    icon: <IconCircleX />,
                    withCloseButton: false,
                    autoClose: false,
                });
            });
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return (
        <Container size="lg" py="xl">
            <Title order={2} className={classes.title} ta="center" mt="sm">
                {t('news.title')}
            </Title>
            <SimpleGrid cols={1} spacing="xl" mt={50} breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
                {news.slice(startIndex, endIndex).map((newsItem) => (
                    <UnstyledButton key={newsItem.id} className={classes.button} style={{width: 'auto', height: 'auto'}} onClick={() => newsRedirect(newsItem)}>
                    <Paper key={newsItem.id} className={classes.card} p="xl" radius="lg" shadow="lg">
                        <Flex className={classes.cardContent}>
                            <div className={classes.cardImage}>
                                <Image src={newsItem.image_url} alt="newsimage" radius="lg" />
                            </div>
                            <div>
                                <Title className={classes.cardTitle}>{newsItem.name[i18n.language]}</Title>
                                <Text className={classes.cardDescription}>
                                    {newsItem.description[i18n.language].length > 300
                                        ? `${newsItem.description[i18n.language].slice(0, 300)}...`
                                        : newsItem.description[i18n.language]}
                                </Text>

                                <div className={classes.cardAuthorDate}>
                                    <Group>
                                        <IconUser size={18} color={theme.colors.blue[9]}></IconUser>
                                        <Text size="md" fw="bold" color={theme.colors.blue[9]}>
                                            {newsItem.userId}
                                        </Text>
                                    </Group>
                                    <Group position="right">
                                        <IconCalendarTime size={18} color={theme.colors.blue[9]} />
                                        <Text size="md" c={theme.colors.blue[9]}>
                                            {format(new Date(newsItem.publishedAt), 'dd-MM-yyyy')}
                                        </Text>
                                    </Group>
                                </div>
                            </div>
                        </Flex>
                    </Paper>
                    </UnstyledButton>
                ))}
            </SimpleGrid>
            <Pagination
                value={currentPage}
                onChange={setCurrentPage}
                total={Math.ceil(news.length / itemsPerPage)}
                mt={10}
                position={"center"}
                radius={"lg"}
                className={classes.pagination}
            />

        </Container>
    );
};