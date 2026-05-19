'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { useState, useEffect, useContext } from 'react';
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

function EditRoleContent() {
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
    return <p className="p-6">Loading role...</p>;
  }

  return (
    <div className="space-y-6 max-w-6xl">

      {/* Page Header + Navigation */}
      <div className="flex items-center gap-4">
        <Link href="/root/roles">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>

        <div>
          <h1 className="text-xl font-medium">Edit Role</h1>
          <p className="text-muted-foreground">
            Update role details
          </p>
        </div>
      </div>

      {/* Main Layout (Form Section) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">

          {/* Role Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>Role Details</CardTitle>
              <CardDescription>
                Modify role in multiple languages
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">

              {/* Global API / Submission Error */}
              {errors.global && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  {errors.global}
                </div>
              )}

              {/* Language Switcher (controls current editing language) */}
              <MultiLangTabs
                currentLang={currentLang}
                onChange={setCurrentLang}
              />

              {/* Role Name (multilingual input) */}
              <MultiLangInput
                label="Role Name"
                value={formData.name}
                currentLang={currentLang}
                onChange={(lang, value) =>
                  handleInputChange('name', lang, value)
                }
                error={errors.name?.[currentLang]}
              />

              {/* Description (multilingual textarea) */}
              <MultiLangTextarea
                label="Description"
                value={formData.description}
                currentLang={currentLang}
                onChange={(lang, value) =>
                  handleInputChange('description', lang, value)
                }
              />

              {/* Role Status Selector */}
              <div>
                <Label className="mb-2 block">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val: Status) =>
                    setFormData(prev => ({ ...prev, status: val }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>

                  <SelectContent>
                    {STATUS_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Form Actions (Submit / Cancel) */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="gap-2 flex-1"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? 'Updating...' : 'Update Role'}
                </Button>

                <Link href="/root/roles" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* RIGHT SIDE RESPONSE MESSAGE */}
      <AppMessage
        visible={visible}
        message={message}
        type={type}
        onClose={clearMessage}
      />
    </div>
  );
}

/* ================= EXPORT ================= */

export default function EditRolePage() {
  return (
    <AdminProvider>
      <EditRoleContent />
    </AdminProvider>
  );
}