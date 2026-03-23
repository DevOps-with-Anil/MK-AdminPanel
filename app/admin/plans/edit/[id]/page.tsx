'use client';

import { useState, useRef, useEffect, use } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { getPlanById, updatePlan } from '@/services/auth.service';
import { AdminProvider } from '@/contexts/AdminContext';

// ---------------------- Dropdown Component ----------------------
function Dropdown({
  options,
  value,
  onChange,
  placeholder
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2 border rounded-md flex justify-between items-center bg-white"
      >
        {options.find(o => o.id === value)?.label || placeholder || 'Select'}
        <ChevronDown className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
          {options.map(opt => (
            <div
              key={opt.id}
              onClick={() => { onChange(opt.id); setOpen(false); }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------- Constants ----------------------
const LANGUAGES = ['en', 'fr', 'ar', 'hi'] as const;
const CURRENCIES = ['USD', 'EUR', 'INR', 'GBP'];
const PLAN_TYPES = [{ id: 'MONTHLY', label: 'Monthly' }, { id: 'YEARLY', label: 'Yearly' }];
const STATUS_TYPES = [{ id: 'ACTIVE', label: 'Active' }, { id: 'INACTIVE', label: 'Inactive' }];

// ---------------------- Type Definitions ----------------------
type Lang = typeof LANGUAGES[number];

interface PlanForm {
  name: Record<Lang, string>;
  description: Record<Lang, string>;
  price: string;
  currency: string;
  type: string;
  status: string;
}

// ---------------------- Edit Plan Content ----------------------
function EditPlanContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  const [formData, setFormData] = useState<PlanForm>({
    name: { en: '', fr: '', ar: '', hi: '' },
    description: { en: '', fr: '', ar: '', hi: '' },
    price: '',
    currency: 'USD',
    type: 'MONTHLY',
    status: 'ACTIVE',
  });

  const [existingModules, setExistingModules] = useState<any[]>([]);
  const [activeLang, setActiveLang] = useState<Lang>('en');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Load Plan Data
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await getPlanById(resolvedParams.id);
        const data = res?.data || res;

        if (data) {
          // Normalize name/description which might be strings or objects
          const normalizeMultiLang = (val: any) => {
            if (typeof val === 'string') return { en: val, fr: '', ar: '', hi: '' };
            return { en: '', fr: '', ar: '', hi: '', ...val };
          };

          setFormData({
            name: normalizeMultiLang(data.name),
            description: normalizeMultiLang(data.description),
            price: data.price ? String(data.price) : '',
            currency: data.currency || 'USD',
            type: data.duration || 'MONTHLY',
            status: data.status || 'ACTIVE',
          });
          setExistingModules(data.modules || []);
        }
      } catch (err: any) {
         setErrors({ global: 'Failed to fetch plan details.' });
      } finally {
        setIsLoading(false);
      }
    };

    if (resolvedParams.id) {
        fetchPlan();
    }
  }, [resolvedParams.id]);


  // Handlers
  const handleInputChange = (field: 'name' | 'description' | 'price' | 'currency' | 'type' | 'status', value: string, lang?: Lang) => {
    if (lang && (field === 'name' || field === 'description')) {
      setFormData(prev => ({
        ...prev,
        [field]: { ...prev[field], [lang]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.en.trim()) newErrors.name = 'Name (EN) is required';
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Price must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    setErrors(prev => ({ ...prev, global: '' }));
    setSuccessMessage('');

    try {
      await updatePlan(resolvedParams.id, {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        currency: formData.currency,
        duration: formData.type,
        status: formData.status,
        modules: existingModules
      });

      setSuccessMessage('Plan updated successfully!');
    } catch (err: any) {
      let message = 'Failed to update plan';
       if (err?.message) message = err.message;
      setErrors(prev => ({ ...prev, global: message }));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-8">Loading plan details...</div>;

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/plans">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-medium">Edit Plan</h1>
          <p className="text-muted-foreground">Update subscription plan details</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan Details</CardTitle>
          <CardDescription>Update name, description, price, currency, type, and status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          {successMessage && (
            <div className="p-3 rounded-md bg-green-100 text-green-700 border border-green-300">
              {successMessage}
            </div>
          )}

          {errors.global && (
            <div className="p-3 rounded-md bg-red-100 text-red-700 border border-red-300">
              {errors.global}
            </div>
          )}

          <div className="flex gap-2 mb-4">
            {LANGUAGES.map(lang => (
              <Button
                key={lang}
                variant={activeLang === lang ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveLang(lang)}
              >
                {lang.toUpperCase()}
              </Button>
            ))}
          </div>

          <div>
            <Label className="mb-2 block">Plan Name ({activeLang.toUpperCase()}) *</Label>
            <Input
              value={formData.name[activeLang]}
              onChange={e => handleInputChange('name', e.target.value, activeLang)}
              placeholder="Plan Name"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <Label className="mb-2 block">Description ({activeLang.toUpperCase()})</Label>
            <textarea
              value={formData.description[activeLang]}
              onChange={e => handleInputChange('description', e.target.value, activeLang)}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Label className="mb-2 block">Currency</Label>
              <Dropdown
                options={CURRENCIES.map(c => ({ id: c, label: c }))}
                value={formData.currency}
                onChange={val => handleInputChange('currency', val)}
              />
            </div>
            <div className="flex-1">
              <Label className="mb-2 block">Price</Label>
              <Input
                type="number"
                min={0}
                value={formData.price}
                onChange={e => handleInputChange('price', e.target.value)}
                placeholder="0.00"
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Label className="mb-2 block">Plan Type</Label>
              <Dropdown
                options={PLAN_TYPES}
                value={formData.type}
                onChange={val => handleInputChange('type', val)}
              />
            </div>
            <div className="flex-1">
              <Label className="mb-2 block">Status</Label>
              <Dropdown
                options={STATUS_TYPES}
                value={formData.status}
                onChange={val => handleInputChange('status', val)}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button onClick={handleSave} disabled={isSaving} className="gap-2 bg-primary flex-1">
              <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Update Plan'}
            </Button>
            <Link href="/admin/plans" className="flex-1">
              <Button variant="outline" className="w-full">Cancel</Button>
            </Link>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

export default function EditPlanPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <AdminProvider>
      <EditPlanContent params={params} />
    </AdminProvider>
  );
}