import React, {useEffect, useMemo, useState} from 'react';
import {createStyles, Menu, rem, Text} from "@mantine/core";
import { IconLogout, IconUser} from "@tabler/icons-react";
import jwtDecode from 'jwt-decode';
import {DecodedTokenInt} from "../hooks/types";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

function useAuth() {
    const authToken = localStorage.getItem('authToken');

    return useMemo(() => {
        return authToken !== null;
    }, [authToken]);
}

function getTokenFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('token');
}

function removeTokenFromUrl() {
    if (window.history.replaceState) {
        const urlWithoutToken = window.location.protocol + '//' + window.location.host + window.location.pathname;
        window.history.replaceState({}, document.title, urlWithoutToken);
    }
}

function getDecodedToken(token: string): DecodedTokenInt | null {
    try {
        return jwtDecode<DecodedTokenInt>(token);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}

export const logOutButtonStyle = createStyles((theme) => ({
    link: {
        display: 'block',
        lineHeight: 1,
        padding: `${rem(8)} ${rem(12)}`,
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: '#fff',
        fontSize: theme.fontSizes.sm,
        fontWeight: 700,
        fontFamily: `Montserrat`,

        '&:hover': {
            color: theme.colors.brand[2],
            cursor: "pointer",
        },

        [theme.fn.smallerThan('sm')]: {
            borderRadius: 0,
            padding: theme.spacing.md,
        },
    },
}));


function LogoutButton() {
    const { classes } = logOutButtonStyle();
    const [decodedToken, setDecodedToken] = useState<DecodedTokenInt | null>(null);
    const navigate = useNavigate();

    const HandleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authTokenExpiration');

        navigate('/');
    };

    const HandleProfile = () => {
        navigate('/profile');
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

    const { t } = useTranslation();

    return (
        decodedToken ? (
            <Menu radius="lg" shadow="md" width={200}>
                <Menu.Target>
                    <Text className={classes.link}>{decodedToken.userData.name.first} {decodedToken.userData.id}</Text>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item icon={<IconUser size={14} />} onClick={HandleProfile}>{t("mybook")}</Menu.Item>
                    <Menu.Item color="red" icon={<IconLogout size={14} />} onClick={HandleLogout}>{t("logoutButton")}</Menu.Item>
                </Menu.Dropdown>
            </Menu>
        ) : null
    );
}

function Handler() {
    const isAuthenticated = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            const expiration = localStorage.getItem('authTokenExpiration');

            if (expiration && Date.now() > Number(expiration)) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('authTokenExpiration');
                navigate('/')
            }
        }
    }, [isAuthenticated]);

    return null;
}

export { Handler, useAuth, LogoutButton, getDecodedToken, getTokenFromUrl, removeTokenFromUrl };
