'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGE_CONFIG } from '@/i18n/translations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage, supportedLanguages, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title={t('ui.language')}
          className="relative"
        >
          <span className="text-lg">{LANGUAGE_CONFIG[currentLanguage].flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {supportedLanguages.map(lang => (
          <DropdownMenuCheckboxItem
            key={lang}
            checked={currentLanguage === lang}
            onCheckedChange={() => setLanguage(lang)}
            className="cursor-pointer"
          >
            <span className="mr-2">{LANGUAGE_CONFIG[lang].flag}</span>
            <span>{LANGUAGE_CONFIG[lang].name}</span>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
