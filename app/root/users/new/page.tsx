'use client';

import { useState, useRef, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Upload, ChevronDown, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { createAdminUser, getSystemRoles } from '@/services/auth.service';

import { AppMessage } from '@/components/common/AppMessage';
import { useAppMessage } from '@/hooks/ui/useAppMessage';

// ---------------------- Constants ----------------------

// Country options for multi-select
const COUNTRIES = [
  { code: 'IN', label: 'India' },
  { code: 'US', label: 'United States' },
];

// Phone code options for dropdown
const PHONE_CODES = [
  { code: '+91', label: 'India (+91)' },
  { code: '+1', label: 'USA (+1)' },
];

// ---------------------- Dropdown Component ----------------------
/**
 * Generic dropdown component
 */
function Dropdown({
  options,
  value,
  onChange,
  placeholder
}: {
  options: { id?: string; code?: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Dropdown button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2 border rounded-md flex justify-between items-center bg-white"
      >
        {options.find(o => o.id === value || o.code === value)?.label || placeholder || 'Select'}
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Dropdown options */}
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
          {options.map(opt => (
            <div
              key={opt.id || opt.code}
              onClick={() => { onChange(opt.id || opt.code!); setOpen(false); }}
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

// ---------------------- Multi-Select Countries Component ----------------------
/**
 * Multi-select dropdown for countries
 */
function CountryMultiSelect({
  selected,
  onChange
}: {
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle country selection
  const toggleCountry = (code: string) => {
    if (selected.includes(code)) onChange(selected.filter(c => c !== code));
    else onChange([...selected, code]);
  };

  return (
    <div className="relative" ref={ref}>
      {/* Dropdown button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-3 py-2 border rounded-md flex justify-between items-center bg-white"
      >
        {selected.length > 0 ? selected.map(c => COUNTRIES.find(x => x.code === c)?.label).join(', ') : 'Select countries'}
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Dropdown options */}
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
          {COUNTRIES.map(c => (
            <label key={c.code} className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100">
              <Checkbox checked={selected.includes(c.code)} onCheckedChange={() => toggleCountry(c.code)} />
              <span>{c.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------- New Admin Form Component ----------------------
function NewAdminContent() {
  // ---------------------- State ----------------------
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneCode: '+91',
    phoneNumber: '',
    role: '',
    allowedCountries: [] as string[],
    status: 'INACTIVE',
    photo: null as File | null
  });

  const { t } = useAdmin();

  const [roles, setRoles] = useState<{ id: string; label: string }[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { message, type, visible, showMessage, clearMessage } = useAppMessage();


  // ---------------------- Handlers ----------------------
  // Handle input change for all fields
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' })); // clear field error
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // ✅ real file for backend
      handleInputChange('photo', file);

      // preview only
      const reader = new FileReader();
      reader.onload = () => {
        handleInputChange('photo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) newErrors.email = 'Enter a valid email address';
    }

    if (!formData.password.trim()) newErrors.password = 'Password is required';
    else {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(formData.password)) newErrors.password = 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character';
    }

    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.status) newErrors.status = 'Status is required';
    if (!formData.allowedCountries.length) newErrors.allowedCountries = 'Select at least one country';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save button click
  const handleSave = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    setErrors(prev => ({ ...prev, global: '' })); // clear global error

    try {
      const payload = new FormData();

      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("password", formData.password);
      payload.append("phoneCode", formData.phoneCode);
      payload.append("phoneNumber", formData.phoneNumber);
      payload.append("role", formData.role);
      payload.append("status", formData.status);

      formData.allowedCountries.forEach(c =>
        payload.append("allowedCountries[]", c)
      );

      // ✅ IMAGE
      if (formData.photo) {
        payload.append("photo", formData.photo);
      }

      const res = await createAdminUser(payload);

      showMessage(res?.message || 'User created successfully', 'success');


      // alert('Admin user created successfully!');

      // Reset form after success
      setFormData({
        name: '',
        email: '',
        password: '',
        phoneCode: '+91',
        phoneNumber: '',
        role: roles[0]?.id || '',
        allowedCountries: [],
        status: 'INACTIVE',
        photo: null
      });
      setErrors({});
    } catch (err: any) {
      setErrors(prev => ({ ...prev, global: err?.message || 'Failed to create admin user' }));
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------- Fetch Roles ----------------------
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getSystemRoles({});
        const rolesData = response.data || response;

        if (Array.isArray(rolesData)) {
          const roleList = rolesData.map((role: any) => ({ id: role._id, label: role.name }));
          setRoles(roleList);

          if (roleList.length > 0) handleInputChange('role', roleList[0].id);
        }
      } catch (err) {
        console.error('Fetch roles error', err);
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, [t]);

  // ---------------------- Render ----------------------

  return (
    <div className="space-y-6 max-w-8xl">

      {/* HEADER */}
      <div className="flex items-center gap-4">

        <Link href="/root/users">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>

        <div>
          <h1 className="text-xl font-medium">
            {t("translate.create_admin_title")}
          </h1>

          <p className="text-muted-foreground">
            {t("translate.create_admin_description")}
          </p>

          {errors.global && (
            <p className="text-red-500 mt-2">{errors.global}</p>
          )}
        </div>

      </div>

      {/* FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        <div className="lg:col-span-2 space-y-6">

          <Card>

            <CardHeader>
              <CardTitle>
                {t("translate.admin_user_info_title")}
              </CardTitle>

              <CardDescription>
                {t("translate.admin_user_info_desc")}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">

              {/* NAME */}
              <div>
                <Label className="mb-2 block">
                  {t("translate.full_name")} *
                </Label>

                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder={t("translate.full_name")}
                />

                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <Label className="mb-2 block">
                  {t("translate.email")} *
                </Label>

                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder={t("translate.email")}
                />

                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <Label className="mb-2 block">
                  {t("translate.password")} *
                </Label>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder={t("translate.password")}
                  />

                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              {/* PHONE */}
              <div className="grid grid-cols-[150px_1fr] gap-4">

                <div>
                  <Label className="mb-2 block">
                    {t("translate.phone_code")} *
                  </Label>

                  <Dropdown
                    options={PHONE_CODES}
                    value={formData.phoneCode}
                    onChange={(val) =>
                      handleInputChange("phoneCode", val)
                    }
                    placeholder={t("translate.select_code")}
                  />
                </div>

                <div>
                  <Label className="mb-2 block">
                    {t("translate.phone_number")} *
                  </Label>

                  <Input
                    type="number"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                    placeholder={t("translate.phone_number")}
                  />

                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

              </div>

              {/* ROLE & STATUS */}
              <div className="grid grid-cols-2 gap-4">

                <div>
                  <Label className="mb-2 block">
                    {t("translate.role")} *
                  </Label>

                  {loadingRoles ? (
                    <div>{t("translate.loading_roles")}</div>
                  ) : (
                    <Dropdown
                      options={roles}
                      value={formData.role}
                      onChange={(val) =>
                        handleInputChange("role", val)
                      }
                      placeholder={t("translate.select_role")}
                    />
                  )}

                  {errors.role && (
                    <p className="text-red-500 text-sm">{errors.role}</p>
                  )}
                </div>

                <div>
                  <Label className="mb-2 block">
                    {t("translate.status")} *
                  </Label>

                  <Dropdown
                    options={[
                      { label: t("translate.active"), id: "ACTIVE" },
                      { label: t("translate.inactive"), id: "INACTIVE" }
                    ]}
                    value={formData.status}
                    onChange={(val) =>
                      handleInputChange("status", val)
                    }
                    placeholder={t("translate.select_status")}
                  />

                  {errors.status && (
                    <p className="text-red-500 text-sm">{errors.status}</p>
                  )}
                </div>

              </div>

              {/* COUNTRIES */}
              <div>
                <Label className="mb-2 block">
                  {t("translate.allowed_countries")} *
                </Label>

                <CountryMultiSelect
                  selected={formData.allowedCountries}
                  onChange={(val) =>
                    handleInputChange("allowedCountries", val)
                  }
                />

                {errors.allowedCountries && (
                  <p className="text-red-500 text-sm">
                    {errors.allowedCountries}
                  </p>
                )}
              </div>

              {/* IMAGE */}
              <div>
                <Label className="mb-2 block">
                  {t("translate.admin_image")}
                </Label>

                <div className="flex items-center gap-4">

                  {formData.photo && (
                    <img
                      src={formData.photo}
                      alt="Admin"
                      className="w-20 h-20 rounded-full object-cover border"
                    />
                  )}

                  <label className="flex items-center gap-2 cursor-pointer px-3 py-2 border rounded-md">
                    <Upload className="w-4 h-4" />
                    {t("translate.upload_image")}

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>

                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3 mt-4">

                <Button
                  onClick={handleSave}
                  className="gap-2 bg-primary flex-1"
                  disabled={isLoading}
                >
                  <Save className="w-4 h-4" />

                  {isLoading
                    ? t("translate.saving")
                    : t("translate.save_admin")}
                </Button>

                <Link href="/root/users" className="flex-1">
                  <Button variant="outline" className="w-full">
                    {t("translate.cancel")}
                  </Button>
                </Link>

              </div>

            </CardContent>
          </Card>

        </div>

      </div>

      {/* MESSAGE */}
      <AppMessage
        visible={visible}
        message={message}
        type={type}
        onClose={clearMessage}
      />

    </div>
  );

}

export default NewAdminContent;