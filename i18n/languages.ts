export type Language = 'en' | 'fr' ;

export const LANGUAGES: Record<
  Language,
  { label: string; flag: string }
> = {
  en: { label: 'English', flag: '🇺🇸' },
  fr: { label: 'French', flag: '🇫🇷' }
};

export const DEFAULT_LANGUAGE: Language = 'en';

export const isLanguage = (lang: string): lang is Language => {
  return Object.keys(LANGUAGES).includes(lang);
};