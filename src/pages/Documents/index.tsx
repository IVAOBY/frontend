import { useEffect, useState } from 'react';

import { notifications } from '@mantine/notifications';
import { IconCircleX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { BreadcrumbLayout, Centered } from '../../components/Layout';
import { Loader } from '../../components/Loader';
import { H3 } from '../../components/Typography/H3';
import { useApi } from '../../context/ApiContext';
import { DocumentsCategoryType, DocumentsType } from '../../hooks/types';

export function DocumentsMain() {
  const [documentsCategory, setDocumentsCategory] = useState<
    DocumentsCategoryType[]
  >([]);
  const [documents, setDocuments] = useState<DocumentsType[]>([]);
  const { t, i18n } = useTranslation();
  const api = useApi();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api('/Documents-category')
      .then(function (response: DocumentsCategoryType[]) {
        if (response && Array.isArray(response)) {
          setDocumentsCategory(response);
        } else {
          console.error('Error: Unexpected API response structure');
        }
      })
      .catch(function (error: any) {
        console.error('Error fetching data:', error);
      });

    api('/Documents')
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
          setLoading(false);
        } else {
          console.error('Error: Unexpected API response structure');
          notifications.show({
            id: 'load-data-error',
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
        console.error('Error fetching Documents:', error);
        notifications.show({
          id: 'load-data-error',
          color: 'red',
          title: t('notif.server.name'),
          message: t('notif.server.descritpion'),
          radius: 'lg',
          icon: <IconCircleX />,
          withCloseButton: false,
          autoClose: false,
        });
      });
  }, [api, t]);

  const navigate = useNavigate();
  const documentsRedirect = (documentsItem: DocumentsType) => {
    navigate(`/documents/${documentsItem.id}`);
  };

  return (
    <BreadcrumbLayout>
      {documentsCategory.map((category, index) => (
        <div key={index} className="mb-10">
          <H3 className="text-atmos-700">{category.name[i18n.language]}</H3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {documents
              .filter(
                (document) =>
                  document.category === category.id && document.published,
              )
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
            {documents.filter(
              (document) =>
                document.category === category.id && document.published,
            ).length === 0 && (
              <div className="rounded-xl bg-white p-4 shadow-lg">
                <p className="font-semibold text-atmos-700">
                  {t('documents.error.nodoc')}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
      {loading && (
        <Centered>
          <Loader />
        </Centered>
      )}
    </BreadcrumbLayout>
  );
}
