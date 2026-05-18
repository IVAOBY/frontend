// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL as string;

// Auth Configuration
export const getAuthLoginUrl = (returnUrl: string = window.location.href) =>
  `${API_BASE_URL}/auth/login?goto=${encodeURIComponent(returnUrl)}`;

// Local Storage Keys
export const STORAGE_KEYS = {
  LANGUAGE: 'language',
  WARNING_CLOSED: 'warningClosed',
} as const;
