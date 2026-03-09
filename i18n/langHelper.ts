/**
 * Language Helper Utilities
 * Handles multi-language content validation, copying, and formatting
 */

import { Language } from './translations';

export interface MultiLangValue {
  [key: string]: string;
}

/**
 * Check if a multi-language object has all required translations
 */
export function hasAllTranslations(
  value: MultiLangValue | undefined,
  requiredLanguages: Language[]
): boolean {
  if (!value) return false;
  return requiredLanguages.every(lang => value[lang]?.trim().length > 0);
}

/**
 * Get missing translations for required languages
 */
export function getMissingTranslations(
  value: MultiLangValue | undefined,
  requiredLanguages: Language[]
): Language[] {
  if (!value) return requiredLanguages;
  return requiredLanguages.filter(lang => !value[lang]?.trim().length);
}

/**
 * Copy translation from one language to another
 */
export function copyTranslation(
  value: MultiLangValue,
  fromLang: Language,
  toLang: Language
): MultiLangValue {
  return {
    ...value,
    [toLang]: value[fromLang] || '',
  };
}

/**
 * Copy translation to all missing languages
 */
export function copyToMissing(
  value: MultiLangValue,
  fromLang: Language,
  allLanguages: Language[]
): MultiLangValue {
  const result = { ...value };
  const sourceText = value[fromLang];

  if (sourceText?.trim()) {
    allLanguages.forEach(lang => {
      if (!result[lang]?.trim().length) {
        result[lang] = sourceText;
      }
    });
  }

  return result;
}

/**
 * Get display text for current language with fallback to English
 */
export function getLocalizedText(
  value: MultiLangValue | string | undefined,
  lang: Language
): string {
  if (!value) return '';

  // If it's a simple string, return it
  if (typeof value === 'string') return value;

  // If it's an object, try current language then fallback to English
  return value[lang] || value['en'] || '';
}

/**
 * Validate multi-language value completeness
 */
export function validateMultiLang(
  value: MultiLangValue | undefined,
  requiredLanguages: Language[]
): {
  isValid: boolean;
  missing: Language[];
  errors: string[];
} {
  const errors: string[] = [];
  const missing = getMissingTranslations(value, requiredLanguages);

  if (missing.length > 0) {
    errors.push(`Missing translations for: ${missing.join(', ')}`);
  }

  // Check for empty values
  if (!value) {
    errors.push('No translations provided');
  }

  return {
    isValid: errors.length === 0,
    missing,
    errors,
  };
}

/**
 * Format multi-language value for API submission
 * Ensures all values are trimmed and properly formatted
 */
export function formatMultiLangForAPI(value: MultiLangValue): MultiLangValue {
  const result: MultiLangValue = {};
  
  Object.entries(value).forEach(([lang, text]) => {
    const trimmed = text?.trim() || '';
    if (trimmed) {
      result[lang] = trimmed;
    }
  });

  return result;
}

/**
 * Initialize empty multi-language object with all supported languages
 */
export function initializeMultiLang(languages: Language[]): MultiLangValue {
  const result: MultiLangValue = {};
  languages.forEach(lang => {
    result[lang] = '';
  });
  return result;
}

/**
 * Check if text direction is RTL (Right-to-Left)
 */
export function isRTLLanguage(lang: Language): boolean {
  return lang === 'ar';
}

/**
 * Get text alignment based on language direction
 */
export function getTextAlignment(lang: Language): 'left' | 'right' {
  return isRTLLanguage(lang) ? 'right' : 'left';
}
