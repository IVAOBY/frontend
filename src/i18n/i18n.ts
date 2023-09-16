import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resources from "./locales";

const storedLanguage = localStorage.getItem("language");

const i18nConfig = {
    resources: resources,
    lng: storedLanguage || "en",
    fallbackLng: 'en'
}

i18n
    .use(initReactI18next)
    .init(i18nConfig)

export default i18n;