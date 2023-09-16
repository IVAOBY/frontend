import React, { useState, useEffect } from 'react';
import {
    useMantineTheme,
    Container,
    Notification,
} from '@mantine/core';
import { TableSort } from './components/Table';
import { api } from '../../hooks/api';
import { SlotData } from "../../hooks/types";

function Departure() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [departureData, setDepartureData] = useState<SlotData[]>([]);
    const theme = useMantineTheme();

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api('/rfe/airports/UUEE/slots/departures');
                if (response) {
                    const formattedData = response.map((item: any) => ({
                        id: item.id,
                        ident: item.ident,
                        icaoDep: item.icaoDep,
                        icaoArr: item.icaoArr,
                        acftType: item.acftType,
                        scheduleTime: new Date(item.scheduleTime).toLocaleTimeString('en-US', {
                            timeZone: 'UTC',
                            hour12: false,
                            hour: '2-digit',
                            minute: '2-digit',
                        }),
                        bookedUser: item.bookedUser,
                    }));

                    setDepartureData(formattedData);
                } else {
                    setError(true);
                }
            } catch (error) {
                console.error('Error fetching departure data:', error);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <>
            <Container size="lg">
                {loading ? (
                    <TableSort data={null} loading={true} error={false} />
                ) : error ? (
                    <>
                        <TableSort data={[]} loading={false} error={true} />
                        <Notification
                            title="Error"
                            color="red"
                            style={{ position: 'fixed', bottom: theme.spacing.md, right: theme.spacing.md }}
                        >
                            Error fetching data
                        </Notification>
                    </>
                ) : (
                    <TableSort data={departureData} loading={false} error={false} />
                )}
            </Container>
        </>
    );
}

export default Departure;
