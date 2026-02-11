'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, MoreVertical, Shield } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Role {
  id: string;
  name: string;
  description: string;
  permissionsCount: number;
  usersCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Root Admin',
    description: 'Full system access and control',
    permissionsCount: 23,
    usersCount: 1,
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Root Sub-Admin',
    description: 'Limited system management',
    permissionsCount: 9,
    usersCount: 2,
    status: 'active',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Affiliate Admin',
    description: 'Affiliate management access',
    permissionsCount: 18,
    usersCount: 5,
    status: 'active',
    createdAt: '2024-03-10',
  },
  {
    id: '4',
    name: 'Content Manager',
    description: 'CMS content management only',
    permissionsCount: 6,
    usersCount: 3,
    status: 'active',
    createdAt: '2024-04-05',
  },
];

function RolesPageContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roles] = useState<Role[]>(mockRoles);

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <Shield className="text-primary w-10 h-10 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Roles & Permissions</h1>
            <p className="text-muted-foreground">Manage user roles and permission sets</p>
          </div>
        </div>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4" />
          New Role
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Roles Directory</CardTitle>
          <CardDescription>{filteredRoles.length} role(s) found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Role Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Description</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Permissions</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Users</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map((role) => (
                  <tr key={role.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-medium text-foreground">{role.name}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{role.description}</td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary">{role.permissionsCount} permissions</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">{role.usersCount} users</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={role.status === 'active' ? 'bg-primary' : 'bg-muted'}>
                        {role.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{roles.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Roles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">{roles.filter((r) => r.status === 'active').length}</p>
              <p className="text-sm text-muted-foreground mt-1">Active Roles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">{roles.reduce((sum, r) => sum + r.usersCount, 0)}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Users</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function RolesPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <RolesPageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
