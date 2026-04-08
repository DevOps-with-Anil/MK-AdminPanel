'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { useState, useContext } from 'react';
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

import { PHONE_CODES, getCountries, getStates, getCities } from '@/constants/app';

import { LANGUAGES, Language } from '@/i18n/languages';
import { I18nContext } from '@/i18n/provider';

import { MultiLangTabs } from '@/components/common/MultiLangTabs';
import { MultiLangInput } from '@/components/common/MultiLangInput';
import { MultiLangTextarea } from '@/components/common/MultiLangTextarea';


import { createAffiliate } from '@/services/auth.service';

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
  addressLine2?: string; // optional
  landmark?: string; // optional
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

// const PHONE_CODES: Option[] = [
//   { code: '+91', label: 'India (+91)' },
//   { code: '+1', label: 'USA (+1)' },
// ];

// const COUNTRIES: Option[] = [
//   { value: 'India', label: 'India' },
//   { value: 'USA', label: 'USA' },
// ];

// const STATES: Option[] = [
//   { value: 'Madhya Pradesh', label: 'Madhya Pradesh' },
//   { value: 'Maharashtra', label: 'Maharashtra' },
//   { value: 'Delhi', label: 'Delhi' },
// ]

// const CITIES: Option[] = [
//   { value: 'Bhopal', label: 'Bhopal' },
//   { value: 'Indore', label: 'Indore' },
//   { value: 'Mumbai', label: 'Mumbai' },
// ];

/* ================= HELPERS ================= */

const createMultiLangObject = (): MultiLangText =>
  Object.keys(LANGUAGES).reduce((acc, lang) => {
    acc[lang as Language] = '';
    return acc;
  }, {} as MultiLangText);

/* ================= DROPDOWN ================= */

function Dropdown({ options, value, onChange, placeholder = 'Select' }: DropdownProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt, i) => {
          const val = opt.code || opt.value || '';
          return <SelectItem key={i} value={val}>{opt.label}</SelectItem>;
        })}
      </SelectContent>
    </Select>
  );
}

/* ================= PAGE ================= */

function NewTenantContent() {

  const { locale } = useContext(I18nContext);

  const [currentLang, setCurrentLang] = useState<Language>(locale);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');

    /* ================= New Affiliate Data Form ================= */

   const [formData, setFormData] = useState<TenantForm>({
    companyName: createMultiLangObject(),
    description: createMultiLangObject(),
    contact_email: '',
    phoneCode: '',
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
  })

  const countries = getCountries();
  const states = getStates(formData.country); 
  const cities = getCities(formData.country, formData.state);

  /* ================= HANDLERS ================= */

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
  setFormData((prev) => {
    if (field === 'country') {
      return {
        ...prev,
        country: value,
        state: '', // ✅ reset state
        city: '',  // ✅ reset city
      };
    }
    if (field === 'state') {
      return {
        ...prev,
        state: value,
        city: '', // ✅ reset city
      };
    }
    return {
      ...prev,
      [field]: value,
    };
  });
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

  /* ================= VALIDATION ================= */

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{7,15}$/;
    const urlRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i;

    if (!formData.companyName.en.trim()) newErrors.companyName = 'Company name (EN) is required';
    if (!formData.description.en.trim()) newErrors.description = 'Description (EN) is required';

    if (!formData.contact_email.trim()) newErrors.contact_email = 'Email is required';
    else if (!emailRegex.test(formData.contact_email)) newErrors.contact_email = 'Invalid email format';

    if (!formData.phoneCode.trim()) newErrors.phoneCode = 'Phone code is required';

    if (!formData.contact_phoneNumber.trim()) newErrors.contact_phoneNumber = 'Phone number is required';
    else if (!phoneRegex.test(formData.contact_phoneNumber)) newErrors.contact_phoneNumber = 'Phone must be 7–15 digits only';

    if (!formData.website.trim()) newErrors.website = 'Website is required';
    else if (!urlRegex.test(formData.website)) newErrors.website = 'Invalid website URL';

    if (!formData.adminPanelUrl.trim()) newErrors.adminPanelUrl = 'Admin URL is required';
    else if (!urlRegex.test(formData.adminPanelUrl)) newErrors.adminPanelUrl = 'Invalid admin URL';

    if (!formData.apiDomains.length) newErrors.apiDomains = 'At least one domain is required';
    else if (formData.apiDomains.some(d => !d.trim() || !urlRegex.test(d))) newErrors.apiDomains = 'All domains must be valid URLs';

    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address Line 1 is required';
    if (!formData.zipCode.trim()) newErrors.pincode = 'Pincode is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= SUBMIT PAYLOAD ================= */

  function mapFormToPayload(formData: TenantForm) {
    return {
      companyName: formData.companyName,
      description: formData.description,
      contact: {
        email: formData.contact_email,
        phone: {
          code: formData.phoneCode,
          number: formData.contact_phoneNumber
        }
      },
      platform: {
        website: formData.website,
        adminPanelUrl: formData.adminPanelUrl
      },
      apiDomains: formData.apiDomains,
      address: {
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        landmark: formData.landmark,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipCode: formData.zipCode
      }
    };
  }

  /* ================= SUBMIT HANDLER ================= */

  const handleSubmit = async () => {
    setSuccessMessage('');
    setApiError('');

    setSuccess(false);

    if (!validateForm()) return;

    try {
      const payload = mapFormToPayload(formData);
      console.log('Payload ready to send:', JSON.stringify(payload));

      await createAffiliate(payload);
      setSuccess(true);
      setErrors({});

      setSuccessMessage('Affiliate created successfully!');
      setTimeout(() => {
        setSuccess(false);
        setSuccessMessage('');
      }, 1000);

      setFormData({
        companyName: createMultiLangObject(),
        description: createMultiLangObject(),
        contact_email: "",
        phoneCode: "",
        contact_phoneNumber: "",
        website: "",
        adminPanelUrl: "",
        apiDomains: [],
        country: "",
        state: "",
        city: "",
        addressLine1: "",
        addressLine2: "",
        landmark: "",
        zipCode: "",
      });
    } catch {
      setApiError('Something went wrong. Please try again.');
    } finally {
    }
  };


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
              {errors.phoneCode && <p className="text-red-500 text-xs">{errors.phoneCode}</p>}
              {errors.contact_phoneNumber && <p className="text-red-500 text-xs">{errors.contact_phoneNumber}</p>}

              <Input placeholder="Address Line 1" value={formData.addressLine1} onChange={e => setField('addressLine1', e.target.value)} />
              {errors.addressLine1 && <p className="text-red-500 text-xs">{errors.addressLine1}</p>}
              <Input placeholder="Address Line 2" value={formData.addressLine2} onChange={e => setField('addressLine2', e.target.value)} />
              <Input placeholder="Landmark" value={formData.landmark} onChange={e => setField('landmark', e.target.value)} />

              {/* <div className="grid grid-cols-3 gap-4">
                <Dropdown options={COUNTRIES} value={formData.country} onChange={(v) => setField('country', v)} />
                <Dropdown options={STATES} value={formData.state} onChange={(v) => setField('state', v)} />
                <Dropdown options={CITIES} value={formData.city} onChange={(v) => setField('city', v)} />
              </div> */}

              <div className="grid grid-cols-3 gap-4">
  <Dropdown
    options={countries}
    value={formData.country}
    onChange={(v) => setField('country', v)}
  />

  <Dropdown
    options={states}
    value={formData.state}
    onChange={(v) => setField('state', v)}
  />

  <Dropdown
    options={cities}
    value={formData.city}
    onChange={(v) => setField('city', v)}
  />
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
        <Button className="flex-1" onClick={handleSubmit}>
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
      <NewTenantContent />
    </AdminProvider>
  );
}