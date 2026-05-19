'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { useState, useContext } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Eye, EyeOff, Save, Trash2 } from 'lucide-react';
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

import { AppMessage } from '@/components/common/AppMessage';
import { useAppMessage } from '@/hooks/ui/useAppMessage';


/* ================= TYPES ================= */

type MultiLangText = Record<Language, string>;

/* ================= TYPES ================= */

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

  /* ================= ADMIN ================= */

  adminName: string;
  adminEmail: string;
  adminPhoneCode: string;
  adminPhoneNumber: string;
  adminPassword: string;
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
  
  // const [success, setSuccess] = useState(false);
  // const [successMessage, setSuccessMessage] = useState('');
  // const [apiError, setApiError] = useState('');
  
  // Fields error states
  const [errors, setErrors] = useState<Record<string, string>>({});
  // APis Response states
  const { message, type, visible, showMessage, clearMessage } = useAppMessage();

  // Show/Hide Password icon state
  const [showPassword, setShowPassword] = useState(false);


  /* ================= New Affiliate Data Form ================= */

  /* ================= INITIAL STATE ================= */

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
    adminName: '',
    adminEmail: '',
    adminPhoneCode: '',
    adminPhoneNumber: '',
    adminPassword: '',
  });
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

  /* ================= VALIDATION ================= */

  const validateForm = () => {

    const newErrors: Record<string, string> = {};

    /* ================= REGEX ================= */

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const phoneRegex =
      /^[0-9]{7,15}$/;

    const urlRegex =
      /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i;

    // Minimum 8 chars
    // 1 uppercase
    // 1 lowercase
    // 1 number
    // 1 special char

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;

    /* ================= COMPANY ================= */

    if (!formData.companyName.en?.trim()) {
      newErrors.companyName =
        'Company name (EN) is required';
    } else if (
      formData.companyName.en.trim().length < 2
    ) {
      newErrors.companyName =
        'Company name must be at least 2 characters';
    }

    if (!formData.description.en?.trim()) {
      newErrors.description =
        'Description (EN) is required';
    } else if (
      formData.description.en.trim().length < 10
    ) {
      newErrors.description =
        'Description must be at least 10 characters';
    }

    /* ================= CONTACT ================= */

    if (!formData.contact_email?.trim()) {

      newErrors.contact_email =
        'Email is required';

    } else if (
      !emailRegex.test(
        formData.contact_email.trim()
      )
    ) {

      newErrors.contact_email =
        'Invalid email format';
    }

    if (!formData.phoneCode?.trim()) {

      newErrors.phoneCode =
        'Phone code is required';
    }

    if (!formData.contact_phoneNumber?.trim()) {

      newErrors.contact_phoneNumber =
        'Phone number is required';

    } else if (
      !phoneRegex.test(
        formData.contact_phoneNumber
      )
    ) {

      newErrors.contact_phoneNumber =
        'Phone number must contain 7 to 15 digits';
    }

    /* ================= PLATFORM ================= */

    if (!formData.website?.trim()) {

      newErrors.website =
        'Website is required';

    } else if (
      !urlRegex.test(
        formData.website.trim()
      )
    ) {

      newErrors.website =
        'Invalid website URL';
    }

    if (!formData.adminPanelUrl?.trim()) {

      newErrors.adminPanelUrl =
        'Admin panel URL is required';

    } else if (
      !urlRegex.test(
        formData.adminPanelUrl.trim()
      )
    ) {

      newErrors.adminPanelUrl =
        'Invalid admin panel URL';
    }

    /* ================= API DOMAINS ================= */

    const validDomains =
      formData.apiDomains.filter(
        (d) => d.trim() !== ''
      );

    if (!validDomains.length) {

      newErrors.apiDomains =
        'At least one API domain is required';

    } else {

      const invalidDomain =
        validDomains.some(
          (domain) =>
            !urlRegex.test(domain.trim())
        );

      if (invalidDomain) {

        newErrors.apiDomains =
          'All API domains must be valid URLs';
      }
    }

    /* ================= ADDRESS ================= */

    if (!formData.country?.trim()) {

      newErrors.country =
        'Country is required';
    }

    if (!formData.state?.trim()) {

      newErrors.state =
        'State is required';
    }

    if (!formData.city?.trim()) {

      newErrors.city =
        'City is required';
    }

    if (!formData.addressLine1?.trim()) {

      newErrors.addressLine1 =
        'Address Line 1 is required';

    } else if (
      formData.addressLine1.trim().length < 5
    ) {

      newErrors.addressLine1 =
        'Address Line 1 is too short';
    }

    if (!formData.zipCode?.trim()) {

      newErrors.zipCode =
        'Zip code is required';

    } else if (
      formData.zipCode.trim().length < 4
    ) {

      newErrors.zipCode =
        'Invalid zip code';
    }

    /* ================= ADMIN ================= */

    if (!formData.adminName?.trim()) {

      newErrors.adminName =
        'Admin name is required';

    } else if (
      formData.adminName.trim().length < 2
    ) {

      newErrors.adminName =
        'Admin name must be at least 2 characters';
    }

    if (!formData.adminEmail?.trim()) {

      newErrors.adminEmail =
        'Admin email is required';

    } else if (
      !emailRegex.test(
        formData.adminEmail.trim()
      )
    ) {

      newErrors.adminEmail =
        'Invalid admin email format';
    }

    if (!formData.adminPhoneCode?.trim()) {

      newErrors.adminPhoneCode =
        'Admin phone code is required';
    }

    if (!formData.adminPhoneNumber?.trim()) {

      newErrors.adminPhoneNumber =
        'Admin phone number is required';

    } else if (
      !phoneRegex.test(
        formData.adminPhoneNumber
      )
    ) {

      newErrors.adminPhoneNumber =
        'Admin phone number must contain 7 to 15 digits';
    }

    if (!formData.adminPassword?.trim()) {

      newErrors.adminPassword =
        'Admin password is required';

    } else if (
      !passwordRegex.test(
        formData.adminPassword
      )
    ) {

      newErrors.adminPassword =
        'Password must contain uppercase, lowercase, number, special character and minimum 8 characters';
    }

    /* ================= SET ERRORS ================= */

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
      },

      /* ================= ADMIN ================= */

      admin: {
        name: formData.adminName,
        email: formData.adminEmail,
        phoneCode: formData.adminPhoneCode,
        phoneNumber: formData.adminPhoneNumber,
        password: formData.adminPassword
      }
    };
  }

  /* ================= SUBMIT HANDLER ================= */

  const handleSubmit = async () => {
    // setSuccessMessage('');
    // setApiError('');

    if (!validateForm()) {
      return;
    }

    try {
      const payload = mapFormToPayload(formData);
      console.log('Payload ready to send:', JSON.stringify(payload));

     const res =  await createAffiliate(payload);

      setErrors({});

      // setSuccessMessage('Affiliate created successfully!');

      showMessage(res?.message ||
        `Affiliate created successfully!`,
        'success'
      );
      // setTimeout(() => {
      //   setSuccess(false);
      //   setSuccessMessage('');
      // }, 1000);

      /* ================= RESET FORM ================= */

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

        adminName: "",
        adminEmail: "",
        adminPhoneCode: "",
        adminPhoneNumber: "",
        adminPassword: "",
      });
    } catch {
      // setApiError('Something went wrong. Please try again.');
      showMessage(
        `Something went wrong. Please try again.`,
        'danger'
      );
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

          {/* ================= ADMIN CREDENTIALS ================= */}

          <Card>
            <CardHeader>
              <CardTitle>Admin Credentials</CardTitle>

              <CardDescription>
                Create default tenant admin account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">

              <Input
                placeholder="Admin Name"
                value={formData.adminName}
                onChange={(e) =>
                  setField('adminName', e.target.value)
                }
              />

              {errors.adminName && (
                <p className="text-red-500 text-xs">
                  {errors.adminName}
                </p>
              )}

              <Input
                placeholder="Admin Email"
                value={formData.adminEmail}
                onChange={(e) =>
                  setField('adminEmail', e.target.value)
                }
              />

              {errors.adminEmail && (
                <p className="text-red-500 text-xs">
                  {errors.adminEmail}
                </p>
              )}

              <div className="grid grid-cols-[150px_1fr] gap-2">

                <Dropdown
                  options={PHONE_CODES}
                  value={formData.adminPhoneCode}
                  onChange={(v) =>
                    setField('adminPhoneCode', v)
                  }
                />

                <Input
                  placeholder="Admin Phone Number"
                  value={formData.adminPhoneNumber}
                  onChange={(e) =>
                    setField(
                      'adminPhoneNumber',
                      e.target.value.replace(/\D/g, '')
                    )
                  }
                />

              </div>

              {errors.adminPhoneCode && (
                <p className="text-red-500 text-xs">
                  {errors.adminPhoneCode}
                </p>
              )}

              {errors.adminPhoneNumber && (
                <p className="text-red-500 text-xs">
                  {errors.adminPhoneNumber}
                </p>
              )}

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Admin Password"
                  value={formData.adminPassword}
                  onChange={(e) =>
                    setField('adminPassword', e.target.value)
                  }
                  className="pr-10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {errors.adminPassword && (
                <p className="text-red-500 text-xs">
                  {errors.adminPassword}
                </p>
              )}

            </CardContent>
          </Card>
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


      <div className="flex gap-3">
        <Button className="flex-1" onClick={handleSubmit}>
          <Save className="w-4 h-4 mr-2" />Create
        </Button>

        <Link href="/root/affiliates" className="flex-1">
          <Button variant="outline" className="w-full">Cancel</Button>
        </Link>
      </div>

      {/* RIGHT SIDE RESPONSE MESSAGE */}
      <AppMessage
        visible={visible}
        message={message}
        type={type}
        onClose={clearMessage}
      />
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