
'use client';

import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { loadLocale } from '@/i18n';
import {
  LANGUAGES,
  DEFAULT_LANGUAGE,
  Language,
  isLanguage,
} from '@/i18n/languages';

// recursive message type
type Messages = {
  [key: string]: string | Messages;
};

type InterpolationValues = Record<string, string | number | boolean>;

interface I18nContextProps {
  locale: Language;
  changeLanguage: (lang: Language) => Promise<void>;
  messages: Messages;
  t: (key: string, vars?: InterpolationValues, fallback?: string) => string;
}

export const I18nContext = createContext<I18nContextProps>({
  locale: DEFAULT_LANGUAGE,
  changeLanguage: async () => { },
  messages: {},
  t: (key: string) => key,
});

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<Language>(DEFAULT_LANGUAGE);
  const [messages, setMessages] = useState<Messages>({});
  const [loading, setLoading] = useState(true);

  // ✅ load initial language safely
  useEffect(() => {
    const init = async () => {
      try {
        const savedLang = localStorage.getItem('lang');

        const lang =
          savedLang && isLanguage(savedLang)
            ? savedLang
            : DEFAULT_LANGUAGE;

        const msgs = await loadLocale(lang);

        setLocale(lang);
        setMessages(msgs);
      } catch (err) {
        console.error('Failed to initialize i18n:', err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // change language safely
  const changeLanguage = useCallback(async (lang: Language) => {
    try {
      localStorage.setItem('lang', lang);
      setLocale(lang);

      const msgs = await loadLocale(lang);
      setMessages(msgs);
    } catch (err) {
      console.error(`Failed to change language to ${lang}`, err);
    }
  }, []);

  // safe nested getter
  const getValue = (obj: Messages, path: string): unknown => {
    return path.split('.').reduce<unknown>((acc, key) => {
      if (typeof acc === 'object' && acc !== null && key in acc) {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  };

  // translation function
  const t = useCallback(
    (
      key: string,
      vars?: InterpolationValues,
      fallback?: string
    ): string => {
      const raw = getValue(messages, key);

      if (typeof raw !== 'string') {
        return fallback || key;
      }

      if (!vars) return raw;

      return raw.replace(/{{(.*?)}}/g, (_, v: string) => {
        const value = vars[v.trim()];
        return value !== undefined && value !== null
          ? String(value)
          : '';
      });
    },
    [messages]
  );

  // ⛔ prevent UI flicker before language loads
  if (loading) return null;

  return (
    <I18nContext.Provider value={{ locale, changeLanguage, messages, t }}>
      {children}
    </I18nContext.Provider>
  );
};