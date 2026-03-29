
import { Language } from '@/i18n/languages';

export type MultiLang<T> = Record<Language, T>;
export type MultiLangText = MultiLang<string>;