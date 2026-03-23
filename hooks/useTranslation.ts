// import { useContext } from 'react';
// import { I18nContext } from '@/i18n/provider';

// export const useTranslation = () => {
//   const { messages } = useContext(I18nContext);

//   const t = (key: string) => {
//     const value = key.split('.').reduce((obj, k) => obj?.[k], messages);
//     return value ?? key; // ✅ correct fallback
//   };

//   return { t };
// };

import { useContext } from 'react';
import { I18nContext } from '@/i18n/provider';

export const useTranslation = () => {
  const { messages } = useContext(I18nContext);

  const t = (key: string, placeholders?: Record<string, string | number>) => {
    const value = key.split('.').reduce((obj: any, k: string) => obj?.[k], messages);
    if (!value) return key;

    if (placeholders) {
      return Object.keys(placeholders).reduce(
        (str, ph) => str.replace(`{{${ph}}}`, String(placeholders[ph])),
        value
      );
    }

    return value;
  };

  return { t };
};