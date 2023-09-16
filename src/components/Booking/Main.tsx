import React from 'react';
import { Container } from '@mantine/core';
import Cards from "./components/Cards";
import arr from '../../assets/image/Arrival.svg';
import dep from '../../assets/image/Departure.svg';
import {BookingData} from "../../hooks/types";
import {useTranslation} from "react-i18next";

function BookingMain() {
    const { t } = useTranslation();
    const data: BookingData[] = [
        {
            image: arr,
            title: t('arrivalTitle'),
            category: t('ap1Title'),
            url: 'arrivals',
            url_text: t('bookButton'),
        },
        {
            image: dep,
            title: t('departureTitle'),
            category: t('ap1Title'),
            url: 'departures',
            url_text: t('bookButton'),
        },
    ];

    const slides = data.map((item) => (
        <Cards key={item.title} {...item} />
    ));

    return (
        <>
        <Container size="lg">
            {slides}
        </Container>
        </>
    );
}

export default BookingMain;
