import React from 'react';
import {
    createStyles,
    Title,
    Text,
    Container,
    rem,
    Image,
    Paper,
    Anchor,
    List,
    Grid,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';

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

export function FirstStepP() {
    const { classes, theme } = useStyles();
    const { t } = useTranslation();

    return (
        <Container size="lg" py="xl">
            <Title order={2} className={classes.title} ta="center" mt="sm">
                Первые шаги пилота
            </Title>
            <Paper shadow={"lg"} radius={"lg"} bg="#fff" p={"lg"} mt={rem(16)}>
                <Title order={2} className={classes.subtitle}>
                    Регистрация в IVAO
                </Title>
                <Text size={15}>
                    В данном руководстве изложена пошаговая инструкция, которая поможет вам подключиться к IVAO в качестве виртуального пилота. Здесь представлен краткий обзор используемого программного обеспечения, а также некоторые основные инструкции о правилах поведения в виртуальном сообществе IVAO.
                </Text>
                <Text size={15} mt={5}>
                    Первое что требуется сделать –{' '}
                    <Anchor href="https://ivao.aero/members/person/register.htm" target="_blank">
                        зарегистрироваться на сайте IVAO
                    </Anchor>
                </Text>
                <Text size={15} mt={5}>
                    Обращаем внимание, что у вас должна быть только одна учетная запись, которая будет действительна для участия в сети IVAO как в качестве пилота, так и в качестве авиадиспетчера.
                </Text>
                <Text size={15} mt={5}>
                    Более подробно остановимся на следующих аспектах:
                </Text>
                <List size={"sm"} withPadding>
                    <List.Item>загрузка, установка и настройка требуемого программного обеспечения</List.Item>
                    <List.Item>подключение к виртуальной сети IVAO</List.Item>
                    <List.Item>подача полетного плана (основы)</List.Item>
                    <List.Item>взаимодействие с виртуальным авиадиспетчером (ATC), а также работа при отсутствии виртуального авиадиспетчера</List.Item>
                    <List.Item>получение дополнительной информации и тренинг</List.Item>
                </List>
                <Title order={2} mt={10} className={classes.subtitle}>
                    Загрузка программы клиента Altitude
                </Title>
                <Grid gutter={20}>
                    <Grid.Col span={6}>
                        <Text size={15} mt={5}>
                            Первое, что вам необходимо сделать, это загрузить клиент виртуального пилота
                            программу ALTITUDE, с помощью которой вы сможете подключаться к сети.
                            Данный клиент может быть загружен со страницы Pilot Client: Altitude.
                        </Text>
                        <Text size={15} mt={5}>
                            После загрузки клиента вам необходимо запустить исполняемый файл
                            и установить программу.
                        </Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Image
                            src="https://media.discordapp.net/attachments/757343581408329729/1158130098713665706/image.png?ex=651b2034&is=6519ceb4&hm=3a5b2bcdcd6f216287ef0b8459a7f03b28592dd765e5565d7a3339a97cb94b10&="
                            alt="Изображение"
                            maw="50%"
                            style={{ float: 'right' }}
                        />
                    </Grid.Col>
                </Grid>
                <Title order={2} mt={10} className={classes.subtitle}>
                    MTL (Multiplayer Traffic Library)
                </Title>
                <Text size={15} mt={5}>
                    MTL (Multiplayer Traffic Library) позволяет видеть находящиеся радом с вами воздушные суда путем установки сотен моделей и их ливрей в ваш симулятор полетов.
                </Text>
            </Paper>
        </Container>
    );
}
