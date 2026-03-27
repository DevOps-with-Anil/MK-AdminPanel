
'use client';

import { createContext, useEffect, useState, ReactNode } from 'react';
import { loadLocale } from '@/i18n/index';
import enMessages from '@/i18n/locales/en.json';

interface I18nContextProps {
  locale: string;
  changeLanguage: (lang: string) => Promise<void>;
  messages: Record<string, any>;
}

export const I18nContext = createContext<I18nContextProps>({
  locale: 'en',
  changeLanguage: async () => {},
  messages: {}
});

const DEFAULT_LOCALE = 'en';
const localeCache: Record<string, { translate: Record<string, any> }> = {
  en: { translate: enMessages },
};

const getInitialLocale = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  return localStorage.getItem('lang') || DEFAULT_LOCALE;
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState(getInitialLocale);
  const [messages, setMessages] = useState<Record<string, any>>(localeCache.en);

  useEffect(() => {
    const savedLang = getInitialLocale();
    setLocale(savedLang);

    if (localeCache[savedLang]) {
      setMessages(localeCache[savedLang]);
      return;
    }

    loadLocale(savedLang).then((loadedMessages) => {
      localeCache[savedLang] = loadedMessages;
      setMessages(loadedMessages);
    });
  }, []);

  const changeLanguage = async (lang: string) => {
    localStorage.setItem('lang', lang);
    setLocale(lang);

    if (localeCache[lang]) {
      setMessages(localeCache[lang]);
      return;
    }

    const msgs = await loadLocale(lang);
    localeCache[lang] = msgs;
    setMessages(msgs);
  };

  return (
    <I18nContext.Provider value={{ locale, changeLanguage, messages }}>
      {children}
    </I18nContext.Provider>
  );
};
