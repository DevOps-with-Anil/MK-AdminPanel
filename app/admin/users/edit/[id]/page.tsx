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
import { ArrowLeft, Save, X } from 'lucide-react';
import Link from 'next/link';

interface UserForm {
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  verified: boolean;
}

function EditUserContent() {
  const params = useParams();
  const userId = params.id as string;
  const [isEditing, setIsEditing] = useState(true);
  const [formData, setFormData] = useState<UserForm>({
    name: 'Ahmed Khan',
    email: 'ahmed@example.com',
    role: 'root-admin',
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
    alert('User updated successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/users">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Edit Admin User</h1>
            <p className="text-muted-foreground">Modify user details and permissions</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>User account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="name" className="mb-2 block">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter full name"
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="email" className="mb-2 block">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="user@example.com"
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="role" className="mb-2 block">
                  User Role
                </Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground disabled:opacity-50"
                >
                  <option value="root-admin">Root Admin</option>
                  <option value="root-sub-admin">Root Sub-Admin</option>
                  <option value="affiliate-admin">Affiliate Admin</option>
                  <option value="affiliate-sub-admin">Affiliate Sub-Admin</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Status & Verification */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Verification</CardTitle>
              <CardDescription>Account status settings</CardDescription>
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
                </select>
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Email Verified</p>
                  <p className="text-sm text-muted-foreground">User email verification status</p>
                </div>
                <Badge className={formData.verified ? 'bg-primary' : 'bg-muted'}>
                  {formData.verified ? 'Verified' : 'Unverified'}
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

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">User ID</p>
                <p className="font-mono text-foreground">{userId}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Created</p>
                <p className="text-foreground">2024-01-15</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Last Login</p>
                <p className="text-foreground">Today at 2:30 PM</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" className="w-full gap-2">
                <X className="w-4 h-4" />
                Deactivate User
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function EditUserPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <EditUserContent />
      </AdminLayout>
    </AdminProvider>
  );
}
