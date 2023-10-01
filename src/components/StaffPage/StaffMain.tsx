import {
    createStyles,
    Container,
    Text,
    Title,
    Paper,
    rem,
    Image,
    Grid,
    Flex,
    Group,
    ActionIcon,
    SimpleGrid
} from '@mantine/core';
import {IconAdjustments, IconIdBadge2, IconMailOpened} from '@tabler/icons-react';
import React, {useEffect, useState} from "react";
import {api} from "../../hooks/api";
import AuthGuard from "../../hooks/AuthGuard";

const useStyles = createStyles((theme) => ({
    card: {
        minWidth: rem(300),
        minHeight: rem(300)
    },
}));

interface Department {
    id: string;
    name: string;
    email: string;
}

interface Position {
    departmentId: string;
    id: string;
    name: {
        en: string;
        ru: string | null;
    };
    prefix: string;
    order: number;
    userId: number;
    description: {
        en: string;
        ru: string | null;
    } | null;
    is_vacant: number; // new property
}


export function StaffMain() {
    const {classes, theme} = useStyles();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);

    const handleEmailClick = (email: string) => {
        window.location.href = `mailto:${email}`;
    };

    useEffect(() => {
        api("/staff-departments")
            .then(response => {
                if (response && Array.isArray(response)) {
                    setDepartments(response);
                } else {
                    console.error("Error: Unexpected API response structure");
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });

        api('/staff-positions')
            .then((response) => {
                if (response && Array.isArray(response)) {
                    const positions: Position[] = response.map((positionData) => ({
                        departmentId: positionData.departmentId,
                        id: positionData.id,
                        name: positionData.name,
                        prefix: positionData.prefix,
                        order: positionData.order,
                        userId: positionData.userId,
                        description: positionData.description,
                        is_vacant: positionData.is_vacant,
                    }));
                    setPositions(positions);
                } else {
                    console.error('Error: Unexpected API response structure');
                }
            })
            .catch((error) => {
                console.error('Error fetching job positions:', error);
            });
    }, []);

    return (
        <Container size={"xl"}>
            <Container>
                <Title order={1} c={theme.colors.blue[9]} pt={50}>Руководство дивизиона</Title>
            </Container>
            <Container size={"xl"}>
                {departments.map((department, index) => (
                    <div key={index}>
                        <Flex direction="column" align="center">
                            <Title key={index} ta="center" order={2} c={theme.colors.blue[9]} pt={40}>
                                {department.name}
                            </Title>
                            <ActionIcon
                                variant="filled"
                                color={theme.colors.blue[9]}
                                size="lg"
                                aria-label="Send Email"
                                onClick={() => handleEmailClick(department.email)}
                                mt={10}
                            >
                                <IconMailOpened style={{ width: "60%", height: "60%" }} color="white" stroke={1.5} />
                            </ActionIcon>

                            <Flex
                                id="staff-grid"
                                mt={40}
                                gap="md"
                                justify="center"
                                align="center"
                                direction="row"
                                wrap="wrap"
                            >
                                {positions
                                    .filter(
                                        (position) =>
                                            position.departmentId === department.id &&
                                            (position.userId !== null || position.is_vacant === 1)
                                    )
                                    .sort((a, b) => {
                                        if (a.userId === null && b.userId !== null) {
                                            return 1;
                                        } else if (a.userId !== null && b.userId === null) {
                                            return -1;
                                        } else {
                                            return a.order - b.order;
                                        }
                                    })
                                    .map((position, positionIndex) => (
                                        <Paper className={classes.card} shadow={"lg"} p={"xl"} radius="lg" key={positionIndex}>
                                            <Flex
                                                direction={"column"}
                                                justify={"center"}
                                                align={"center"}
                                            >
                                                <Image
                                                    radius={100}
                                                    maw={150}
                                                    src={position.userId ? `https://xr.ivao.aero/images/staff_photo/${position.userId}.jpg` : 'https://xr.ivao.aero/images/staff_photo/vacant.png'}
                                                />
                                                <Title order={3} color={theme.colors.blue[9]} mt={20}>
                                                    {position.userId ? position.userId : "Вакантно"}
                                                </Title>
                                                <Text size={14} fw={600} c={theme.colors.gray[7]}>
                                                    {position.prefix}-{position.id}
                                                </Text>
                                                <Flex
                                                    gap={10}
                                                    mt={40}
                                                >
                                                    <ActionIcon
                                                        component="a"
                                                        variant="filled"
                                                        color={theme.colors.blue[9]}
                                                        size="lg"
                                                        radius="xl"
                                                        aria-label="MAIL IVAO"
                                                        href={`mailto:${position.prefix}-${position.id}@ivao.aero`}
                                                        target="_blank"
                                                    >
                                                        <IconMailOpened style={{ width: "60%", height: "60%" }} color="white" stroke={1.5} />
                                                    </ActionIcon>
                                                    <ActionIcon
                                                        component="a"
                                                        variant="filled"
                                                        color={theme.colors.blue[9]}
                                                        size="lg"
                                                        radius="xl"
                                                        aria-label="IVAO"
                                                        href={`https://www.ivao.aero/staff/details.asp?Id=${position.prefix}-${position.id}`}
                                                        target="_blank"
                                                    >
                                                        <IconIdBadge2 style={{ width: "60%", height: "60%" }} color="white" stroke={1.5} />
                                                    </ActionIcon>
                                                </Flex>
                                            </Flex>
                                        </Paper>
                                    ))}
                            </Flex>
                        </Flex>
                    </div>
                ))}
            </Container>
        </Container>
    );
}