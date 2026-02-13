'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, LANGUAGE_CONFIG, UI_TRANSLATIONS } from '@/i18n/translations';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  direction: 'ltr' | 'rtl';
  t: (key: string) => string;
  supportedLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [isClient, setIsClient] = useState(false);

  // Initialize from localStorage on client
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('app-language') as Language | null;
    if (saved && ['en', 'hi', 'ar'].includes(saved)) {
      setCurrentLanguage(saved);
      document.documentElement.lang = saved;
      document.documentElement.dir = LANGUAGE_CONFIG[saved].dir;
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    localStorage.setItem('app-language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = LANGUAGE_CONFIG[lang].dir;
  };

  const t = (key: string): string => {
    return UI_TRANSLATIONS[currentLanguage][key] || key;
  };

  const direction = LANGUAGE_CONFIG[currentLanguage].dir;

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage: handleSetLanguage,
        direction,
        t,
        supportedLanguages: ['en', 'hi', 'ar'],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
