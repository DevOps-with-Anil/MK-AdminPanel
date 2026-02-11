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
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface PlanForm {
  name: string;
  price: number;
  billing: 'monthly' | 'yearly';
  description: string;
  features: string[];
  status: 'active' | 'inactive';
}

function EditPlanContent() {
  const params = useParams();
  const planId = params.id as string;
  const [isEditing, setIsEditing] = useState(true);
  const [newFeature, setNewFeature] = useState('');
  const [formData, setFormData] = useState<PlanForm>({
    name: 'Pro Plan',
    price: 99,
    billing: 'monthly',
    description: 'Best for growing teams with advanced features',
    features: ['Dashboard', 'Full CMS', 'Analytics', 'Support Tickets', 'Ad Management'],
    status: 'active',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature],
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    alert('Plan updated successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/plans">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Subscription Plan</h1>
            <p className="text-muted-foreground">Configure plan details and features</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Details */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Details</CardTitle>
              <CardDescription>Basic plan information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name" className="mb-2 block">
                  Plan Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Pro Plan"
                  disabled={!isEditing}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price" className="mb-2 block">
                    Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                    placeholder="99"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <Label htmlFor="billing" className="mb-2 block">
                    Billing Cycle
                  </Label>
                  <select
                    id="billing"
                    value={formData.billing}
                    onChange={(e) => handleInputChange('billing', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground disabled:opacity-50"
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
                  placeholder="Plan description"
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground disabled:opacity-50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Included Features</CardTitle>
              <CardDescription>Features available in this plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <span className="text-foreground">{feature}</span>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}

              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    placeholder="Add new feature..."
                  />
                  <Button onClick={addFeature} className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Status</CardTitle>
              <CardDescription>Control plan availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value as any)}
                  disabled={!isEditing}
                  className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground disabled:opacity-50"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <Badge className={formData.status === 'active' ? 'bg-primary' : 'bg-muted'}>
                  {formData.status}
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

        {/* Pricing Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pricing Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 border border-border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Price</p>
                <p className="text-3xl font-bold text-primary">
                  ${formData.price}
                  <span className="text-lg text-muted-foreground">/{formData.billing.charAt(0)}</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Features Count</p>
                <Badge className="bg-primary text-primary-foreground">
                  {formData.features.length} features
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Plan ID</p>
                <p className="font-mono text-foreground">{planId}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Subscribers</p>
                <p className="text-2xl font-bold text-foreground">450</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Monthly Revenue</p>
                <p className="text-2xl font-bold text-accent">${(formData.price * 450).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function EditPlanPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <EditPlanContent />
      </AdminLayout>
    </AdminProvider>
  );
}
