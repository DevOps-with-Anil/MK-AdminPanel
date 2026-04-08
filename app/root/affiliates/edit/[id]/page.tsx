'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { useParams } from 'next/navigation';
import { useState, useContext, useEffect } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';

import { LANGUAGES, Language } from '@/i18n/languages';
import { I18nContext } from '@/i18n/provider';

import { MultiLangTabs } from '@/components/common/MultiLangTabs';
import { MultiLangInput } from '@/components/common/MultiLangInput';
import { MultiLangTextarea } from '@/components/common/MultiLangTextarea';

import { getAffiliateById } from '@/services/auth.service';

/* ================= TYPES ================= */

type MultiLangText = Record<Language, string>;

interface TenantForm {
  companyName: MultiLangText;
  description: MultiLangText;
  contact_email: string;
  phoneCode: string;
  contact_phoneNumber: string;
  website: string;
  adminPanelUrl: string;
  apiDomains: string[];
  country: string;
  state: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  zipCode: string;
}

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

/* ================= CONSTANTS ================= */

const PHONE_CODES: Option[] = [
  { code: '+91', label: 'India (+91)' },
  { code: '+1', label: 'USA (+1)' },
  { code: '+49', label: 'Germany (+49)' },
];

const COUNTRIES: Option[] = [
  { value: 'india', label: 'India' },
  { value: 'usa', label: 'USA' },
  { value: 'germany', label: 'Germany' },
];

const STATES: Option[] = [
  { value: 'mp', label: 'Madhya Pradesh' },
  { value: 'maharashtra', label: 'Maharashtra' },
  { value: 'delhi', label: 'Delhi' },
  { value: 'bavaria', label: 'Bavaria' },
];

const CITIES: Option[] = [
  { value: 'bhopal', label: 'Bhopal' },
  { value: 'indore', label: 'Indore' },
  { value: 'munich', label: 'Munich' },
];

/* ================= HELPERS ================= */

const createMultiLangObject = (): MultiLangText =>
  Object.keys(LANGUAGES).reduce((acc, lang) => {
    acc[lang as Language] = '';
    return acc;
  }, {} as MultiLangText);

const normalizeMultiLang = (value: any): MultiLangText => {
  if (typeof value === 'object' && value !== null) {
    return {
      ...createMultiLangObject(),
      ...value,
    };
  }
  return createMultiLangObject();
};

 const normalizeValue = (value?: string) =>
  value ? value.toLowerCase().trim() : '';


const initialState: TenantForm = {
  companyName: createMultiLangObject(),
  description: createMultiLangObject(),
  contact_email: '',
  phoneCode: '+91',
  contact_phoneNumber: '',
  website: '',
  adminPanelUrl: '',
  apiDomains: [''],
  country: '',
  state: '',
  city: '',
  addressLine1: '',
  addressLine2: '',
  landmark: '',
  zipCode: '',
};

const mapAffiliateToForm = (res: any): TenantForm => {
  if (!res) return initialState;

  return {
    companyName: normalizeMultiLang(res.companyName),
    description: normalizeMultiLang(res.description),

    contact_email: res.contact?.email ?? '',
    phoneCode: res.contact?.phone?.code ?? '+91',
    contact_phoneNumber: res.contact?.phone?.number ?? '',

    website: res.platform?.website ?? '',
    adminPanelUrl: res.platform?.adminPanelUrl ?? '',

    apiDomains: res.apiDomains?.length ? res.apiDomains : [''],

    country: normalizeValue(res.address?.country),
    state: normalizeValue(res.address?.state),
    city: normalizeValue(res.address?.city),

    addressLine1: res.address?.addressLine1 ?? '',
    addressLine2: res.address?.addressLine2 ?? '',
    landmark: res.address?.landmark ?? '',
    zipCode: res.address?.zipCode ?? '',
  };
};
/* ================= DROPDOWN ================= */

function Dropdown({ options, value, onChange, placeholder = 'Select' }: DropdownProps) {
  return (
    <Select value={value || ''} onValueChange={onChange}>
      <SelectTrigger className="w-full">
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

/* ================= PAGE ================= */

function UpdateTenantContent() {
  const params = useParams();
  const AffiliateId = params?.id as string;

  const { locale } = useContext(I18nContext);

  const [currentLang, setCurrentLang] = useState<Language>(locale);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<TenantForm>(initialState);

 
  const handleInputChange = (
    field: 'companyName' | 'description',
    value: string,
    lang: Language
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
  };

  const setField = (field: keyof TenantForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const setDomain = (i: number, value: string) => {
    const updated = [...formData.apiDomains];
    updated[i] = value;
    setFormData(prev => ({ ...prev, apiDomains: updated }));
  };

  const addDomain = () => setFormData(prev => ({ ...prev, apiDomains: [...prev.apiDomains, ''] }));

  const removeDomain = (i: number) => {
    if (formData.apiDomains.length === 1) return;
    const updated = formData.apiDomains.filter((_, idx) => idx !== i);
    setFormData(prev => ({ ...prev, apiDomains: updated }));
  };

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    if (!AffiliateId) return;

    const fetchAffiliate = async () => {
      try {
        setIsLoading(true);

        const res = await getAffiliateById(AffiliateId);

        const data = res?.data;

        console.log("dasdasdas. :  "+ JSON.stringify(data));

        setFormData(mapAffiliateToForm(data));

      } catch {
        setErrors({ global: 'Failed to load affiliate' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAffiliate();
  }, [AffiliateId]);

 
  /* ================= UI ================= */

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-4">
        <Link href="/root/affiliates">
          <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h1 className="text-xl font-medium">Create Tenant</h1>
          <p className="text-muted-foreground">Multi-tenant setup</p>
        </div>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Info</CardTitle>
              <CardDescription>Provide company name and description in multiple languages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <MultiLangTabs currentLang={currentLang} onChange={setCurrentLang} />
              <MultiLangInput
                label="Company Name"
                value={formData.companyName}
                currentLang={currentLang}
                onChange={(lang, value) => handleInputChange('companyName', value, lang)}
                error={errors.companyName}
              />
              <MultiLangTextarea
                label="Description"
                value={formData.description}
                currentLang={currentLang}
                onChange={(lang, value) => handleInputChange('description', value, lang)}
                error={errors.description}
                rows={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Info</CardTitle>
              <CardDescription>Basic contact and address details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Email" value={formData.contact_email} onChange={e => setField('contact_email', e.target.value)} />
              {errors.contact_email && <p className="text-red-500 text-xs">{errors.contact_email}</p>}

              <div className="grid grid-cols-[150px_1fr] gap-2">
                <Dropdown options={PHONE_CODES} value={formData.phoneCode} onChange={(val) => setField('phoneCode', val)} />
                <Input placeholder="Phone Number" value={formData.contact_phoneNumber} onChange={e => setField('contact_phoneNumber', e.target.value.replace(/\D/g, ''))} />
              </div>
              {errors.contact_phoneNumber && <p className="text-red-500 text-xs">{errors.contact_phoneNumber}</p>}

              <Input placeholder="Address Line 1" value={formData.addressLine1} onChange={e => setField('addressLine1', e.target.value)} />
              {errors.addressLine1 && <p className="text-red-500 text-xs">{errors.addressLine1}</p>}
              <Input placeholder="Address Line 2" value={formData.addressLine2} onChange={e => setField('addressLine2', e.target.value)} />
              <Input placeholder="Landmark" value={formData.landmark} onChange={e => setField('landmark', e.target.value)} />

              <div className="grid grid-cols-3 gap-4">
                <Dropdown options={COUNTRIES} value={formData.country} onChange={(v) => setField('country', v)} />
                <Dropdown options={STATES} value={formData.state} onChange={(v) => setField('state', v)} />
                <Dropdown options={CITIES} value={formData.city} onChange={(v) => setField('city', v)} />
              </div>
              {errors.country && <p className="text-red-500 text-xs">{errors.country}</p>}
              {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}
              {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}

              <Input placeholder="Pincode" value={formData.zipCode} onChange={e => setField('zipCode', e.target.value)} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Config</CardTitle>
              <CardDescription>Configure URLs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Website" value={formData.website} onChange={e => setField('website', e.target.value)} />
              {errors.website && <p className="text-red-500 text-xs">{errors.website}</p>}

              <Input placeholder="Admin Panel URL" value={formData.adminPanelUrl} onChange={e => setField('adminPanelUrl', e.target.value)} />
              {errors.adminPanelUrl && <p className="text-red-500 text-xs">{errors.adminPanelUrl}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Domains</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.apiDomains.map((d, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={d} onChange={e => setDomain(i, e.target.value)} />
                  <Button variant="ghost" size="icon" onClick={() => removeDomain(i)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
              {errors.apiDomains && <p className="text-red-500 text-xs">{errors.apiDomains}</p>}
              <Button variant="outline" onClick={addDomain}>+ Add Domain</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success */}
      {successMessage && (
        <div className="p-3 rounded-md bg-green-100 text-green-700 border border-green-300">
          {successMessage}
        </div>
      )}

      {/* Error */}
      {errors.global && (
        <div className="p-3 rounded-md bg-red-100 text-red-700 border border-red-300">
          {errors.global}
        </div>
      )}
      <div className="flex gap-3">
        <Button className="flex-1">
          <Save className="w-4 h-4 mr-2" />Create
        </Button>

        <Link href="/root/affiliates" className="flex-1">
          <Button variant="outline" className="w-full">Cancel</Button>
        </Link>
      </div>
    </div>
  );
}

export default function NewTenantPage() {
  return (
    <AdminProvider>
      <UpdateTenantContent />
    </AdminProvider>
  );
}
