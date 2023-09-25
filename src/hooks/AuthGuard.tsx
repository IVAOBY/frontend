import React, { useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { api } from './api';
import ErrorOverlay from '../components/elements/errors/ErrorAlert';

const AuthGuard: React.FC<{ children?: ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const authToken = localStorage.getItem('authToken');
    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!authToken) {
            setIsTokenValid(false);
            setError('Отсутствует токен. Пожалуйста, войдите заново.');
        } else {
            const urlWithToken = `/auth/verify-token?token=${encodeURIComponent(authToken)}`;

            api(urlWithToken, 'v3', 'GET')
                .then(response => {
                    const responseString = response.toString();

                    if (responseString.trim() === '<body>false</body>') {
                        setIsTokenValid(false);
                        setError('Токен невалиден. Пожалуйста, войдите заново.');
                    } else {
                        setIsTokenValid(true);
                    }
                })
                .catch(error => {
                    console.error('Ошибка при проверке токена:', error);
                    setIsTokenValid(false);
                    setError('Произошла ошибка при проверке токена. Пожалуйста, повторите попытку.');
                });
        }
    }, [authToken]);

    const isLoading = isTokenValid === null;

    useEffect(() => {
        if (!isLoading && !isTokenValid) {
            navigate('/');
        }
    }, [isLoading, isTokenValid, navigate]);

    if (!isTokenValid) {
        return null;
    }

    if (isLoading) {
        return <ErrorOverlay isLoading={isLoading} message="Загрузка..." onClose={() => {}} />;
    }

    return <>{children}</>;
};

export default AuthGuard;
