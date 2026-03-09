'use client';

import React, { useState } from 'react';
import { Language, LANGUAGE_CONFIG } from '@/i18n/translations';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  getMissingTranslations,
  copyTranslation,
  getLocalizedText,
  isRTLLanguage,
} from '@/i18n/langHelper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { AlertCircle, Copy } from 'lucide-react';

export interface MultiLangInputValue {
  [key: string]: string;
}

interface MultiLangInputProps {
  label?: string;
  description?: string;
  value: MultiLangInputValue;
  onChange: (value: MultiLangInputValue) => void;
  requiredLanguages?: Language[];
  supportedLanguages?: Language[];
  multiline?: boolean;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  showMissingIndicator?: boolean;
}

export function MultiLangInput({
  label,
  description,
  value,
  onChange,
  requiredLanguages = ['en'],
  supportedLanguages = ['en', 'hi', 'ar'],
  multiline = false,
  placeholder,
  error = false,
  disabled = false,
  showMissingIndicator = true,
}: MultiLangInputProps) {
  const { t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<Language>(
    (requiredLanguages[0] || 'en') as Language
  );

  const missingLangs = getMissingTranslations(value, requiredLanguages);
  const hasMissing = missingLangs.length > 0;

  const handleTextChange = (text: string) => {
    onChange({
      ...value,
      [selectedLang]: text,
    });
  };

  const handleCopyFrom = (sourceLang: Language) => {
    const updated = copyTranslation(value, sourceLang, selectedLang);
    onChange(updated);
  };

  const Component = multiline ? Textarea : Input;

  return (
    <div className="w-full space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">{label}</Label>
          {showMissingIndicator && hasMissing && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {t('multilang.missingTranslations')}
            </Badge>
          )}
        </div>
      )}

      {description && <p className="text-sm text-muted-foreground">{description}</p>}

      <div className="border rounded-lg overflow-hidden">
        <Tabs
          value={selectedLang}
          onValueChange={(v) => setSelectedLang(v as Language)}
          className="w-full"
        >
          <TabsList className="w-full flex h-auto rounded-none bg-muted border-b">
            {supportedLanguages.map(lang => {
              const isRequired = requiredLanguages.includes(lang);
              const isMissing = missingLangs.includes(lang);
              const hasContent = value[lang]?.trim().length > 0;

              return (
                <TabsTrigger
                  key={lang}
                  value={lang}
                  disabled={disabled}
                  className="flex-1 relative py-3 rounded-none data-[state=active]:bg-background"
                >
                  <div className="flex items-center gap-2">
                    <span>{LANGUAGE_CONFIG[lang].flag}</span>
                    <span className="text-sm font-medium">
                      {LANGUAGE_CONFIG[lang].name}
                    </span>
                  </div>

                  {isRequired && (
                    <span className="absolute top-1 right-1 text-red-500 text-xs font-bold">
                      *
                    </span>
                  )}

                  {isMissing && (
                    <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2" />
                  )}

                  {hasContent && !isMissing && (
                    <span className="absolute top-1 right-1 bg-green-500 rounded-full w-2 h-2" />
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {supportedLanguages.map(lang => (
            <TabsContent key={lang} value={lang} className="p-4 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">
                    {t('multilang.translation')} - {LANGUAGE_CONFIG[lang].name}
                  </div>
                  {requiredLanguages.includes(lang) && (
                    <span className="text-xs text-red-500">
                      {t('ui.required')}
                    </span>
                  )}
                </div>

                <Component
                  value={value[lang] || ''}
                  onChange={e => handleTextChange(e.target.value)}
                  placeholder={
                    placeholder ||
                    `${t('form.description')} (${LANGUAGE_CONFIG[lang].name})`
                  }
                  disabled={disabled}
                  className={`${
                    isRTLLanguage(lang)
                      ? 'text-right'
                      : 'text-left'
                  } ${error ? 'border-red-500' : ''}`}
                  style={{
                    direction: isRTLLanguage(lang) ? 'rtl' : 'ltr',
                  }}
                  rows={multiline ? 4 : undefined}
                />
              </div>

              {/* Copy from other languages */}
              {supportedLanguages.length > 1 && (
                <div className="pt-2 border-t">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={disabled}
                        className="w-full justify-start gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        {t('multilang.copyFrom')}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      {supportedLanguages.map(sourceLang => {
                        if (sourceLang === lang) return null;
                        const sourceText = value[sourceLang];
                        const hasSourceContent =
                          sourceText && sourceText.trim().length > 0;

                        return (
                          <DropdownMenuItem
                            key={sourceLang}
                            onClick={() => handleCopyFrom(sourceLang)}
                            disabled={!hasSourceContent}
                            className="cursor-pointer"
                          >
                            <span className="mr-2">
                              {LANGUAGE_CONFIG[sourceLang].flag}
                            </span>
                            <span>{LANGUAGE_CONFIG[sourceLang].name}</span>
                            {!hasSourceContent && (
                              <span className="ml-auto text-xs text-muted-foreground">
                                {t('ui.noResults')}
                              </span>
                            )}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Missing translations summary */}
      {hasMissing && showMissingIndicator && (
        <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 dark:bg-red-950">
          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-700 dark:text-red-300">
            {t('multilang.requiredLanguages')}: {missingLangs.map(l => LANGUAGE_CONFIG[l].name).join(', ')}
          </div>
        </div>
      )}
    </div>
  );
}

export default MultiLangInput;
