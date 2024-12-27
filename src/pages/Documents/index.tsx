import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { BreadcrumbLayout, Centered } from '../../components/Layout';
import { Loader } from '../../components/Loader';
import { ErrorNotification } from '../../components/Notification/ErrorNotification';
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
        <ErrorNotification
          error={error}
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
            <H3 className="text-atmos-700 font-bold text-3xl">
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
                      className="hover:-scale-10 cursor-pointer rounded-xl bg-white p-4 shadow-lg duration-300 hover:-translate-y-1 hover:bg-gray-50 flex flex-col max-w-[287px]"
                      onClick={() => documentsRedirect(document)}
                    >
                      <p className="font-bold text-2xl text-black">
                        {document.name[i18n.language]}
                      </p>
                      <div className="h-2 bg-gray-200 rounded-full mb-2.5 mt-2.5"></div>
                      <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
                      <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
                      <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
                      <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
                      <div className="h-2 bg-gray-200 rounded-full w-1/2"></div>
                      <div className="relative flex flex-row gap-9 mt-5 inset-x-0 bottom-0">
                        <div className="h-2 bg-gray-200 rounded-full w-[52px]"></div>
                        <div className="h-2 bg-gray-200 rounded-full w-[94px]"></div>
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
