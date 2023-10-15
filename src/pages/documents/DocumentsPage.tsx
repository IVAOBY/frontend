import {
    createStyles,
    Container,
    Title,
    Paper,
    rem,
    Flex,
    UnstyledButton
} from '@mantine/core';
import {
    IconCircleX,
} from '@tabler/icons-react';
import {useEffect, useState} from "react";
import {api} from "../../hooks/api";
import {useTranslation} from "react-i18next";
import {notifications} from "@mantine/notifications";
import {DocumentsCategoryType, DocumentsType} from "../../hooks/types";
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
        minWidth: rem(100),
        minHeight: rem(120)
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
}));


export function DocumentsMain() {
    const {classes, theme} = useStyles();
    const [documentsCategory, setDocumentsCategory] = useState<DocumentsCategoryType[]>([]);
    const [documents, setDocuments] = useState<DocumentsType[]>([]);
    const {t, i18n} = useTranslation();

    useEffect(() => {
        api("/documents-category")
            .then(response => {
                if (response && Array.isArray(response)) {
                    setDocumentsCategory(response);
                } else {
                    console.error("Error: Unexpected API response structure");
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });

        notifications.show({
            id: 'load-data',
            loading: true,
            title: t("notif.loading.name"),
            message: t("notif.loading.descritpion"),
            radius: "lg",
            autoClose: false,
            withCloseButton: false,
        });

        api('/documents')
            .then((response) => {
                if (response && Array.isArray(response)) {
                    const documents: DocumentsType[] = response.map((documentdata) => ({
                        id: documentdata.id,
                        category: documentdata.category,
                        name: documentdata.name,
                        content: documentdata.content,
                        published: documentdata.published
                    }));
                    setDocuments(documents);

                    notifications.hide('load-data')
                } else {
                    console.error('Error: Unexpected API response structure');
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
                console.error('Error fetching staff positions:', error);
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
    }, []);

    const navigate = useNavigate();
    const documentsRedirect = (documentsItem: DocumentsType) => {
        navigate(`/documents/${documentsItem.id}`);
    };

    return (
        <Container size={"xl"} py={"xl"}>
            <Title order={2} className={classes.title} ta="center" mt="sm">
                {t("navbar.atc.docs")}
            </Title>
            {documentsCategory.map((category, index) => (
                <div key={index}>
                    <Flex direction="column" align="center">
                        <Title
                            key={index}
                            ta="center"
                            order={2}
                            c={theme.colors.blue[9]}
                            pt={index === 0 ? 13 : 40}
                        >
                            {category.name[i18n.language]}
                        </Title>

                        <Flex
                            id="staff-grid"
                            mt={40}
                            gap="md"
                            justify="center"
                            align="center"
                            direction="row"
                            wrap="wrap"
                        >
                            {documents
                                .filter((document) => document.category === category.id && document.published)
                                .map((documents, positionIndex) => (
                                    <UnstyledButton key={documents.id} className={classes.button}
                                                    style={{width: 'auto', height: 'auto'}}
                                                    onClick={() => documentsRedirect(documents)}>
                                        <Paper className={classes.card} shadow={"lg"} p={"xl"} radius="lg"
                                               key={positionIndex} bg="#fff">

                                            <Title order={3} color={theme.colors.blue[9]} mt={20}>
                                                {documents.name[i18n.language]}
                                            </Title>
                                        </Paper>
                                    </UnstyledButton>
                                ))}
                        </Flex>
                    </Flex>
                </div>
            ))}
        </Container>
    );
}