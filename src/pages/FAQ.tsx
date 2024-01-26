import {
  Accordion,
  Container,
  createStyles,
  rem,
  Text,
  Title,
} from '@mantine/core';
import {
  IconAwardOff,
  IconClockExclamation,
  IconLanguage,
  IconMailForward,
  IconPlugConnectedX,
  IconSos,
  IconTransfer,
  IconUserQuestion,
  IconUsers,
} from '@tabler/icons-react';
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
  root: {
    backgroundColor: '#fff',
    borderRadius: theme.radius.xl,
  },

  item: {
    borderRadius: theme.radius.xl,
    wordBreak: 'break-word',
    backgroundColor: '#fff',
    border: `${rem(1)} solid transparent`,
    position: 'relative',
    zIndex: 0,
    transition: 'transform 150ms ease',

    '&[data-active]': {
      color: '#000',
      transform: 'scale(1.03)',
      backgroundColor: 'white',
      boxShadow: theme.shadows.xl,
      borderRadius: theme.radius.lg,
      zIndex: 1,
    },
  },

  chevron: {
    '&[data-rotate]': {
      transform: 'rotate(-90deg)',
    },
  },
  text: {
    fontWeight: 600,
  },
}));

export function FAQ() {
  const { classes } = useStyles();
  const { t } = useTranslation();

  return (
    <Container size="lg" py="xl">
      <Title order={2} className={classes.title} ta="center" mt="sm">
        {t('FAQ.page.title')}
      </Title>
      <Accordion
        mt={25}
        maw={1000}
        mx="auto"
        variant="filled"
        defaultValue="customization"
        classNames={classes}
        className={classes.root}
      >
        <Accordion.Item value="1">
          <Accordion.Control
            icon={
              <IconPlugConnectedX
                size={rem(30)}
                fontWeight={700}
                color={'#0D2C99'}
              />
            }
          >
            <Text className={classes.text}>{t('FAQ.questions.1')}</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Text
              dangerouslySetInnerHTML={{ __html: t('FAQ.answers.1') || '' }}
            ></Text>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="2">
          <Accordion.Control
            icon={<IconUsers size={rem(30)} color={'#0D2C99'} />}
          >
            <Text className={classes.text}>{t('FAQ.questions.2')}</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Text
              dangerouslySetInnerHTML={{ __html: t('FAQ.answers.2') || '' }}
            ></Text>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="3">
          <Accordion.Control
            icon={<IconLanguage size={rem(30)} color={'#0D2C99'} />}
          >
            <Text className={classes.text}>{t('FAQ.questions.3')}</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Text
              dangerouslySetInnerHTML={{ __html: t('FAQ.answers.3') || '' }}
            ></Text>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="4">
          <Accordion.Control
            icon={<IconAwardOff size={rem(30)} color={'#0D2C99'} />}
          >
            <Text className={classes.text}>{t('FAQ.questions.4')}</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Text
              dangerouslySetInnerHTML={{ __html: t('FAQ.answers.4') || '' }}
            ></Text>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="5">
          <Accordion.Control
            icon={<IconUserQuestion size={rem(30)} color={'#0D2C99'} />}
          >
            <Text className={classes.text}>{t('FAQ.questions.5')}</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Text
              dangerouslySetInnerHTML={{ __html: t('FAQ.answers.5') || '' }}
            ></Text>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="6">
          <Accordion.Control
            icon={<IconMailForward size={rem(30)} color={'#0D2C99'} />}
          >
            <Text className={classes.text}>{t('FAQ.questions.6')}</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Text
              dangerouslySetInnerHTML={{ __html: t('FAQ.answers.6') || '' }}
            ></Text>
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="7">
          <Accordion.Control
            icon={<IconClockExclamation size={rem(30)} color={'#0D2C99'} />}
          >
            <Text className={classes.text}>{t('FAQ.questions.7')}</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Text
              dangerouslySetInnerHTML={{ __html: t('FAQ.answers.7') || '' }}
            ></Text>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="8">
          <Accordion.Control
            icon={<IconTransfer size={rem(30)} color={'#0D2C99'} />}
          >
            <Text className={classes.text}>{t('FAQ.questions.8')}</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Text
              dangerouslySetInnerHTML={{ __html: t('FAQ.answers.8') || '' }}
            ></Text>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="9">
          <Accordion.Control
            icon={<IconSos size={rem(30)} color={'#0D2C99'} />}
          >
            <Text className={classes.text}>{t('FAQ.questions.9')}</Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Text
              dangerouslySetInnerHTML={{ __html: t('FAQ.answers.9') || '' }}
            ></Text>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}
