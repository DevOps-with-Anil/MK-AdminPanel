'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { useState, useEffect } from 'react';
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
import { useParams, useRouter } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  getRoleById,
  updateRole,
} from '@/services/auth.service';

/* ================= TYPES ================= */

type Status = 'ACTIVE' | 'INACTIVE';

/* ✅ FIX: derive LangKey from constant */
const LANGUAGES = [
  { key: 'en', label: 'English' },
  { key: 'fr', label: 'French' },
  { key: 'ar', label: 'Arabic' },
  { key: 'ch', label: 'Chinese' },
] as const;

type LangKey = typeof LANGUAGES[number]['key'];

interface MultiLangText {
  en: string;
  fr: string;
  ar: string;
  ch: string;
}

interface RoleForm {
  name: MultiLangText;
  description: MultiLangText;
  status: Status;
}

type FieldErrors = {
  name?: Partial<Record<LangKey, string>>;
  description?: Partial<Record<LangKey, string>>;
  global?: string;
};

/* ================= CONSTANTS ================= */

const STATUS_OPTIONS: { label: string; value: Status }[] = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
];

/* ================= COMPONENT ================= */

function EditRoleContent() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState<RoleForm>({
    name: { en: '', fr: '', ar: '', ch: '' },
    description: { en: '', fr: '', ar: '', ch: '' },
    status: 'ACTIVE',
  });

  const [currentLang, setCurrentLang] = useState<LangKey>('en');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [success, setSuccess] = useState(false);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (id) fetchRole();
  }, [id]);

  const fetchRole = async () => {
    try {
      setLoadingData(true);

      const res = await getRoleById(id as string);

      console.log("Role data by ID : " + JSON.stringify(res?.data));

      /* ✅ FIX: support both API formats */
      const role = res?.data || res;

      setFormData({
        name: role.name || { en: '', fr: '', ar: '', ch: '' },
        description:
          role.description || { en: '', fr: '', ar: '', ch: '' },
        status: role.status || 'ACTIVE',
      });
    } catch (err) {
      setErrors({ global: 'Failed to load role' });
    } finally {
      setLoadingData(false);
    }
  };

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

    if (!formData.name.en.trim()) {
      newErrors.name = {
        en: 'English role name is required',
      };
    }

    return newErrors;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    setSuccess(false);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      const firstLang =
        Object.keys(validationErrors.name || {})[0] as LangKey;

      if (firstLang) setCurrentLang(firstLang);
      return;
    }

    setIsLoading(true);

    try {
      await updateRole(id as string, formData);

      setSuccess(true);

      setTimeout(() => {
        router.push('/admin/roles');
      }, 1000);
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
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/roles">
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

      {/* Layout (UNCHANGED) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Role Details</CardTitle>
              <CardDescription>
                Modify role in multiple languages
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
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
                  Role Name ({currentLang.toUpperCase()})
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
                  Description ({currentLang.toUpperCase()})
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
              <div>
                <Label className="mb-2 block">Status</Label>
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
                    <SelectValue placeholder="Select status" />
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
                  {isLoading ? 'Updating...' : 'Update Role'}
                </Button>

                <Link href="/admin/roles" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>

              {success && (
                <p className="text-green-600 text-sm">
                  Role updated successfully!
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
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