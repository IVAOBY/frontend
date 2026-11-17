// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL as string;

// Auth Configuration
export const getAuthLoginUrl = (returnUrl: string = window.location.href) => {
  // В mock-режиме SSO нет: «вход» — возврат на ту же страницу с профилем staff (см. src/mocks/session.ts).
  if (import.meta.env.VITE_API_MOCK === 'true') {
    const url = new URL(returnUrl);
    url.searchParams.set('mock_user', 'staff');
    return url.toString();
  }
  return `${API_BASE_URL}/auth/login?goto=${encodeURIComponent(returnUrl)}`;
};

// Local Storage Keys
export const STORAGE_KEYS = {
  LANGUAGE: 'language',
  WARNING_CLOSED: 'warningClosed',
} as const;
