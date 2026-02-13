'use client';

import { useState } from 'react';
import { AdminUser } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AdminUserFormProps {
  user?: AdminUser | null;
  onSubmit: (data: Partial<AdminUser>) => Promise<void>;
  onClose: () => void;
}

export default function AdminUserForm({ user, onSubmit, onClose }: AdminUserFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<AdminUser>>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    adminType: user?.adminType || 'root-sub-admin',
    roleId: user?.roleId || '',
    tenantId: user?.tenantId || 'ROOT',
    status: user?.status || 'active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.roleId?.trim()) {
      newErrors.roleId = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  const adminTypes = [
    { value: 'root-admin', label: 'Root Admin' },
    { value: 'root-sub-admin', label: 'Root Sub-Admin' },
    { value: 'affiliate-admin', label: 'Affiliate Admin' },
    { value: 'affiliate-sub-admin', label: 'Affiliate Sub-Admin' },
  ];

  const roles = [
    { id: 'ROLE001', name: 'Super Admin' },
    { id: 'ROLE002', name: 'Content Manager' },
    { id: 'ROLE003', name: 'User Manager' },
    { id: 'ROLE004', name: 'Viewer' },
  ];

  const tenants = [
    { id: 'ROOT', name: 'Root Tenant' },
    { id: 'TENANT001', name: 'TechCorp India' },
    { id: 'TENANT002', name: 'Digital UAE' },
  ];

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
      </TabsList>

      <form onSubmit={handleSubmit} className="space-y-6">
        <TabsContent value="basic" className="space-y-6">
          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-base font-semibold mb-2 block">Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-base font-semibold mb-2 block">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email || ''}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone" className="text-base font-semibold mb-2 block">Phone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1-234-567-8900"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          {/* Admin Type & Tenant */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="admin-type" className="text-base font-semibold mb-2 block">Admin Type</Label>
              <Select value={formData.adminType || 'root-sub-admin'} onValueChange={(value) => setFormData({ ...formData, adminType: value as any })}>
                <SelectTrigger id="admin-type">
                  <SelectValue placeholder="Select admin type" />
                </SelectTrigger>
                <SelectContent>
                  {adminTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tenant" className="text-base font-semibold mb-2 block">Tenant</Label>
              <Select value={formData.tenantId || 'ROOT'} onValueChange={(value) => setFormData({ ...formData, tenantId: value })}>
                <SelectTrigger id="tenant">
                  <SelectValue placeholder="Select tenant" />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status" className="text-base font-semibold mb-2 block">Status</Label>
            <Select value={formData.status || 'active'} onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' })}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          {/* Role Selection */}
          <div>
            <Label htmlFor="role" className="text-base font-semibold mb-2 block">Assign Role *</Label>
            <Select value={formData.roleId || ''} onValueChange={(value) => setFormData({ ...formData, roleId: value })}>
              <SelectTrigger id="role" className={errors.roleId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.roleId && <p className="text-red-500 text-sm mt-1">{errors.roleId}</p>}
          </div>

          {/* Permissions Info */}
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">Role Permissions</p>
            <p className="text-sm text-muted-foreground">
              The selected role will determine the modules and actions this admin user can access. Permissions will be assigned based on the role configuration.
            </p>
          </div>
        </TabsContent>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Saving...' : user ? 'Update User' : 'Create User'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Tabs>
  );
}
