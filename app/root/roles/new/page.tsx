
'use client';

import { AdminProvider, useAdmin } from '@/contexts/AdminContext';
import { useState, useContext, useEffect } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

import { I18nContext } from '@/i18n/provider';
import { LANGUAGES, DEFAULT_LANGUAGE, Language } from '@/i18n/languages';

import { MultiLangTabs } from '@/components/common/MultiLangTabs';
import { MultiLangInput } from '@/components/common/MultiLangInput';
import { MultiLangTextarea } from '@/components/common/MultiLangTextarea';

import { createRole } from '@/services/auth.service';
import { AppMessage } from '@/components/common/AppMessage';
import { useAppMessage } from '@/hooks/ui/useAppMessage';

/* ================= TYPES ================= */

type Status = 'ACTIVE' | 'INACTIVE';

type MultiLang<T> = Record<Language, T>;
type MultiLangText = MultiLang<string>;

interface NewRoleForm {
  name: MultiLangText;
  description: MultiLangText;
  status: Status;
}

type FieldErrors = {
  name?: Partial<MultiLangText>;
  description?: Partial<MultiLangText>;
  global?: string;
};

/* ================= CONSTANTS ================= */

const languageKeys = Object.keys(LANGUAGES) as Language[];

const STATUS_OPTIONS = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
] as const;

/* ================= HELPERS ================= */

const createMultiLangObject = (): MultiLangText =>
  languageKeys.reduce((acc, lang) => {
    acc[lang] = '';
    return acc;
  }, {} as MultiLangText);

/* ================= COMPONENT ================= */

export default function NewRoleContent() {

  const { t } = useAdmin();
  const { locale } = useContext(I18nContext);

  const [currentLang, setCurrentLang] = useState<Language>(locale);

  const [formData, setFormData] = useState<NewRoleForm>({
    name: createMultiLangObject(),
    description: createMultiLangObject(),
    status: 'ACTIVE',
  });

  const [errors, setErrors] = useState<FieldErrors>({});

  const [isLoading, setIsLoading] = useState(false);

  const { message, type, visible, showMessage, clearMessage } = useAppMessage();


  // const [success, setSuccess] = useState(false);

  useEffect(() => {
    setCurrentLang(locale);
  }, [locale]);

  /* ================= HANDLERS ================= */

  const handleInputChange = (
    field: keyof Pick<NewRoleForm, 'name' | 'description'>,
    lang: Language,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));

    setErrors(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: undefined,
      },
      global: undefined,
    }));
  };

  const validate = (): FieldErrors => {
    const newErrors: FieldErrors = {};

    // Required: default language
    if (!formData.name[DEFAULT_LANGUAGE]?.trim()) {
      newErrors.name = {
        [DEFAULT_LANGUAGE]: `${LANGUAGES[DEFAULT_LANGUAGE].label} role name is required`,
      };
    }

    // Validate other languages
    languageKeys.forEach(lang => {
      if (lang === DEFAULT_LANGUAGE) return;

      const value = formData.name[lang];
      if (value && value.length < 2) {
        newErrors.name = {
          ...newErrors.name,
          [lang]: 'Must be at least 2 characters',
        };
      }
    });

    return newErrors;
  };

  const handleSubmit = async () => {
    // setSuccess(false);

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      const firstLang = Object.keys(validationErrors.name ?? {})[0] as Language;
      if (firstLang) setCurrentLang(firstLang);

      return;
    }

    setIsLoading(true);

    try {
      const res = await createRole(formData);
      showMessage(
        res?.message || "Role created successfully!",
        "success"
      );
      setErrors({});
      setFormData({
        name: createMultiLangObject(),
        description: createMultiLangObject(),
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

      {/* PAGE HEADER */}
      <div className="flex items-center gap-4">

        <Link href="/root/roles">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>

        <div>
          <h1 className="text-xl font-medium">
            {t("translate.create_role_title")}
          </h1>

          <p className="text-muted-foreground">
            {t("translate.create_role_description")}
          </p>
        </div>

      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        <div className="lg:col-span-2">

          <Card>

            <CardHeader>
              <CardTitle>
                {t("translate.role_details_title")}
              </CardTitle>

              <CardDescription>
                {t("translate.role_details_description")}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">

              {/* GLOBAL ERROR */}
              {errors.global && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  {errors.global}
                </div>
              )}

              {/* LANGUAGE TABS */}
              <MultiLangTabs
                currentLang={currentLang}
                onChange={setCurrentLang}
              />

              {/* ROLE NAME */}
              <MultiLangInput
                label={t("translate.role_name")}
                value={formData.name}
                currentLang={currentLang}
                onChange={(lang, value) =>
                  handleInputChange("name", lang, value)
                }
                error={errors.name?.[currentLang]}
              />

              {/* DESCRIPTION */}
              <MultiLangTextarea
                label={t("translate.role_description")}
                value={formData.description}
                currentLang={currentLang}
                onChange={(lang, value) =>
                  handleInputChange("description", lang, value)
                }
              />

              {/* STATUS */}
              <div>
                <Label className="mb-2 block">
                  {t("translate.status")}
                </Label>

                <Select
                  value={formData.status}
                  onValueChange={(val: Status) =>
                    setFormData((prev) => ({ ...prev, status: val }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={t("translate.select_status")}
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
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

              {/* ACTIONS */}
              <div className="flex gap-3">

                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="gap-2 flex-1"
                >
                  <Save className="w-4 h-4" />

                  {isLoading
                    ? t("translate.creating")
                    : t("translate.create_role")}
                </Button>

                <Link href="/root/roles" className="flex-1">
                  <Button variant="outline" className="w-full">
                    {t("translate.cancel")}
                  </Button>
                </Link>

              </div>

            </CardContent>
          </Card>

        </div>

      </div>

      {/* MESSAGE */}
      <AppMessage
        visible={visible}
        message={message}
        type={type}
        onClose={clearMessage}
      />

    </div>
  );

}
