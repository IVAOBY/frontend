import React, {
    createContext,
    useState,
    useEffect,
    useCallback
} from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import jwtDecode from "jwt-decode";
import {removeTokenFromUrl} from "../components/Handler";

interface AuthProviderProps {
    children: React.ReactNode;
}

interface AuthContextProps {
    signed: boolean;
    token: string;
    signIn: (ivaoToken: string) => Promise<void>;
    signOut: () => void;
    refreshToken: () => void;
}

interface TokenData {
    iat: number;
    exp: number;
}

export const AuthContext = createContext<AuthContextProps>({
    signed: false,
    token: "",
    signIn: (_: string) => Promise.reject(),
    signOut: () => { },
    refreshToken: () => { }
});

export function AuthProvider({ children }: AuthProviderProps ) {
    const location = useLocation();
    const navigate = useNavigate();
    const [token, setToken] = useState<string>(localStorage.getItem("token") || "");

    const signIn = useCallback(async () => {
        try {
            const urlSearchParams = new URLSearchParams(window.location.search);
            const tokenFromUrl = urlSearchParams.get('token');

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
            return;
        }

        const currentTimestampSec = Math.floor(Date.now() / 1000);
        const { exp } = jwtDecode<TokenData>(token);

        if (currentTimestampSec > exp) {
            refreshToken();
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
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
