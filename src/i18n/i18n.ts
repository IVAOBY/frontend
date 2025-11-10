import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import { STORAGE_KEYS } from '../constants/app';
import translations from './locales';

const storedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE);

const i18nConfig = {
  resources: translations,
  lng: storedLanguage || 'en',
  fallbackLng: 'en',
  defaultNS: 'translations',
};

void i18n.use(LanguageDetector).use(initReactI18next).init(i18nConfig);

export default i18n;
