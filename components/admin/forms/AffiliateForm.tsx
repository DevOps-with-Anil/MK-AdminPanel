'use client';

import { useState } from 'react';
import { Tenant } from '@/lib/types';
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

interface AffiliateFormProps {
  affiliate?: Tenant | null;
  onSubmit: (data: Partial<Tenant>) => Promise<void>;
  onClose: () => void;
}

export default function AffiliateForm({ affiliate, onSubmit, onClose }: AffiliateFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Tenant>>({
    name: affiliate?.name || { en: '', hi: '', ar: '' },
    slug: affiliate?.slug || '',
    country: affiliate?.country || 'IN',
    email: affiliate?.email || '',
    phone: affiliate?.phone || '',
    website: affiliate?.website || '',
    subscriptionPlanId: affiliate?.subscriptionPlanId || '',
    status: affiliate?.status || 'active',
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
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.country?.trim()) {
      newErrors.country = 'Country is required';
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

  const countries = [
    { code: 'IN', name: 'India' },
    { code: 'AE', name: 'United Arab Emirates' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'SA', name: 'Saudi Arabia' },
  ];

  const plans = [
    { id: 'PLAN001', name: 'Free Plan' },
    { id: 'PLAN002', name: 'Pro Plan' },
    { id: 'PLAN003', name: 'Enterprise Plan' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <Label className="text-base font-semibold mb-3 block">Affiliate Name *</Label>
        <MultiLangInput
          value={formData.name || { en: '', hi: '', ar: '' }}
          onChange={(value) => setFormData({ ...formData, name: value })}
          placeholder="Enter affiliate name"
          error={errors.name ? true : false}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Slug */}
      <div>
        <Label htmlFor="slug" className="text-base font-semibold mb-2 block">Slug *</Label>
        <Input
          id="slug"
          type="text"
          placeholder="e.g., techcorp-india"
          value={formData.slug || ''}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className={errors.slug ? 'border-red-500' : ''}
        />
        {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email" className="text-base font-semibold mb-2 block">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="admin@affiliate.com"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div>
          <Label htmlFor="phone" className="text-base font-semibold mb-2 block">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1-234-567-8900"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>

      {/* Website & Country */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="website" className="text-base font-semibold mb-2 block">Website</Label>
          <Input
            id="website"
            type="url"
            placeholder="https://affiliate.com"
            value={formData.website || ''}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="country" className="text-base font-semibold mb-2 block">Country *</Label>
          <Select value={formData.country || 'IN'} onValueChange={(value) => setFormData({ ...formData, country: value })}>
            <SelectTrigger id="country" className={errors.country ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
        </div>
      </div>

      {/* Plan & Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="plan" className="text-base font-semibold mb-2 block">Subscription Plan</Label>
          <Select value={formData.subscriptionPlanId || ''} onValueChange={(value) => setFormData({ ...formData, subscriptionPlanId: value })}>
            <SelectTrigger id="plan">
              <SelectValue placeholder="Select plan" />
            </SelectTrigger>
            <SelectContent>
              {plans.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status" className="text-base font-semibold mb-2 block">Status</Label>
          <Select value={formData.status || 'active'} onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' })}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? 'Saving...' : affiliate ? 'Update Affiliate' : 'Create Affiliate'}
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
