import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en.json";
import ruTranslation from "./locales/ru.json";

const resources = {
    en: {
        translation: enTranslation,
    },
    ru: {
        translation: ruTranslation,
    },
};

const storedLanguage = localStorage.getItem("language");

i18n.use(initReactI18next).init({
    resources,
    lng: storedLanguage || "en",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;