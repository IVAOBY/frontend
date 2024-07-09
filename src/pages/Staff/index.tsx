import { useEffect, useState } from 'react';

import { notifications } from '@mantine/notifications';
import { IconCircleX, IconIdBadge2, IconMailOpened } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { BreadcrumbLayout } from '../../components/Layout';
import { useApi } from '../../context/ApiContext';

interface Department {
  id: string;
  name: string;
  email: string;
}

interface Position {
  departmentId: string;
  id: string;
  name: {
    en: string;
    ru: string | null;
  };
  prefix: string;
  order: number;
  user: {
    id: number;
    name: {
      first: string;
      last: string;
    };
  };
  description: {
    en: string;
    ru: string | null;
  } | null;
  is_vacant: number;
}

export function StaffPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const { t } = useTranslation();
  const api = useApi();

  const handleEmailClick = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  useEffect(() => {
    api('/staff-departments')
      .then((response: any) => {
        if (response && Array.isArray(response)) {
          setDepartments(response);
        } else {
          console.error('Error: Unexpected API response structure');
        }
      })
      .catch((error: any) => {
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

    api('/staff-positions')
      .then((response: Position) => {
        console.log(response);
        if (response && Array.isArray(response)) {
          const updatedPositions: Position[] = response.map(
            (positionData: Position) => {
              const user = positionData.user
                ? {
                    id: positionData.user.id,
                    name: {
                      first: positionData.user.name.first,
                      last:
                        positionData.user.name.last ||
                        positionData.user.id.toString(),
                    },
                  }
                : null;
              return {
                ...positionData,
                user,
              };
            },
          );
          setPositions(updatedPositions);

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
  }, [api, t]);

  return (
    <BreadcrumbLayout>
      <div className="text-3xl font-bold text-black md:text-5xl">
        {t('staff.name')}
      </div>
      {departments.map((department) => (
        <div key={department.id} className="mt-4 md:mt-10">
          <div className="flex items-center text-xl font-bold text-blue-900 md:text-4xl">
            <div>{department.name}</div>
            <div
              className="ml-2 cursor-pointer"
              onClick={() => handleEmailClick(department.email)}
            >
              <IconMailOpened className="w-6 self-start stroke-blue-900 stroke-[2.5px] md:w-8" />
            </div>
          </div>
          <div className="flex flex-col">
            <div
              id="staff-grid"
              className="mt-4 flex w-full flex-wrap gap-2 md:mt-5"
            >
              {positions
                .filter(
                  (position) =>
                    position.departmentId === department.id &&
                    (position.user || position.is_vacant === 1),
                )
                .sort((a, b) => {
                  const aUserId = a.user?.id ?? Number.MAX_VALUE;
                  const bUserId = b.user?.id ?? Number.MAX_VALUE;

                  if (
                    aUserId === Number.MAX_VALUE &&
                    bUserId !== Number.MAX_VALUE
                  ) {
                    return 1;
                  } else if (
                    aUserId !== Number.MAX_VALUE &&
                    bUserId === Number.MAX_VALUE
                  ) {
                    return -1;
                  } else {
                    return a.order - b.order;
                  }
                })
                .map((position) => (
                  <div
                    key={position.id}
                    className="flex w-full flex-col md:w-80"
                  >
                    {/*TODO: Mobile optimization, 2 cols*/}
                    <img
                      src={
                        position.user?.id
                          ? `https://cdn.by.ivao.aero/images/staff/${position.user?.id}.jpg`
                          : 'https://cdn.by.ivao.aero/images/staff/vacant.jpg'
                      }
                      alt="Staff Photo"
                      className="aspect-square w-full rounded-t-2xl"
                    />
                    <div className="flex w-full flex-col items-start rounded-b-2xl bg-white p-5 py-2 pl-2 md:py-5 md:pl-8">
                      <div className="md:text-md rounded-2xl bg-stone-300 px-3 py-1 text-sm font-medium leading-5 text-black md:px-3 md:py-1">
                        {position.name.en}
                      </div>
                      <div className="mt-2 text-2xl font-bold leading-6 tracking-tighter text-black md:mt-3 md:text-4xl md:leading-8">
                        {position.user?.id ? (
                          <>
                            <span>{position.user.name.first}</span>
                            <br />
                            <span>{position.user.name.last}</span>
                          </>
                        ) : (
                          'Вакантно'
                        )}
                      </div>

                      <div className="mt-2 flex gap-2.5 md:mt-3">
                        <div className="flex flex-row gap-2">
                          <div
                            className="size-9 cursor-pointer rounded-xl bg-atmos-700 p-1.5 transition hover:bg-ocean-600 md:size-10 md:p-2"
                            onClick={() =>
                              handleEmailClick(
                                `${position.prefix.toLowerCase()}-${position.id.toLowerCase()}@ivao.aero`,
                              )
                            }
                          >
                            <IconMailOpened className="text-white" />
                            {/*TODO: Change mail to staff application*/}
                          </div>
                          {position.user && (
                            <a
                              className="size-9 cursor-pointer rounded-xl bg-atmos-700 p-1.5 transition hover:bg-ocean-600 md:size-10 md:p-2"
                              href={`https://www.ivao.aero/staff/details.asp?Id=${position.prefix}-${position.id}`}
                              target="_blank"
                              aria-label="IVAO"
                              rel="noreferrer"
                            >
                              <IconIdBadge2 className="text-white" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {positions.filter(
                (position) =>
                  position.departmentId === department.id &&
                  (position.is_vacant === 1 || position.user !== null),
              ).length === 0 && (
                <div className="text-base leading-5 text-neutral-400 md:text-xl">
                  {t('staff.nopositions')}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </BreadcrumbLayout>
  );
}
