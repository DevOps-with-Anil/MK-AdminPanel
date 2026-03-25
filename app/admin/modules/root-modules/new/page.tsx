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

/* ================= ERRORS ================= */
type FieldErrors = {
  moduleKey?: string;
  moduleName?: Partial<Record<LangKey, string>>;
  actions?: {
    key?: string;
    name?: Partial<Record<LangKey, string>>;
  }[];
  global?: string;
};

/* ================= CONSTANTS ================= */
const LANGUAGES: { key: LangKey; label: string }[] = [
  { key: 'en', label: 'English' },
  { key: 'fr', label: 'French' },
  { key: 'ar', label: 'Arabic' },
  { key: 'ch', label: 'Chinese' },
];

/* ================= COMPONENT ================= */
function ModulePage() {
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
  const [formData, setFormData] = useState<ModuleForm>({
    key: '',
    name: { en: '', fr: '', ar: '', ch: '' },
    status: 'ACTIVE',
    actions: [],
  });

  const [currentLang, setCurrentLang] = useState<LangKey>('en');
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
          actionName: { en: '', fr: '', ar: '', ch: '' },
          status: prev.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
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
              [field]: prev.status === 'INACTIVE' && field === 'status' ? 'INACTIVE' : value,
            }
          : a
      ),
    }));
  };

  const handleActionNameChange = (index: number, lang: LangKey, value: string) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions.map((a, i) =>
        i === index
          ? { ...a, actionName: { ...a.actionName, [lang]: value } }
          : a
      ),
    }));
  };

  /* ================= VALIDATION ================= */
  const validate = (): FieldErrors => {
    const newErrors: FieldErrors = {};

    if (!formData.key.trim()) newErrors.moduleKey = 'Module key is required';
    if (!formData.name.en.trim()) newErrors.moduleName = { en: 'English module name is required' };

    const actionErrors: any[] = [];

    formData.actions.forEach((a, i) => {
      const err: any = {};
      if (!a.key.trim()) err.key = 'Action key is required';
      if (!a.actionName.en.trim()) err.name = { en: 'English action name is required' };
      if (Object.keys(err).length > 0) actionErrors[i] = err;
    });

    if (actionErrors.length > 0) newErrors.actions = actionErrors;

    return newErrors;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    setSuccess(false);
    setErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setCurrentLang('en');
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
      // Clear form after success
      setFormData({ key: '', name: { en: '', fr: '', ar: '', ch: '' }, status: 'ACTIVE', actions: [] });
    } catch (err: any) {
      setErrors({ global: err?.message || 'Failed to create module' });
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/modules/root-modules">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>

        <div>
          <h1 className="text-xl font-medium">{t('translate.modules.createTitle')}</h1>
          <p className="text-muted-foreground">{t('translate.modules.createSubtitle')}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('translate.modules.detailsTitle')}</CardTitle>
          <CardDescription>{t('translate.modules.detailsDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Success / Global Error */}
          {success && <p className="text-green-800">{t('translate.modules.success')}</p>}
          {errors.global && <p className="text-red-500">{errors.global}</p>}

          {/* ðŸŒ GLOBAL LANGUAGE TABS */}
          <div className="flex gap-2 flex-wrap mb-4">
            {LANGUAGES.map(lang => (
              <Button
                key={lang.key}
                size="sm"
                variant={currentLang === lang.key ? 'default' : 'outline'}
                onClick={() => setCurrentLang(lang.key)}
              >
                {lang.label}
              </Button>
            ))}
          </div>

          {/* Module Key */}
          <div className="space-y-2">
            <Label>{t('translate.modules.keyLabel')} *</Label>
            <Input
              value={formData.key}
              onChange={e => setFormData({ ...formData, key: e.target.value })}
            />
            {errors.moduleKey && <p className="text-xs text-red-500">{errors.moduleKey}</p>}
          </div>
          {/* Module Name */}
          <div className="space-y-2">
            <Label>{t('translate.modules.nameLabel')} ({currentLang.toUpperCase()}) *</Label>
            <Input
              value={formData.name[currentLang]}
              onChange={e =>
                setFormData(prev => ({ ...prev, name: { ...prev.name, [currentLang]: e.target.value } }))
              }
            />
            {errors.moduleName?.[currentLang] && (
              <p className="text-xs text-red-500">{errors.moduleName[currentLang]}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>{t('translate.plans.statusLabel')}</Label>
            <Select value={formData.status} onValueChange={handleModuleStatusChange}>
              <SelectTrigger className="w-full min-w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">{t('translate.plans.active')}</SelectItem>
                <SelectItem value="INACTIVE">{t('translate.plans.inactive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-base">{t('translate.modules.actionsTitle')}</CardTitle>
                <CardDescription>{t('translate.modules.actionsDesc')}</CardDescription>
              </div>
              <Button size="sm" variant="outline" className="bg-white hover:bg-gray-50" onClick={handleAddAction}>
                <Plus className="w-4 h-4 mr-1" />
                {t('translate.modules.addActionBtn')}
              </Button>
            </div>

            {formData.actions.map((action, index) => (
              <div key={index} className="relative p-4 border rounded-lg shadow-sm">
                <button
                  onClick={() => handleDeleteAction(index)}
                  className="absolute right-3 top-3 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* ACTION KEY */}
                <div className="space-y-2">
                  <Label>{t('translate.modules.actionKeyLabel')} *</Label>
                  <Input
                    value={action.key}
                    onChange={e => handleActionChange(index, 'key', e.target.value)}
                  />
                  {errors.actions?.[index]?.key && (
                    <p className="text-xs text-red-500">{errors.actions[index].key}</p>
                  )}
                </div>

                {/* ACTION NAME */}
                <div className="space-y-2">
                  <Label>{t('translate.modules.actionNameLabel')} ({currentLang.toUpperCase()}) *</Label>
                  <Input
                    value={action.actionName[currentLang]}
                    onChange={e => handleActionNameChange(index, currentLang, e.target.value)}
                  />
                  {errors.actions?.[index]?.name?.[currentLang] && (
                    <p className="text-xs text-red-500">{errors.actions[index].name[currentLang]}</p>
                  )}
                </div>

                {/* STATUS */}
                <div className="space-y-2">
                  <Label>{t('translate.plans.statusLabel')}</Label>
                  <Select
                    value={action.status}
                    onValueChange={val => handleActionChange(index, 'status', val)}
                  >
                    <SelectTrigger className="w-full min-w-[220px] bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">{t('translate.plans.active')}</SelectItem>
                      <SelectItem value="INACTIVE">{t('translate.plans.inactive')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleSubmit} disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {t('translate.modules.createBtn')}
            </Button>

            <Link href="/admin/modules/root-modules">
              <Button variant="outline">{t('translate.plans.cancel')}</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Page() { 
  return <ModulePage />;
}

