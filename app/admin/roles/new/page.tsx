
'use client';

import { useContext, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { createRole } from '@/services/auth.service';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { I18nContext } from '@/i18n/provider';

/* ================= TYPES ================= */

type Status = 'ACTIVE' | 'INACTIVE';

type LangKey = 'en' | 'fr' | 'ar' | 'ch';

interface MultiLangText {
  en: string;
  fr: string;
  ar: string;
  ch: string;
}

interface NewRoleForm {
  name: MultiLangText;
  description: MultiLangText;
  status: Status;
}

/* âœ… ERROR STRUCTURE */
type FieldErrors = {
  name?: Partial<Record<LangKey, string>>;
  description?: Partial<Record<LangKey, string>>;
  global?: string;
};

/* ================= CONSTANTS ================= */

const LANGUAGES: { key: LangKey; label: string }[] = [
  { key: 'en', label: 'English' },
  { key: 'fr', label: 'French' },
  { key: 'ar', label: 'Arabic' },
  { key: 'ch', label: 'Chinese' },
];

const STATUS_OPTIONS: { label: string; value: Status }[] = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
];

/* ================= COMPONENT ================= */

export default function NewRolePage() {
  const { messages } = useContext(I18nContext);
  const t = (key: string, placeholders?: Record<string, string | number>) => {
    const normalizedKey = key.replace(/^translate\./, '');
    let value = messages.translate?.[normalizedKey] || key;

    if (placeholders) {
      for (const [ph, phValue] of Object.entries(placeholders)) {
        value = value.replace(`{{${ph}}}`, String(phValue));
        value = value.replace(`{${ph}}`, String(phValue));
      }
    }

    return value;
  };
  const [formData, setFormData] = useState<NewRoleForm>({
    name: { en: '', fr: '', ar: '', ch: '' },
    description: { en: '', fr: '', ar: '', ch: '' },
    status: 'ACTIVE',
  });

  const [currentLang, setCurrentLang] = useState<LangKey>('en');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ================= HANDLERS ================= */

  const handleInputChange = (
    field: 'name' | 'description',
    lang: LangKey,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
    // clear only that field+lang error
    setErrors(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: undefined,
      },
      global: undefined,
    }));
  };

  /* âœ… VALIDATION FUNCTION */
  const validate = (): FieldErrors => {
    const newErrors: FieldErrors = {};
    // Required: English name
    if (!formData.name.en.trim()) {
      newErrors.name = {
        ...newErrors.name,
        en: 'English role name is required',
      };
    }
    // Optional: validate other langs if filled (example rule)
    (['fr', 'ar', 'ch'] as LangKey[]).forEach(lang => {
      if (formData.name[lang] && formData.name[lang].length < 2) {
        newErrors.name = {
          ...newErrors.name,
          [lang]: 'Must be at least 2 characters',
        };
      }
    });
    return newErrors;
  };

  const handleSubmit = async () => {
    setSuccess(false);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // auto switch to first error language
      const firstLang =
        Object.keys(validationErrors.name || {})[0] as LangKey;
      if (firstLang) setCurrentLang(firstLang);
      return;
    }
    setIsLoading(true);
    try {
      await createRole(formData);
      setSuccess(true);
      setErrors({});
      setFormData({
        name: { en: '', fr: '', ar: '', ch: '' },
        description: { en: '', fr: '', ar: '', ch: '' },
        status: 'ACTIVE',
      });
    } catch (err: any) {
      setErrors({
        global: err?.message || 'Failed to create role',
      });
    } finally {
      setIsLoading(false);
    }
  };


  /* ================= UI ================= */

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/roles">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>

        <div>
          <h1 className="text-xl font-medium">{t('translate.roles.createTitle')}</h1>
          <p className="text-muted-foreground">
            {t('translate.roles.createSubtitle')}
          </p>
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('translate.roles.details')}</CardTitle>
              <CardDescription>
                {t('translate.roles.detailsSubtitle')}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Global Error */}
              {errors.global && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  {errors.global}
                </div>
              )}

              {/* Language Tabs */}
              <div className="flex gap-2 flex-wrap">
                {LANGUAGES.map(lang => (
                  <Button
                    key={lang.key}
                    size="sm"
                    variant={
                      currentLang === lang.key
                        ? 'default'
                        : 'outline'
                    }
                    onClick={() => setCurrentLang(lang.key)}
                  >
                    {lang.label}
                  </Button>
                ))}
              </div>

              {/* Name */}
              <div>
                <Label className="mb-2 block">
                  {t('translate.roles.roleName')} ({currentLang.toUpperCase()})
                </Label>
                <Input
                  value={formData.name[currentLang]}
                  onChange={e =>
                    handleInputChange(
                      'name',
                      currentLang,
                      e.target.value
                    )
                  }
                />
                {errors.name?.[currentLang] && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.name[currentLang]}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label className="mb-2 block">
                  {t('translate.roles.description')} ({currentLang.toUpperCase()})
                </Label>
                <Input
                  value={formData.description[currentLang]}
                  onChange={e =>
                    handleInputChange(
                      'description',
                      currentLang,
                      e.target.value
                    )
                  }
                />
              </div>

              {/* Status */}
              {/* Status (same grid style as admin form) */}
              {/* Status */}
              <div>
                <Label className="mb-2 block">{t('translate.roles.status')}</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val: Status) =>
                    setFormData(prev => ({
                      ...prev,
                      status: val,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('translate.roles.selectStatus')} />
                  </SelectTrigger>

                  <SelectContent>
                    {STATUS_OPTIONS.map(option => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="gap-2 flex-1"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? t('translate.roles.creating') : t('translate.roles.createBtn')}
                </Button>

                <Link href="/admin/roles" className="flex-1">
                  <Button variant="outline" className="w-full">
                    {t('translate.roles.cancel')}
                  </Button>
                </Link>
              </div>

              {/* Success */}
              {success && (
                <p className="text-green-600 text-sm">
                  {t('translate.roles.success')}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

