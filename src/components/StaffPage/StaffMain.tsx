import {
    createStyles,
    Container,
    Text,
    Title,
    Paper,
    rem,
    Image,
    Flex,
    ActionIcon,
    Tooltip
} from '@mantine/core';
import {
    IconCircleX,
    IconIdBadge2,
    IconMailOpened,
} from '@tabler/icons-react';
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {notifications} from "@mantine/notifications";
import {useApi} from "../../context/ApiContext";

const useStyles = createStyles((theme) => ({
    title: {
        fontSize: rem(34),
        fontWeight: 800,
        color: theme.colors.blue[9],
        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(24),
        },
        '&::after': {
            content: '""',
            display: 'block',
            backgroundColor: theme.fn.primaryColor(),
            width: rem(45),
            height: rem(2),
            marginTop: theme.spacing.sm,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
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
    user: {
        id: number;
        name: {
            first: string;
            last: string;
        },
    },
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
    const { t} = useTranslation();
    const api = useApi();

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

        notifications.show({
            id: 'load-data',
            loading: true,
            title: t("notif.loading.name"),
            message: t("notif.loading.descritpion"),
            radius: "lg",
            autoClose: false,
            withCloseButton: false,
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
                        user: {
                            id: positionData.user.id,
                            name: {
                                first: positionData.user.name.first,
                                last: positionData.user.name.last,
                            }
                        },
                        description: positionData.description,
                        is_vacant: positionData.is_vacant,
                    }));
                    setPositions(positions);

                    notifications.hide('load-data')
                } else {
                    console.error('Error: Unexpected API response structure');
                    notifications.update({
                        id: 'load-data',
                        color: 'red',
                        title: t("notif.server.name"),
                        message: t("notif.server.descritpion"),
                        radius: "lg",
                        icon: <IconCircleX />,
                        withCloseButton: false,
                        autoClose: false,
                    });
                }
            })
            .catch((error) => {
                console.error('Error fetching staff positions:', error);
                notifications.update({
                    id: 'load-data',
                    color: 'red',
                    title: t("notif.server.name"),
                    message: t("notif.server.descritpion"),
                    radius: "lg",
                    icon: <IconCircleX />,
                    withCloseButton: false,
                    autoClose: false,
                });
            });
    }, []);

    return (
        <Container size={"xl"} py={"xl"}>
            <Title order={2} className={classes.title} ta="center" mt="sm">
                {t('staff.name')}
            </Title>
                {departments.map((department, index) => (
                    <div key={index}>
                        <Flex direction="column" align="center">
                            <Title
                                key={index}
                                ta="center"
                                order={2}
                                c={theme.colors.blue[9]}
                                pt={index === 0 ? 13 : 40}
                            >
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
                                            (position.user.id !== null || position.is_vacant === 1)
                                    )
                                    .sort((a, b) => {
                                        if (a.user.id === null && b.user.id !== null) {
                                            return 1;
                                        } else if (a.user.id !== null && b.user.id === null) {
                                            return -1;
                                        } else {
                                            return a.order - b.order;
                                        }
                                    })
                                    .map((position, positionIndex) => (
                                        <Paper className={classes.card} shadow={"lg"} p={"xl"} radius="lg" key={positionIndex} bg="#fff">
                                            <Flex
                                                direction={"column"}
                                                justify={"center"}
                                                align={"center"}
                                            >
                                                <Image
                                                    radius={100}
                                                    maw={150}
                                                    src={position.user.id ? `https://static.game-explore.space/staff/${position.user.id}.jpg` : 'https://static.game-explore.space/staff/vacant.png'}
                                                />
                                                <Title order={3} color={theme.colors.blue[9]} mt={20}>
                                                    {position.user.id ? (
                                                        position.user.name.last
                                                            ? `${position.user.name.first} ${position.user.name.last}`
                                                            : `${position.user.name.first} ${position.user.id}`
                                                    ) : "Вакантно"}
                                                </Title>
                                                <Tooltip label={position.name.en} position={"bottom"} radius={"lg"} withArrow>
                                                    <Text size={14} fw={600} c={theme.colors.gray[7]}>
                                                        {position.prefix}-{position.id}
                                                    </Text>
                                                </Tooltip>
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
    );
}