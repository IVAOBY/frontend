import React, { useEffect, useState } from 'react';
import {
    createStyles,
    Table,
    ScrollArea,
    Group,
    Text,
    Button,
    TextInput,
    rem,
    useMantineTheme,
    Container,
} from '@mantine/core';
import { keys } from '@mantine/utils';
import { api } from '../../../hooks/api';
import { getDecodedToken, useAuth } from '../../Handler';
import { DecodedTokenInt } from '../../../hooks/types';
import { MessageOverlay } from '../../MessageOverlay';
import {useTranslation} from "react-i18next";

const useStyles = createStyles((theme) => ({
    th: {
        padding: '0 !important',
        backgroundColor: theme.colors.brand[0],
        '&:first-of-type': {
            borderStartStartRadius: theme.radius.lg,
            '&:hover': {
                borderStartStartRadius: theme.radius.lg,
            },
        },

        '&:last-of-type': {
            borderStartEndRadius: theme.radius.lg,
            '&:hover': {
                borderStartEndRadius: theme.radius.lg,
            },
        },

        '&:hover': {
            backgroundColor: theme.colors.brand[1],
            borderStartStartRadius: '0',
        },
    },

    td: {
        backgroundColor:  "#eaeaea",
    },

    tr: {
        '&:last-child': {
            borderBottomLeftRadius: theme.radius.lg,
        },
    },

    control: {
        width: '100%',
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    },

    icon: {
        width: rem(21),
        height: rem(21),
        borderRadius: rem(21),
    },

    test: {
        backgroundColor: theme.colors.brand[0],
    },

    donemessage: {
        padding: theme.spacing.lg,
    },

    roundedBottomCell: {
        backgroundColor:  "#eaeaea",
        borderBottomRightRadius: theme.radius.lg,
    },
    roundedBottomCellLeft: {
        backgroundColor:  "#eaeaea",
        borderBottomLeftRadius: theme.radius.lg,
    },
}));

interface RowData {
    id: number;
    ident: string;
    icaoDep: null | string;
    icaoArr: null | string;
    acftType: string;
    scheduleTime: string;
    bookedUser: null | number | { id: number; name: { first: string } };
}

interface TableSortProps {
    data: RowData[] | null;
    loading: boolean;
    error: boolean;
}

interface ThProps {
    children: React.ReactNode;
}

function Th({ children }: ThProps) {
    const { classes } = useStyles();
    return (
        <th className={classes.th}>
                <Group position="apart" className={classes.control}>
                    <Text fw={500} fz="sm" color="#fff">
                        {children}
                    </Text>
                </Group>
        </th>
    );
}

function filterData(data: RowData[], search: string) {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
        keys(data[0]).some((key) => item[key]?.toString().toLowerCase().includes(query))
    );
}

export function TableSort(props: TableSortProps) {
    const [search, setSearch] = useState('');
    const filteredData = filterData(props.data || [], search);
    const [decodedToken, setDecodedToken] = useState<DecodedTokenInt | null>(null);
    const theme = useMantineTheme();
    const { classes } = useStyles();
    const [bookingResult, setBookingResult] = useState<{ success: boolean; message: string } | null>(null);
    const [confirmBooking, setConfirmBooking] = useState<number | null>(null);
    const isAuthenticated = useAuth();
    const { t } = useTranslation();

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        setSearch(value);
    };

    const handleBooking = async (row: RowData) => {
        if (confirmBooking === row.id) {
            try {
                try {
                    if (row.bookedUser === null) {
                        await api(`/rfe/slots/${row.id}/book`, 'v3', 'POST');
                        setBookingResult({ success: true, message: t("booked") });
                    } else if (
                        typeof row.bookedUser === 'object' &&
                        'id' in row.bookedUser &&
                        row.bookedUser.id === decodedToken?.userData.id
                    ) {
                        await api(`/rfe/slots/${row.id}/unbook`, 'v3', 'POST');
                        setBookingResult({ success: true, message: t("unbooked") });
                    }
                } catch (error) {
                    setBookingResult({ success: false, message: t("errorbookunbook") });
                    console.error('Error booking/unbooking slot:', error);
                }
                setConfirmBooking(null);
            } catch (error) {
                setBookingResult({ success: false, message: t("errorbookunbook") });
                console.error('Error booking/unbooking slot:', error);
            }
        } else {
            setConfirmBooking(row.id);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const decoded = getDecodedToken(token);
                setDecodedToken(decoded);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    const rows = filteredData.map((row, index) => {
        const isLastRow = index === filteredData.length - 1;
        return (
            <tr key={row.id}>
                <td className={isLastRow ? classes.roundedBottomCellLeft : classes.td}>{row.ident}</td>
                <td className={classes.td}>{row.icaoDep}</td>
                <td className={classes.td}>{row.icaoArr}</td>
                <td className={classes.td}>{row.acftType}</td>
                <td className={classes.td}>{row.scheduleTime}</td>
                <td className={isLastRow ? classes.roundedBottomCell : classes.td}>
                    <Button
                        style={{
                            backgroundColor: row.bookedUser === null ? theme.colors.brand[3] : theme.colors.brand[5],
                            color: 'white',
                            ...(row.bookedUser !== null &&
                                typeof row.bookedUser === 'object' &&
                                'id' in row.bookedUser &&
                                row.bookedUser.id === (decodedToken?.userData.id ?? -1) && { backgroundColor: confirmBooking === row.id ? theme.colors.red[7] : theme.colors.brand[7] }),
                        }}
                        onClick={() => handleBooking(row)}
                        disabled={!isAuthenticated || (row.bookedUser !== null && typeof row.bookedUser === 'object' && 'id' in row.bookedUser && row.bookedUser.id !== (decodedToken?.userData.id ?? -1))}
                    >
                        {confirmBooking === row.id
                            ? row.bookedUser !== null && typeof row.bookedUser === 'object' && 'id' in row.bookedUser
                                ? row.bookedUser.id === (decodedToken?.userData.id ?? -1)
                                    ? t('bcuButton')
                                    : t('bcButton')
                                : t('bcButton')
                            : row.bookedUser !== null && typeof row.bookedUser === 'object' && 'id' in row.bookedUser
                                ? row.bookedUser.id === (decodedToken?.userData.id ?? -1)
                                    ? t('bdButtonU')
                                    : `${t('bdButton')} ${row.bookedUser.id}`
                                : t('bButton')}
                    </Button>
                </td>
            </tr>
        );
    });

    return (
            <Container size="lg">
                {bookingResult ? (
                    <MessageOverlay title={bookingResult.success ? t("success") : t("error")} message={bookingResult.message} link="/profile" linkTitle={t("gotoprofile")} />
                ) : (
                    <>
                        <TextInput
                            placeholder={t('searchField')}
                            mb="md"
                            value={search}
                            onChange={handleSearchChange}
                        />
                            <Table
                                horizontalSpacing="md"
                                verticalSpacing="xs"
                                mb={120}
                                miw={960}
                                sx={{ tableLayout: 'auto', width: '100%' }}
                            >
                            <thead>
                                <tr>
                                    <Th>{t("identifier")}</Th>
                                    <Th>{t("icaoDep")}</Th>
                                    <Th>{t("icaoArr")}</Th>
                                    <Th>{t("aircraft")}</Th>
                                    <Th>{t("slot")}</Th>
                                    <Th>{t("status")}</Th>
                                </tr>
                            </thead>
                            <tbody>
                            {props.loading ? (
                                <tr>
                                    <td colSpan={5}>
                                        <Text weight={500} align="center">
                                            {t("loading")}
                                        </Text>
                                    </td>
                                </tr>
                            ) : props.error ? (
                                <tr>
                                    <td colSpan={5}>
                                        <Text weight={500} align="center">
                                            {t("errorfetch")}
                                        </Text>
                                    </td>
                                </tr>
                            ) : props.data && props.data.length > 0 ? (
                                rows
                            ) : (
                                <tr>
                                    <td colSpan={5}>
                                        <Text weight={500} align="center">
                                            {t("notfing")}
                                        </Text>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                    </>
                )}
            </Container>
    );
}