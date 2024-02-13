import { useEffect, useState } from 'react';

import { notifications } from '@mantine/notifications';
import { IconCircleX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Centered, GeneralLayout } from '../../components/Layout';
import { Loader } from '../../components/Loader';
import { H3 } from '../../components/Typography/H3';
import { Title } from '../../components/Typography/Title';
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
    <GeneralLayout>
      <Title withUndreline>{t('navbar.atc.docs')}</Title>
      {documentsCategory.map((category, index) => (
        <div key={index} className="my-10">
          <H3 className="text-atmos-700">{category.name[i18n.language]}</H3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {documents
              .filter(
                (document) =>
                  document.category === category.id && document.published,
              )
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
            {documents.filter(
              (document) =>
                document.category === category.id && document.published,
            ).length === 0 && (
              <div className="p-4 shadow-lg rounded-xl bg-white">
                <p className="text-atmos-700 font-semibold">
                  {t('Documents.error.nodoc')}
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
    </GeneralLayout>
  );
}
