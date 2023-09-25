import {
    createStyles,
    Container,
    Text,
    Title,
    Card,
    rem,
    Image,
    Badge,
    Button,
    Flex,
    Group,
    SimpleGrid,
    Divider,
    Space, Grid
} from '@mantine/core';
import {IconAlertTriangle, IconRoad, IconInfoCircle, IconAirTrafficControl} from '@tabler/icons-react';
import React, {useEffect, useState} from "react";
import {api} from "../../hooks/api";

const useStyles = createStyles((theme) => ({
    card: {
        minWidth: rem(300),
        minHeight: rem(300)
    },
}));

interface Department {
    id: string;
    name: {
        en: string;
        ru: string;
    };
}

export function Airport() {
    const {classes, theme} = useStyles();
    const [departments, setDepartments] = useState<Department[]>([]);

    return (
        <Container size="lg">
            <Title ta="center" order={1} c={theme.colors.blue[9]} pt={50}>
                Аэропорт Минск-2
            </Title>
            <Flex
                mih={50}
                gap={{base: 'sm', md: 'xl'}}
                justify="center"
                align="flex-start"
                direction="row"
                wrap="wrap"
                mt="40px"
            >
                <Card
                    w="40%"
                    shadow="xl"
                    padding="xl"
                    radius="md"
                    style={{position: 'relative', background: theme.colors.gray[1]}}
                >
                    <Card.Section>
                        <Flex
                            mih={50}
                            bg="#0D2C99"
                            gap="xl"
                            justify="center"
                            align="center"
                            direction="row"
                            wrap="nowrap"
                        >
                            <IconInfoCircle color="#fff"></IconInfoCircle>
                            <Text
                                c="#fff"
                                fw="700"
                                size="xl"
                            >Общая информация</Text>
                        </Flex>
                    </Card.Section>
                    <Flex
                        gap="sm"
                        justify="center"
                        align="left"
                        direction="column"
                        wrap="wrap">

                        <Group><Title order={3}><Text span c="#0D2C99">Название:</Text></Title><Text
                            fw="500">Минск-2</Text></Group>
                        <Group><Title order={3}><Text span c="#0D2C99">ICAO:</Text></Title><Text
                            fw="500">UMMS</Text></Group>
                        <Group><Title order={3}><Text span c="#0D2C99">IATA:</Text></Title><Text
                            fw="500">MSQ</Text></Group>
                        <Group><Title order={3}><Text span c="#0D2C99">ВПП:</Text></Title><Text
                            fw="500">Нету</Text></Group>
                        <Group><Title order={3}><Text align="center" span c="#0D2C99">Превышение:</Text></Title><Text
                            align="center" fw="500">681ft</Text></Group>

                    </Flex>
                </Card>
            </Flex>
            <Flex
                w="100%"
                gap={{base: 'sm', md: 'xl'}}
                justify="center"
                align="center"
                direction="row"
                wrap="wrap"
                mt="20px"
            >
            <Card
                w="40%"
                shadow="xl"
                padding="xl"
                radius="md"
                style={{position: 'relative', background: theme.colors.gray[1]}}
            >
                <Card.Section>
                    <Flex
                        mih={50}
                        bg="#0D2C99"
                        gap="xl"
                        justify="center"
                        align="center"
                        direction="row"
                        wrap="nowrap"
                    >
                        <IconAirTrafficControl color="#fff"></IconAirTrafficControl>
                        <Text
                            c="#fff"
                            fw="700"
                            size="xl"
                        >Частоты</Text>
                    </Flex>
                </Card.Section>
                <Flex
                    gap="sm"
                    justify="center"
                    align="left"
                    direction="column"
                    wrap="wrap">

                    <Group><Title order={3}><Text span c="#0D2C99">Название:</Text></Title><Text
                        fw="500">Минск-2</Text></Group>
                    <Group><Title order={3}><Text span c="#0D2C99">ICAO:</Text></Title><Text
                        fw="500">UMMS</Text></Group>
                    <Group><Title order={3}><Text span c="#0D2C99">IATA:</Text></Title><Text
                        fw="500">MSQ</Text></Group>
                    <Group><Title order={3}><Text span c="#0D2C99">ВПП:</Text></Title><Text
                        fw="500">Нету</Text></Group>
                    <Group><Title order={3}><Text align="center" span c="#0D2C99">Превышение:</Text></Title><Text
                        align="center" fw="500">681ft</Text></Group>

                </Flex>
            </Card>
                <Card
                    w="40%"
                    shadow="xl"
                    padding="xl"
                    radius="md"
                    style={{position: 'relative', background: theme.colors.gray[1]}}
                >
                    <Card.Section>
                        <Flex
                            mih={50}
                            bg="#0D2C99"
                            gap="xl"
                            justify="center"
                            align="center"
                            direction="row"
                            wrap="nowrap"
                        >
                            <IconAlertTriangle color="#fff"></IconAlertTriangle>
                            <Text
                                c="#fff"
                                fw="700"
                                size="xl"
                            >NOTAMs</Text>
                        </Flex>
                    </Card.Section>
                    <Flex
                        gap="sm"
                        justify="center"
                        align="left"
                        direction="column"
                        wrap="wrap">

                        <Group><Title order={3}><Text span c="#0D2C99">Название:</Text></Title><Text
                            fw="500">Минск-2</Text></Group>
                        <Group><Title order={3}><Text span c="#0D2C99">ICAO:</Text></Title><Text
                            fw="500">UMMS</Text></Group>
                        <Group><Title order={3}><Text span c="#0D2C99">IATA:</Text></Title><Text
                            fw="500">MSQ</Text></Group>
                        <Group><Title order={3}><Text span c="#0D2C99">ВПП:</Text></Title><Text
                            fw="500">Нету</Text></Group>
                        <Group><Title order={3}><Text align="center" span c="#0D2C99">Превышение:</Text></Title><Text
                            align="center" fw="500">681ft</Text></Group>

                    </Flex>
                </Card>
            </Flex>
            <Flex
                w="100%"
                gap={{base: 'sm', md: 'xl'}}
                justify="space-between"
                align="flex-start"
                direction="row"
                wrap="wrap"
                mt="20px"
            >
                <Card
                    w={{base: '100%', md: '23%'}}
                    shadow="xl"
                    padding="xl"
                    radius="md"
                    style={{position: 'relative', background: theme.colors.gray[1]}}
                >
                    <Card.Section>
                        <Flex
                            mih={50}
                            bg="#0D2C99"
                            gap="xl"
                            justify="center"
                            align="center"
                            direction="row"
                            wrap="nowrap"
                        >
                            <IconRoad color="#fff"></IconRoad>
                            <Text
                                c="#fff"
                                fw="700"
                                size="xl"
                            >ВПП 31R</Text>
                        </Flex>
                    </Card.Section>
                    <Flex
                        gap="sm"
                        justify="center"
                        align="left"
                        direction="column"
                        wrap="wrap">

                        <Group><Title mt="sm" order={3}><Text span c="#0D2C99">Длина:</Text></Title><Text mt="sm"
                                                                                                          fw="500">121234</Text></Group>
                        <Group><Title order={3}><Text span c="#0D2C99">Ширина:</Text></Title><Text
                            fw="500">121234</Text></Group>
                        <Group><Title order={3}><Text span c="#0D2C99">Курс:</Text></Title><Text
                            fw="500">310&deg;</Text></Group>
                    </Flex>
                </Card>

                <Card
                    w={{base: '100%', md: '23%'}}
                    shadow="xl"
                    padding="xl"
                    radius="md"
                    style={{position: 'relative', background: theme.colors.gray[1]}}
                >
                    <Card.Section>
                        <Flex
                            mih={50}
                            bg="#0D2C99"
                            gap="xl"
                            justify="center"
                            align="center"
                            direction="row"
                            wrap="nowrap"
                        >
                            <IconRoad color="#fff"></IconRoad>
                            <Text
                                c="#fff"
                                fw="700"
                                size="xl"
                            >ВПП 13L</Text>
                        </Flex>
                    </Card.Section>
                    <Flex
                        gap="sm"
                        justify="center"
                        align="left"
                        direction="column"
                        wrap="wrap">

                        <Group><Title mt="sm" order={3}><Text span c="#0D2C99">Длина:</Text></Title><Text mt="sm"
                                                                                                          fw="500">121234</Text></Group>
                        <Group><Title order={3}><Text span c="#0D2C99">Ширина:</Text></Title><Text
                            fw="500">121234</Text></Group>
                        <Group><Title order={3}><Text span c="#0D2C99">Курс:</Text></Title><Text
                            fw="500">310&deg;</Text></Group>
                    </Flex>
                </Card>

                <Card
                    w={{base: '100%', md: '23%'}}
                    shadow="xl"
                    padding="xl"
                    radius="md"
                    style={{position: 'relative', background: theme.colors.gray[1]}}
                >
                    <Card.Section>
                        <Flex
                            mih={50}
                            bg="#0D2C99"
                            gap="xl"
                            justify="center"
                            align="center"
                            direction="row"
                            wrap="nowrap"
                        >
                            <IconRoad color="#fff"></IconRoad>
                            <Text
                                c="#fff"
                                fw="700"
                                size="xl"
                            >ВПП 31L</Text>
                        </Flex>
                    </Card.Section>
                    <Flex
                        gap="sm"
                        justify="center"
                        align="left"
                        direction="column"
                        wrap="wrap">

                        <Group><Title mt="sm" order={3}><Text span c="#0D2C99">Длина:</Text></Title><Text mt="sm"
                                                                                                          fw="500">121234</Text></Group>
                        <Group><Title order={3}><Text span c="#0D2C99">Ширина:</Text></Title><Text
                            fw="500">121234</Text></Group>
                        <Group><Title order={3}><Text span c="#0D2C99">Курс:</Text></Title><Text
                            fw="500">310&deg;</Text></Group>
                    </Flex>
                </Card>

                <Card
                    w={{base: '100%', md: '23%'}}
                    shadow="xl"
                    padding="xl"
                    radius="md"
                    style={{position: 'relative', background: theme.colors.gray[1]}}
                >
                    <Card.Section>
                        <Flex
                            mih={50}
                            bg="#0D2C99"
                            gap="xl"
                            justify="center"
                            align="center"
                            direction="row"
                            wrap="nowrap"
                        >
                            <IconRoad color="#fff"></IconRoad>
                            <Text
                                c="#fff"
                                fw="700"
                                size="xl"
                            >ВПП 13R</Text>
                        </Flex>
                    </Card.Section>
                    <Flex
                        gap="sm"
                        justify="center"
                        align="left"
                        direction="column"
                        wrap="wrap">

                        <Group><Title mt="sm" order={3}><Text span c="#0D2C99">Длина:</Text></Title><Text mt="sm"
                                                                                                          fw="500">121234</Text></Group>
                        <Group><Title order={3}><Text span c="#0D2C99">Ширина:</Text></Title><Text
                            fw="500">121234</Text></Group>
                        <Group><Title order={3}><Text span c="#0D2C99">Курс:</Text></Title><Text
                            fw="500">310&deg;</Text></Group>
                    </Flex>
                </Card>
            </Flex>
        </Container>

    );
}
