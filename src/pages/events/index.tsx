import { useEffect, useState } from 'react';

import {
  Container,
  createStyles,
  Flex,
  Image,
  Paper,
  rem,
  Text,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCircleX } from '@tabler/icons-react';
import { format } from 'date-fns';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useApi } from '../../context/ApiContext';
import { EventEntity } from '../../types/Events';
import { ShiftComponent } from './components/ShiftComponent';

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: rem(34),
    fontWeight: 800,
    color: theme.colors.blue[9],
  },
  subtitle: {
    fontSize: rem(18),
    fontWeight: 800,
    color: theme.colors.blue[9],
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

  image: {
    maxWidth: '100%',
    minWidth: '80%',
    height: 'auto',
    [theme.fn.largerThan('md')]: {
      maxWidth: '50%',
    },
  },

  cardContent: {
    wordBreak: 'break-word',
  },

  cardAuthorDate: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: rem(20),
    marginLeft: rem(20),
    color: theme.colors.gray,
  },
}));

export function EventPage() {
  const { classes, theme } = useStyles();
  const { t } = useTranslation();
  const { id } = useParams();
  const api = useApi();

  const [eventItem, setEventItem] = useState<EventEntity | null>(null);
  useEffect(() => {
    notifications.show({
      id: 'load-data',
      loading: true,
      title: t('notif.loading.name'),
      message: t('notif.loading.descritpion'),
      radius: 'lg',
      autoClose: false,
      withCloseButton: false,
    });
    api(`/events/${id}`)
      .then((response: EventEntity) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response)
        ) {
          setEventItem(response);
          notifications.hide('load-data');
        } else {
          console.error('Invalid response from API:', response);
          notifications.update({
            id: 'load-data',
            color: 'red',
            title: t('notif.server.name'),
            message: t('notif.server.descritpion'),
            radius: 'lg',
            icon: <IconCircleX />,
            withCloseButton: false,
            autoClose: false,
          });
        }
      })
      .catch((error: any) => {
        console.error('Error fetching news:', error);
        notifications.update({
          id: 'load-data',
          color: 'red',
          title: t('notif.server.name'),
          message: t('notif.server.descritpion'),
          radius: 'lg',
          icon: <IconCircleX />,
          withCloseButton: false,
          autoClose: false,
        });
      });
  }, [api, id, t]);

  return (
    <Container size="lg" py="xl">
      {eventItem && (
        <>
          <Title order={2} className={classes.title} ta="center" mt="sm">
            {eventItem.name[i18n.language]}
          </Title>
          <Text className={classes.subtitle} ta={'center'}>
            {`${format(new Date(eventItem.startDate), 'dd.MM.yy')} ${new Date(
              eventItem.startDate,
            ).toLocaleTimeString('eu', {
              timeZone: 'UTC',
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
            })}`}
            {` - ${format(new Date(eventItem.startDate), 'dd.MM.yy')} ${new Date(
              eventItem.endDate,
            ).toLocaleTimeString('eu', {
              timeZone: 'UTC',
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
            })}`}
          </Text>
          <Paper p={'lg'} bg={'#fff'} shadow={'lg'} radius={'lg'} mt={rem(13)}>
            <Flex
              gap={'md'}
              className={classes.cardContent}
              justify="center"
              align="center"
              direction="column"
              wrap="wrap"
              py="xl"
            >
              <Image
                src={eventItem.imageUrl}
                alt={eventItem.name.en}
                className={classes.image}
                radius="lg"
              />
              <Text color={theme.colors.gray[8]} fz={rem(16)} mt={rem(10)}>
                {eventItem.description[i18n.language]}
              </Text>
            </Flex>
          </Paper>
          <Paper p={'lg'} bg={'#fff'} shadow={'lg'} radius={'lg'} mt={rem(23)}>
            <Title order={2} className={classes.title} ta="center" mt="sm">
              ATC Shift
            </Title>
            <ShiftComponent />
          </Paper>
        </>
      )}
    </Container>
  );
}
