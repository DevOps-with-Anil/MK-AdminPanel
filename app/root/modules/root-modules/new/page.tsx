'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { useState } from 'react';
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
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { createRootModules } from '@/services/auth.service';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  LANGUAGES,
  DEFAULT_LANGUAGE,
  Language,
} from '@/i18n/languages';

import { MultiLangTabs } from '@/components/common/MultiLangTabs';
import { MultiLangInput } from '@/components/common/MultiLangInput';

/* ================= TYPES ================= */
type Status = 'ACTIVE' | 'INACTIVE';
type MultiLangText = Record<Language, string>;

interface ActionItem {
  key: string;
  actionName: MultiLangText;
  status: Status;
}

interface ModuleForm {
  key: string;
  name: MultiLangText;
  status: Status;
  actions: ActionItem[];
}

type ActionError = {
  key?: string;
  name?: Partial<Record<Language, string>>;
};

type FieldErrors = {
  moduleKey?: string;
  moduleName?: Partial<Record<Language, string>>;
  actions?: ActionError[];
  global?: string;
};

/* ================= HELPERS ================= */
const createEmptyLangObject = (): MultiLangText => {
  return Object.keys(LANGUAGES).reduce((acc, lang) => {
    acc[lang as Language] = '';
    return acc;
  }, {} as MultiLangText);
};

/* ================= COMPONENT ================= */
function ModulePage() {
  const [formData, setFormData] = useState<ModuleForm>({
    key: '',
    name: createEmptyLangObject(),
    status: 'ACTIVE',
    actions: [],
  });

  const [currentLang, setCurrentLang] = useState<Language>(
    DEFAULT_LANGUAGE
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState(false);

  /* ================= HANDLERS ================= */
  const handleModuleStatusChange = (status: Status) => {
    setFormData(prev => ({
      ...prev,
      status,
      actions:
        status === 'INACTIVE'
          ? prev.actions.map(a => ({ ...a, status: 'INACTIVE' }))
          : prev.actions,
    }));
  };

  const handleAddAction = () => {
    setFormData(prev => ({
      ...prev,
      actions: [
        ...prev.actions,
        {
          key: '',
          actionName: createEmptyLangObject(),
          status:
            prev.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
        },
      ],
    }));
  };

  const handleDeleteAction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index),
    }));
  };

  const handleActionChange = (
    index: number,
    field: keyof ActionItem,
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.map((a, i) =>
        i === index
          ? {
              ...a,
              [field]:
                prev.status === 'INACTIVE' &&
                field === 'status'
                  ? 'INACTIVE'
                  : value,
            }
          : a
      ),
    }));
  };

  const handleInputChange = (
    field: keyof ModuleForm,
    lang: Language,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...(prev[field] as MultiLangText),
        [lang]: value,
      },
    }));
  };

  const handleActionNameChange = (
    index: number,
    lang: Language,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.map((a, i) =>
        i === index
          ? {
              ...a,
              actionName: {
                ...a.actionName,
                [lang]: value,
              },
            }
          : a
      ),
    }));
  };

  /* ================= VALIDATION ================= */
  const validate = (): FieldErrors => {
    const newErrors: FieldErrors = {};

    if (!formData.key.trim()) {
      newErrors.moduleKey = 'Module key is required';
    }

    if (!formData.name[DEFAULT_LANGUAGE].trim()) {
      newErrors.moduleName = {
        [DEFAULT_LANGUAGE]: 'Module name is required',
      };
    }

    const actionErrors: ActionError[] = [];

    formData.actions.forEach((a, i) => {
      const err: ActionError = {};

      if (!a.key.trim()) {
        err.key = 'Action key is required';
      }

      if (!a.actionName[DEFAULT_LANGUAGE].trim()) {
        err.name = {
          [DEFAULT_LANGUAGE]: 'Action name is required',
        };
      }

      if (Object.keys(err).length > 0) {
        actionErrors[i] = err;
      }
    });

    if (actionErrors.length > 0) {
      newErrors.actions = actionErrors;
    }

    return newErrors;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    setSuccess(false);
    setErrors({});

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setCurrentLang(DEFAULT_LANGUAGE);
      return;
    }

    const payload = {
      key: formData.key,
      moduleName: formData.name,
      status: formData.status,
      actions: formData.actions.map(a => ({
        key: a.key,
        actionName: a.actionName,
        status: a.status || 'ACTIVE',
      })),
    };

    setIsLoading(true);

    try {
      await createRootModules(payload);
      setSuccess(true);
      setErrors({});
      setFormData({
        key: '',
        name: createEmptyLangObject(),
        status: 'ACTIVE',
        actions: [],
      });
    } catch (err: any) {
      setErrors({
        global: err?.message || 'Failed to create module',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/root/modules/root-modules">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>

        <div>
          <h1 className="text-xl font-medium">
            Create Module & Actions
          </h1>
          <p className="text-muted-foreground">
            Add a new Module with multilingual support
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Module Details</CardTitle>
          <CardDescription>
            Fill module information in multiple languages
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {success && (
            <p className="text-green-800">
              Module created successfully!
            </p>
          )}

          {errors.global && (
            <p className="text-red-500">{errors.global}</p>
          )}

          {/* Language Tabs */}
          <MultiLangTabs
            currentLang={currentLang}
            onChange={setCurrentLang}
          />

          {/* Module Key */}
          <div className="space-y-2">
            <Label>Module Key *</Label>
            <Input
              value={formData.key}
              onChange={e =>
                setFormData({
                  ...formData,
                  key: e.target.value,
                })
              }
            />
            {errors.moduleKey && (
              <p className="text-xs text-red-500">
                {errors.moduleKey}
              </p>
            )}
          </div>

          {/* Module Name */}
          <MultiLangInput
            label="Module Name"
            value={formData.name}
            currentLang={currentLang}
            onChange={(lang, value) =>
              handleInputChange('name', lang, value)
            }
            error={errors.moduleName?.[currentLang]}
          />

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={formData.status}
              onValueChange={handleModuleStatusChange}
            >
              <SelectTrigger className="w-full min-w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">
                  Active
                </SelectItem>
                <SelectItem value="INACTIVE">
                  Inactive
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <CardTitle>Actions Details</CardTitle>

            <Button
              size="lg"
              variant="outline"
              onClick={handleAddAction}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Action
            </Button>

            {formData.actions.map((action, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 p-4 rounded-lg space-y-4 relative shadow-sm"
              >
                <button
                  onClick={() => handleDeleteAction(index)}
                  className="absolute right-3 top-3 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* ACTION KEY */}
                <div className="space-y-2">
                  <Label>Action Key *</Label>
                  <Input
                    value={action.key}
                    onChange={e =>
                      handleActionChange(index, 'key', e.target.value)
                    }
                  />
                  {errors.actions?.[index]?.key && (
                    <p className="text-xs text-red-500">
                      {errors.actions[index].key}
                    </p>
                  )}
                </div>

                {/* ACTION NAME */}
                {/* <div className="space-y-2">
                  <Label>
                    Action Name ({currentLang.toUpperCase()}) *
                  </Label>
                  <Input
                    value={action.actionName[currentLang]}
                    onChange={e =>
                      handleActionNameChange(
                        index,
                        currentLang,
                        e.target.value
                      )
                    }
                  />
                  {errors.actions?.[index]?.name?.[currentLang] && (
                    <p className="text-xs text-red-500">
                      {
                        errors.actions[index].name?.[
                          currentLang
                        ]
                      }
                    </p>
                  )}
                </div> */}


                <MultiLangInput
  label="Action Name"
  value={action.actionName}
  currentLang={currentLang}
  onChange={(lang, value) =>
    handleActionNameChange(index, lang, value)
  }
  error={errors.actions?.[index]?.name?.[currentLang]}
/>

                {/* STATUS */}
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={action.status}
                    disabled={formData.status === 'INACTIVE'}
                    onValueChange={val =>
                      handleActionChange(index, 'status', val)
                    }
                  >
                    <SelectTrigger className="w-full min-w-[220px] bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">
                        Active
                      </SelectItem>
                      <SelectItem value="INACTIVE">
                        Inactive
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              Create Module
            </Button>

            <Link href="/root/modules/root-modules">
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <AdminProvider>
      <ModulePage />
    </AdminProvider>
  );
}