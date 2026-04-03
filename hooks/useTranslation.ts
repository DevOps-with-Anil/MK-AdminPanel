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

  const resolveTranslation = (key: string) => {
    const normalizedKey = key.startsWith('translate.') ? key.slice('translate.'.length) : key;
    const keyVariants = [key, normalizedKey];

    for (const candidate of keyVariants) {
      const nestedValue = candidate
        .split('.')
        .reduce((obj: any, segment: string) => obj?.[segment], messages);

      if (typeof nestedValue === 'string') {
        return nestedValue;
      }

      const directValue = messages?.[candidate];
      if (typeof directValue === 'string') {
        return directValue;
      }
    }

    return null;
  };

  const t = (key: string, placeholders?: Record<string, string | number>) => {
    const value = resolveTranslation(key);
    if (!value) return key;

    if (placeholders) {
      return Object.keys(placeholders).reduce(
        (str, ph) =>
          str
            .replaceAll(`{{${ph}}}`, String(placeholders[ph]))
            .replaceAll(`{${ph}}`, String(placeholders[ph])),
        value
      );
    }

    return value;
  };

  return { t };
};
