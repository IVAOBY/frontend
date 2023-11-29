import React, {
    createContext,
    useState,
    useEffect,
    useCallback
} from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import jwtDecode from "jwt-decode";
import {removeTokenFromUrl} from "../components/Handler";
import {notifications} from "@mantine/notifications";
import {IconCircleX} from "@tabler/icons-react";
import {DecodedTokenInt} from "../hooks/types";

interface AuthProviderProps {
    children: React.ReactNode;
}

interface AuthContextProps {
    signed: boolean;
    token: string;
    decodedToken: DecodedTokenInt | null;
    signIn: (ivaoToken: string) => Promise<void>;
    signOut: () => void;
    refreshToken: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
    signed: false,
    token: "",
    decodedToken: null,
    signIn: (_: string) => Promise.reject(),
    signOut: () => { },
    refreshToken: () => { }
});

export function AuthProvider({ children }: AuthProviderProps ) {
    const location = useLocation();
    const navigate = useNavigate();
    const [token, setToken] = useState<string>(localStorage.getItem("token") || "");
    const [decodedToken, setDecodedToken] = useState<DecodedTokenInt | null>(null);

    const signIn = useCallback(async () => {
        try {
            const urlSearchParams = new URLSearchParams(window.location.search);
            const tokenFromUrl = urlSearchParams.get('token');

            //Добавить перевод
            if (token) {
                removeTokenFromUrl();
                notifications.show({
                    id: 'auth-already',
                    color: 'red',
                    title: 'Ошибка!',
                    message: 'Вы уже авторизированы на сайте!',
                    radius: 'lg',
                    icon: <IconCircleX />,
                    withCloseButton: true,
                    autoClose: 3000,
                });
                return;
            }

            if (tokenFromUrl) {
                localStorage.setItem("token", tokenFromUrl);

                removeTokenFromUrl();

                setToken(tokenFromUrl);

                return;
            }

        } catch (error) {
            console.error('Ошибка при аутентификации:', error);
        }
    }, []);

    const signOut = useCallback(() => {
        localStorage.removeItem("token");
        setToken("");
    }, []);

    const refreshToken = useCallback(() => {
        signOut();
        navigate("/", { state: { from: location } });
    }, [navigate, signOut, location]);

    useEffect(() => {
        if (!token) {
            setDecodedToken(null);
            return;
        }

        const currentTimestampSec = Math.floor(Date.now() / 1000);
        const decoded = jwtDecode<DecodedTokenInt>(token);

        if (currentTimestampSec > decoded.exp) {
            refreshToken();
        } else {
            const mappedToken: DecodedTokenInt = {
                iat: decoded.iat,
                exp: decoded.exp,
                userData: decoded.userData,
            };

            setDecodedToken(mappedToken);
        }
    }, [refreshToken, token]);

    return (
        <AuthContext.Provider
            value={{
                signIn,
                signOut,
                refreshToken,
                signed: !!token,
                token,
                decodedToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
