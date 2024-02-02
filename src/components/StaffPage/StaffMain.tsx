import { useEffect, useState } from 'react';

import { notifications } from '@mantine/notifications';
import { IconCircleX, IconIdBadge2, IconMailOpened } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { useApi } from '../../context/ApiContext';
import { GeneralLayout } from '../Layout';
import { Tooltip } from '../Tooltip';
import { Title } from '../Typography/Title';

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
  is_vacant: number; // new property
}

export function StaffMain() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const { t } = useTranslation();
  const api = useApi();

  const handleEmailClick = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  useEffect(() => {
    api('/staff-departments')
      .then(function (response: any) {
        if (response && Array.isArray(response)) {
          setDepartments(response);
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

    api('/staff-positions')
      .then((response: any) => {
        if (response && Array.isArray(response)) {
          const positions: Position[] = response.map((positionData) => ({
            departmentId: positionData.departmentId,
            id: positionData.id,
            name: positionData.name,
            prefix: positionData.prefix,
            order: positionData.order,
            user: {
              id: positionData.user.id,
              name: {
                first: positionData.user.name.first,
                last: positionData.user.name.last,
              },
            },
            description: positionData.description,
            is_vacant: positionData.is_vacant,
          }));
          setPositions(positions);

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
    <GeneralLayout>
      <Title withUndreline>{t('staff.name')}</Title>
      {departments.map((department, index) => (
        <div key={index} className="mt-10">
          <div className="flex flex-col items-center justify-items-center">
            <Title key={index} className={`pt-${index === 0 ? 13 : 40}`}>
              {department.name}
            </Title>
            <div
              className="mt-2 cursor-pointer rounded-xl bg-atmos-700 p-2 transition hover:bg-ocean-600"
              onClick={() => handleEmailClick(department.email)}
            >
              <IconMailOpened className={'text-white'} />
            </div>

            <div
              id="staff-grid"
              className="mt-5 flex flex-row flex-wrap items-center justify-center gap-2 text-center"
            >
              {positions
                .filter(
                  (position) =>
                    position.departmentId === department.id &&
                    (position.user.id !== null || position.is_vacant === 1),
                )
                .sort((a, b) => {
                  if (a.user.id === null && b.user.id !== null) {
                    return 1;
                  } else if (a.user.id !== null && b.user.id === null) {
                    return -1;
                  } else {
                    return a.order - b.order;
                  }
                })
                .map((position, positionIndex) => (
                  <div
                    className="min-w-[350px] rounded-2xl bg-white p-10 shadow-xl"
                    key={positionIndex}
                  >
                    <div className="flex flex-col items-center">
                      <img
                        className="max-h-[150px] max-w-[150px] rounded-[100px]"
                        src={
                          position.user.id
                            ? `https://xr.ivao.aero/images/staff_photo/${position.user.id}.jpg`
                            : 'https://static.game-explore.space/staff/vacant.png'
                        }
                        alt={'Staff Photo'}
                      />
                      <Title className="text-[24px]">
                        {position.user.id
                          ? position.user.name.last
                            ? `${position.user.name.first} ${position.user.name.last}`
                            : `${position.user.name.first} ${position.user.id}`
                          : 'Вакантно'}
                      </Title>
                      <Tooltip
                        content={position.name['en']}
                        position={'bottom'}
                      >
                        <p
                          className={
                            'text-base font-semibold text-fuselage-400'
                          }
                        >
                          {position.prefix}-{position.id}
                        </p>
                      </Tooltip>
                      <div className={'mt-20 flex flex-row gap-2'}>
                        <div
                          className="mt-2 cursor-pointer rounded-xl bg-atmos-700 p-2 transition hover:bg-ocean-600"
                          onClick={() =>
                            handleEmailClick(
                              `${position.prefix}-${position.id}@ivao.aero\``,
                            )
                          }
                        >
                          <IconMailOpened className={'text-white'} />
                        </div>
                        <a
                          className="mt-2 cursor-pointer rounded-xl bg-atmos-700 p-2 transition hover:bg-ocean-600"
                          href={`https://www.ivao.aero/staff/details.asp?Id=${position.prefix}-${position.id}`}
                          target="_blank"
                          aria-label="IVAO"
                          rel="noreferrer"
                        >
                          <IconIdBadge2 className={'text-white'} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
    </GeneralLayout>
  );
}
