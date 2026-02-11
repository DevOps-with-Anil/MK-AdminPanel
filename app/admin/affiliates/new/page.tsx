'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface NewAffiliateForm {
  businessName: string;
  email: string;
  phone: string;
  plan: string;
  commission: number;
  status: 'active' | 'inactive';
}

function NewAffiliateContent() {
  const [formData, setFormData] = useState<NewAffiliateForm>({
    businessName: '',
    email: '',
    phone: '',
    plan: 'pro',
    commission: 15,
    status: 'active',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!formData.businessName || !formData.email || !formData.phone) {
      alert('Please fill in all required fields');
      return;
    }
    alert('Affiliate created successfully!');
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
          <p className="text-muted-foreground">Add a new affiliate partner to the platform</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
              <CardDescription>Affiliate business information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+971-50-123-4567"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan & Commission */}
          <Card>
            <CardHeader>
              <CardTitle>Plan & Commission</CardTitle>
              <CardDescription>Select subscription plan and commission rate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="plan" className="mb-2 block">
                    Subscription Plan *
                  </Label>
                  <select
                    id="plan"
                    value={formData.plan}
                    onChange={(e) => handleInputChange('plan', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    required
                  >
                    <option value="free">Free</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="commission" className="mb-2 block">
                    Commission Rate (%) *
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
                  onChange={(e) => handleInputChange('status', e.target.value as any)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleSave} className="gap-2 bg-primary hover:bg-primary/90 flex-1">
              <Save className="w-4 h-4" />
              Create Affiliate
            </Button>
            <Link href="/admin/affiliates" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Cancel
              </Button>
            </Link>
          </div>
        </div>

        {/* Preview Sidebar */}
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
              <div className="pt-3 border-t border-border">
                <p className="text-muted-foreground mb-2">Plan Details</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Plan:</span>
                    <Badge className="capitalize bg-primary text-primary-foreground">{formData.plan}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Commission:</span>
                    <Badge variant="outline">{formData.commission}%</Badge>
                  </div>
                </div>
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
