import React, {useEffect, useRef} from 'react';
import { useTranslation } from 'react-i18next';
import {Container, Center, Card, Text, Group, useMantineTheme} from '@mantine/core';
import { IconAlertTriangle } from "@tabler/icons-react";

const StarrySky: React.FC = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        let stars: HTMLDivElement[] = [];
        const header = document.querySelector('header');
        if (header) {
            header.style.background = 'transparent';
        }

        const createStar = () => {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDuration = `${Math.random() * 3 + 2}s`;
            star.style.animationDelay = `${Math.random() * 2}s`;
            containerRef.current?.appendChild(star);
            stars.push(star);
        };

        const createStars = () => {
            for (let i = 0; i < 500; i++) {
                createStar();
            }
        };

        const init = () => {
            createStars();
        };

        init();

        return () => {
            stars.forEach((star) => {
                containerRef.current?.removeChild(star);
            });
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none',
                background: 'black',
            }}
        >
            <style>
                {`
          .star {
            position: absolute;
            background: white;
            width: 2px;
            height: 2px;
            border-radius: 50%;
            pointer-events: none;
            opacity: 1;
            transform: translateX(-50%) translateY(-50%);
            animation: twinkling 3s infinite;
          }

          @keyframes twinkling {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0;
              transform: translateX(-50%) translateY(-50%);
            }
          }
        `}
            </style>
        </div>
    );
};

const NotFound: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div style={{ position: 'relative' }}>
            <StarrySky />
            <Container size="sm">
                <Center h="50%" mt="50%">
                    <Card bg="#fff" radius="md" style={{ padding: '20px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                        <Card.Section style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                            <Group position="center" grow>
                                <IconAlertTriangle color="#ff0000" size={24} style={{ marginRight: '10px' }} />
                                <Text size="lg" weight={700}>Произошла ошибка!</Text>
                            </Group>
                        </Card.Section>
                        <Text size="sm" color="dimmed">
                            Такой страницы нету
                        </Text>
                        <Text fw="400" size="sm" color="dimmed">
                            Хорошо, что у нас их ещё много
                        </Text>
                    </Card>
                </Center>
            </Container>
        </div>
    );
};

export default NotFound;
