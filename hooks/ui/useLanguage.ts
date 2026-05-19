// hooks/ui/useLanguage.ts

'use client';

import { useContext, useState } from 'react';
import { I18nContext } from '@/i18n/provider';

export function useLanguage() {

    const { locale } =
        useContext(I18nContext);

    const [currentLang, setCurrentLang] =
        useState(locale);

    return {
        locale,
        currentLang,
        setCurrentLang,
    };
}