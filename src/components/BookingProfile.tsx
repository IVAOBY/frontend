import React, { useState, useEffect } from 'react';
import {
    Paper,
    Text,
    Col,
    Container,
    Divider,
    Grid,
    Image,
    useMantineTheme,
    createStyles,
    Group,
    Button,
    ActionIcon,
    Modal, Loader,
} from '@mantine/core';
import { SlotData } from '../hooks/types';
import { api } from '../hooks/api';
import { IconMoodCry, IconX } from '@tabler/icons-react';
import {MessageOverlay} from "./MessageOverlay";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const useStyles = createStyles((theme) => ({
    box: {
        minWidth: 650,

        [theme.fn.smallerThan('sm')]: {
            minWidth: 550,
        },
        [theme.fn.smallerThan('xs')]: {
            minWidth: 150,
        },
    },
}));

const Ticket = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [arrivalData, setArrivalData] = useState<SlotData[]>([]);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [bookingResult, setBookingResult] = useState<{ success: boolean; message: string } | null>(null);
    const theme = useMantineTheme();
    const { t } = useTranslation();
    const { classes } = useStyles();


    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api('/rfe/slots/my');
                if (response) {
                    const formattedData = response.map((item: any) => ({
                        id: item.id,
                        ident: item.ident,
                        icaoDep: item.icaoDep,
                        icaoArr: item.icaoArr,
                        acftType: item.acftType,
                        scheduleTime: new Date(item.scheduleTime).toLocaleString('en-US', {
                            timeZone: 'UTC',
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour12: false,
                            hour: '2-digit',
                            minute: '2-digit',
                        }).replace(/\//g, '.'),
                        bookedUser: item.bookedUser,
                    }));

                    setArrivalData(formattedData);
                } else {
                    setError(t("errorfetch"));
                }
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleDeleteConfirmation = (id: number) => {
        setConfirmDelete(id);
        setModalVisible(true);
    };

    const handleDeleteConfirmed = async () => {
        if (confirmDelete !== null) {
            try {
                await api(`/rfe/slots/${confirmDelete}/unbook`, 'v3', 'POST');
                setBookingResult({ success: true, message: t("unbooked") });
            } catch (error) {
                console.log(error);
                setBookingResult({ success: false, message: t("errorunbook") });
            }

            setConfirmDelete(null);
            setModalVisible(false);
        }
    };

    return (
        <Container size="lg">
            {loading ? (
                <Paper className={classes.box} p="lg" radius="lg" shadow={theme.shadows.lg}>
                    <Container size="xl">
                        <Group position="center">
                            <Loader></Loader>
                            <Text size="lg" weight={600} align="center">
                                {t("loading")}
                            </Text>
                        </Group>
                    </Container>
                </Paper>
            ) : error ? (
                <>
                    <Paper className={classes.box} p="lg" radius="lg" shadow={theme.shadows.lg}>
                        <Container size="xl">
                            <Group position="center">
                                <IconMoodCry color={theme.colors.brand[5]} size={40}></IconMoodCry>
                                <Text size="lg" weight={600} align="center">
                                    {error}
                                </Text>
                            </Group>
                        </Container>
                    </Paper>
                </>
            ) : bookingResult ? (
                <MessageOverlay
                    title={bookingResult.success ? t("success") : t("error")}
                    message={bookingResult.message}
                    link="/booking"
                    linkTitle={t("gotobooking")}
                />
            ) : (
                arrivalData.length > 0 ? (
                    arrivalData.map((data, index) => (
                    <Paper key={data.id} className={classes.box} p="lg" radius="lg" shadow={theme.shadows.lg} style={{ marginBottom: index === 0 ? '20px' : '150px' }}>
                        <Modal opened={modalVisible} onClose={() => setModalVisible(false)} title={t("confcancel")} size="xs" radius="lg"  centered>
                            <Text size="sm" align="center">
                                {t("confirmunbook")}
                            </Text>
                            <Group position="center" style={{ marginTop: '20px' }}>
                                <Button onClick={handleDeleteConfirmed} color="green" bg={theme.colors.brand[3]} variant="filled">
                                    {t("confirm")}
                                </Button>
                                <Button onClick={() => setModalVisible(false)}  color="red" style={{ marginLeft: '10px' }}>
                                    {t("cancel")}
                                </Button>
                            </Group>
                        </Modal>
                        <Container size="xl">
                            <Grid>
                                <Col span={6}>
                                    <Image src="https://xr.ivao.aero/images/logos/2021/logo_small.svg" width={110}></Image>
                                </Col>
                                <Col span={5} >
                                    <Text color={theme.colors.brand[0]} size="xl" align="right" weight={700}>
                                        {data.ident}
                                    </Text>
                                </Col>
                                <Col span={1} >
                                    <ActionIcon color="red" size="md" variant="filled" onClick={() => handleDeleteConfirmation(data.id)}>
                                        <IconX size="1.325rem" />
                                    </ActionIcon>
                                </Col>
                            </Grid>
                            <Divider m="xs" />
                            <Grid>
                                <Col span={6}>
                                    <Text size="sm">Passenger:</Text>
                                    <Text size="lg" weight={600}>
                                        {data.bookedUser !== null && typeof data.bookedUser === 'object' ? (
                                            <>
                                                {data.bookedUser.name.first} ({data.bookedUser.id})
                                            </>
                                        ) : (
                                            'Unknown Passenger'
                                        )}
                                    </Text>
                                </Col>
                                <Col span={6} >
                                    <Text size="sm">Seat:</Text>
                                    <Text size="lg" weight={600}>
                                        Cockpit
                                    </Text>
                                </Col>
                            </Grid>
                            <Grid>
                                <Col span={6}>
                                    <Text size="sm">From:</Text>
                                    <Text size="lg" weight={600}>
                                        {data.icaoDep}
                                    </Text>
                                </Col>
                                <Col span={6} >
                                    <Text size="sm">To:</Text>
                                    <Text size="lg" weight={600}>
                                        {data.icaoArr}
                                    </Text>
                                </Col>
                            </Grid>
                            <Grid>
                                <Col span={6}>
                                    <Text size="sm">Date and time:</Text>
                                    <Text size="lg" weight={600}>
                                        {data.scheduleTime}
                                    </Text>
                                </Col>
                                <Col span={6} >
                                    <Text size="sm">Aircraft:</Text>
                                    <Text size="lg" weight={600}>
                                        {data.acftType}
                                    </Text>
                                </Col>
                            </Grid>
                        </Container>
                    </Paper>
                    ))
                ) : (
                    <Paper className={classes.box} p="lg" radius="lg" shadow={theme.shadows.lg}>
                        <Container size="xl">
                            <Group position="center">
                                <IconMoodCry color={theme.colors.brand[5]} size={40}></IconMoodCry>
                                <Text size="lg" weight={600} align="center">
                                    {t("nobooked")}
                                </Text>
                            </Group>
                            <Group position="center">
                                <Button onClick={() => navigate('/booking')} color={theme.colors.brand[0]}>{t("welcomeButton")}</Button>
                            </Group>
                        </Container>
                    </Paper>
                )
            )}

        </Container>
    );
};

export default Ticket;
