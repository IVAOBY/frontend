import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { BreadcrumbLayout, Centered } from '../../components/Layout';
import { Loader } from '../../components/Loader';
import { Notification } from '../../components/Notification/Notification';
import { H3 } from '../../components/Typography/H3';
import { useCategory } from '../../hooks/query/useDocuments';
import { DocumentsType } from '../../types/Documents';

export function DocumentsMain() {
  const { t, i18n } = useTranslation();

  const { data, isLoading, isError, error } = useCategory();

  const navigate = useNavigate();
  const documentsRedirect = (documentsItem: DocumentsType) => {
    navigate(`/documents/${documentsItem.id}`);
  };

  return (
    <BreadcrumbLayout>
      {isError && error && (
        <Notification
          type="error"
          message={error.message}
          notificationId="documents-error-maindocuments"
        />
      )}
      {isLoading || isError ? (
        <Centered>
          <Loader />
        </Centered>
      ) : (
        data &&
        data.map((category, index) => (
          <div key={index} className="mb-10">
            <H3 className="text-3xl font-bold text-atmos-700">
              {category.name[i18n.language]}
            </H3>
            {category.documents.filter((document) => document.published)
              .length > 0 ? (
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {category.documents
                  .filter((document) => document.published)
                  .map((document) => (
                    <div
                      key={document.id}
                      className="hover:-scale-20 flex max-w-[287px] cursor-pointer flex-col squircle-2xl bg-white p-4 shadow-figma duration-300 hover:-translate-y-1 hover:bg-gray-50"
                      onClick={() => documentsRedirect(document)}
                    >
                      <p className="text-2xl font-bold text-black">
                        {document.name[i18n.language]}
                      </p>
                      <div className="my-2.5 h-2 rounded-full bg-gray-200"></div>
                      <div className="mb-2.5 h-2 rounded-full bg-gray-200"></div>
                      <div className="mb-2.5 h-2 rounded-full bg-gray-200"></div>
                      <div className="mb-2.5 h-2 rounded-full bg-gray-200"></div>
                      <div className="mb-2.5 h-2 rounded-full bg-gray-200"></div>
                      <div className="h-2 w-1/2 rounded-full bg-gray-200"></div>
                      <div className="relative inset-x-0 bottom-0 mt-5 flex flex-row gap-9">
                        <div className="h-2 w-[52px] rounded-full bg-gray-200"></div>
                        <div className="h-2 w-[94px] rounded-full bg-gray-200"></div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="mt-0 text-base leading-5 text-neutral-400 md:text-xl">
                {t('documents.error.nodoc')}
              </div>
            )}
          </div>
        ))
      )}
    </BreadcrumbLayout>
  );
}
