'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Upload, ChevronDown, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { createAdminUser, getSystemRoles } from '@/services/auth.service';

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
    image: ''
  });

  const [roles, setRoles] = useState<{ id: string; label: string }[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ---------------------- Handlers ----------------------
  // Handle input change for all fields
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' })); // clear field error
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => handleInputChange('image', reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
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
      await createAdminUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneCode: formData.phoneCode,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
        allowedCountries: formData.allowedCountries,
        status: formData.status as 'ACTIVE' | 'INACTIVE'
      });

      alert('Admin user created successfully!');

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
        image: ''
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
  }, []);

  // ---------------------- Render ----------------------
  return (
    <div className="space-y-6 max-w-8xl">
      {/* Header & Breadcrumb */}
      <div className="flex items-center gap-4">
        <Link href="/root/users">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-medium">Create New Admin User</h1>
          <p className="text-muted-foreground">Add a new administrator and configure permissions</p>
          {errors.global && <p className="text-red-500 mt-2">{errors.global}</p>}
        </div>
      </div>

      {/* Form Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Enter basic admin details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Name */}
              <div>
                <Label className="mb-2 block">Full Name *</Label>
                <Input value={formData.name} onChange={e => handleInputChange('name', e.target.value)} placeholder="Full Name" />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <Label className="mb-2 block">Email *</Label>
                <Input type="email" value={formData.email} onChange={e => handleInputChange('email', e.target.value)} placeholder="Email" />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <Label className="mb-2 block">Password *</Label>
                <div className="relative">
                  <Input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => handleInputChange('password', e.target.value)} placeholder="Password" />
                  <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>

              {/* Phone */}
              <div className="grid grid-cols-[120px_1fr] gap-4">
                <div>
                  <Label className="mb-2 block">Phone Code *</Label>
                  <Dropdown options={PHONE_CODES} value={formData.phoneCode} onChange={val => handleInputChange('phoneCode', val)} placeholder="Select code" />
                </div>
                <div>
                  <Label className="mb-2 block">Phone Number *</Label>
                  <Input type="number" value={formData.phoneNumber} onChange={e => handleInputChange('phoneNumber', e.target.value)} placeholder="Phone Number" />
                  {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
                </div>
              </div>

              {/* Role & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">Role *</Label>
                  {loadingRoles ? <div>Loading roles...</div> :
                    <Dropdown options={roles} value={formData.role} onChange={val => handleInputChange('role', val)} placeholder="Select role" />
                  }
                  {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
                </div>
                <div>
                  <Label className="mb-2 block">Status *</Label>
                  <Dropdown options={[{ label: 'Active', id: 'ACTIVE' }, { label: 'Inactive', id: 'INACTIVE' }]} value={formData.status} onChange={val => handleInputChange('status', val)} placeholder="Select status" />
                  {errors.status && <p className="text-red-500 text-sm">{errors.status}</p>}
                </div>
              </div>

              {/* Allowed Countries */}
              <div>
                <Label className="mb-2 block">Allowed Countries *</Label>
                <CountryMultiSelect selected={formData.allowedCountries} onChange={val => handleInputChange('allowedCountries', val)} />
                {errors.allowedCountries && <p className="text-red-500 text-sm">{errors.allowedCountries}</p>}
              </div>

              {/* Admin Image */}
              <div>
                <Label className="mb-2 block">Admin Image</Label>
                <div className="flex items-center gap-4">
                  {formData.image && <img src={formData.image} alt="Admin" className="w-20 h-20 rounded-full object-cover border" />}
                  <label className="flex items-center gap-2 cursor-pointer px-3 py-2 border rounded-md">
                    <Upload className="w-4 h-4" /> Upload Image
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-4">
                <Button onClick={handleSave} className="gap-2 bg-primary flex-1" disabled={isLoading}>
                  <Save className="w-4 h-4" /> {isLoading ? 'Saving...' : 'Save Admin'}
                </Button>
                <Link href="/root/users" className="flex-1">
                  <Button variant="outline" className="w-full">Cancel</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default NewAdminContent;