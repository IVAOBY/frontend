import { useContext, useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Card,
  Center,
  Container,
  createStyles,
  Flex,
  Image,
  rem,
  Text,
  Tooltip,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import {
  IconAirTrafficControl,
  IconBrandFlightradar24,
  IconCircleX,
  IconRadar,
} from '@tabler/icons-react';
import { format } from 'date-fns';
import { PartsEntity } from '../../../types/Events';
import { useApi } from '../../../context/ApiContext';
import { AuthContext } from '../../../context/UserContext';
import { CustomButton } from '../../../components/Button';

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
    maxWidth: '30%',
  },

  icon: {
    backgroundColor: theme.colors.blue[9],
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
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

  card: {
    border: `${rem(2)} solid ${theme.colors.lightBlue[6]}`,
  },

  cardTitle: {
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

  badge: {
    margin: rem(5),
    '&:hover': {
      cursor: 'pointer',
      transform: 'scale(1.02)',
    },
  },
}));

export function ShiftComponent() {
  const { classes } = useStyles();
  const { t } = useTranslation();
  const { id } = useParams();
  const api = useApi();
  const { decodedToken, signed } = useContext(AuthContext);
  console.log(decodedToken);
  // const isSmallScreen = window.innerWidth < 768;

  const [partItem, setPartItem] = useState<PartsEntity[] | null>(null);
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
    api(`/events-parts/event/${id}`)
      .then((response: any) => {
        if (response && Array.isArray(response)) {
          setPartItem(response);
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
  }, [id]);

  const handleBook = async (partId: number, atcPositionId: number) => {
    if (signed && partItem) {
      const part = partItem.find((part) => part.id === partId);
      if (part) {
        try {
          await api(
            `/events-booking/book?atcPositionId=${atcPositionId}`,
            'v3',
            'POST',
            {
              atcPositionId: atcPositionId,
              eventPartId: part.id,
              eventId: part.eventId,
            },
          );

          api(`/events-parts/event/${id}`).then((response: any) => {
            if (response && Array.isArray(response)) {
              setPartItem(response);
            }
          });
        } catch (error) {
          console.log('Error handling booking:', error);
        }
      }
    }
  };

  function isBookedForPosition(bookings: any[], atcPositionId: number) {
    return bookings.some(
      (booking) =>
        booking.atcPosition?.id === atcPositionId &&
        booking.bookedUser?.id === decodedToken?.userData.id,
    );
  }

  function getBookingIdForPosition(bookings: any[], atcPositionId: number) {
    const booking = bookings.find((booking) => {
      return (
        booking.atcPosition.id === atcPositionId &&
        booking.bookedUser?.id === decodedToken?.userData.id
      );
    });
    return booking ? booking.id : undefined;
  }

  const handleUnbook = (bookingId: number) => {
    if (signed) {
      api(`/events-booking/unbook/${bookingId}`, 'v3', 'DELETE')
        .then(() => {
          api(`/events-parts/event/${id}`).then((response: any) => {
            if (response && Array.isArray(response)) {
              setPartItem(response);
            }
          });
        })
        .catch((error: any) => {
          console.log('Error handling unbooking:', error);
        });
    } else {
      console.log('Token is not defined or null');
    }
  };

  return (
    <Container size="lg" py="xl">
      {partItem &&
        partItem.map((part) => (
          <div key={part.id}>
            <Text className={classes.subtitle} ta="center">
              {`${format(new Date(part.startDate), 'dd.MM.yy')} ${new Date(
                part.startDate,
              ).toLocaleTimeString('eu', {
                timeZone: 'UTC',
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
              })}`}
              {` - ${format(new Date(part.startDate), 'dd.MM.yy')} ${new Date(
                part.endDate,
              ).toLocaleTimeString('eu', {
                timeZone: 'UTC',
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
              })}`}
            </Text>
            <Flex
              mt={rem(13)}
              gap="md"
              justify="center"
              direction="row"
              wrap="wrap"
            >
              {part.positions && part.positions.length > 0 ? (
                part.positions.map((position) => (
                  <Card
                    mb={30}
                    mt={15}
                    key={position.atcPositionId}
                    shadow="md"
                    radius="md"
                    className={classes.card}
                    padding="xl"
                    miw={300}
                  >
                    <Center>
                      <Box className={classes.icon}>
                        {position.position.callsign.endsWith('APP') ? (
                          <IconRadar size={rem(40)} stroke={2} color="#fff" />
                        ) : position.position.callsign.endsWith('CTR') ? (
                          <IconBrandFlightradar24
                            size={rem(40)}
                            stroke={2}
                            color="#fff"
                          />
                        ) : (
                          <IconAirTrafficControl
                            size={rem(40)}
                            stroke={2}
                            color="#fff"
                          />
                        )}
                      </Box>
                    </Center>
                    <Text
                      fz="lg"
                      fw={700}
                      className={classes.cardTitle}
                      mt="md"
                      ta={'center'}
                    >
                      {position.position.callsign}
                    </Text>
                    <Center mt={10} mb={10}>
                      <Image
                        className={classes.image}
                        aria-label="IVAO"
                        src={`https://www.ivao.aero/data/images/ratings/atc/${position.position.fra}.gif`}
                      />
                    </Center>
                    {part.booking
                      .filter(
                        (bookingItem) =>
                          bookingItem.atcPosition?.id ===
                          position.atcPositionId,
                      )
                      .map((filteredBookingItem) => (
                        <Center
                          key={filteredBookingItem.id}
                          style={{ margin: '0px' }}
                        >
                          <Tooltip
                            label="IVAO Profile"
                            color="blue"
                            position="bottom"
                            withArrow
                          >
                            <Badge
                              className={classes.badge}
                              component="a"
                              href={`https://www.ivao.aero/Member.aspx?Id=${filteredBookingItem.bookedUser?.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              color={
                                filteredBookingItem.status === 0
                                  ? 'blue'
                                  : filteredBookingItem.status === 1
                                    ? 'green'
                                    : 'red'
                              }
                              style={{ margin: '5px' }}
                            >
                              {signed
                                ? `${filteredBookingItem.bookedUser?.name.first} ${filteredBookingItem.bookedUser?.name.last}`
                                : `${filteredBookingItem.bookedUser?.name.first} ${filteredBookingItem.bookedUser?.id}`}
                            </Badge>
                          </Tooltip>
                        </Center>
                      ))}

                    {signed &&
                    isBookedForPosition(
                      part.booking,
                      position.atcPositionId,
                    ) ? (
                      <Center>
                        <CustomButton
                          title={t('events.booking.unbook')}
                          variant={'danger'}
                          size={'lg'}
                          onClick={() => {
                            const bookingId = getBookingIdForPosition(
                              part.booking,
                              position.atcPositionId,
                            );
                            if (typeof bookingId !== 'undefined') {
                              handleUnbook(bookingId);
                            } else {
                              console.log('Booking ID is undefined');
                            }
                          }}
                        />
                      </Center>
                    ) : signed ? (
                      <Center>
                        <CustomButton
                          title={t('events.booking.book')}
                          variant={'primary'}
                          size={'lg'}
                          onClick={() =>
                            handleBook(part.id, position.atcPositionId)
                          }
                        />
                      </Center>
                    ) : null}
                  </Card>
                ))
              ) : (
                <Text>{t('events.booking.none')}</Text>
              )}
            </Flex>
          </div>
        ))}
    </Container>
  );
}
