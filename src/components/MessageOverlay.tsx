import React from 'react';
import {Button, Group, Image, Paper, Text, useMantineTheme} from '@mantine/core';
import loading from '../assets/image/loading_blue.svg';
import {MessagesType} from "../hooks/types";
import {useNavigate} from "react-router-dom";

export function MessageOverlay({ title, message, link, linkTitle }: MessagesType) {
    const theme = useMantineTheme()
    const navigate = useNavigate()
    const HandleNavigate = () => {
        navigate(link)
    };

    return (
        <Paper p={40} shadow={theme.shadows.lg} radius="md">
            <Image
                src={loading}
                alt="Logo"
                maw={150}
                mx="auto"
            />
                <Text size={25} fw={700} color={theme.colors.brand[0]} align="center">{title}</Text>
                <Text align="center">{message}</Text>
                <Group position="center" mt={5}>
                    <Button
                        bg={theme.colors.brand[0]}
                        onClick={() => {
                            HandleNavigate();
                        }}
                    >
                        {linkTitle}
                    </Button>
                </Group>
        </Paper>
    );
}
