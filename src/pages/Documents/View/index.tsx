import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { BreadcrumbLayout, Centered } from '../../../components/Layout';
import { Loader } from '../../../components/Loader';
import { ErrorNotification } from '../../../components/Notification/ErrorNotification';
import { useDocument } from '../../../hooks/query/useDocuments';

export function DocumentView() {
  useTranslation();
  const { id } = useParams();

  const { data, error, isError, isLoading } = useDocument(id);

  return (
    <BreadcrumbLayout>
      <div className="mt-[30px] flex flex-col gap-[50px]">
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
          data && (
            <>
              <h4 className="text-3xl font-bold leading-8 text-black md:text-[55px]">
                {data.name[i18n.language]}
              </h4>
              <div className="rounded-[25px] bg-white px-[32px] py-[41px] shadow-md">
                <div
                  dangerouslySetInnerHTML={{
                    __html: data.content[i18n.language] || '',
                  }}
                  className="text-[#494949]"
                ></div>
              </div>
            </>
          )
        )}
      </div>
    </BreadcrumbLayout>
  );
}
