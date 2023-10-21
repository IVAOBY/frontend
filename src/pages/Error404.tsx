import {
    createStyles,
    Title,
    Container,
    Button,
    Text, SimpleGrid, Image,
} from '@mantine/core';
import errorimage from '../assets/image/en.svg';
import { useTranslation } from 'react-i18next';
import {useNavigate} from "react-router-dom";
const useStyles = createStyles(() => ({
    root: {
        paddingTop: '80px',
        paddingBottom: '80px',
    },
    title: {
        fontWeight: 900,
        fontSize: '34px',
        marginBottom: '20px',
        color: '#E93434',

        '@media (max-width: $mantine-breakpoint-sm)': {
            fontSize: '32px',
        },
    },
    control: {
        '@media (max-width: $mantine-breakpoint-sm)': {
            width: '100%',
            backgroundColor: '#0D2C99',
        },
    },
    mobileImage: {
        '@media (min-width: 48em)': {
            display: 'none',
        },
    },
    desktopImage: {
        '@media (max-width: 47.99em)': {
            display: 'none',
        },
    },
}));

export function NotFound() {
    const { classes } = useStyles();
    const { t } = useTranslation();

    const navigate = useNavigate();
    return (
        <Container className={classes.root}>
            <SimpleGrid spacing={40} cols={2}>
                <Image src={errorimage} className={classes.mobileImage} />
                <div>
                    <Title className={classes.title}>{t('errorpage.notfoundtext')}</Title>
                    <Text c={"#000"} size="lg">
                        {t('errorpage.notfoundsubtext')}
                    </Text>
                    <Button variant="filled" size="md" mt="xl" className={classes.control} onClick={() => navigate('/')}>
                        {t('errorpage.homebutton')}
                    </Button>
                </div>
                <Image src={errorimage} className={classes.desktopImage} />
            </SimpleGrid>
        </Container>
    );
}
