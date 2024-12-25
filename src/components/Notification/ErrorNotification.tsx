import { useEffect } from 'react';

import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface ErrorNotificationProps {
  error: Error;
  notificationId?: string;
}

export const ErrorNotification = ({
  error,
  notificationId = 'error',
}: ErrorNotificationProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    notifications.show({
      id: notificationId,
      title: t('notif.server.name') || 'Ошибка',
      message:
        error.message || t('notif.server.unknownError') || 'Неизвестная ошибка',
      color: 'red',
      radius: 'lg',
      withCloseButton: false,
      autoClose: false,
      icon: <IconX />,
    });

    return () => {
      notifications.hide(notificationId);
    };
  }, [error, notificationId, t]);

  return null;
};
