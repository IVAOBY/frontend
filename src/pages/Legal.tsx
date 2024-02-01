import {
  Container,
  createStyles,
  List,
  Paper,
  rem,
  Text,
  Title,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';

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
  subtitle: {
    color: theme.colors.lightBlue[9],
  },
}));

export function Legal() {
  const { classes } = useStyles();
  const { t } = useTranslation();

  return (
    <Container size="lg" py="xl">
      <Title order={2} className={classes.title} ta="center" mt="sm">
        {t('legal.title')}
      </Title>
      <Paper shadow={'lg'} radius={'lg'} bg="#fff" p={'lg'} mt={rem(16)}>
        <Text size={15}>{t('legal.text')}</Text>
        <br />
        <List size={'sm'} withPadding>
          <List.Item>
            <a
              target={'_blank'}
              href={'https://wiki.ivao.aero/en/home/ivao/privacypolicy'}
              rel="noreferrer"
            >
              {' '}
              {t('legal.privacypolicy')}
            </a>
          </List.Item>
          <List.Item>
            <a
              target={'_blank'}
              href={'https://wiki.ivao.aero/en/home/ivao/terms-of-use'}
              rel="noreferrer"
            >
              {' '}
              {t('legal.termsofuse')}
            </a>
          </List.Item>
          <List.Item>
            <a
              target={'_blank'}
              href={
                'https://wiki.ivao.aero/en/home/ivao/intellectual-property-policy'
              }
              rel="noreferrer"
            >
              {' '}
              {t('legal.ipp')}
            </a>
          </List.Item>
        </List>
      </Paper>
    </Container>
  );
}
