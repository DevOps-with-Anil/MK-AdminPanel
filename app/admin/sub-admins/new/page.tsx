'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';

/* ================= TYPES ================= */

type LangKey = 'en' | 'fr' | 'ar';

interface MultiLang {
  en: string;
  fr: string;
  ar: string;
}

interface TenantForm {
  companyName: MultiLang;
  description: MultiLang;
  contact_email: string;
  phoneCode: string;
  contact_phoneNumber: string;
  website: string;
  adminPanelUrl: string;
  apiDomains: string[];
}

type FieldErrors = {
  companyName?: Partial<Record<LangKey, string>>;
  description?: Partial<Record<LangKey, string>>;
  contact_email?: string;
  phone?: string;
  website?: string;
  apiDomains?: string[];
  global?: string;
};

/* ================= CONSTANTS ================= */

const LANGUAGES = [
  { key: 'en', label: 'English' },
  { key: 'fr', label: 'French' },
  { key: 'ar', label: 'Arabic' },
];

const PHONE_CODES = [
  { code: '+91', label: 'India (+91)' },
  { code: '+1', label: 'USA (+1)' },
  { code: '+971', label: 'UAE (+971)' },
];

/* ================= REGEX ================= */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9]{7,15}$/;
const URL_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/;
const DOMAIN_REGEX = /^([\w-]+\.)+[\w-]{2,}$/;

/* ================= COMPONENT ================= */

function NewTenantContent() {
  const [currentLang, setCurrentLang] = useState<LangKey>('en');

  const [formData, setFormData] = useState<TenantForm>({
    companyName: { en: '', fr: '', ar: '' },
    description: { en: '', fr: '', ar: '' },
    contact_email: '',
    phoneCode: '+91',
    contact_phoneNumber: '',
    website: '',
    adminPanelUrl: '',
    apiDomains: [''],
  });

  const [errors, setErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);


  type Option = {
  code?: string;
  value?: string;
  label: string;
};

interface DropdownProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select',
}: DropdownProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt, i) => {
          const val = opt.code || opt.value || '';
          return (
            <SelectItem key={i} value={val}>
              {opt.label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

  /* ================= HANDLERS ================= */

  const setLangField = (field: 'companyName' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [currentLang]: value,
      },
    }));

    setErrors(prev => ({
      ...prev,
      [field]: {
        ...(prev[field] || {}),
        [currentLang]: undefined,
      },
    }));
  };

  const setField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    setErrors(prev => ({
      ...prev,
      [field]: undefined,
      global: undefined,
    }));
  };

  const setDomain = (i: number, value: string) => {
    const updated = [...formData.apiDomains];
    updated[i] = value;

    setFormData(prev => ({ ...prev, apiDomains: updated }));

    setErrors(prev => {
      const domainErrors = [...(prev.apiDomains || [])];
      domainErrors[i] = '';
      return { ...prev, apiDomains: domainErrors };
    });
  };

  const addDomain = () => {
    setFormData(prev => ({
      ...prev,
      apiDomains: [...prev.apiDomains, ''],
    }));
  };

  const removeDomain = (i: number) => {
    if (formData.apiDomains.length === 1) return;
    const updated = formData.apiDomains.filter((_, idx) => idx !== i);
    setFormData(prev => ({ ...prev, apiDomains: updated }));
  };

  /* ================= VALIDATION ================= */

  const validate = (): FieldErrors => {
    const newErrors: FieldErrors = {};

    if (!formData.companyName.en.trim()) {
      newErrors.companyName = { en: 'Company name (English) required' };
    }

    (['en', 'fr', 'ar'] as LangKey[]).forEach(lang => {
      if (formData.description[lang] && formData.description[lang].length < 3) {
        newErrors.description = {
          ...newErrors.description,
          [lang]: 'Minimum 3 characters',
        };
      }
    });

    if (!formData.contact_email) {
      newErrors.contact_email = 'Email required';
    } else if (!EMAIL_REGEX.test(formData.contact_email)) {
      newErrors.contact_email = 'Invalid email';
    }

    if (!formData.contact_phoneNumber) {
      newErrors.phone = 'Phone required';
    } else if (!PHONE_REGEX.test(formData.contact_phoneNumber)) {
      newErrors.phone = 'Invalid phone (7–15 digits)';
    }

    if (!formData.website) {
      newErrors.website = 'Website required';
    } else if (!URL_REGEX.test(formData.website)) {
      newErrors.website = 'Invalid URL';
    }

    if (formData.adminPanelUrl && !URL_REGEX.test(formData.adminPanelUrl)) {
      newErrors.global = 'Invalid admin panel URL';
    }

    const domainErrors: string[] = [];
    formData.apiDomains.forEach((d, i) => {
      if (!d) domainErrors[i] = 'Required';
      else if (!DOMAIN_REGEX.test(d)) {
        domainErrors[i] = 'Invalid domain';
      }
    });

    if (domainErrors.length) newErrors.apiDomains = domainErrors;

    return newErrors;
  };

  const handleSubmit = async () => {
    setSuccess(false);

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      const firstLang =
        Object.keys(validationErrors.companyName || {})[0] as LangKey;

      if (firstLang) setCurrentLang(firstLang);
      return;
    }

    setIsLoading(true);

    try {
      console.log('PAYLOAD:', formData);
      setSuccess(true);
      setErrors({});
    } catch (err: any) {
      setErrors({ global: err?.message || 'Failed to create tenant' });
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= UI ================= */

  // return (
  //   <div className="space-y-6 max-w-6xl">

  //     {/* Header */}
  //     <div className="flex items-center gap-4">
  //       <Link href="/admin/tenants">
  //         <Button variant="ghost" size="sm">
  //           <ArrowLeft className="w-4 h-4" />
  //         </Button>
  //       </Link>
  //       <div>
  //         <h1 className="text-xl font-medium">Create Tenant</h1>
  //         <p className="text-muted-foreground">Multi-tenant setup</p>
  //       </div>
  //     </div>

  //     {/* Language Tabs */}
  //     <div className="flex gap-2">
  //       {LANGUAGES.map(lang => (
  //         <Button
  //           key={lang.key}
  //           size="sm"
  //           variant={currentLang === lang.key ? 'default' : 'outline'}
  //           onClick={() => setCurrentLang(lang.key as LangKey)}
  //         >
  //           {lang.label}
  //         </Button>
  //       ))}
  //     </div>

  //     {/* GRID */}
  //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

  //       {/* LEFT */}
  //       <div className="space-y-6">

  //         <Card>
  //           <CardHeader>
  //             <CardTitle>Company Info</CardTitle>
  //             <CardDescription>Multilingual details</CardDescription>
  //           </CardHeader>
  //           <CardContent className="space-y-4">

  //             <div>
  //               <Label className="mb-2 block">Company Name ({currentLang})*</Label>
  //               <Input
  //                 value={formData.companyName[currentLang]}
  //                 onChange={e => setLangField('companyName', e.target.value)}
  //               />
  //               {errors.companyName?.[currentLang] && (
  //                 <p className="text-red-500 text-xs">
  //                   {errors.companyName[currentLang]}
  //                 </p>
  //               )}
  //             </div>

  //             <div>
  //               <Label className="mb-2 block">Description ({currentLang})</Label>
  //               <Input
  //                 value={formData.description[currentLang]}
  //                 onChange={e => setLangField('description', e.target.value)}
  //               />
  //             </div>

  //           </CardContent>
  //         </Card>

  //            {/* Contact */}
  //         <Card>
  //           <CardHeader>
  //             <CardTitle>Contact Info</CardTitle>
  //           </CardHeader>
  //           <CardContent className="space-y-4">

  //             <div>
  //               <Label className="mb-2 block">Email*</Label>
  //               <Input
  //                 value={formData.contact_email}
  //                 onChange={e => setField('contact_email', e.target.value)}
  //               />
  //               {errors.contact_email && (
  //                 <p className="text-red-500 text-xs">{errors.contact_email}</p>
  //               )}
  //             </div>

  //             <div className="grid grid-cols-[100px_1fr] gap-4">
  //               <div>
  //                 <Label className="mb-2 block">Phone Code</Label>
  //               <Select
  //                 value={formData.phoneCode}
  //                 onValueChange={(val) => setField('phoneCode', val)}
  //               >
  //                 <SelectTrigger>
  //                   <SelectValue />
  //                 </SelectTrigger>
  //                 <SelectContent>
  //                   {PHONE_CODES.map(p => (
  //                     <SelectItem key={p.code} value={p.code}>
  //                       {p.label}
  //                     </SelectItem>
  //                   ))}
  //                 </SelectContent>
  //               </Select>
  //               </div>

  //               <div>
  //                   <Label className="mb-2 block">Phone Number *</Label> 
  //                 <Input
  //                   placeholder="Phone number"
  //                   value={formData.contact_phoneNumber}
  //                   onChange={e =>
  //                     setField('contact_phoneNumber', e.target.value)
  //                   }
  //                 />
  //                 {errors.phone && (
  //                   <p className="text-red-500 text-xs">
  //                     {errors.phone}
  //                   </p>
  //                 )}
  //               </div>

  //             </div>

  //           </CardContent>
  //         </Card>

  //       </div>

  //       {/* RIGHT */}
  //       <div className="space-y-6">

  //         <Card>
  //           <CardHeader>
  //             <CardTitle>Platform Config</CardTitle>
  //              <CardDescription>Public Access URL</CardDescription>
  //           </CardHeader>
  //           <CardContent className="space-y-4">

  //             <div>
  //               <Label className="mb-2 block">Website URL*</Label>
  //               <Input
  //                 value={formData.website}
  //                 onChange={e => setField('website', e.target.value)}
  //               />
  //               {errors.website && (
  //                 <p className="text-red-500 text-xs">{errors.website}</p>
  //               )}
  //             </div>
              
  //             <Label className="mb-2 block">Admin Panel URL*</Label>
  //             <Input
  //               value={formData.adminPanelUrl}
  //               onChange={e => setField('adminPanelUrl', e.target.value)}
  //             />

  //           </CardContent>
  //         </Card>

  //         <Card>
  //           <CardHeader>
  //             <CardTitle>API Domains</CardTitle>
  //           </CardHeader>
  //           <CardContent className="space-y-3">

  //             {formData.apiDomains.map((d, i) => (
  //               <div key={i} className="flex gap-2 items-start">

  //                 <div className="flex-1">
  //                   <Input
  //                     value={d}
  //                     onChange={e => setDomain(i, e.target.value)}
  //                   />
  //                   {errors.apiDomains?.[i] && (
  //                     <p className="text-red-500 text-xs">
  //                       {errors.apiDomains[i]}
  //                     </p>
  //                   )}
  //                 </div>

  //                 <Button
  //                   type="button"
  //                   variant="ghost"
  //                   size="icon"
  //                   onClick={() => removeDomain(i)}
  //                   disabled={formData.apiDomains.length === 1}
  //                 >
  //                   <Trash2 className="w-4 h-4 text-red-500" />
  //                 </Button>

  //               </div>
  //             ))}

  //             <Button variant="outline" onClick={addDomain}>
  //               + Add Domain
  //             </Button>

  //           </CardContent>
  //         </Card>

  //       </div>
  //     </div>

  //     {/* ACTION */}
  //     <div className="flex gap-3">
  //       <Button onClick={handleSubmit} disabled={isLoading} className="flex-1">
  //         <Save className="w-4 h-4 mr-2" />
  //         {isLoading ? 'Creating...' : 'Create Tenant'}
  //       </Button>

  //       <Link href="/admin/tenants" className="flex-1">
  //         <Button variant="outline" className="w-full">
  //           Cancel
  //         </Button>
  //       </Link>
  //     </div>

  //     {success && (
  //       <p className="text-green-600 text-sm">
  //         Tenant created successfully!
  //       </p>
  //     )}

  //   </div>
  // );

/* ================= UI ================= */

return (
  <div className="space-y-6 max-w-6xl">

    {/* Header */}
    <div className="flex items-center gap-4">
      <Link href="/admin/tenants">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </Link>
      <div>
        <h1 className="text-xl font-medium">Create Tenant</h1>
        <p className="text-muted-foreground">Multi-tenant setup</p>
      </div>
    </div>

    {/* Language Tabs */}
    <div className="flex gap-2">
      {LANGUAGES.map(lang => (
        <Button
          key={lang.key}
          size="sm"
          variant={currentLang === lang.key ? 'default' : 'outline'}
          onClick={() => setCurrentLang(lang.key as LangKey)}
        >
          {lang.label}
        </Button>
      ))}
    </div>

    {/* GRID */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* LEFT */}
      <div className="space-y-6">

        <Card>
          <CardHeader>
            <CardTitle>Company Info</CardTitle>
            <CardDescription>Multilingual details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            <div>
              <Label className="mb-2 block">Company Name ({currentLang})*</Label>
              <Input
                value={formData.companyName[currentLang]}
                onChange={e => setLangField('companyName', e.target.value)}
              />
              {errors.companyName?.[currentLang] && (
                <p className="text-red-500 text-xs">
                  {errors.companyName[currentLang]}
                </p>
              )}
            </div>

            <div>
              <Label className="mb-2 block">Description ({currentLang})</Label>
              <Input
                value={formData.description[currentLang]}
                onChange={e => setLangField('description', e.target.value)}
              />
            </div>

          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            <div>
              <Label className="mb-2 block">Email*</Label>
              <Input
                value={formData.contact_email}
                onChange={e => setField('contact_email', e.target.value)}
              />
              {errors.contact_email && (
                <p className="text-red-500 text-xs">{errors.contact_email}</p>
              )}
            </div>

            {/* ✅ UPDATED PHONE DROPDOWN */}
            <div className="grid grid-cols-[120px_1fr] gap-4">

              <div>
                <Label className="mb-2 block">Phone Code *</Label>
                <Dropdown
                  options={PHONE_CODES}
                  value={formData.phoneCode}
                  onChange={(val: string) => setField('phoneCode', val)}
                  placeholder="Select code"
                />
              </div>

              <div>
                <Label className="mb-2 block">Phone Number *</Label>
                <Input
                  type="number"
                  value={formData.contact_phoneNumber}
                  onChange={e =>
                    setField('contact_phoneNumber', e.target.value)
                  }
                  placeholder="Phone Number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs">
                    {errors.phone}
                  </p>
                )}
              </div>

            </div>

          </CardContent>
        </Card>

      </div>

      {/* RIGHT */}
      <div className="space-y-6">

        <Card>
          <CardHeader>
            <CardTitle>Platform Config</CardTitle>
            <CardDescription>Public Access URL</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">

            <div>
              <Label className="mb-2 block">Website URL*</Label>
              <Input
                value={formData.website}
                onChange={e => setField('website', e.target.value)}
              />
              {errors.website && (
                <p className="text-red-500 text-xs">{errors.website}</p>
              )}
            </div>

            <Label className="mb-2 block">Admin Panel URL*</Label>
            <Input
              value={formData.adminPanelUrl}
              onChange={e => setField('adminPanelUrl', e.target.value)}
            />

          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Domains</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">

            {formData.apiDomains.map((d, i) => (
              <div key={i} className="flex gap-2 items-start">

                <div className="flex-1">
                  <Input
                    value={d}
                    onChange={e => setDomain(i, e.target.value)}
                  />
                  {errors.apiDomains?.[i] && (
                    <p className="text-red-500 text-xs">
                      {errors.apiDomains[i]}
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeDomain(i)}
                  disabled={formData.apiDomains.length === 1}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>

              </div>
            ))}

            <Button variant="outline" onClick={addDomain}>
              + Add Domain
            </Button>

          </CardContent>
        </Card>

      </div>
    </div>

    {/* ACTION */}
    <div className="flex gap-3">
      <Button onClick={handleSubmit} disabled={isLoading} className="flex-1">
        <Save className="w-4 h-4 mr-2" />
        {isLoading ? 'Creating...' : 'Create Tenant'}
      </Button>

      <Link href="/admin/tenants" className="flex-1">
        <Button variant="outline" className="w-full">
          Cancel
        </Button>
      </Link>
    </div>

    {success && (
      <p className="text-green-600 text-sm">
        Tenant created successfully!
      </p>
    )}

  </div>
);

}

export default function NewTenantPage() {
  return (
    <AdminProvider>
      <NewTenantContent />
    </AdminProvider>
  );
}