import {
    createStyles,
    Title,
    Container,
    rem,
    Paper,
    Input,
    Button,
    Flex,
    Text,
    BackgroundImage,
} from '@mantine/core';
import { IconSearch } from "@tabler/icons-react";

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
        backgroundColor: '#fff',
    },

    contactcard: {
        background: "transparent",
    },
    contactimg: {
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    button: {
        color: "white",
    },
}));

export function ScenaryPage() {
    const { classes, theme } = useStyles();

    return (
        <Container size="lg" py="xl">
            <Title order={2} className={classes.title} ta="center" mt="sm">
                Scenarios
            </Title>
            <Container size={"xs"} mt={rem(12)}>
                <Paper className={classes.card} shadow={"lg"} p={"lg"} radius={"lg"}>
                    <Title order={2} c={theme.colors.blue[9]}>Enter ICAO</Title>
                    <Flex direction={"row"} gap={10}>
                        <Input
                            icon={<IconSearch />}
                            placeholder="UMMS"
                            radius="md"
                        />
                        <Button radius="md" c={"white"}>
                            Find
                        </Button>
                    </Flex>
                </Paper>
            </Container>
            <Container size={"md"} mt={rem(24)}>
                <BackgroundImage
                    radius={"md"}
                    className={classes.contactimg}
                    src="https://content.onliner.by/news/970x485/e1106fc9ff56225d5f2829d841c139ca.jpeg"
                    style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://content.onliner.by/news/970x485/e1106fc9ff56225d5f2829d841c139ca.jpeg")`, }}
                >
                    <Paper shadow={"lg"} p={"lg"} radius={"lg"} ta={"center"}>
                        <Title order={3} color={"#fff"}>Do you want to see your own sceneries here?</Title>
                        <Text color={"#fff"}>We move forward with the help of people like you! </Text>
                        <Button className={classes.button}>Apply Now!</Button>
                    </Paper>
                </BackgroundImage>
            </Container>
        </Container>
    );
}
