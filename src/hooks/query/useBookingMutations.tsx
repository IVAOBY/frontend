import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';

import {BookingCreateData, BookingEntity} from '../../types/Events';
import Http from '../../utils/Http';

export const useBookEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BookingCreateData) =>
      Http<BookingCreateData>({
        method: 'post',
        url: '/events-booking/book',
        data,
      }),
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
      Http<BookingEntity>({
        method: 'DELETE',
        url: `/events-booking/unbook/${bookingId}`,
      }),
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
