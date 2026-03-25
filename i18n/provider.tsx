
// 'use client';

// import { createContext, useEffect, useState, ReactNode } from 'react';
// import { loadLocale } from '@/i18n/index';

// interface I18nContextProps {
//   locale: string;
//   changeLanguage: (lang: string) => Promise<void>;
//   messages: Record<string, any>;
// }

// export const I18nContext = createContext<I18nContextProps>({
//   locale: 'en',
//   changeLanguage: async () => {},
//   messages: {}
// });

// export const I18nProvider = ({ children }: { children: ReactNode }) => {
//   const [locale, setLocale] = useState('en');
//   const [messages, setMessages] = useState<Record<string, any>>({});

//   // load saved or default language
//   useEffect(() => {
//     const savedLang = localStorage.getItem('lang') || 'en';
//     setLocale(savedLang);

//     loadLocale(savedLang).then(setMessages);
//   }, []);

//   const changeLanguage = async (lang: string) => {
//     localStorage.setItem('lang', lang);
//     setLocale(lang);
//     const msgs = await loadLocale(lang);
//     setMessages(msgs);
//   };

//   return (
//     <I18nContext.Provider value={{ locale, changeLanguage, messages }}>
//       {children}
//     </I18nContext.Provider>
//   );
// };


'use client';

import { createContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { loadLocale } from '@/i18n/index';

interface I18nContextProps {
  locale: string;
  changeLanguage: (lang: string) => Promise<void>;
  messages: Record<string, any>;
  t: (key: string) => string; 
}

export const I18nContext = createContext<I18nContextProps>({
  locale: 'en',
  changeLanguage: async () => {},
  messages: {},
  t: (key: string) => key,
});

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState('en');
  const [messages, setMessages] = useState<Record<string, any>>({});

  // ✅ Load initial language
  useEffect(() => {
    const savedLang = localStorage.getItem('lang') || 'en';
    setLocale(savedLang);

    loadLocale(savedLang).then(setMessages);
  }, []);

  // ✅ Change language
  const changeLanguage = async (lang: string) => {
    localStorage.setItem('lang', lang);
    setLocale(lang);

    const msgs = await loadLocale(lang);
    setMessages(msgs);
  };

  // ✅ Translation function (supports nested keys)
  const t = useCallback(
    (key: string): string => {
      const keys = key.split('.');
      let value: any = messages;

      for (let k of keys) {
        value = value?.[k];
        if (!value) return key; // fallback
      }

      return typeof value === 'string' ? value : key;
    },
    [messages]
  );

  return (
    <I18nContext.Provider value={{ locale, changeLanguage, messages, t }}>
      {children}
    </I18nContext.Provider>
  );
};