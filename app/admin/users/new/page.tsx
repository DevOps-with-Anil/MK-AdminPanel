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
import { ArrowLeft, Save, User, Shield } from 'lucide-react';
import Link from 'next/link';

interface NewAdminForm {
  name: string;
  email: string;
  role: string;
  country: string;
  permissions: string[];
}

const AVAILABLE_PERMISSIONS = [
  { id: 'dashboard', label: 'Dashboard Access', description: 'View main dashboard' },
  { id: 'users_view', label: 'View Admin Users', description: 'View all admin users' },
  { id: 'users_edit', label: 'Edit Admin Users', description: 'Edit admin user details' },
  { id: 'users_delete', label: 'Delete Admin Users', description: 'Delete admin users' },
  { id: 'roles_manage', label: 'Manage Roles', description: 'Create and edit roles' },
  { id: 'plans_view', label: 'View Plans', description: 'View subscription plans' },
  { id: 'plans_edit', label: 'Edit Plans', description: 'Edit subscription plans' },
  { id: 'affiliates_view', label: 'View Affiliates', description: 'View affiliate partners' },
  { id: 'affiliates_edit', label: 'Edit Affiliates', description: 'Edit affiliate details' },
  { id: 'cms_manage', label: 'Manage CMS', description: 'Create and edit content' },
  { id: 'reports_view', label: 'View Reports', description: 'View analytics and reports' },
  { id: 'settings_manage', label: 'Manage Settings', description: 'Configure platform settings' },
];

function NewAdminContent() {
  const [formData, setFormData] = useState<NewAdminForm>({
    name: '',
    email: '',
    role: 'root-sub-admin',
    country: 'IN',
    permissions: ['dashboard', 'users_view', 'plans_view', 'affiliates_view'],
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePermission = (permissionId: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }
    alert('Admin user created successfully!');
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      'root-admin': 'bg-primary text-primary-foreground',
      'root-sub-admin': 'bg-secondary text-secondary-foreground',
      'affiliate-admin': 'bg-accent text-accent-foreground',
      'affiliate-sub-admin': 'bg-muted text-muted-foreground',
    };
    return colors[role] || 'bg-muted text-muted-foreground';
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
          <p className="text-muted-foreground">Add a new administrator and configure permissions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>Enter basic admin details</CardDescription>
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
                  placeholder="e.g., John Smith"
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
                  <Label htmlFor="role" className="mb-2 block">
                    User Role *
                  </Label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    required
                  >
                    <option value="root-admin">Root Admin</option>
                    <option value="root-sub-admin">Root Sub-Admin</option>
                    <option value="affiliate-admin">Affiliate Admin</option>
                    <option value="affiliate-sub-admin">Affiliate Sub-Admin</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="country" className="mb-2 block">
                    Country *
                  </Label>
                  <select
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    required
                  >
                    <option value="IN">India</option>
                    <option value="AE">United Arab Emirates</option>
                    <option value="US">United States</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissions Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Assign Permissions
              </CardTitle>
              <CardDescription>Select which features this user can access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {AVAILABLE_PERMISSIONS.map((perm) => (
                  <label
                    key={perm.id}
                    className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={formData.permissions.includes(perm.id)}
                      onCheckedChange={() => togglePermission(perm.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{perm.label}</p>
                      <p className="text-xs text-muted-foreground">{perm.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleSave} className="gap-2 bg-primary hover:bg-primary/90 flex-1">
              <Save className="w-4 h-4" />
              Create Admin User
            </Button>
            <Link href="/admin/users" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Cancel
              </Button>
            </Link>
          </div>
        </div>

        {/* Sidebar Preview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Admin Summary */}
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
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Role & Location</p>
                <div className="flex gap-2">
                  <Badge className={getRoleBadgeColor(formData.role)}>
                    {formData.role.replace('-', ' ')}
                  </Badge>
                  <Badge variant="outline">{formData.country}</Badge>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-sm font-semibold text-foreground mb-3">Assigned Permissions</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {AVAILABLE_PERMISSIONS.filter((p) => formData.permissions.includes(p.id)).length > 0 ? (
                    AVAILABLE_PERMISSIONS.filter((p) => formData.permissions.includes(p.id)).map((perm) => (
                      <div key={perm.id} className="flex items-center justify-between p-2 bg-primary/10 rounded border border-primary/20">
                        <span className="text-xs font-medium text-foreground">{perm.label}</span>
                        <Badge className="bg-primary text-primary-foreground text-xs">✓</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-4">No permissions selected</p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground mb-1">Total Permissions</p>
                <p className="text-2xl font-bold text-primary">{formData.permissions.length}</p>
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
