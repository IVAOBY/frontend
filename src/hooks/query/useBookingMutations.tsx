import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';

import { bookingControllerCreate, bookingControllerRemove } from '../../api/booking/booking';
import { BookingCreateData, BookingEntity } from '../../types/Events';

export const useBookEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BookingCreateData) =>
      bookingControllerCreate(data as never) as unknown as Promise<BookingCreateData>,
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['event-parts'] });

      notifications.show({
        id: `complete-booking-${data.atcPositionId}`,
        title: t('notif.booking.book.name'),
        message: t('notif.booking.book.description'),
        color: 'green',
        radius: 'lg',
        withCloseButton: true,
        autoClose: 3000,
        icon: <IconCheck />,
      });
    },
    onError: (error) => {
      notifications.show({
        id: 'complete-unbooking',
        title: t('notif.server.name'),
        message: error.toString(),
        color: 'red',
        radius: 'lg',
        withCloseButton: true,
        icon: <IconX />,
      });
    },
  });
};

export const useUnbookEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: number) =>
      bookingControllerRemove(bookingId) as unknown as Promise<BookingEntity>,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['event-parts'] });
      notifications.show({
        id: 'complete-unbooking',
        title: t('notif.booking.unbook.name'),
        message: t('notif.booking.unbook.description'),
        color: 'green',
        radius: 'lg',
        withCloseButton: true,
        autoClose: 3000,
        icon: <IconCheck />,
      });
    },
    onError: (error) => {
      notifications.show({
        id: 'complete-unbooking',
        title: t('notif.server.name'),
        message: error.toString(),
        color: 'red',
        radius: 'lg',
        withCloseButton: true,
        icon: <IconX />,
      });
    },
  });
};
