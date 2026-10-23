import { IconIdBadge2, IconMailOpened } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { BreadcrumbLayout, Centered } from '../../components/Layout';
import { Loader } from '../../components/Loader';
import { Notification } from '../../components/Notification/Notification';
import { useStaff } from '../../hooks/query/useStaff';

export function StaffPage() {
  const { t } = useTranslation();

  const handleEmailClick = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const { data: departmentsData, isLoading, isError, error } = useStaff();

  return (
    <BreadcrumbLayout>
      <div className="text-3xl font-bold text-black md:text-5xl">
        {t('staff.name')}
      </div>

      {isError && error && (
        <Notification
          type="error"
          message={error.message}
          notificationId="staff-error"
        />
      )}

      {isLoading ? (
        <Centered>
          <Loader />
        </Centered>
      ) : isError ? null : (
        departmentsData?.map((department) => {
          const visiblePositions = department.positions ?? [];

          return (
            <div key={department.id} className="mt-4 md:mt-10">
              <div className="flex items-center text-xl font-bold text-blue-900 md:text-4xl">
                <div>
                  {typeof department.name === 'string'
                    ? department.name
                    : JSON.stringify(department.name)}
                </div>

                <button
                  type="button"
                  className="ml-2 cursor-pointer"
                  onClick={() => handleEmailClick(department.email)}
                  aria-label={`Email ${String(department.name)}`}
                >
                  <IconMailOpened className="w-6 self-start stroke-blue-900 stroke-[2.5px] md:w-8" />
                </button>
              </div>

              <div className="flex flex-col">
                <div
                  id="staff-grid"
                  className="mt-4 flex w-full flex-wrap gap-2 md:mt-5"
                >
                  {visiblePositions.length === 0 ? (
                    <div className="text-base leading-5 text-neutral-400 md:text-xl">
                      {t('staff.nopositions')}
                    </div>
                  ) : (
                    visiblePositions.map((position) => {
                      const positionEmail = `${position.prefix.toLowerCase()}-${position.id.toLowerCase()}@ivao.aero`;

                      const isVacant = Number(position.is_vacant) === 1;
                      const hasUser = position.user != null;
                      const hasUserId = position.user?.id != null;

                      const imageSrc =
                        !hasUserId || isVacant
                          ? 'https://cdn.by.ivao.aero/images/staff/vacant.webp'
                          : `https://cdn.by.ivao.aero/images/staff/${position.user!.id}.webp`;

                      return (
                        <div
                          key={`${position.departmentId}-${position.prefix}-${position.id}`}
                          className="flex w-full flex-col md:w-80"
                        >
                          <img
                            src={imageSrc}
                            alt={
                              !hasUserId || isVacant
                                ? 'Vacant position'
                                : 'Staff Photo'
                            }
                            className="aspect-square w-full squircle-t-2xl"
                            loading="lazy"
                          />

                          <div className="flex w-full flex-col items-start squircle-b-2xl bg-white p-5 py-2 pl-2 md:py-5 md:pl-8">
                            <div className="md:text-md rounded-2xl bg-stone-300 px-3 py-1 text-sm font-medium leading-5 text-black md:px-3 md:py-1">
                              {typeof position.name === 'string'
                                ? position.name
                                : position.name?.en ?? ''}
                            </div>

                            <div className="mt-2 text-2xl font-bold leading-6 tracking-tighter text-black md:mt-3 md:text-4xl md:leading-8">
                              {isVacant ? (
                                'Вакантно'
                              ) : hasUser && position.user?.name?.last ? (
                                <>
                                  <span>{position.user.name.first}</span>
                                  <br />
                                  <span>{position.user.name.last}</span>
                                </>
                              ) : hasUser ? (
                                <>
                                  <span>{position.user?.name?.first ?? ''}</span>
                                  <br />
                                  <span>{position.user?.id ?? ''}</span>
                                </>
                              ) : (
                                <>
                                  <span>
                                    {typeof position.name === 'string'
                                      ? position.name
                                      : position.name?.en ?? ''}
                                  </span>
                                  <br />
                                  <span>{position.id}</span>
                                </>
                              )}
                            </div>

                            <div className="mt-2 flex gap-2.5 md:mt-3">
                              <div className="flex flex-row gap-2">
                                <button
                                  type="button"
                                  className="size-9 cursor-pointer rounded-xl bg-atmos-700 p-1.5 transition hover:bg-ocean-600 md:size-10 md:p-2"
                                  onClick={() => handleEmailClick(positionEmail)}
                                  aria-label={`Email ${position.prefix}-${position.id}`}
                                >
                                  <IconMailOpened className="text-white" />
                                </button>

                                {hasUserId && !isVacant && (
                                  <a
                                    className="size-9 cursor-pointer rounded-xl bg-atmos-700 p-1.5 transition hover:bg-ocean-600 md:size-10 md:p-2"
                                    href={`https://www.ivao.aero/staff/details.asp?Id=${position.prefix}-${position.id}`}
                                    target="_blank"
                                    aria-label={`IVAO profile ${position.prefix}-${position.id}`}
                                    rel="noreferrer"
                                  >
                                    <IconIdBadge2 className="text-white" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </BreadcrumbLayout>
  );
}
