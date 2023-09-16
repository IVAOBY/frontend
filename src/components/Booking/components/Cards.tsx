import React from 'react';
import {
    Paper,
    Text,
    Title,
    Button,
    createStyles,
    MantineTheme,
    rem,
} from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

interface CardProps {
    image: string;
    title: string;
    category: string;
    url: string;
    url_text: string;
}

const useStyles = createStyles((theme: MantineTheme) => ({
    card: {
        height: rem(200),
        width: rem(650),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: theme.colors.brand[1],
        [theme.fn.smallerThan('sm')]: {
            width: "100%",
        },
        [theme.fn.smallerThan('xs')]: {
            height: rem(200),
        },

    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: theme.spacing.md,
        flexGrow: 1,
    },
    logo: {
        width: rem(120),
        height: rem(120),
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        [theme.fn.smallerThan('xs')]: {
            display: 'none',
        },
    },
    button: {
        background: theme.colors.brand[0],
        color: '#fff',
        maxWidth:  rem(185),
    },
    title: {
        fontFamily: `Greycliff CF ${theme.fontFamily}`,
        fontWeight: 900,
        color: theme.white,
        lineHeight: 1.2,
        fontSize: rem(32),
        marginBottom: theme.spacing.xs,
    },
    category: {
        color: theme.white,
        opacity: 0.7,
        fontWeight: 700,
        textTransform: 'uppercase',
    },
}));

function Card({ image, title, category, url, url_text }: CardProps) {
    const { classes } = useStyles();
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(url);
    };

    return (
        <Paper
            shadow="md"
            p="xl"
            radius="md"
            mb="20px"
            className={classes.card}
        >
            <div className={classes.content}>
                <Text className={classes.category} size="xs">
                    {category}
                </Text>
                <Title order={3} className={classes.title}>
                    {title}
                </Title>
                <Button
                    leftIcon={<IconExternalLink strokeWidth={2} />}
                    className={classes.button}
                    onClick={handleNavigate}
                >
                    {url_text}
                </Button>
            </div>
            <div className={classes.logo} style={{ backgroundImage: `url(${image})` }} />
        </Paper>
    );
}

export default Card;
