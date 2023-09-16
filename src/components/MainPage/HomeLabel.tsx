import React, { useEffect, useState } from 'react';
import {
    Container,
    Title,
    Divider,
    Center,
    Skeleton,
    createStyles,
    Notification,
} from '@mantine/core';
import { api, getTextFromApiResponse } from '../../hooks/api';

const useStyles = createStyles((theme) => ({
    airline: {
        flex: 1,
        minWidth: '70',
        maxWidth: '250',
    },
    notificationContainer: {
        position: 'fixed',
        bottom: theme.spacing.sm,
        right: theme.spacing.sm,
        zIndex: 1000,
    },
}));

export function HomeLabelComponent() {
    const { classes } = useStyles();

    const [data, setData] = useState<{ title: string; body: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const language = localStorage.getItem('language');
    const isLoading = data === null && error === null;

    useEffect(() => {
        api('/rfe')
            .then((response) => {
                if (response === false) {
                    setError('An error occurred while fetching data.');
                } else {
                    const textData = getTextFromApiResponse(response, 'homePage', language || 'ru');
                    if (textData) {
                        setData(textData);
                    } else {
                        setError('No data available.');
                    }
                }
            })
            .catch((error) => {
                console.error(error);
                setError('An error occurred while fetching data.');
            });
    }, [language]);

    return (
        <Container size="lg">
            <Divider size={3} my="sm" />
            {isLoading ? (
                <Center>
                    <Skeleton width="100%" height={300} />
                </Center>
            ) : (
                <>
                    {error ? (
                        <div className={classes.notificationContainer}>
                            <Notification color="red" title="Error" withCloseButton={false}>
                                {error}
                            </Notification>
                        </div>
                    ) : (
                        <>
                            <Title size={30} align="center" mt={47.5} c="var(--ivao-light-blue)">
                                {data?.title || ''}
                            </Title>
                            <p dangerouslySetInnerHTML={{ __html: data?.body || '' }} />
                        </>
                    )}
                </>
            )}
        </Container>
    );
}
