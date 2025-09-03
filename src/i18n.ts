import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from './i18n/locales/en.json';
import hi from './i18n/locales/hi.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('preferred-language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;