'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, User } from 'lucide-react';
import Link from 'next/link';
import { userService } from '@/services/user-service';
import { CreateSystemUserPayload } from '@/lib/types';

interface NewAdminForm extends CreateSystemUserPayload {
  allowedCountriesInput: string;
}

function NewAdminContent() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<NewAdminForm>({
    name: '',
    email: '',
    phoneCode: '',
    phoneNumber: '',
    password: '',
    role: '',
    allowedCountries: [],
    allowedCountriesInput: '',
    status: 'ACTIVE',
  });

  const handleInputChange = (field: keyof NewAdminForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCountriesChange = (value: string) => {
    const allowedCountries = value
      .split(',')
      .map((country) => country.trim().toUpperCase())
      .filter(Boolean);

    setFormData((prev) => ({
      ...prev,
      allowedCountriesInput: value,
      allowedCountries,
    }));
  };

  const handleSave = async () => {
    setError('');

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phoneCode.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.password.trim() ||
      !formData.role.trim() ||
      formData.allowedCountries.length === 0
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    const payload: CreateSystemUserPayload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phoneCode: formData.phoneCode.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      password: formData.password,
      role: formData.role.trim(),
      allowedCountries: formData.allowedCountries,
      status: formData.status,
    };

    const response = await userService.createUser(payload);
    setIsSubmitting(false);

    if (!response.success) {
      setError(response.message || response.error || 'Failed to create admin user.');
      return;
    }

    router.push('/admin/users');
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New Admin User</h1>
          <p className="text-muted-foreground">Add a new system administrator</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Enter API-required details for system user creation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name" className="mb-2 block">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="mb-2 block">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phoneCode" className="mb-2 block">
                    Phone Code *
                  </Label>
                  <Input
                    id="phoneCode"
                    value={formData.phoneCode}
                    onChange={(e) => handleInputChange('phoneCode', e.target.value)}
                    placeholder="+1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber" className="mb-2 block">
                    Phone Number *
                  </Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="1234567890"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="mb-2 block">
                  Password *
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="SecurePass123!"
                  required
                />
              </div>

              <div>
                <Label htmlFor="role" className="mb-2 block">
                  Role Name *
                </Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  placeholder="e.g., Root Admin"
                  required
                />
              </div>

              <div>
                <Label htmlFor="allowedCountries" className="mb-2 block">
                  Allowed Countries (comma-separated) *
                </Label>
                <Input
                  id="allowedCountries"
                  value={formData.allowedCountriesInput}
                  onChange={(e) => handleCountriesChange(e.target.value)}
                  placeholder="US, UK"
                  required
                />
              </div>

              <div>
                <Label htmlFor="status" className="mb-2 block">
                  Status *
                </Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as NewAdminForm['status'])}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  required
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={isSubmitting} className="gap-2 bg-primary hover:bg-primary/90 flex-1">
              <Save className="w-4 h-4" />
              {isSubmitting ? 'Creating...' : 'Create Admin User'}
            </Button>
            <Link href="/admin/users" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent" disabled={isSubmitting}>
                Cancel
              </Button>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="sticky top-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="w-4 h-4" />
                Admin Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">User Info</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-semibold text-foreground">{formData.name || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-mono text-sm text-foreground break-all">{formData.email || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm text-foreground">
                      {formData.phoneCode && formData.phoneNumber
                        ? `${formData.phoneCode} ${formData.phoneNumber}`
                        : 'Not set'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Role & Status</p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">{formData.role || 'Role not set'}</Badge>
                  <Badge>{formData.status}</Badge>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-sm font-semibold text-foreground mb-2">Allowed Countries</p>
                {formData.allowedCountries.length > 0 ? (
                  <div className="flex gap-2 flex-wrap">
                    {formData.allowedCountries.map((country) => (
                      <Badge key={country} variant="outline">
                        {country}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">No countries selected</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function NewAdminPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <NewAdminContent />
      </AdminLayout>
    </AdminProvider>
  );
}
