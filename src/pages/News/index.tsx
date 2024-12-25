import { IconCalendarTime, IconUser } from '@tabler/icons-react';
import { format } from 'date-fns';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { BreadcrumbLayout, Centered } from '../../components/Layout';
import { Loader } from '../../components/Loader';
import { ErrorNotification } from '../../components/Notification/ErrorNotification';
import { Title } from '../../components/Typography/Title';
import { useNewsById } from '../../hooks/query/MainPage/useNews';

export function NewsPage() {
  useTranslation();

  const { id } = useParams<{ id: string }>();
  const { data, error, isError, isLoading } = useNewsById(id as string);

  return (
    <BreadcrumbLayout>
      {isError && error && (
        <ErrorNotification error={error} notificationId={`news-${id}`} />
      )}
      {isLoading || isError ? (
        <Centered>
          <Loader />
        </Centered>
      ) : data ? (
        <>
          <Title
            className="text-ivao-blue text-center text-2xl font-bold md:text-4xl"
            withUndreline
          >
            {data.name[i18n.language]}
          </Title>
          <div className="mt-5 flex flex-row justify-center gap-[103.55px]">
            <div className="flex flex-row gap-2">
              <IconCalendarTime className="ml-2 text-atmos-700 md:ml-0" />
              <p className="text-base font-bold text-gray-500 md:text-lg">
                {format(new Date(data.publishedAt), 'dd.MM.yyyy')}
              </p>
            </div>
            <div className="flex flex-row gap-2">
              <IconUser className="text-atmos-700" />
              <p className="mr-2 text-base font-bold text-gray-500 md:mr-0 md:text-lg">
                {data.user &&
                data.user.staffPositions &&
                data.user.staffPositions.length > 0
                  ? data.user.staffPositions
                      .map((position) => `BY-${position.id}`)
                      .filter(
                        (value, index, self) => self.indexOf(value) === index,
                      )
                      .join('/')
                  : data.user
                    ? `${data.user.name.first} ${data.user.id}`
                    : 'IVAO BY HQ'}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={data.image_url}
              alt={data.name.en}
              className="mt-8 w-11/12 rounded-lg md:w-7/12"
            />
          </div>
          <div className="flex items-center justify-center text-justify">
            <p
              className="m-5 w-[700px] break-words text-gray-700 md:text-lg"
              dangerouslySetInnerHTML={{
                __html: data.description[i18n.language],
              }}
            />
          </div>
        </>
      ) : null}
    </BreadcrumbLayout>
  );
}
