'use client';

import { useContext, useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Upload, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { getSystemRoles, editAdminUser, getAdminUserById } from '@/services/auth.service';
import { I18nContext } from '@/i18n/provider';

const COUNTRIES = [
  { code: 'IN', label: 'India' },
  { code: 'US', label: 'United States' },
  { code: 'AE', label: 'UAE' },
];

const PHONE_CODES = [
  { code: '+91', label: 'India (+91)' },
  { code: '+1', label: 'USA (+1)' },
  { code: '+971', label: 'UAE (+971)' },
];

type StatusType = 'ACTIVE' | 'INACTIVE';

interface FormData {
  name: string;
  email: string;
  phoneCode: { code: string; label: string };
  phoneNumber: string;
  role: { id: string; label: string };
  allowedCountries: string[];
  status: StatusType;
  image?: string;
}

interface DropdownOption {
  id?: string;
  code?: string;
  label?: string;
}

function Dropdown<T extends DropdownOption>({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: T[];
  value: T | null;
  onChange: (val: T) => void;
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
        {value?.label || placeholder || 'Select'}
        <ChevronDown className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
          {options.map((opt, index) => (
            <div
              key={`${opt.id || opt.code || index}`}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
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

function CountryMultiSelect({ selected, onChange }: { selected: string[]; onChange: (val: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCountry = (code: string) => {
    if (selected.includes(code)) onChange(selected.filter((c) => c !== code));
    else onChange([...selected, code]);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2 border rounded-md flex justify-between items-center bg-white"
      >
        {selected.length > 0 ? selected.map((c) => COUNTRIES.find((x) => x.code === c)?.label).join(', ') : 'Select countries'}
        <ChevronDown className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
          {COUNTRIES.map((c, index) => (
            <label key={`${c.code}-${index}`} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100">
              <Checkbox checked={selected.includes(c.code)} onCheckedChange={() => toggleCountry(c.code)} />
              <span>{c.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EditUserPage() {
  const params = useParams();
  const { messages } = useContext(I18nContext);
  const t = (key: string, placeholders?: Record<string, string | number>) => {
    const normalizedKey = key.replace(/^translate\./, '');
    let value = messages.translate?.[normalizedKey] || key;

    if (placeholders) {
      for (const [ph, phValue] of Object.entries(placeholders)) {
        value = value.replace(`{{${ph}}}`, String(phValue));
        value = value.replace(`{${ph}}`, String(phValue));
      }
    }

    return value;
  };
  const userId = params.id as string;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneCode: PHONE_CODES[0],
    phoneNumber: '',
    role: { id: '', label: '' },
    allowedCountries: [],
    status: 'INACTIVE',
    image: '',
  });

  const [roles, setRoles] = useState<{ id: string; label: string }[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [isEditing, setIsEditing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});


  const handleInputChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => handleInputChange('image', reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };


  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = t('translate.users.name') + ' is required';
    if (!formData.email.trim()) newErrors.email = t('translate.users.email') + ' is required';
    // if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = t('translate.users.phoneNumber') + ' is required';
    // if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.status) newErrors.status = 'Status is required';
    if (!formData.allowedCountries.length) newErrors.allowedCountries = 'Select at least one country';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSave = async () => {

    if (!validateForm()) return;
    console.log("Role ID is : " + formData.role.id);

    setIsLoading(true);
    try {
      await editAdminUser(userId, {
        name: formData.name,
        email: formData.email,
        phoneCode: formData.phoneCode.code,
        phoneNumber: formData.phoneNumber,
        role: formData.role.id,
        allowedCountries: formData.allowedCountries,
        status: formData.status as 'ACTIVE' | 'INACTIVE'
      });
      alert('User updated successfully!');
    } catch (err: any) {
      alert(err?.message || 'Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch roles first
  useEffect(() => {
  const fetchRoles = async () => {
    try {
      const response = await getSystemRoles({});
      
      // Check the actual data structure
      console.log('Roles API response:', response);

      // Adjust based on actual structure
      const rolesData = response.data || response; // if response.data exists, use it; else use response itself

      if (Array.isArray(rolesData)) {
        const roleList = rolesData.map((role: any) => ({
          id: role._id,   // map _id to id
          label: role.name
        }));
        setRoles(roleList);

        // Set default selected role if available
        if (roleList.length > 0) handleInputChange('role', roleList[0].id);
      } else {
        console.warn('Roles data is not an array:', rolesData);
      }
    } catch (err) {
      console.error('Fetch roles error', err);
    } finally {
      setLoadingRoles(false);
    }
  };

  fetchRoles();
}, []);

  // Fetch user after roles loaded
  useEffect(() => {
    if (roles.length === 0) return; // wait for roles

   
    const fetchUser = async () => {
      try {
        const res = await getAdminUserById(userId);
        const user = res.data;

                console.log("User data is  : "+JSON.stringify(user))


        // Match role object from roles array
        let matchedRole = roles.find(r => r.id === user.role?._id || r.id === user.role);

        if (!matchedRole) {
          // fallback to first role if not found
          matchedRole = roles[0] || { id: '', label: '' };
        }

        console.log(user.role._id + "Matched Role is : "+matchedRole.label)

        setFormData((prev) => ({
          ...prev,
          name: user.name || '',
          email: user.email || '',
          phoneCode: PHONE_CODES.find((p) => p.code === user.phoneCode) || PHONE_CODES[0],
          phoneNumber: user.phoneNumber || '',
          role: matchedRole, // âœ… exact object from roles
          allowedCountries: user.allowedCountries || [],
          status: user.status || 'INACTIVE',
          image: user.image || '',
        }));
      } catch (err) {
        console.error('Fetch user error', err);
      }
    };

    fetchUser();
  }, [roles, userId]);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-medium">{t('translate.users.editTitle')}</h1>
          <p className="text-muted-foreground">{t('translate.users.editSubtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('translate.users.detailsTitle')}</CardTitle>
              <CardDescription>{t('translate.users.detailsDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>{t('translate.users.name')}</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={!isEditing}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label>{t('translate.users.email')}</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-[120px_1fr] gap-4">
                <div>
                  <Label>{t('translate.users.phoneCode')}</Label>
                  <Dropdown options={PHONE_CODES} value={formData.phoneCode} onChange={(val) => handleInputChange('phoneCode', val)} />
                </div>
                <div>
                  <Label>{t('translate.users.phoneNumber')}</Label>
                  <Input
                    type="number"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('translate.users.role')}</Label>
                  {loadingRoles ? (
                    <div>Loading roles...</div>
                  ) : (
                    <Dropdown
                      options={roles}
                      value={formData.role}
                      onChange={(val) => handleInputChange('role', val)}
                      placeholder={t('translate.users.selectRole')}
                    />
                  )}
                  {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                </div>

                <div>
                  <Label>{t('translate.users.status')}</Label>
                  <Dropdown
                    options={[
                      { id: 'ACTIVE', label: t('translate.users.active') },
                      { id: 'INACTIVE', label: t('translate.users.inactive') },
                    ]}
                    value={{ id: formData.status, label: formData.status === 'ACTIVE' ? t('translate.users.active') : t('translate.users.inactive') }}
                    onChange={(val) => handleInputChange('status', val.id as StatusType)}
                  />
                  {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                </div>
              </div>

              <div>
                <Label>{t('translate.users.allowedCountries')}</Label>
                <CountryMultiSelect
                  selected={formData.allowedCountries}
                  onChange={(val) => handleInputChange('allowedCountries', val)}
                />
                {errors.allowedCountries && <p className="text-red-500 text-sm mt-1">{errors.allowedCountries}</p>}
              </div>

              <div>
                <Label>{t('translate.users.adminImage')}</Label>
                <div className="flex items-center gap-4">
                  {formData.image && <img src={formData.image} className="w-20 h-20 rounded-full object-cover border" />}
                  <label className="flex items-center gap-2 cursor-pointer px-3 py-2 border rounded-md">
                    <Upload className="w-4 h-4" /> {t('translate.users.uploadImage')}
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button onClick={handleSave} className="gap-2 bg-primary flex-1" disabled={isLoading}>
                  <Save className="w-4 h-4" /> {isLoading ? t('translate.roles.creating') : t('translate.users.saveChanges')}
                </Button>
                <Button onClick={() => setIsEditing(!isEditing)} variant="outline" className="flex-1">
                  {isEditing ? t('translate.plans.cancel') : t('translate.users.edit')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

