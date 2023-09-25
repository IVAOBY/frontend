import React, { useEffect } from 'react';
import { Alert, Overlay, Button, Flex } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

interface ErrorOverlayProps {
    isLoading: boolean;
    message: string;
    onClose: () => void;
}

const ErrorOverlay: React.FC<ErrorOverlayProps> = ({ isLoading, message, onClose }) => {
    const navigate = useNavigate();

    const redirectToHome = () => {
        navigate('/');
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <Overlay zIndex={10000} fixed={true}>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Alert
                    color={isLoading ? 'blue' : 'red'}
                    bg="#fff"
                    title={isLoading ? 'Загрузка' : 'Ошибка'} // Добавить перевод
                    onClose={onClose}
                    style={{
                        width: '300px',
                        textAlign: 'center',
                    }}
                >
                    <Flex direction="column">
                        {message}
                        {!isLoading && (
                            <Button
                                variant="filled"
                                color={isLoading ? 'blue' : 'red'}
                                c="#fff"
                                onClick={redirectToHome}
                                style={{ marginTop: '1rem' }}
                            >
                                На главную
                            </Button>
                        )}
                    </Flex>
                </Alert>
            </div>
        </Overlay>
    );
};

export default ErrorOverlay;
