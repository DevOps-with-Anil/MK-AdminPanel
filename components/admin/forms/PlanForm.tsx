'use client';

import { useState } from 'react';
import { SubscriptionPlan } from '@/lib/types';
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

interface PlanFormProps {
  plan?: SubscriptionPlan | null;
  onSubmit: (data: Partial<SubscriptionPlan>) => Promise<void>;
  onClose: () => void;
}

export default function PlanForm({ plan, onSubmit, onClose }: PlanFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<SubscriptionPlan>>({
    name: plan?.name || { en: '', hi: '', ar: '' },
    slug: plan?.slug || '',
    description: plan?.description || { en: '', hi: '', ar: '' },
    price: plan?.price || 0,
    currency: plan?.currency || 'USD',
    billingCycle: plan?.billingCycle || 'monthly',
    status: plan?.status || 'active',
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
    if (formData.price === undefined || formData.price < 0) {
      newErrors.price = 'Valid price is required';
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <Label className="text-base font-semibold mb-3 block">Plan Name *</Label>
        <MultiLangInput
          value={formData.name || { en: '', hi: '', ar: '' }}
          onChange={(value) => setFormData({ ...formData, name: value })}
          placeholder="Enter plan name"
          error={errors.name}
        />
      </div>

      {/* Slug */}
      <div>
        <Label htmlFor="slug" className="text-base font-semibold mb-2 block">Slug *</Label>
        <Input
          id="slug"
          type="text"
          placeholder="e.g., free, pro, enterprise"
          value={formData.slug || ''}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className={errors.slug ? 'border-red-500' : ''}
        />
        {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
      </div>

      {/* Description */}
      <div>
        <Label className="text-base font-semibold mb-3 block">Description</Label>
        <MultiLangInput
          value={formData.description || { en: '', hi: '', ar: '' }}
          onChange={(value) => setFormData({ ...formData, description: value })}
          placeholder="Enter plan description"
          isTextarea={true}
        />
      </div>

      {/* Price & Billing */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price" className="text-base font-semibold mb-2 block">Price *</Label>
          <Input
            id="price"
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={formData.price || ''}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            className={errors.price ? 'border-red-500' : ''}
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
        </div>
        <div>
          <Label htmlFor="billing" className="text-base font-semibold mb-2 block">Billing Cycle</Label>
          <Select value={formData.billingCycle || 'monthly'} onValueChange={(value) => setFormData({ ...formData, billingCycle: value as 'monthly' | 'yearly' })}>
            <SelectTrigger id="billing">
              <SelectValue placeholder="Select billing cycle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Currency & Status */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="currency" className="text-base font-semibold mb-2 block">Currency</Label>
          <Select value={formData.currency || 'USD'} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
            <SelectTrigger id="currency">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
              <SelectItem value="INR">INR (₹)</SelectItem>
              <SelectItem value="AED">AED (د.إ)</SelectItem>
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
          {isLoading ? 'Saving...' : plan ? 'Update Plan' : 'Create Plan'}
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
