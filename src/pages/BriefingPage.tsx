import React from 'react';
import {Container, Paper, Text, useMantineTheme} from '@mantine/core';
import {useTranslation} from "react-i18next";

function Briefing() {
    const theme = useMantineTheme();
    const { t } = useTranslation();
    return (
        <>
            <Container size="lg">
                <Text c={theme.colors.brand[0]} fw={700} lh={1.2} fz={25} mb={10} align="center">{t("briefingButton")} | Moscow RFE</Text>
                <Paper
                    p="lg" radius="lg" shadow={theme.shadows.lg} mb={150}
                >
                    <Container size="md">
                        <Text dangerouslySetInnerHTML={{ __html: t("briefingText") || '' }} />
                    </Container>
                </Paper>
            </Container>
        </>
    );
}

export default Briefing;
