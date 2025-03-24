import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./languages/en.json";
import tr from "./languages/tr.json";

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        tr: { translation: tr }
    },
    lng: localStorage.getItem("language") || "en", // Set default language
    fallbackLng: "en",
    interpolation: { escapeValue: false }
});

export default i18n;
