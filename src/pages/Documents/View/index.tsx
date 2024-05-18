import { useEffect, useState } from 'react';

import { notifications } from '@mantine/notifications';
import { IconCircleX } from '@tabler/icons-react';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { LayoutTitle } from '../../../components/Layout';
import { useApi } from '../../../context/ApiContext';
import { DocumentsType } from '../../../hooks/types';

export function DocumentView() {
  const { t } = useTranslation();
  const { id } = useParams();
  const api = useApi();

  const [documentItem, setDocumentItem] = useState<DocumentsType | null>(null);
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
    api(`/documents/${id}`)
      .then((response: DocumentsType) => {
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response)
        ) {
          setDocumentItem(response);
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
    <LayoutTitle title={documentItem?.name[i18n.language]} withUnderline>
      {documentItem && (
        <div className="mt-13">
          <p
            dangerouslySetInnerHTML={{
              __html: documentItem.content[i18n.language] || '',
            }}
            className="mt-4 text-gray-500"
          ></p>
        </div>
      )}
    </LayoutTitle>
  );
}
