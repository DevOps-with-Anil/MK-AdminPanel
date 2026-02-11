'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Search } from 'lucide-react';
import Link from 'next/link';

interface PlanForm {
  name: string;
  price: number;
  billing: 'monthly' | 'yearly';
  description: string;
  selectedFeatures: string[];
  maxUsers: number;
  maxProjects: number;
  status: 'draft' | 'active';
}

interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
}

const availableFeatures: Feature[] = [
  { id: 'f1', name: 'Dashboard', description: 'Main dashboard and statistics', category: 'Core' },
  { id: 'f2', name: 'Analytics', description: 'Advanced analytics and reporting', category: 'Analytics' },
  { id: 'f3', name: 'CMS', description: 'Content management system', category: 'Content' },
  { id: 'f4', name: 'User Management', description: 'Manage admin users and roles', category: 'Admin' },
  { id: 'f5', name: 'API Access', description: 'REST API and webhooks', category: 'Integration' },
  { id: 'f6', name: 'Custom Branding', description: 'White-label customization', category: 'Design' },
  { id: 'f7', name: 'Priority Support', description: '24/7 priority support', category: 'Support' },
  { id: 'f8', name: 'Data Export', description: 'Bulk data export', category: 'Data' },
  { id: 'f9', name: 'Advanced Security', description: 'Two-factor auth and SSO', category: 'Security' },
  { id: 'f10', name: 'Custom Reports', description: 'Create custom reports', category: 'Analytics' },
  { id: 'f11', name: 'Team Collaboration', description: 'Real-time collaboration tools', category: 'Teamwork' },
  { id: 'f12', name: 'Webhooks', description: 'Incoming and outgoing webhooks', category: 'Integration' },
];

function CreatePlanContent() {
  const [formData, setFormData] = useState<PlanForm>({
    name: '',
    price: 0,
    billing: 'monthly',
    description: '',
    selectedFeatures: [],
    maxUsers: 1,
    maxProjects: 5,
    status: 'draft',
  });

  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFeatureToggle = (featureId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(featureId)
        ? prev.selectedFeatures.filter((id) => id !== featureId)
        : [...prev.selectedFeatures, featureId],
    }));
  };

  const handleSave = () => {
    if (!formData.name || formData.price < 0 || formData.selectedFeatures.length === 0) {
      alert('Please fill in all required fields');
      return;
    }
    alert('Plan created successfully!');
  };

  const categories = Array.from(new Set(availableFeatures.map((f) => f.category)));
  const filteredFeatures = availableFeatures.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedFeaturesList = availableFeatures.filter((f) => formData.selectedFeatures.includes(f.id));

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/plans">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create New Plan</h1>
          <p className="text-muted-foreground">Design a new subscription plan with features</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Plan Basics */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Details</CardTitle>
              <CardDescription>Basic plan information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name" className="mb-2 block">
                  Plan Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Professional Plan"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="mb-2 block">
                    Price ($)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                    placeholder="99"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="billing" className="mb-2 block">
                    Billing Cycle
                  </Label>
                  <select
                    id="billing"
                    value={formData.billing}
                    onChange={(e) => handleInputChange('billing', e.target.value as any)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="mb-2 block">
                  Description
                </Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Plan description and benefits..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                />
              </div>
            </CardContent>
          </Card>

          {/* Limits & Restrictions */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Limits</CardTitle>
              <CardDescription>Set usage limits for this plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="maxUsers" className="mb-2 block">
                  Max Admin Users
                </Label>
                <Input
                  id="maxUsers"
                  type="number"
                  min="1"
                  value={formData.maxUsers}
                  onChange={(e) => handleInputChange('maxUsers', parseInt(e.target.value))}
                  placeholder="1"
                />
              </div>

              <div>
                <Label htmlFor="maxProjects" className="mb-2 block">
                  Max Projects/Affiliates
                </Label>
                <Input
                  id="maxProjects"
                  type="number"
                  min="1"
                  value={formData.maxProjects}
                  onChange={(e) => handleInputChange('maxProjects', parseInt(e.target.value))}
                  placeholder="5"
                />
              </div>

              <div>
                <Label htmlFor="status" className="mb-2 block">
                  Status
                </Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as any)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleSave} className="gap-2 bg-primary hover:bg-primary/90 flex-1">
              <Save className="w-4 h-4" />
              Create Plan
            </Button>
            <Link href="/admin/plans" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Cancel
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search & Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {categories.map((category) => {
                  const categoryFeatures = filteredFeatures.filter((f) => f.category === category);
                  if (categoryFeatures.length === 0) return null;

                  return (
                    <div key={category}>
                      <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-2">{category}</h3>
                      <div className="space-y-2">
                        {categoryFeatures.map((feature) => (
                          <label
                            key={feature.id}
                            className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          >
                            <Checkbox
                              checked={formData.selectedFeatures.includes(feature.id)}
                              onCheckedChange={() => handleFeatureToggle(feature.id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{feature.name}</p>
                              <p className="text-xs text-muted-foreground">{feature.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Selected Features Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Selected Features ({formData.selectedFeatures.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedFeaturesList.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedFeaturesList.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                    >
                      <span className="text-sm font-medium text-foreground">{feature.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {feature.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No features selected</p>
              )}
            </CardContent>
          </Card>

          {/* Plan Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Plan Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Price</p>
                <p className="text-2xl font-bold text-primary">
                  ${formData.price}
                  <span className="text-sm text-muted-foreground">/{formData.billing.charAt(0)}</span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="p-2 bg-muted rounded">
                  <p className="text-xs text-muted-foreground">Max Users</p>
                  <p className="font-semibold text-foreground">{formData.maxUsers}</p>
                </div>
                <div className="p-2 bg-muted rounded">
                  <p className="text-xs text-muted-foreground">Max Affiliates</p>
                  <p className="font-semibold text-foreground">{formData.maxProjects}</p>
                </div>
              </div>
              <Badge className={formData.status === 'active' ? 'bg-primary w-full justify-center' : 'bg-secondary w-full justify-center'}>
                {formData.status}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CreatePlanPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <CreatePlanContent />
      </AdminLayout>
    </AdminProvider>
  );
}
