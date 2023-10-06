import React, {useEffect, useState} from 'react';
import {
    createStyles,
    Title,
    Container,
    rem, Paper, Flex, Image, Text, Group,
} from '@mantine/core';
import {useTranslation} from 'react-i18next';
import {useParams} from "react-router-dom";
import {notifications} from "@mantine/notifications";
import {api} from "../hooks/api";
import {IconCalendarTime, IconCircleCheck, IconCircleX, IconUser} from "@tabler/icons-react";
import {format} from "date-fns";
import i18n from "i18next";
import {th} from "date-fns/locale";

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
        maxWidth: '70%',
        minWidth: '20%',
        height: 'auto',
        display: 'block',
        margin: '0 auto',
        textAlign: 'center',
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

export function NewsPage() {
    const {classes, theme} = useStyles();
    const {t} = useTranslation();
    const {id} = useParams();

    const [newsItem, setNewsItem] = useState<News | null>(null);
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
        api(`/news/${id}`)
            .then((response) => {
                if (response && typeof response === 'object' && !Array.isArray(response)) {
                    setNewsItem(response);
                    notifications.update({
                        id: 'load-data',
                        color: 'green',
                        title: t("notif.loaded.name"),
                        message: t("notif.loaded.descritpion"),
                        radius: "lg",
                        icon: <IconCircleCheck/>,
                        autoClose: 1000,
                    });
                } else {
                    console.error('Invalid response from API:', response);
                    notifications.update({
                        id: 'load-data',
                        color: 'red',
                        title: t("notif.server.name"),
                        message: t("notif.server.descritpion"),
                        radius: "lg",
                        icon: <IconCircleX/>,
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
                    icon: <IconCircleX/>,
                    withCloseButton: false,
                    autoClose: false,
                });
            });
    }, [id]);

    return (
        <Container size="lg" py="xl">
            {newsItem && (
                <>
                    <Title order={2} className={classes.title} ta="center" mt="sm">
                        {newsItem.name[i18n.language]}
                    </Title>
                        <Text ta={"center"} color={theme.colors.blue[9]} fz={rem(18)} mt={rem(13)}>{newsItem.description[i18n.language]}</Text>
                        <Image
                            src={newsItem.image_url}
                            alt={newsItem.name.en}
                            className={classes.image}
                            radius={"lg"}
                            mt={rem(10)}
                        />
                </>
            )}
        </Container>
    );
}
