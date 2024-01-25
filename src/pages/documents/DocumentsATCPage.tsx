import {
  Container,
  createStyles,
  Flex,
  Paper,
  rem,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { IconCircleX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import { DocumentsCategoryType, DocumentsType } from '../../hooks/types';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../context/ApiContext';

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: rem(34),
    fontWeight: 800,
    color: theme.colors.blue[9],
    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(24),
    },
    '&::after': {
      content: '""',
      display: 'block',
      backgroundColor: theme.fn.primaryColor(),
      width: rem(45),
      height: rem(2),
      marginTop: theme.spacing.sm,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  card: {
    minWidth: rem(100),
    minHeight: rem(120),
  },
  button: {
    position: 'relative',
    borderRadius: theme.radius.lg,
    boxShadow: '0px 10px 23px -4px rgba(34, 60, 80, 0.2)',
    overflow: 'hidden',
    transition: 'transform 0.4s ease, box-shadow 0.4s ease',
    '&:hover': {
      transform: 'scale(1.01)',
      boxShadow: '0px 50px 50px rgba(0, 0, 0, 0.2)',
    },
  },
}));

export function DocumentsATCPage() {
  const { classes, theme } = useStyles();
  const [documentsCategory, setDocumentsCategory] = useState<
    DocumentsCategoryType[]
  >([]);
  const [documents, setDocuments] = useState<DocumentsType[]>([]);
  const { t, i18n } = useTranslation();
  const api = useApi();

  useEffect(() => {
    api('/documents-category')
      .then(function (response: any) {
        if (response && Array.isArray(response)) {
          setDocumentsCategory(response);
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

    api('/documents')
      .then((response: any) => {
        if (response && Array.isArray(response)) {
          const documents: DocumentsType[] = response.map((documentdata) => ({
            id: documentdata.id,
            category: documentdata.category,
            name: documentdata.name,
            content: documentdata.content,
            published: documentdata.published,
          }));
          setDocuments(documents);

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
  }, []);

  const navigate = useNavigate();
  const documentsRedirect = (documentsItem: DocumentsType) => {
    navigate(`/documents/${documentsItem.id}`);
  };

  return (
    <Container size={'xl'} py={'xl'}>
      {documentsCategory
        .filter((category) => parseInt(category.id) === 1)
        .map((category, index) => (
          <>
            <Title order={2} className={classes.title} ta="center" mt="sm">
              {category.name[i18n.language]}
            </Title>
            <div key={index}>
              <Flex direction="column" align="center">
                <Flex
                  id="staff-grid"
                  mt={13}
                  gap="md"
                  justify="center"
                  align="center"
                  direction="row"
                  wrap="wrap"
                >
                  {documents
                    .filter(
                      (document) =>
                        document.category === category.id && document.published,
                    )
                    .map((documents, positionIndex) => (
                      <UnstyledButton
                        key={documents.id}
                        className={classes.button}
                        style={{ width: 'auto', height: 'auto' }}
                        onClick={() => documentsRedirect(documents)}
                      >
                        <Paper
                          className={classes.card}
                          shadow={'lg'}
                          p={'xl'}
                          radius="lg"
                          key={positionIndex}
                          bg="#fff"
                        >
                          <Title order={3} color={theme.colors.blue[9]} mt={20}>
                            {documents.name[i18n.language]}
                          </Title>
                        </Paper>
                      </UnstyledButton>
                    ))}
                </Flex>
              </Flex>
            </div>
          </>
        ))}
    </Container>
  );
}
