import type { MockProfile } from './data/users';

import { profiles } from './data/users';

export type SessionProfile = MockProfile | 'guest';

const STORAGE_KEY = 'mock:profile';
export const PROFILE_PARAM = 'mock_user';

const isProfile = (value: unknown): value is SessionProfile =>
  value === 'guest' || (typeof value === 'string' && value in profiles);

export const getProfile = (): SessionProfile => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isProfile(stored) ? stored : 'staff';
  } catch {
    return 'staff';
  }
};

export const setProfile = (profile: SessionProfile) => {
  try {
    localStorage.setItem(STORAGE_KEY, profile);
  } catch {
    // без localStorage профиль просто не переживёт перезагрузку
  }
};

export const currentUser = () => {
  const profile = getProfile();
  return profile === 'guest' ? null : profiles[profile];
};

// `?mock_user=staff|member|guest` переключает профиль; так же работает «вход» в mock-режиме.
export const applyProfileFromUrl = () => {
  const url = new URL(window.location.href);
  const requested = url.searchParams.get(PROFILE_PARAM);
  if (!requested) return;
  if (isProfile(requested)) setProfile(requested);
  url.searchParams.delete(PROFILE_PARAM);
  window.history.replaceState(window.history.state, '', url);
};
