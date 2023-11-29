import {useEffect, useState} from 'react';
import {
    createStyles,
    Title,
    Container,
    rem,
    Text,
    Paper,
} from '@mantine/core';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {notifications} from '@mantine/notifications';
import {IconCircleX} from '@tabler/icons-react';
import i18n from 'i18next';
import {DocumentsType} from "../../hooks/types";
import {useApi} from "../../context/ApiContext";

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
}));

export function DocumentContentPage() {
    const {classes} = useStyles();
    const {t} = useTranslation();
    const {id} = useParams();
    const api = useApi();

    const [documentItem, setDocumentItem] = useState<DocumentsType | null>(null);
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
        api(`/documents/${id}`)
            .then((response) => {
                if (response && typeof response === 'object' && !Array.isArray(response)) {
                    setDocumentItem(response);
                    notifications.hide('load-data');
                } else {
                    console.error('Invalid response from API:', response);
                    notifications.update({
                        id: 'load-data',
                        color: 'red',
                        title: t('notif.server.name'),
                        message: t('notif.server.descritpion'),
                        radius: 'lg',
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
                    title: t('notif.server.name'),
                    message: t('notif.server.descritpion'),
                    radius: 'lg',
                    icon: <IconCircleX/>,
                    withCloseButton: false,
                    autoClose: false,
                });
            });
    }, [id]);

    return (
        <Container size="lg" py="xl">
            {documentItem && (
                <>
                    <Title order={2} className={classes.title} ta="center" mt="sm">
                        {documentItem.name[i18n.language]}
                    </Title>
                    <Paper p={"lg"} bg={"#fff"} shadow={"lg"} radius={"lg"} mt={rem(13)}>
                        <Text dangerouslySetInnerHTML={{__html: documentItem.content[i18n.language] || ''}}
                              mt={rem(10)}>
                        </Text>
                    </Paper>

                </>
            )}
        </Container>
    );
}
