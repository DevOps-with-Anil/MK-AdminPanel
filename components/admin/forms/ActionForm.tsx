'use client';

import { useState } from 'react';
import { Action } from '@/lib/types';
import MultiLangInput from '@/components/common/MultiLangInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ActionFormProps {
  action?: Action | null;
  onSubmit: (data: Partial<Action>) => Promise<void>;
  onClose: () => void;
}

export default function ActionForm({ action, onSubmit, onClose }: ActionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Action>>({
    name: action?.name || { en: '', hi: '', ar: '' },
    slug: action?.slug || '',
    label: action?.label || { en: '', hi: '', ar: '' },
    module: action?.module || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.en?.trim()) {
      newErrors.name = 'English name is required';
    }
    if (!formData.slug?.trim()) {
      newErrors.slug = 'Slug is required';
    }
    if (!formData.label?.en?.trim()) {
      newErrors.label = 'English label is required';
    }
    if (!formData.module?.trim()) {
      newErrors.module = 'Module is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock modules list
  const modules = [
    { id: 'MOD001', name: 'Dashboard' },
    { id: 'MOD002', name: 'Users' },
    { id: 'MOD003', name: 'Roles' },
    { id: 'MOD004', name: 'Plans' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <Label className="text-base font-semibold mb-3 block">Name *</Label>
        <MultiLangInput
          value={formData.name || { en: '', hi: '', ar: '' }}
          onChange={(value) => setFormData({ ...formData, name: value })}
          placeholder="Enter action name"
          error={errors.name}
        />
      </div>

      {/* Slug */}
      <div>
        <Label htmlFor="slug" className="text-base font-semibold mb-2 block">Slug *</Label>
        <Input
          id="slug"
          type="text"
          placeholder="e.g., view, create, edit, delete"
          value={formData.slug || ''}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className={errors.slug ? 'border-red-500' : ''}
        />
        {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
      </div>

      {/* Label */}
      <div>
        <Label className="text-base font-semibold mb-3 block">Label *</Label>
        <MultiLangInput
          value={formData.label || { en: '', hi: '', ar: '' }}
          onChange={(value) => setFormData({ ...formData, label: value })}
          placeholder="Enter action label"
          error={errors.label}
        />
      </div>

      {/* Module */}
      <div>
        <Label htmlFor="module" className="text-base font-semibold mb-2 block">Module *</Label>
        <Select value={formData.module || ''} onValueChange={(value) => setFormData({ ...formData, module: value })}>
          <SelectTrigger id="module" className={errors.module ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select a module" />
          </SelectTrigger>
          <SelectContent>
            {modules.map((mod) => (
              <SelectItem key={mod.id} value={mod.id}>
                {mod.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.module && <p className="text-red-500 text-sm mt-1">{errors.module}</p>}
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Saving...' : action ? 'Update Action' : 'Create Action'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
