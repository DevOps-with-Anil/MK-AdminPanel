'use client';

import { AdminProvider, useAdmin } from '@/contexts/AdminContext';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Upload, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { getSystemRoles, editAdminUser, getAdminUserById } from '@/services/auth.service';
import { AppMessage } from '@/components/common/AppMessage';
import { useAppMessage } from '@/hooks/ui/useAppMessage';

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

  photo?: File | null;     // new upload
  photoUrl?: string;       // display (server OR preview)
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

export default function EditUserContent() {
  const { t } = useAdmin();
  const params = useParams();
  const userId = params.id as string;

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phoneCode: PHONE_CODES[0],
    phoneNumber: '',
    role: { id: '', label: '' },
    allowedCountries: [],
    status: 'INACTIVE',
    photo: null,
  });

  const [roles, setRoles] = useState<{ id: string; label: string }[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [isEditing, setIsEditing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { message, type, visible, showMessage, clearMessage } = useAppMessage();



  const handleInputChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      photo: file,

      // 👇 override server image with preview
      photoUrl: URL.createObjectURL(file),
    }));
  };


  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    // if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    // if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.status) newErrors.status = 'Status is required';
    if (!formData.allowedCountries.length) newErrors.allowedCountries = 'Select at least one country';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const payload = new FormData();

      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("phoneCode", formData.phoneCode.code);
      payload.append("phoneNumber", formData.phoneNumber);
      payload.append("role", formData.role.id);
      payload.append("status", formData.status);
      formData.allowedCountries.forEach((c) =>
        payload.append("allowedCountries[]", c)
      );

      // ✅ IMPORTANT: only send file if user selected new image
      if (formData.photo) {
        payload.append("photo", formData.photo);
      }

      // console.log("Update User Data : " + JSON.stringify(formData));

      const res = await editAdminUser(userId, payload);

      showMessage(res?.message || 'User updated successfully', 'success');

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
        // console.log('Roles API response:', response);

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
  }, [t]);

  // Fetch user after roles loaded
  useEffect(() => {
    if (roles.length === 0) return; // wait for roles


    const fetchUser = async () => {
      try {
        const res = await getAdminUserById(userId);
        const user = res.data;

        // console.log("User data is  : " + JSON.stringify(user))


        // Match role object from roles array
        let matchedRole = roles.find(r => r.id === user.role?._id || r.id === user.role);

        if (!matchedRole) {
          // fallback to first role if not found
          matchedRole = roles[0] || { id: '', label: '' };
        }

        // console.log(user.role._id + "Matched Role is : " + matchedRole.label)

        setFormData((prev) => ({
          ...prev,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: matchedRole,
          allowedCountries: user.allowedCountries,
          status: user.status,

          // 👇 server image URL
          photoUrl: user.photo || '',
          photo: null,
        }));
      } catch (err) {
        console.error('Fetch user error', err);
      }
    };

    fetchUser();
  }, [roles, userId]);


  return (
    <div className="space-y-6 max-w-6xl">

      {/* HEADER */}
      <div className="flex items-center gap-4">

        <Link href="/root/users">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>

        <div>
          <h1 className="text-xl font-medium">
            {t("translate.edit_admin_title")}
          </h1>

          <p className="text-muted-foreground">
            {t("translate.edit_admin_description")}
          </p>
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
                <Label>
                  {t("translate.full_name")}
                </Label>

                <Input
                  value={formData.name}
                  onChange={(e) =>
                    handleInputChange("name", e.target.value)
                  }
                  disabled={!isEditing}
                />

                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <Label>
                  {t("translate.email")}
                </Label>

                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    handleInputChange("email", e.target.value)
                  }
                  disabled={!isEditing}
                />

                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* PHONE */}
              <div className="grid grid-cols-[150px_1fr] gap-4">

                <div>
                  <Label>
                    {t("translate.phone_code")}
                  </Label>

                  <Dropdown
                    options={PHONE_CODES}
                    value={formData.phoneCode}
                    onChange={(val) =>
                      handleInputChange("phoneCode", val)
                    }
                  />
                </div>

                <div>
                  <Label>
                    {t("translate.phone_number")}
                  </Label>

                  <Input
                    type="number"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", e.target.value)
                    }
                  />

                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

              </div>

              {/* ROLE & STATUS */}
              <div className="grid grid-cols-2 gap-4">

                <div>
                  <Label>
                    {t("translate.role")}
                  </Label>

                  {loadingRoles ? (
                    <div>
                      {t("translate.loading_roles")}
                    </div>
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
                    <p className="text-red-500 text-sm mt-1">
                      {errors.role}
                    </p>
                  )}
                </div>

                <div>
                  <Label>
                    {t("translate.status")}
                  </Label>

                  <Dropdown
                    options={[
                      { id: "ACTIVE", label: t("translate.active") },
                      { id: "INACTIVE", label: t("translate.inactive") }
                    ]}
                    value={{
                      id: formData.status,
                      label:
                        formData.status === "ACTIVE"
                          ? t("translate.active")
                          : t("translate.inactive")
                    }}
                    onChange={(val) =>
                      handleInputChange("status", val.id as StatusType)
                    }
                  />

                  {errors.status && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.status}
                    </p>
                  )}
                </div>

              </div>

              {/* COUNTRIES */}
              <div>
                <Label>
                  {t("translate.allowed_countries")}
                </Label>

                <CountryMultiSelect
                  selected={formData.allowedCountries}
                  onChange={(val) =>
                    handleInputChange("allowedCountries", val)
                  }
                />

                {errors.allowedCountries && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.allowedCountries}
                  </p>
                )}
              </div>

              {/* IMAGE */}
              <div>
                <Label>
                  {t("translate.admin_image")}
                </Label>

                <div className="flex items-center gap-4">

                  {formData.photoUrl ? (
                    <img
                      src={formData.photoUrl}
                      className="w-20 h-20 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full border flex items-center justify-center text-sm text-gray-500">
                      {t("translate.no_image")}
                    </div>
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
                    : t("translate.save_changes")}
                </Button>

                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  className="flex-1"
                >
                  {isEditing
                    ? t("translate.cancel")
                    : t("translate.edit")}
                </Button>

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

