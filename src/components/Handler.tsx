import { useEffect, useState } from 'react';

import { createStyles, Menu, rem, UnstyledButton } from '@mantine/core';
import { IconLogout, IconUser } from '@tabler/icons-react';
import jwtDecode from 'jwt-decode';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { DecodedTokenInt } from '../hooks/types';

function getTokenFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('token');
}

function removeTokenFromUrl() {
  if (window.history.replaceState) {
    const urlWithoutToken =
      window.location.protocol +
      '//' +
      window.location.host +
      window.location.pathname;
    window.history.replaceState({}, document.title, urlWithoutToken);
  }
}

function getDecodedToken(token: string): DecodedTokenInt | null {
  try {
    return jwtDecode<DecodedTokenInt>(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export const logOutButtonStyle = createStyles((theme) => ({
  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(1)} ${rem(7)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: '#fff',
    fontSize: theme.fontSizes.sm,
    fontWeight: 700,
    fontFamily: 'Montserrat',
    cursor: 'pointer',
    '&:hover': { color: theme.colors.gray[3] },
  },

  linkScrolled: {
    color: theme.colors.blue[9],
    '&:hover': { color: theme.colors.lightBlue[8] },
  },
}));

function LogoutButton() {
  const { classes } = logOutButtonStyle();
  const [decodedToken, setDecodedToken] = useState<DecodedTokenInt | null>(
    null,
  );
  const navigate = useNavigate();
  const [scrollPosition, setScrollPosition] = useState(0);

  const HandleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTokenExpiration');

    navigate('/');
  };

  const HandleProfile = () => {
    navigate('/profile');
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = getDecodedToken(token);
        setDecodedToken(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const { t } = useTranslation();

  return decodedToken ? (
    <Menu radius="lg" shadow="md" width={200}>
      <Menu.Target>
        <UnstyledButton
          className={`${classes.link} ${scrollPosition > 0 ? classes.linkScrolled : ''}`}
        >
          {decodedToken.userData.name.first} {decodedToken.userData.id}
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item icon={<IconUser size={14} />} onClick={HandleProfile}>
          {t('navbar.user.profile')}
        </Menu.Item>
        <Menu.Item
          color="red"
          icon={<IconLogout size={14} />}
          onClick={HandleLogout}
        >
          {t('navbar.user.logout')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  ) : null;
}

export { LogoutButton, getDecodedToken, getTokenFromUrl, removeTokenFromUrl };
