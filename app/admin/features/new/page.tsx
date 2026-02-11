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
import { ArrowLeft, Save, Plus } from 'lucide-react';
import Link from 'next/link';

interface FeatureForm {
  name: string;
  description: string;
  module: string;
  icon: string;
  planAssignment: Record<string, boolean>;
  priority: 'low' | 'medium' | 'high';
  status: 'draft' | 'published';
}

function AddFeatureContent() {
  const [formData, setFormData] = useState<FeatureForm>({
    name: '',
    description: '',
    module: 'dashboard',
    icon: '✨',
    planAssignment: {
      free: false,
      pro: true,
      enterprise: true,
    },
    priority: 'medium',
    status: 'draft',
  });

  const modules = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'cms', name: 'Content Management' },
    { id: 'analytics', name: 'Analytics' },
    { id: 'users', name: 'User Management' },
    { id: 'affiliates', name: 'Affiliates' },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePlanToggle = (plan: string) => {
    setFormData((prev) => ({
      ...prev,
      planAssignment: {
        ...prev.planAssignment,
        [plan]: !prev.planAssignment[plan],
      },
    }));
  };

  const handleSave = () => {
    alert('Feature created successfully!');
  };

  const assignedPlans = Object.entries(formData.planAssignment)
    .filter(([_, assigned]) => assigned)
    .map(([plan]) => plan);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/modules">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add New Feature</h1>
          <p className="text-muted-foreground">Create a new feature and assign it to plans</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Feature Details */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Information</CardTitle>
              <CardDescription>Define the feature details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name" className="mb-2 block">
                  Feature Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Advanced Analytics"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="mb-2 block">
                  Description *
                </Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what this feature does..."
                  rows={4}
                  required
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="module" className="mb-2 block">
                    Module *
                  </Label>
                  <select
                    id="module"
                    value={formData.module}
                    onChange={(e) => handleInputChange('module', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    required
                  >
                    {modules.map((mod) => (
                      <option key={mod.id} value={mod.id}>
                        {mod.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="icon" className="mb-2 block">
                    Icon
                  </Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => handleInputChange('icon', e.target.value)}
                    placeholder="✨"
                    maxLength={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority" className="mb-2 block">
                    Priority
                  </Label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value as any)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
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
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan Assignment Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Assign to Plans</CardTitle>
              <CardDescription>Select which subscription plans will have access to this feature</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['free', 'pro', 'enterprise'].map((plan) => (
                  <div
                    key={plan}
                    onClick={() => handlePlanToggle(plan)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.planAssignment[plan]
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Checkbox
                        checked={formData.planAssignment[plan]}
                        onCheckedChange={() => handlePlanToggle(plan)}
                        className="w-5 h-5"
                      />
                      <span className="font-semibold text-foreground capitalize">{plan} Plan</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {plan === 'free' && 'For basic users'}
                      {plan === 'pro' && 'For professional teams'}
                      {plan === 'enterprise' && 'For enterprise customers'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleSave} className="gap-2 bg-primary hover:bg-primary/90 flex-1">
              <Save className="w-4 h-4" />
              Create Feature
            </Button>
            <Link href="/admin/modules" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Cancel
              </Button>
            </Link>
          </div>
        </div>

        {/* Preview Sidebar */}
        <div className="space-y-6">
          {/* Preview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Feature Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-muted/50">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{formData.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {formData.name || 'Feature Name'}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {formData.description || 'Feature description will appear here'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan Assignment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Assigned Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {assignedPlans.length > 0 ? (
                  assignedPlans.map((plan) => (
                    <Badge key={plan} className="bg-primary text-primary-foreground w-full justify-center capitalize">
                      {plan} Plan
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No plans selected</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Module Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Module Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Selected Module</p>
                <Badge variant="outline" className="capitalize">
                  {modules.find((m) => m.id === formData.module)?.name}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Priority</p>
                <Badge
                  className={
                    formData.priority === 'high'
                      ? 'bg-red-100 text-red-800'
                      : formData.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                  }
                >
                  {formData.priority}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Status</p>
                <Badge className={formData.status === 'published' ? 'bg-primary' : 'bg-secondary'}>
                  {formData.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AddFeaturePage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <AddFeatureContent />
      </AdminLayout>
    </AdminProvider>
  );
}
