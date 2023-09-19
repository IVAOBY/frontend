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
    Group,
    SimpleGrid,
    Divider,
    Space, Grid
} from '@mantine/core';
import {IconAdjustments, IconIdBadge2, IconMailOpened} from '@tabler/icons-react';
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
<Container size={"lg"}>
        <Title ta={"center"} order={1} c={theme.colors.blue[9]} pt={50}>Аэропорт Минск-2</Title>
    <Grid mt={40} gutter={5}>
        <Grid.Col span={4}>
            <Card shadow="xl" padding="xl" radius="md" style={{ position: 'relative', background: theme.colors.gray[1] }}>
                <Card.Section>
                    <div
                        style={{
                            background: '#0D2C99',
                        }}
                    >
                        <Text ta={"center"} c="#fff" size="xl" weight={500} style={{ marginBottom: '16px' }}>
                            Информация
                        </Text>
                    </div>
                </Card.Section>
                <Title order={3}><Text span c="blue" inherit>Название:</Text></Title><Text span inherit>Международный Аэропорт Минск-2</Text>
                <Group><Title order={3}><Text span c="blue" inherit>ICAO:</Text></Title><Text inherit>UMMS</Text></Group>
                <Group><Title order={3}><Text span c="blue" inherit>IATA:</Text></Title><Text span inherit>MSQ</Text></Group>
                <Group><Title order={3}><Text span c="blue" inherit>ВПП:</Text></Title><Text span inherit>Нету</Text></Group>
                <Group><Title order={3}><Text span c="blue" inherit>Превышение:</Text></Title><Text span inherit>681ft</Text></Group>

            </Card>
        </Grid.Col>
        <Grid.Col span={5} offset={2}>
            <Card shadow="xl" padding="xl" radius="md">
                <Container>
                    <Text size="xl" weight={500} style={{ marginBottom: '16px' }}>
                        Заглавие: Information
                    </Text>
                    <Text>
                        Name: Bydgoszcz Ignecy Jan Paderewski
                        <br />
                        ICAO: EPBY
                        <br />
                        IATA: BZG
                        <br />
                        Runways: 08/26 | 2500m x 60m
                        <br />
                        Elevation: 236ft
                    </Text>
                </Container>
            </Card>
        </Grid.Col>
    </Grid>

</Container>
    );
}
