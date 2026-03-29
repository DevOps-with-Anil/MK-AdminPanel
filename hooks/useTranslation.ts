// import { useContext } from 'react';
// import { I18nContext } from '@/i18n/provider';

// export const useTranslation = () => {
//   const { messages } = useContext(I18nContext);

//   const t = (key: string, placeholders?: Record<string, string | number>) => {
//     const value = key.split('.').reduce((obj: any, k: string) => obj?.[k], messages);
//     if (!value) return key;

//     if (placeholders) {
//       return Object.keys(placeholders).reduce(
//         (str, ph) => str.replace(`{{${ph}}}`, String(placeholders[ph])),
//         value
//       );
//     }

//     return value;
//   };

//   return { t };
// };


import { useContext, useCallback } from 'react';
import { I18nContext } from '@/i18n/provider';

type Messages = Record<string, unknown>;
type InterpolationValues = Record<string, string | number | boolean>;

export const useTranslation = () => {
  const { messages } = useContext(I18nContext);

  // safely get nested value
  const getValue = (obj: Messages, path: string): unknown => {
    return path.split('.').reduce<unknown>((acc, key) => {
      if (typeof acc === 'object' && acc !== null && key in acc) {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  };

  const t = useCallback(
    (
      key: string,
      placeholders?: InterpolationValues,
      fallback?: string
    ): string => {
      const raw = getValue(messages, key);

      // if not string → fallback or key
      if (typeof raw !== 'string') {
        return fallback || key;
      }

      // no placeholders → return directly
      if (!placeholders) return raw;

      // replace ALL {{placeholders}}
      return raw.replace(/{{(.*?)}}/g, (_, p: string) => {
        const value = placeholders[p.trim()];
        return value !== undefined && value !== null
          ? String(value)
          : '';
      });
    },
    [messages]
  );

  return { t };
};