import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { t } from 'i18next';

import {
  useBookingCreate,
  useBookingRemove,
} from '../../api/event-bookings/event-bookings';
import { getPartFindOneEventQueryKey } from '../../api/event-parts/event-parts';

const showServerError = (error: Error) => {
  notifications.show({
    id: 'complete-unbooking',
    title: t('notif.server.name'),
    message: error.toString(),
    color: 'red',
    radius: 'lg',
    withCloseButton: true,
    icon: <IconX />,
  });
};

export const useBookEvent = (eventId: number) => {
  const queryClient = useQueryClient();

  return useBookingCreate({
    mutation: {
      onSuccess: async (booking) => {
        await queryClient.invalidateQueries({
          queryKey: getPartFindOneEventQueryKey(eventId),
        });

        notifications.show({
          id: `complete-booking-${booking.atcPositionId}`,
          title: t('notif.booking.book.name'),
          message: t('notif.booking.book.description'),
          color: 'green',
          radius: 'lg',
          withCloseButton: true,
          autoClose: 3000,
          icon: <IconCheck />,
        });
      },
      onError: showServerError,
    },
  });
};

export const useUnbookEvent = (eventId: number) => {
  const queryClient = useQueryClient();

  return useBookingRemove({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getPartFindOneEventQueryKey(eventId),
        });
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
      onError: showServerError,
    },
  });
};
