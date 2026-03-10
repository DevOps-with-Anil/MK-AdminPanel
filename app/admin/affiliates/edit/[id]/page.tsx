'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { deleteAffiliate, getAffiliateById, updateAffiliate } from '@/services/affiliate-service';

interface AffiliateForm {
  name: string;
  email: string;
  phone: string;
  website: string;
  status: 'active' | 'inactive' | 'suspended';
  kybVerified: boolean;
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

function EditAffiliateContent() {
  const params = useParams();
  const router = useRouter();
  const affiliateId = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AffiliateForm>({
    name: '',
    email: '',
    phone: '',
    website: '',
    status: 'active',
    kybVerified: false,
  });

  useEffect(() => {
    const loadAffiliate = async () => {
      setIsLoading(true);
      setError(null);

      const response = await getAffiliateById(affiliateId);
      if (!response.success) {
        setError(response.message || 'Failed to load affiliate.');
        setIsLoading(false);
        return;
      }

      const payload = response.data as { data?: any } | any;
      const affiliate = payload?.data || payload;

      setFormData({
        name: affiliate?.name?.en || '',
        email: affiliate?.email || '',
        phone: [affiliate?.phoneCode || '', affiliate?.phoneNumber || ''].join(' ').trim(),
        website: affiliate?.website || '',
        status:
          affiliate?.status === 'SUSPENDED'
            ? 'suspended'
            : affiliate?.status === 'INACTIVE'
            ? 'inactive'
            : 'active',
        kybVerified: Boolean(affiliate?.kybVerified),
      });
      setIsLoading(false);
    };

    void loadAffiliate();
  }, [affiliateId]);

  const handleInputChange = (field: keyof AffiliateForm, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required.');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const { phoneCode, phoneNumber } = parsePhone(formData.phone);
      const localizedName = {
        en: formData.name.trim(),
        fr: formData.name.trim(),
        ar: formData.name.trim(),
      };

      const response = await updateAffiliate(affiliateId, {
        email: formData.email.trim(),
        phoneCode,
        phoneNumber,
        website: formData.website.trim() || undefined,
        kybVerified: formData.kybVerified,
        status:
          formData.status === 'suspended'
            ? 'SUSPENDED'
            : formData.status === 'inactive'
            ? 'INACTIVE'
            : 'ACTIVE',
        languages: {
          name: localizedName,
          companyName: localizedName,
        },
      });

      if (!response.success) {
        setError(response.message || 'Failed to update affiliate.');
        return;
      }

      router.push('/admin/affiliates');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this affiliate?')) {
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);

      const response = await deleteAffiliate(affiliateId);
      if (!response.success) {
        setError(response.message || 'Failed to delete affiliate.');
        return;
      }

      router.push('/admin/affiliates');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/affiliates">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Affiliate</h1>
            <p className="text-muted-foreground">Update or delete this affiliate record</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Affiliate Details</CardTitle>
              <CardDescription>Loaded from the affiliate detail API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading affiliate...</p>
              ) : (
                <>
                  <div>
                    <Label htmlFor="name" className="mb-2 block">
                      Business Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter business name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="mb-2 block">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="email@business.com"
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
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        placeholder="https://affiliate.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="status" className="mb-2 block">
                        Status
                      </Label>
                      <select
                        id="status"
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value as AffiliateForm['status'])}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium text-foreground">KYB Verification</p>
                      <p className="text-sm text-muted-foreground">Update business verification status</p>
                    </div>
                    <select
                      value={formData.kybVerified ? 'verified' : 'pending'}
                      onChange={(e) => handleInputChange('kybVerified', e.target.value === 'verified')}
                      className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    >
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                    </select>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={isLoading || isSaving || isDeleting}
              className="gap-2 bg-primary hover:bg-primary/90 flex-1"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isLoading || isSaving || isDeleting}
              variant="destructive"
              className="gap-2 flex-1"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? 'Deleting...' : 'Delete Affiliate'}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Affiliate ID</p>
                <p className="font-mono text-foreground break-all">{affiliateId}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Status</p>
                <Badge className="capitalize">{formData.status}</Badge>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">KYB</p>
                <Badge variant={formData.kybVerified ? 'default' : 'secondary'}>
                  {formData.kybVerified ? 'Verified' : 'Pending'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function EditAffiliatePage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <EditAffiliateContent />
      </AdminLayout>
    </AdminProvider>
  );
}
