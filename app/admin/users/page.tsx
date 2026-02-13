'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Search, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AdminUser } from '@/lib/types';
import AdminUserForm from '@/components/admin/forms/AdminUserForm';
import { useAdmin } from '@/contexts/AdminContext';

const mockUsers: AdminUser[] = [
  {
    id: 'USR001',
    name: 'Ahmed Khan',
    email: 'ahmed@example.com',
    phone: '+91-9876543210',
    tenantId: 'ROOT',
    adminType: 'root-admin',
    roleId: 'ROLE001',
    status: 'active',
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'USR002',
    name: 'Fatima Ali',
    email: 'fatima@example.com',
    phone: '+91-9876543211',
    tenantId: 'ROOT',
    adminType: 'root-sub-admin',
    roleId: 'ROLE002',
    status: 'active',
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'USR003',
    name: 'Hassan Malik',
    email: 'hassan@example.com',
    phone: '+971-501234567',
    tenantId: 'TENANT001',
    adminType: 'affiliate-admin',
    roleId: 'ROLE003',
    status: 'active',
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function UsersPageContent() {
  const { hasPermission } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const filteredUsers = users.filter(
    user =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleToggleStatus = (user: AdminUser) => {
    setUsers(users.map(u => 
      u.id === user.id 
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
        : u
    ));
  };

  const handleFormSubmit = async (data: Partial<AdminUser>) => {
    if (editingUser) {
      setUsers(users.map(u => (u.id === editingUser.id ? { ...u, ...data, updatedAt: new Date().toISOString() } : u)));
    } else {
      const newUser: AdminUser = {
        id: `USR${Date.now()}`,
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        tenantId: data.tenantId || 'ROOT',
        adminType: data.adminType || 'root-sub-admin',
        roleId: data.roleId || '',
        status: data.status || 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUsers([...users, newUser]);
    }
    setIsFormOpen(false);
    setEditingUser(null);
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

  const getStatusBadgeColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <Users className="text-primary w-10 h-10 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Users</h1>
            <p className="text-muted-foreground">Manage system administrators and sub-admins with role assignment</p>
          </div>
        </div>
        {hasPermission('admin_users', 'create') && (
          <Button onClick={handleAddUser} className="gap-2">
            <Plus className="w-4 h-4" />
            New Admin
          </Button>
        )}
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle>Users Directory</CardTitle>
          <CardDescription>
            {filteredUsers.length} admin user{filteredUsers.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Admin Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.adminType)}>
                          {user.adminType.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '—'}
                      </TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-2">
                        {hasPermission('admin_users', 'edit') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        )}
                        {hasPermission('admin_users', 'delete') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

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
                {users.filter((u) => u.adminType === 'root-admin').length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Root Admins</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? 'Edit Admin User' : 'Create New Admin User'}
            </DialogTitle>
          </DialogHeader>
          <AdminUserForm
            user={editingUser}
            onSubmit={handleFormSubmit}
            onClose={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
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
