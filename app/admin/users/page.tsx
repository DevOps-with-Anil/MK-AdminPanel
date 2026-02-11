'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, MoreVertical, Search, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAdmin } from '@/contexts/AdminContext';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: 'active' | 'inactive';
  isVerified: boolean;
  createdAt: string;
}

const mockUsers: AdminUser[] = [
  {
    id: '1',
    email: 'ahmed@example.com',
    name: 'Ahmed Khan',
    role: 'root-admin',
    status: 'active',
    isVerified: true,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    email: 'fatima@example.com',
    name: 'Fatima Ali',
    role: 'root-sub-admin',
    status: 'active',
    isVerified: true,
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    email: 'hassan@example.com',
    name: 'Hassan Malik',
    role: 'affiliate-admin',
    status: 'active',
    isVerified: false,
    createdAt: '2024-03-10',
  },
  {
    id: '4',
    email: 'aisha@example.com',
    name: 'Aisha Ahmed',
    role: 'affiliate-sub-admin',
    status: 'inactive',
    isVerified: true,
    createdAt: '2024-04-05',
  },
];

function UsersPageContent() {
  const { hasPermission } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [users] = useState<AdminUser[]>(mockUsers);

  const filteredUsers = users.filter(
    user =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Users</h1>
          <p className="text-muted-foreground">Manage system administrators and sub-admins</p>
        </div>
        {hasPermission('admin_users', 'create') && (
          <Link href="/admin/users/new">
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              New Admin
            </Button>
          </Link>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users Directory</CardTitle>
          <CardDescription>
            {filteredUsers.length} admin user{filteredUsers.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Role</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Joined</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          {user.isVerified && (
                            <p className="text-xs text-primary flex items-center gap-1 mt-1">
                              <CheckCircle className="w-3 h-3" />
                              Verified
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{user.email}</td>
                      <td className="py-4 px-4">
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.role.replace('-', ' ')}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant="outline"
                          className={
                            user.status === 'active'
                              ? 'border-primary text-primary'
                              : 'border-destructive text-destructive'
                          }
                        >
                          {user.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{user.createdAt}</td>
                      <td className="py-4 px-4 text-right">
                        {hasPermission('admin_users', 'edit') && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/users/edit/${user.id}`} className="gap-2 flex items-center">
                                  <Edit2 className="w-4 h-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              {hasPermission('admin_users', 'delete') && (
                                <DropdownMenuItem className="gap-2 text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{users.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Admins</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">
                {users.filter((u) => u.status === 'active').length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Active Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">
                {users.filter((u) => u.isVerified).length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Verified</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <UsersPageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
