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

export function StaffMain() {
    const { classes, theme } = useStyles();
    const [departments, setDepartments] = useState<Department[]>([]);

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
    }, []);

    return (
        <Container size={"lg"}>
            <Container>
                <Title order={1} c={theme.colors.blue[9]} pt={50}>Руководство дивизиона</Title>
            </Container>
            <Container>
                {departments.map((department, index) => (
                    <Title key={index} ta="center" order={2} c={theme.colors.blue[9]} pt={50}>
                        {department.name.en}
                    </Title>
                ))}
                <SimpleGrid
                    id="staff-grid"
                    cols={2}
                    mt={40}
                >
                    <Paper className={classes.card} shadow={"lg"} p={"xl"} radius="lg">
                        <Flex
                            direction={"column"}
                            justify={"center"}
                            align={"center"}
                        >
                            <Image
                                radius={100}
                                maw={150}
                                src="https://media.discordapp.net/attachments/757343581408329729/1153350802551885944/644558.jpg"
                            />
                            <Title order={3} color={theme.colors.blue[9]} mt={20}>Mikich Kudrautsau</Title>
                            <Text size={14} fw={600} c={theme.colors.gray[7]}>BY-DIR</Text>
                            <Flex
                                gap={10}
                                mt={40}
                            >
                                <ActionIcon variant="filled" color={theme.colors.blue[9]} size="lg" radius="xl" aria-label="Settings">
                                    <IconMailOpened style={{ width: '60%', height: '60%' }} color="white" stroke={1.5} />
                                </ActionIcon>
                                <ActionIcon variant="filled" color={theme.colors.blue[9]} size="lg"  radius="xl" aria-label="Settings">
                                    <IconIdBadge2 style={{ width: '60%', height: '60%' }} color="white" stroke={1.5} />
                                </ActionIcon>
                            </Flex>
                        </Flex>
                    </Paper>
                    <Paper className={classes.card} shadow={"lg"} p={"xl"} radius="lg">
                        <Flex
                            direction={"column"}
                            justify={"center"}
                            align={"center"}
                        >
                            <Image
                                radius={100}
                                maw={150}
                                src="https://xr.ivao.aero/images/staff_photo/646135.jpg"
                            />
                            <Title order={3} color={theme.colors.blue[9]} mt={20}>Alexander Nazarenko</Title>
                            <Text size={14} fw={600} c={theme.colors.gray[7]}>BY-ADIR</Text>
                            <Flex
                                gap={10}
                                mt={40}
                            >
                                <ActionIcon variant="filled" color={theme.colors.blue[9]} size="lg" radius="xl" aria-label="Settings">
                                    <IconMailOpened style={{ width: '60%', height: '60%' }} color="white" stroke={1.5} />
                                </ActionIcon>
                                <ActionIcon variant="filled" color={theme.colors.blue[9]} size="lg"  radius="xl" aria-label="Settings">
                                    <IconIdBadge2 style={{ width: '60%', height: '60%' }} color="white" stroke={1.5} />
                                </ActionIcon>
                            </Flex>
                        </Flex>
                    </Paper>
                </SimpleGrid>
            </Container>
            <Container>
                <Title ta="center" order={2} c={theme.colors.blue[9]} pt={50} >ATC Operation</Title>
                <SimpleGrid
                    id="staff-grid"
                    cols={3}
                    spacing={"md"}
                    mt={40}
                >
                    <Paper className={classes.card} shadow={"lg"} p={"xl"} radius="lg">
                        <Flex
                            direction={"column"}
                            justify={"center"}
                            align={"center"}
                        >
                            <Image
                                radius={100}
                                maw={150}
                                src="https://media.discordapp.net/attachments/757343581408329729/1153350802551885944/644558.jpg"
                            />
                            <Title order={3} color={theme.colors.blue[9]} mt={20}>Mikich Kudrautsau</Title>
                            <Text size={14} fw={600} c={theme.colors.gray[7]}>BY-AOC</Text>
                            <Flex
                                gap={10}
                                mt={40}
                            >
                                <ActionIcon variant="filled" color={theme.colors.blue[9]} size="lg" radius="xl" aria-label="Settings">
                                    <IconMailOpened style={{ width: '60%', height: '60%' }} color="white" stroke={1.5} />
                                </ActionIcon>
                                <ActionIcon variant="filled" color={theme.colors.blue[9]} size="lg"  radius="xl" aria-label="Settings">
                                    <IconIdBadge2 style={{ width: '60%', height: '60%' }} color="white" stroke={1.5} />
                                </ActionIcon>
                            </Flex>
                        </Flex>
                    </Paper>
                    <Paper className={classes.card} shadow={"lg"} p={"xl"} radius="lg">
                        <Flex
                            direction={"column"}
                            justify={"center"}
                            align={"center"}
                        >
                            <Image
                                radius={100}
                                maw={150}
                                src="https://xr.ivao.aero/images/staff_photo/646135.jpg"
                            />
                            <Title order={3} color={theme.colors.blue[9]} mt={20}>Alexander Nazarenko</Title>
                            <Text size={14} fw={600} c={theme.colors.gray[7]}>BY-AOAC</Text>
                            <Flex
                                gap={10}
                                mt={40}
                            >
                                <ActionIcon variant="filled" color={theme.colors.blue[9]} size="lg" radius="xl" aria-label="Settings">
                                    <IconMailOpened style={{ width: '60%', height: '60%' }} color="white" stroke={1.5} />
                                </ActionIcon>
                                <ActionIcon variant="filled" color={theme.colors.blue[9]} size="lg"  radius="xl" aria-label="Settings">
                                    <IconIdBadge2 style={{ width: '60%', height: '60%' }} color="white" stroke={1.5} />
                                </ActionIcon>
                            </Flex>
                        </Flex>
                    </Paper>
                    <Paper className={classes.card} shadow={"lg"} p={"xl"} radius="lg">
                        <Flex
                            direction={"column"}
                            justify={"center"}
                            align={"center"}
                        >
                            <Image
                                radius={100}
                                maw={150}
                                src="https://xr.ivao.aero/images/staff_photo/646135.jpg"
                            />
                            <Title order={3} color={theme.colors.blue[9]} mt={20}>Alexander Nazarenko</Title>
                            <Text size={14} fw={600} c={theme.colors.gray[7]}>BY-AOAC</Text>
                            <Flex
                                gap={10}
                                mt={40}
                            >
                                <ActionIcon variant="filled" color={theme.colors.blue[9]} size="lg" radius="xl" aria-label="Settings">
                                    <IconMailOpened style={{ width: '60%', height: '60%' }} color="white" stroke={1.5} />
                                </ActionIcon>
                                <ActionIcon variant="filled" color={theme.colors.blue[9]} size="lg"  radius="xl" aria-label="Settings">
                                    <IconIdBadge2 style={{ width: '60%', height: '60%' }} color="white" stroke={1.5} />
                                </ActionIcon>
                            </Flex>
                        </Flex>
                    </Paper>
                </SimpleGrid>
            </Container>
        </Container>

    );
}
