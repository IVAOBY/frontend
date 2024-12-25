import { useEffect, useState } from 'react';

import { notifications } from '@mantine/notifications';
import { IconCircleX } from '@tabler/icons-react';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import {useNavigate, useParams} from 'react-router-dom';

import { BreadcrumbLayout } from '../../../components/Layout';
import { useApi } from '../../../context/ApiContext';
import { DocumentsType } from '../../../hooks/types';

export function DocumentView() {
  const { t } = useTranslation();
  const { id } = useParams();
  const api = useApi();
  const navigate = useNavigate();

  const [documentItem, setDocumentItem] = useState<DocumentsType | null>(null);
  useEffect(() => {
    api(`/documents/${id}`)
        .then((response) => {
          if (response === false) {
            navigate('/404');
          } else if (response && typeof response === 'object' && !Array.isArray(response)) {
            setDocumentItem(response);
          } else {
            console.error('Invalid response from API:', response);
            notifications.update({
              id: 'load-data',
              color: 'red',
              title: t('notif.server.name'),
              message: t('notif.server.description'),
              radius: 'lg',
              icon: <IconCircleX />,
              withCloseButton: false,
              autoClose: false,
            });
          }
        })
        .catch((error) => {
          console.error('Error fetching documents:', error);
          notifications.update({
            id: 'load-data',
            color: 'red',
            title: t('notif.server.name'),
            message: t('notif.server.description'),
            radius: 'lg',
            icon: <IconCircleX />,
            withCloseButton: false,
            autoClose: false,
          });
        });
  }, [api, id, t, navigate]);

  return (
    <BreadcrumbLayout>
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
    </BreadcrumbLayout>
  );
}
