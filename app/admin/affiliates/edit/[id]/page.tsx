'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface AffiliateForm {
  name: string;
  email: string;
  phone: string;
  plan: string;
  commission: number;
  status: 'active' | 'inactive' | 'suspended';
  verified: boolean;
}

function EditAffiliateContent() {
  const params = useParams();
  const affiliateId = params.id as string;
  const [isEditing, setIsEditing] = useState(true);
  const [formData, setFormData] = useState<AffiliateForm>({
    name: 'Ahmed Trading Co.',
    email: 'info@ahmedtrading.com',
    phone: '+971-501-234-567',
    plan: 'pro',
    commission: 15,
    status: 'active',
    verified: true,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Affiliate updated successfully!');
  };

  const planDetails: Record<string, { color: string; features: number }> = {
    free: { color: 'bg-blue-100 text-blue-800', features: 3 },
    pro: { color: 'bg-purple-100 text-purple-800', features: 8 },
    enterprise: { color: 'bg-amber-100 text-amber-800', features: 12 },
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
            <h1 className="text-3xl font-bold text-foreground">Edit Affiliate Partner</h1>
            <p className="text-muted-foreground">Manage affiliate account and settings</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Affiliate business details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name" className="mb-2 block">
                  Business Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter business name"
                  disabled={!isEditing}
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
                    disabled={!isEditing}
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
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan & Commission */}
          <Card>
            <CardHeader>
              <CardTitle>Plan & Commission</CardTitle>
              <CardDescription>Subscription and earnings settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="plan" className="mb-2 block">
                    Subscription Plan
                  </Label>
                  <select
                    id="plan"
                    value={formData.plan}
                    onChange={(e) => handleInputChange('plan', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground disabled:opacity-50"
                  >
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="commission" className="mb-2 block">
                    Commission Rate (%)
                  </Label>
                  <Input
                    id="commission"
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={formData.commission}
                    onChange={(e) => handleInputChange('commission', parseFloat(e.target.value))}
                    placeholder="15"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">Plan Features</p>
                <Badge className={planDetails[formData.plan]?.color}>
                  {planDetails[formData.plan]?.features} features available
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Status & Verification */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Verification</CardTitle>
              <CardDescription>Account status and verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="status" className="mb-2 block">
                  Account Status
                </Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as any)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground disabled:opacity-50"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Business Verified</p>
                  <p className="text-sm text-muted-foreground">KYC verification status</p>
                </div>
                <Badge className={formData.verified ? 'bg-primary' : 'bg-muted'}>
                  {formData.verified ? 'Verified' : 'Pending'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={!isEditing}
              className="gap-2 bg-primary hover:bg-primary/90 flex-1"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              className="flex-1"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </div>
        </div>

        {/* Performance Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-muted-foreground mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-primary">$45,230</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                <p className="text-muted-foreground mb-1">Earned Commission</p>
                <p className="text-2xl font-bold text-accent">$6,785</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Joined Date</p>
                <p className="text-foreground">2024-01-10</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Affiliate ID</p>
                <p className="font-mono text-foreground">{affiliateId}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Status</p>
                <Badge className={formData.status === 'active' ? 'bg-primary' : formData.status === 'inactive' ? 'bg-secondary' : 'bg-destructive'}>
                  {formData.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-800">
                Verify business documents before enabling commission payments.
              </p>
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
