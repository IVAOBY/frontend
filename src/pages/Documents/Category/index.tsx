import { useEffect, useState } from 'react';

import { notifications } from '@mantine/notifications';
import { IconCircleX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import {BreadcrumbLayout} from '../../../components/Layout';
import { useApi } from '../../../context/ApiContext';
import { DocumentsCategoryType, DocumentsType } from '../../../hooks/types';

export function DocumentsCategory() {
  const [, setDocumentsCategory] =
    useState<DocumentsCategoryType | null>(null);
  const [documents, setDocuments] = useState<DocumentsType[]>([]);
  const { t, i18n } = useTranslation();
  const api = useApi();
  const { id } = useParams();

  useEffect(() => {
    api(`/documents-category/${id}`)
      .then(function (response: DocumentsCategoryType) {
        if (response) {
          setDocumentsCategory(response);
        } else {
          console.error('Error: Unexpected API response structure');
        }
      })
      .catch(function (error: any) {
        console.error('Error fetching data:', error);
      });

    notifications.show({
      id: 'load-data',
      loading: true,
      title: t('notif.loading.name'),
      message: t('notif.loading.descritpion'),
      radius: 'lg',
      autoClose: false,
      withCloseButton: false,
    });

    api(`/documents/category/${id}`)
      .then((response: DocumentsType[]) => {
        if (response && Array.isArray(response)) {
          const documents: DocumentsType[] = response.map((documentdata) => ({
            id: documentdata.id,
            category: documentdata.category,
            name: documentdata.name,
            content: documentdata.content,
            published: documentdata.published,
          }));
          setDocuments(documents);

          notifications.hide('load-data');
        } else {
          console.error('Error: Unexpected API response structure');
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
        console.error('Error fetching staff positions:', error);
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
  }, [api, t, id]);

  const navigate = useNavigate();
  const documentsRedirect = (documentsItem: DocumentsType) => {
    navigate(`/documents/${documentsItem.id}`);
  };

  return (
    <BreadcrumbLayout>
      <div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {documents
            .filter((document) => document.published)
            .map((document) => (
              <div
                key={document.id}
                className="hover:-scale-10 cursor-pointer rounded-xl bg-white p-4 shadow-lg duration-300 hover:-translate-y-1 hover:bg-gray-50 "
                onClick={() => documentsRedirect(document)}
              >
                <p className="font-semibold text-atmos-700">
                  {document.name[i18n.language]}
                </p>
              </div>
            ))}
          {documents.filter((document) => document.published).length === 0 && (
            <div className="rounded-xl bg-white p-4 shadow-lg">
              <p className="font-semibold text-atmos-700">
                {t('documents.error.nodoc')}
              </p>
            </div>
          )}
        </div>
      </div>
    </BreadcrumbLayout>
  );
}
