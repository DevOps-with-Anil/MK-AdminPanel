'use client';

import { AdminProvider, useAdmin } from '@/contexts/AdminContext';
import { useState, useEffect, useContext, use } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

import { getRoleById, updateRole } from '@/services/auth.service';

import { I18nContext } from '@/i18n/provider';
import { LANGUAGES, DEFAULT_LANGUAGE, Language } from '@/i18n/languages';

import { MultiLangTabs } from '@/components/common/MultiLangTabs';
import { MultiLangInput } from '@/components/common/MultiLangInput';
import { MultiLangTextarea } from '@/components/common/MultiLangTextarea';

import { AppMessage } from '@/components/common/AppMessage';
import { useAppMessage } from '@/hooks/ui/useAppMessage';



/* ================= TYPES ================= */

type Status = 'ACTIVE' | 'INACTIVE';

type MultiLang<T> = Record<Language, T>;
type MultiLangText = MultiLang<string>;

interface RoleForm {
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

const languageList = languageKeys.map(lang => ({
  key: lang,
  label: LANGUAGES[lang].label,
  flag: LANGUAGES[lang].flag,
}));

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

export default function EditRoleContent() {

  const { t } = useAdmin();
  const { id } = useParams();
  const router = useRouter();
  const { locale } = useContext(I18nContext);

  const [currentLang, setCurrentLang] = useState<Language>(locale);

  const [formData, setFormData] = useState<RoleForm>({
    name: createMultiLangObject(),
    description: createMultiLangObject(),
    status: 'ACTIVE',
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  // const [success, setSuccess] = useState(false);

  const { message, type, visible, showMessage, clearMessage } = useAppMessage();

  /* ================= FETCH ================= */

  useEffect(() => {
    if (id) fetchRole();
  }, [id]);

  const fetchRole = async () => {
    try {
      setLoadingData(true);

      const res = await getRoleById(id as string);
      const role = res?.data || res;

      setFormData({
        name: { ...createMultiLangObject(), ...role.name },
        description: {
          ...createMultiLangObject(),
          ...role.description,
        },
        status: role.status || 'ACTIVE',
      });

    } catch {
      setErrors({ global: 'Failed to load role' });
    } finally {
      setLoadingData(false);
    }
  };

  /* ================= HANDLERS ================= */

  const handleInputChange = (
    field: keyof Pick<RoleForm, 'name' | 'description'>,
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

  /* ================= VALIDATION ================= */

  const validate = (): FieldErrors => {
    const newErrors: FieldErrors = {};

    if (!formData.name[DEFAULT_LANGUAGE]?.trim()) {
      newErrors.name = {
        [DEFAULT_LANGUAGE]: `${LANGUAGES[DEFAULT_LANGUAGE].label} role name is required`,
      };
    }

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

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      const firstLang = Object.keys(validationErrors.name ?? {})[0] as Language;
      if (firstLang) setCurrentLang(firstLang);

      return;
    }

    setIsLoading(true);

    try {

      const res = await updateRole(id as string, formData);

      showMessage(
        res?.message || "Role updated successfully!",
        "success"
      );


      // setTimeout(() => {
      //   router.push('/root/roles');
      // }, 1000);

    } catch (err: any) {
      setErrors({
        global: err?.message || 'Failed to update role',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= UI ================= */


  if (loadingData) {
    return <p className="p-6">{t("translate.loading_role")}</p>;
  }

  return (
    <div className="space-y-6 max-w-6xl">

      {/* HEADER */}
      <div className="flex items-center gap-4">

        <Link href="/root/roles">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>

        <div>
          <h1 className="text-xl font-medium">
            {t("translate.edit_role_title")}
          </h1>

          <p className="text-muted-foreground">
            {t("translate.edit_role_description")}
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
                {t("translate.role_details_edit_description")}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">

              {/* ERROR */}
              {errors.global && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  {errors.global}
                </div>
              )}

              {/* LANG SWITCH */}
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
                    <SelectValue placeholder={t("translate.select_status")} />
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
                    ? t("translate.updating")
                    : t("translate.update_role")}
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

