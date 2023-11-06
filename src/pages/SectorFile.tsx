import {
    createStyles,
    Title,
    Text,
    Container,
    rem,
    Paper,
    Alert, Button,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import {IconAlertCircle} from "@tabler/icons-react";

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
    subtitle: {
        color: theme.colors.lightBlue[9],
    },
}));

export function SectorFile() {
    const { classes } = useStyles();
    const { t } = useTranslation();

    return (
        <Container size="lg" py="xl">
            <Title order={2} className={classes.title} ta="center" mt="sm">
                {t('sector.title')}
            </Title>
            <Paper shadow={"lg"} radius={"lg"} bg="#fff" p={"lg"} mt={rem(16)}>
                <Text size={15}>
                    {t('sector.text')}
                </Text> <br/>
                <Alert maw={"100%"} w={"35rem"} icon={<IconAlertCircle size="1rem" />} title={t('sector.wtitle')} color="red">
                    <Text dangerouslySetInnerHTML={{ __html: t('sector.warning') || '' }}>
                    </Text>
                </Alert>
                <br/>
                <a href={"https://files.ivaoru.org/sector_files/UMMV.zip"}><Button> {t('sector.download')}</Button></a>
            </Paper>
        </Container>
    );
}
