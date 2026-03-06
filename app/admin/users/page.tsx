'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Search, Users, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SystemUser, SystemUsersResponse } from '@/lib/types';
import { userService } from '@/services/user-service';
import { useAdmin } from '@/contexts/AdminContext';

// Mock users removed - now using API

function UsersPageContent() {
  const { hasPermission, currentLanguage } = useAdmin();
  const router = useRouter();
  
  // State for users data
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filters and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phoneNumber: '',
    status: 'ACTIVE',
  });

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await userService.getSystemUsers({
        page,
        limit,
        search: searchQuery,
        status: statusFilter || undefined,
      });

      if (response.success && response.data) {
        const backendResponse = response as unknown as {
          data?: unknown;
          meta?: {
            total?: number;
            totalPages?: number;
          };
        };

        // Backend list API returns { success, data: SystemUser[], meta }
        // Keep fallback for accidental nested response shapes.
        const usersData = Array.isArray(backendResponse.data)
          ? (backendResponse.data as SystemUser[])
          : ((response.data as unknown as SystemUsersResponse)?.data || []);

        const meta = backendResponse.meta || (response.data as unknown as SystemUsersResponse)?.meta;

        setUsers(usersData);
        setTotal(meta?.total || 0);
        setTotalPages(meta?.totalPages || 1);
      } else {
        setError(response.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('An error occurred while fetching users');
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, searchQuery, statusFilter]);

  // Fetch users on mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset page when search or status changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  const handleAddUser = () => {
    router.push('/admin/users/new');
  };

  const handleEditUser = (user: SystemUser) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || '',
      phoneNumber: user.phoneNumber || '',
      status: (user.status || 'ACTIVE').toUpperCase(),
    });
    setIsFormOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to deactivate this user?')) {
      try {
        const response = await userService.updateUser(userId, {
          status: 'INACTIVE',
        });
        if (response.success) {
          fetchUsers();
        } else {
          alert(response.message || 'Failed to deactivate user');
        }
      } catch (err) {
        console.error('Error deactivating user:', err);
        alert('An error occurred while deactivating user');
      }
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    if (!editForm.name.trim()) {
      alert('Name is required');
      return;
    }

    try {
      setIsSavingEdit(true);
      const response = await userService.updateUser(editingUser._id, {
        name: editForm.name.trim(),
        phoneNumber: editForm.phoneNumber.trim(),
        status: editForm.status,
      });
      if (response.success) {
        await fetchUsers();
        setIsFormOpen(false);
        setEditingUser(null);
      } else {
        alert(response.message || 'Failed to update user');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('An error occurred while saving user');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Get role name based on current language
  const getRoleName = (role: SystemUser['role']) => {
    if (!role?.name) return 'N/A';
    const nameObj = role.name as { en?: string; fr?: string; ar?: string; [key: string]: string | undefined };
    // Use current language or fallback to English
    return nameObj[currentLanguage as string] || nameObj.en || 'N/A';
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    const normalizedStatus = status?.toUpperCase();
    if (normalizedStatus === 'ACTIVE') {
      return 'bg-green-100 text-green-800 hover:bg-green-100';
    }
    if (normalizedStatus === 'INACTIVE') {
      return 'bg-red-100 text-red-800 hover:bg-red-100';
    }
    if (normalizedStatus === 'SUSPENDED') {
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
    }
    return 'bg-gray-100 text-gray-800';
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('en-CA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  const filteredUsers = users.filter((user) => {
    if (!statusFilter) return true;
    return (user.status || '').toUpperCase() === statusFilter.toUpperCase();
  });

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

      {/* Filters Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              className="flex h-10 w-full  rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Users Directory</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading...' : `${total} admin user${total !== 1 ? 's' : ''}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading users...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <Button variant="outline" className="mt-4" onClick={fetchUsers}>
                Retry
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user._id}</p>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.phoneCode && user.phoneNumber 
                              ? `+${user.phoneCode} ${user.phoneNumber}` 
                              : '—'}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {getRoleName(user.role)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(user.status)}>
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(user.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
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
                                  onClick={() => handleDeleteUser(user._id)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{total}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Admins</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {users.filter((u) => u.status?.toUpperCase() === 'ACTIVE').length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Active Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">
                {users.filter((u) => getRoleName(u.role).toUpperCase().includes('ROOT')).length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Root Admins</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Admin User</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{editingUser.email}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Name</label>
                  <Input
                    value={editForm.name}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Phone Number</label>
                  <Input
                    value={editForm.phoneNumber}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={editForm.status}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value }))}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleUpdateUser} disabled={isSavingEdit} className="flex-1">
                  {isSavingEdit ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingUser(null);
                  }}
                  disabled={isSavingEdit}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
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

