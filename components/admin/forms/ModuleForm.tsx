'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Module } from '@/lib/types';
import MultiLangInput from '@/components/common/MultiLangInput';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { initializeMultiLang, validateMultiLang } from '@/i18n/langHelper';

interface ModuleFormProps {
  module?: Module | null;
  onSubmit: (data: Partial<Module>) => void | Promise<void>;
  onClose: () => void;
}

export default function ModuleForm({ module, onSubmit, onClose }: ModuleFormProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: module?.name || initializeMultiLang(['en', 'hi', 'ar']),
    slug: module?.slug || '',
    description: module?.description || initializeMultiLang(['en', 'hi', 'ar']),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNameChange = (value: any) => {
    setFormData(prev => ({ ...prev, name: value }));
  };

  const handleDescriptionChange = (value: any) => {
    setFormData(prev => ({ ...prev, description: value }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, slug: e.target.value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate name
    const nameValidation = validateMultiLang(formData.name, ['en']);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.errors[0];
    }

    // Validate slug
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
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
        slug: formData.slug,
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
      {/* Module Name - Multi-Language */}
      <MultiLangInput
        label={t('form.name')}
        description="Enter the module name in each language"
        value={formData.name}
        onChange={handleNameChange}
        requiredLanguages={['en']}
        supportedLanguages={['en', 'hi', 'ar']}
        error={!!errors.name}
      />
      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

      {/* Slug - Single field */}
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={handleSlugChange}
          placeholder="e.g., user-management"
          className={errors.slug ? 'border-red-500' : ''}
          disabled={loading}
        />
        {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
        <p className="text-xs text-muted-foreground">
          URL-friendly identifier for this module (lowercase, hyphens only)
        </p>
      </div>

      {/* Module Description - Multi-Language */}
      <MultiLangInput
        label={t('form.description')}
        description="Enter the module description in each language (optional)"
        value={formData.description}
        onChange={handleDescriptionChange}
        requiredLanguages={[]}
        supportedLanguages={['en', 'hi', 'ar']}
        multiline
        error={!!errors.description}
      />

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
          {module ? 'Update Module' : 'Create Module'}
        </Button>
      </div>
    </form>
  );
}
