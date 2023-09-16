import React, { useState, useEffect } from 'react';
import { TableSort } from './components/Table';
import { api } from '../../hooks/api';
import { SlotData } from "../../hooks/types";

function Arrival() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [arrivalData, setArrivalData] = useState<SlotData[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api('/rfe/airports/UUEE/slots/arrivals');
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

                    setArrivalData(formattedData);
                } else {
                    setError(true);
                }
            } catch (error) {
                console.error('Error fetching arrival data:', error);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return (
        <TableSort data={loading ? null : error ? [] : arrivalData} loading={loading} error={error} />
    );
}

export default Arrival;