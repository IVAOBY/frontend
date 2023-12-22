import {Badge, Container, createStyles, Paper, rem, Table, Text, Title,} from '@mantine/core';
import {useApi} from '../../context/ApiContext';
import {useEffect, useState} from 'react';
import {notifications} from '@mantine/notifications';
import {IconCircleX} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';

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
    subtitle: {
        color: theme.colors.lightBlue[9],
    },
}));

interface Unrestrictions {
    id: number;
    airport: string;
    vehicles: string;
    unrestricted_vids: string[];
}

export function Vehicles() {
    const {classes} = useStyles();
    const {t} = useTranslation();
    const {id} = useParams();
    const api = useApi();

    const [vehiclesData, setVehiclesData] = useState<Unrestrictions[] | null>(null);

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

        api(`/vehicles`)
            .then((response: Unrestrictions[]) => {
                if (Array.isArray(response) && response.every((item) => typeof item === 'object')) {
                    setVehiclesData(response);
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
            .catch((error: any) => {
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
            <Title order={2} className={classes.title} ta="center" mt="sm">
                {t('vehicles.title')}
            </Title>
            <Paper shadow={'lg'} radius={'lg'} bg="#fff" p={'lg'} mt={rem(16)}>
                <Title order={2} className={classes.subtitle}>
                    {t('vehicles.airports')}
                </Title>
                <Text size={15}>
                    {t('vehicles.description')}
                </Text>
                <Table mt={15} mb={15} striped withBorder withColumnBorders captionSide="bottom">
                    <caption>{t('vehicles.caption')}</caption>
                    <thead>
                    <tr>
                        <th>{t('vehicles.airport')}</th>
                        <th>{t('vehicles.title')}</th>
                        <th>{t('vehicles.atcreq')}</th>
                        <th>{t('vehicles.driverreq')}</th>
                        <th>{t('vehicles.vids')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {vehiclesData?.map((vehicle) => (
                        <tr key={vehicle.id}>
                            <td>{vehicle.airport}</td>
                            <td>{vehicle.vehicles}</td>
                            <td>AS3</td>
                            <td>{t('vehicles.training')}</td>
                            <td>
                                {vehicle.unrestricted_vids.map((vid) => (
                                    <a key={vid} target={"_blank"} href={"https://www.ivao.aero/Member.aspx?Id=" + vid}
                                       style={{marginLeft: 2}}>
                                        <Badge color="green" mb={2} key={vid}>{vid}</Badge>
                                    </a>
                                ))}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Paper>
        </Container>
    );
}