import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const configureI18n = (resources, language) => {
    if (!i18n.isInitialized) {
        i18n.use(initReactI18next).init({
            resources,
            lng: language,
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false
            },
            react: {
                useSuspense: false
            }
        });
    }

    return i18n;
};

export default i18n;
