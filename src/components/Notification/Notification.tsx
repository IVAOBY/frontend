import { useEffect } from 'react';

import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

interface NotificationProps {
  type: 'success' | 'error';
  message: string;
  notificationId?: string;
}

export const Notification = ({
  type,
  message,
  notificationId = 'notification',
}: NotificationProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    notifications.show({
      id: notificationId,
      title:
        type === 'success'
          ? t('notif.loaded.name') || 'Успешно'
          : t('notif.server.name') || 'Ошибка',
      message:
        message ||
        (type === 'success'
          ? t('notif.loaded.descritpion') || 'Операция выполнена успешно'
          : t('notif.server.description') || 'Неизвестная ошибка'),
      color: type === 'success' ? 'green' : 'red',
      radius: 'lg',
      withCloseButton: true,
      autoClose: type === 'success' ? 3000 : false,
      icon: type === 'success' ? <IconCheck /> : <IconX />,
    });

    return () => {
      notifications.hide(notificationId);
    };
  }, [type, message, notificationId, t]);

  return null;
};
