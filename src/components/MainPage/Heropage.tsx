import { createStyles, Title, Text, Button, Container, Image, Group } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import {useNavigate} from "react-router-dom";
import { useTranslation } from "react-i18next";
import home from "../../assets/image/home.png"

const useStyles = createStyles((theme) => ({
    inner: {
        display: 'flex',
        justifyContent: 'space-between',
    },

    content: {
        maxWidth: 480,
        marginRight: `calc(${theme.spacing.xl} * 3)`,

        [theme.fn.smallerThan('md')]: {
            maxWidth: '100%',
            marginRight: 0,
        },
    },

    title: {
        color: theme.colors.brand[0],
        fontSize: 45,
        lineHeight: 1.2,
        fontWeight: 800,

        [theme.fn.smallerThan('xs')]: {
            fontSize: 28,

        },
    },

    control: {
        backgroundColor: theme.colors.brand[0],
        [theme.fn.smallerThan('xs')]: {
            flex: 1,
        },
    },

    image: {
        flex: 1,
        minWidth: 400,

        [theme.fn.smallerThan('md')]: {
            display: 'none',
        },
    },


    highlight: {
        position: 'relative',
        backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
        borderRadius: theme.radius.sm,
        padding: '4px 12px',
    },

    text: {
        minWidth: '500',
        [theme.fn.smallerThan('xs')]: {
            minWidth: '300',
        },
    },
}));

export function HeroText() {
    const { classes } = useStyles();
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <Container>
            <div className={classes.inner}>
                <div className={classes.content}>
                    <Title className={classes.title}>
                        {t("welcomeTitle")}
                    </Title>
                    <Text className={classes.text} color="dimmed" mt="md" size={18}>
                        {t("welcomeSubtitle")}
                    </Text>

                    <Group mt={30}>
                        <Button radius="md" size="md" leftIcon={<IconExternalLink strokeWidth={2} />} className={classes.control}
                                onClick={() => navigate('/booking')}
                        >
                            {t("welcomeButton")}
                        </Button>
                    </Group>
                </div>
                <Image className={classes.image} src={home} alt="HomeBanner"/>
            </div>
        </Container>
    );
}