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

export function Airport() {
    const {classes, theme} = useStyles();
    const [departments, setDepartments] = useState<Department[]>([]);

    return (
<Container size={"lg"}>
        <Title ta={"center"} order={1} c={theme.colors.blue[9]} pt={50}>Национальный Аэропорт Минск-2</Title>
</Container>
    );
}
