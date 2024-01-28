import {
  Button,
  Container,
  Group,
  Image,
  Paper,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';

import bylogoblue from '../assets/image/logobyblue.svg';
import { MessagesType } from '../hooks/types';


export function MessageOverlay({
  title,
  message,
  link,
  linkTitle,
}: MessagesType) {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const HandleNavigate = () => {
    navigate(link);
  };

  return (
    <Container maw={350} mt={20}>
      <Paper bg={'#fff'} p={40} shadow={theme.shadows.lg} radius="lg">
        <Image src={bylogoblue} alt="Logo" maw={150} mx="auto" />
        <Text
          mt={10}
          size={25}
          fw={700}
          color={theme.colors.blue[9]}
          align="center"
        >
          {title}
        </Text>
        <Text align="center">{message}</Text>
        <Group position="center" mt={5}>
          <Button
            mt={15}
            bg={theme.colors.blue[9]}
            onClick={() => {
              HandleNavigate();
            }}
          >
            {linkTitle}
          </Button>
        </Group>
      </Paper>
    </Container>
  );
}
