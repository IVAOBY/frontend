import { useEffect, useState } from 'react';

import { IconAlertCircleFilled } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

import { CustomButton } from '../components/Button';
import { GeneralLayout } from '../components/Layout';
import { Title } from '../components/Typography/Title';
import { useApi } from '../context/ApiContext';

interface releaseResponse {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  author: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  };
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: Date;
  published_at: Date;
  assets: [
    {
      url: string;
      id: number;
      node_id: string;
      name: string;
      label: string;
      uploader: {
        login: string;
        id: number;
        node_id: string;
        avatar_url: string;
        gravatar_id: string;
        url: string;
        html_url: string;
        followers_url: string;
        following_url: string;
        gists_url: string;
        starred_url: string;
        subscriptions_url: string;
        organizations_url: string;
        repos_url: string;
        events_url: string;
        received_events_url: string;
        type: string;
        site_admin: false;
      };
      content_type: string;
      state: string;
      size: number;
      download_count: number;
      created_at: Date;
      updated_at: Date;
      browser_download_url: string;
    },
  ];
  tarball_url: string;
  zipball_url: string;
  body: string;
}

export function SectorFile() {
  // const { classes } = useStyles();
  const { t } = useTranslation();
  const [releaseData, setReleaseData] = useState<releaseResponse[]>([]);
  const api = useApi();

  useEffect(() => {
    api('/staff-departments')
      .then(function (response: any) {
        if (response && Array.isArray(response)) {
          setReleaseData(response);
        } else {
          console.error('Error: Unexpected API response structure');
        }
      })
      .catch(function (error: any) {
        console.error('Error fetching data:', error);
      });
  });

  return (
    <GeneralLayout>
      <Title className="text-4xl" withUndreline>
        {t('sector.title')}
      </Title>
      <div className="flex flex-col items-center">
        <div
          id="alert-additional-content-2"
          className="mb-4 mt-10 w-10/12 rounded-lg border border-semantic-red-500 p-4 text-semantic-red-500 dark:border-red-800 dark:bg-gray-800 dark:text-red-400 md:w-1/2"
          role="alert"
        >
          <div className="flex items-center">
            <IconAlertCircleFilled />
            <h3 className="text-lg font-medium">{t('sector.wtitle')}</h3>
          </div>
          <div className="mb-4 mt-2 text-sm">{t('sector.warning')}</div>
          <div className={'flex flex-row gap-2'}>
            <CustomButton
              title={'Скачать Aurora'}
              variant={'danger'}
              size={'lg'}
            ></CustomButton>
            <CustomButton
              title={'Узнать больше'}
              variant={'muted'}
              size={'lg'}
            ></CustomButton>
          </div>
        </div>
        <p className="text-black">{t('sector.text')}</p>
      </div>
    </GeneralLayout>
  );
}
