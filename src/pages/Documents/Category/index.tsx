import { useEffect, useState } from 'react';

import { notifications } from '@mantine/notifications';
import { IconCircleX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { LayoutTitle } from '../../../components/Layout';
import { useApi } from '../../../context/ApiContext';
import { DocumentsCategoryType, DocumentsType } from '../../../hooks/types';

export function DocumentsCategory() {
  const [documentsCategory, setDocumentsCategory] =
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
    <LayoutTitle title={documentsCategory?.name[i18n.language]} withUnderline>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {documents
            .filter((document) => document.published)
            .map((document) => (
              <div
                key={document.id}
                className="p-4 shadow-lg rounded-xl cursor-pointer bg-white duration-300 hover:bg-gray-50 hover:-translate-y-1 hover:-scale-10 "
                onClick={() => documentsRedirect(document)}
              >
                <p className="text-atmos-700 font-semibold">
                  {document.name[i18n.language]}
                </p>
              </div>
            ))}
          {documents.filter((document) => document.published).length === 0 && (
            <div className="p-4 shadow-lg rounded-xl bg-white">
              <p className="text-atmos-700 font-semibold">
                {t('Documents.error.nodoc')}
              </p>
            </div>
          )}
        </div>
      </div>
    </LayoutTitle>
  );
}
