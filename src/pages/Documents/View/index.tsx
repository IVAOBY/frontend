import { useEffect, useState } from 'react';

import { notifications } from '@mantine/notifications';
import { IconChevronLeft, IconCircleX } from '@tabler/icons-react';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { GeneralLayout } from '../../../components/Layout';
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
    <GeneralLayout>
      <div className="flex flex-row text-gray-300">
        <IconChevronLeft />
        <span className="font-['Montserrat']">На главную</span>
      </div>
      <div className="mt-[30px] flex flex-col gap-[50px]">
        {documentItem && (
          <>
            <h4 className="text-3xl font-bold leading-8 text-black md:text-[55px]">
              {documentItem.name[i18n.language]}
            </h4>
            <div className="rounded-[25px] bg-white px-[32px] py-[41px] shadow-md">
              <p
                dangerouslySetInnerHTML={{
                  __html: documentItem.content[i18n.language] || '',
                }}
                className="font-medium text-[#494949]"
              ></p>
            </div>
          </>
        )}
      </div>
    </GeneralLayout>
  );
}
