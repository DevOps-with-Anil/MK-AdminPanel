'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { createAffiliate } from '@/services/affiliate-service';

interface NewAffiliateForm {
  businessName: string;
  email: string;
  phone: string;
  website: string;
  password: string;
  status: 'active' | 'inactive';
}

function parsePhone(phone: string) {
  const value = phone.trim();
  if (!value) return { phoneCode: undefined, phoneNumber: undefined };

  const match = value.match(/^(\+\d{1,4})[\s-]*(.*)$/);
  if (!match) return { phoneCode: undefined, phoneNumber: value };

  return {
    phoneCode: match[1],
    phoneNumber: match[2] || undefined,
  };
}

function NewAffiliateContent() {
  const router = useRouter();
  const [formData, setFormData] = useState<NewAffiliateForm>({
    businessName: '',
    email: '',
    phone: '',
    website: '',
    password: '',
    status: 'active',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof NewAffiliateForm, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.businessName.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Business name, email, and password are required.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const { phoneCode, phoneNumber } = parsePhone(formData.phone);
      const localizedName = {
        en: formData.businessName.trim(),
        fr: formData.businessName.trim(),
        ar: formData.businessName.trim(),
      };

      const response = await createAffiliate({
        email: formData.email.trim(),
        phoneCode,
        phoneNumber,
        password: formData.password.trim(),
        website: formData.website.trim() || undefined,
        status: formData.status === 'active' ? 'ACTIVE' : 'INACTIVE',
        languages: {
          name: localizedName,
          companyName: localizedName,
        },
      });

      if (!response.success) {
        setError(response.message || 'Failed to create affiliate.');
        return;
      }

      router.push('/admin/affiliates');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/affiliates">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New Affiliate</h1>
          <p className="text-muted-foreground">Add a new affiliate partner using the affiliate create API</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
              <CardDescription>Affiliate information sent to the backend create endpoint</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <Label htmlFor="businessName" className="mb-2 block">
                  Business Name *
                </Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="e.g., Ahmed Trading Co."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="mb-2 block">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="email@business.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="mb-2 block">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+971-50-123-4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website" className="mb-2 block">
                    Website
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://affiliate.com"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="mb-2 block">
                    Initial Password *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Set initial password"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status" className="mb-2 block">
                  Initial Status
                </Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as NewAffiliateForm['status'])}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2 bg-primary hover:bg-primary/90 flex-1"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Creating...' : 'Create Affiliate'}
            </Button>
            <Link href="/admin/affiliates" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Cancel
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Affiliate Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Business Name</p>
                <p className="font-medium text-foreground">{formData.businessName || 'Not set'}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Email</p>
                <p className="font-medium text-foreground break-all">{formData.email || 'Not set'}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Phone</p>
                <p className="font-medium text-foreground">{formData.phone || 'Not set'}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Website</p>
                <p className="font-medium text-foreground break-all">{formData.website || 'Not set'}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Status</p>
                <p className="font-medium text-foreground capitalize">{formData.status}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function NewAffiliatePage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <NewAffiliateContent />
      </AdminLayout>
    </AdminProvider>
  );
}
