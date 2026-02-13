'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Role, Module, Action } from '@/lib/types';
import MultiLangInput from '@/components/common/MultiLangInput';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { initializeMultiLang, validateMultiLang, getLocalizedText } from '@/i18n/langHelper';

interface RoleFormProps {
  role?: Role | null;
  modules?: Module[];
  onSubmit: (data: Partial<Role>) => void | Promise<void>;
  onClose: () => void;
}

export default function RoleForm({
  role,
  modules = [],
  onSubmit,
  onClose,
}: RoleFormProps) {
  const { t, currentLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: role?.name || initializeMultiLang(['en', 'hi', 'ar']),
    description: role?.description || initializeMultiLang(['en', 'hi', 'ar']),
    permissions: new Set(role?.permissions?.map(p => `${p.moduleId}:${p.actionId}`) || []),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNameChange = (value: any) => {
    setFormData(prev => ({ ...prev, name: value }));
  };

  const handleDescriptionChange = (value: any) => {
    setFormData(prev => ({ ...prev, description: value }));
  };

  const handlePermissionToggle = (moduleId: string, actionId: string, checked: boolean) => {
    const permissionKey = `${moduleId}:${actionId}`;
    const newPermissions = new Set(formData.permissions);
    
    if (checked) {
      newPermissions.add(permissionKey);
    } else {
      newPermissions.delete(permissionKey);
    }
    
    setFormData(prev => ({ ...prev, permissions: newPermissions }));
  };

  const handleSelectAllModule = (moduleId: string, checked: boolean) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    const newPermissions = new Set(formData.permissions);
    
    (module.actions || []).forEach(action => {
      const permissionKey = `${moduleId}:${action.id}`;
      if (checked) {
        newPermissions.add(permissionKey);
      } else {
        newPermissions.delete(permissionKey);
      }
    });
    
    setFormData(prev => ({ ...prev, permissions: newPermissions }));
  };

  const isModuleSelected = (moduleId: string): boolean => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return false;
    
    return (module.actions || []).every(
      action => formData.permissions.has(`${moduleId}:${action.id}`)
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const nameValidation = validateMultiLang(formData.name, ['en']);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.errors[0];
    }

    if (formData.permissions.size === 0) {
      newErrors.permissions = 'Please select at least one permission';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        name: formData.name,
        description: formData.description,
      });
    } catch (err) {
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
          <MultiLangInput
            label={t('form.name')}
            description="Enter the role name in each language"
            value={formData.name}
            onChange={handleNameChange}
            requiredLanguages={['en']}
            supportedLanguages={['en', 'hi', 'ar']}
            error={!!errors.name}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

          <MultiLangInput
            label={t('form.description')}
            description="Enter the role description in each language (optional)"
            value={formData.description}
            onChange={handleDescriptionChange}
            requiredLanguages={[]}
            supportedLanguages={['en', 'hi', 'ar']}
            multiline
          />
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-6">
          {errors.permissions && (
            <div className="p-3 rounded-md bg-red-50 dark:bg-red-950">
              <p className="text-sm text-red-700 dark:text-red-300">{errors.permissions}</p>
            </div>
          )}

          <div className="space-y-4">
            {modules.map(module => {
              const moduleSelected = isModuleSelected(module.id);
              const actions = module.actions || [];

              return (
                <Card key={module.id} className="p-4">
                  {/* Module Header */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                    <Checkbox
                      id={`module-${module.id}`}
                      checked={moduleSelected}
                      onCheckedChange={(checked) =>
                        handleSelectAllModule(module.id, checked as boolean)
                      }
                      disabled={loading}
                    />
                    <Label
                      htmlFor={`module-${module.id}`}
                      className="flex-1 cursor-pointer font-semibold"
                    >
                      {getLocalizedText(module.name, currentLanguage)}
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {actions.filter(a => formData.permissions.has(`${module.id}:${a.id}`)).length} / {actions.length}
                    </span>
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {actions.map(action => {
                      const permissionKey = `${module.id}:${action.id}`;
                      const isChecked = formData.permissions.has(permissionKey);

                      return (
                        <label
                          key={action.id}
                          className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-muted"
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={(checked) =>
                              handlePermissionToggle(module.id, action.id, checked as boolean)
                            }
                            disabled={loading}
                          />
                          <span className="text-sm">
                            {getLocalizedText(action.name, currentLanguage)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
        >
          {t('ui.cancel')}
        </Button>
        <Button type="submit" disabled={loading} className="gap-2">
          {loading && <Loader className="w-4 h-4 animate-spin" />}
          {role ? 'Update Role' : 'Create Role'}
        </Button>
      </div>
    </form>
  );
}
