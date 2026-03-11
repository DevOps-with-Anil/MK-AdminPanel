'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useAdmin } from '@/contexts/AdminContext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreateSystemUserPayload, SystemRoleOption, SystemUser, SystemUsersResponse, UpdateSystemUserPayload } from '@/lib/types';
import { userService } from '@/services/user-service';
import { ChevronLeft, ChevronRight, Edit2, Loader2, Plus, Search, Trash2, Users } from 'lucide-react';

type FormMode = 'create' | 'edit';

interface SubAdminFormState {
  name: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  password: string;
  roleId: string;
  allowedCountriesInput: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

const EMPTY_FORM: SubAdminFormState = {
  name: '',
  email: '',
  phoneCode: '',
  phoneNumber: '',
  password: '',
  roleId: '',
  allowedCountriesInput: '',
  status: 'ACTIVE',
};

function normalizeRoleName(role?: SystemRoleOption | SystemUser['role'] | null) {
  if (!role?.name) return '';
  if (typeof role.name === 'string') return role.name;
  return role.name.en || role.name.fr || role.name.ar || '';
}

function isSubAdminRoleName(roleName: string) {
  const normalized = roleName.trim().toUpperCase();
  return normalized.includes('SUB');
}

function parseCountries(value: string) {
  return value
    .split(',')
    .map((country) => country.trim().toUpperCase())
    .filter(Boolean);
}

function SubAdminsPageContent() {
  const { currentLanguage, hasPermission } = useAdmin();
  const [subAdmins, setSubAdmins] = useState<SystemUser[]>([]);
  const [roles, setRoles] = useState<SystemRoleOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRolesLoading, setIsRolesLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [form, setForm] = useState<SubAdminFormState>(EMPTY_FORM);

  const subAdminRoles = useMemo(
    () => roles.filter((role) => isSubAdminRoleName(normalizeRoleName(role))),
    [roles]
  );

  const subAdminRoleIds = useMemo(
    () => new Set(subAdminRoles.map((role) => role._id || role.id).filter(Boolean)),
    [subAdminRoles]
  );

  const mapRoleName = useCallback((role?: SystemUser['role'] | SystemRoleOption | null) => {
    if (!role?.name) return 'N/A';
    if (typeof role.name === 'string') return role.name;
    const roleNameMap = role.name as Record<string, string | undefined>;
    return roleNameMap[currentLanguage] || roleNameMap.en || roleNameMap.fr || roleNameMap.ar || 'N/A';
  }, [currentLanguage]);

  const fetchRoles = useCallback(async () => {
    setIsRolesLoading(true);
    try {
      const response = await userService.getSystemRoles();
      const payload = response.data as unknown;
      const items = Array.isArray(payload)
        ? (payload as SystemRoleOption[])
        : Array.isArray((payload as { data?: SystemRoleOption[] })?.data)
          ? ((payload as { data: SystemRoleOption[] }).data)
          : [];
      setRoles(items);
    } finally {
      setIsRolesLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userService.getSystemUsers({
        page: 1,
        limit: 500,
        search: searchQuery || undefined,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
      });

      if (!response.success) {
        setError(response.message || 'Failed to fetch sub-admins');
        setSubAdmins([]);
        setTotal(0);
        setTotalPages(1);
        return;
      }

      const rawData = response.data as unknown;
      const items = Array.isArray(rawData)
        ? (rawData as SystemUser[])
        : ((rawData as SystemUsersResponse | undefined)?.data || []);
      const filtered = items.filter((user) => {
        const roleName = normalizeRoleName(user.role);
        return isSubAdminRoleName(roleName) || subAdminRoleIds.has(user.role?._id);
      });

      setSubAdmins(filtered);
      setTotal(filtered.length);
      setTotalPages(Math.max(1, Math.ceil(filtered.length / limit)));
    } catch (fetchError) {
      console.error('Error fetching sub-admins:', fetchError);
      setError('An error occurred while fetching sub-admins');
    } finally {
      setIsLoading(false);
    }
  }, [limit, searchQuery, statusFilter, subAdminRoleIds]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const openCreateDialog = () => {
    setFormMode('create');
    setEditingUser(null);
    setSubmitError(null);
    setForm(EMPTY_FORM);
    setIsDialogOpen(true);
  };

  const openEditDialog = (user: SystemUser) => {
    setFormMode('edit');
    setEditingUser(user);
    setSubmitError(null);
    setForm({
      name: user.name || '',
      email: user.email || '',
      phoneCode: user.phoneCode || '',
      phoneNumber: user.phoneNumber || '',
      password: '',
      roleId: user.role?._id || '',
      allowedCountriesInput: (user.allowedCountries || []).join(', '),
      status: ((user.status || 'ACTIVE').toUpperCase() as SubAdminFormState['status']),
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
    setSubmitError(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async () => {
    setSubmitError(null);

    const allowedCountries = parseCountries(form.allowedCountriesInput);

    if (!form.name.trim() || !form.email.trim() || !form.phoneCode.trim() || !form.phoneNumber.trim() || !form.roleId.trim()) {
      setSubmitError('Name, email, phone, and role are required.');
      return;
    }

    if (formMode === 'create' && !form.password.trim()) {
      setSubmitError('Password is required for new sub-admins.');
      return;
    }

    if (allowedCountries.length === 0) {
      setSubmitError('Add at least one allowed country.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (formMode === 'create') {
        const payload: CreateSystemUserPayload = {
          name: form.name.trim(),
          email: form.email.trim(),
          phoneCode: form.phoneCode.trim(),
          phoneNumber: form.phoneNumber.trim(),
          password: form.password,
          role: form.roleId,
          allowedCountries,
          status: form.status,
        };

        const response = await userService.createUser(payload);
        if (!response.success) {
          setSubmitError(response.message || 'Failed to create sub-admin');
          return;
        }
      } else if (editingUser) {
        const payload: UpdateSystemUserPayload = {
          name: form.name.trim(),
          email: form.email.trim(),
          phoneCode: form.phoneCode.trim(),
          phoneNumber: form.phoneNumber.trim(),
          role: form.roleId,
          allowedCountries,
          status: form.status,
        };

        const response = await userService.updateUser(editingUser._id, payload);
        if (!response.success) {
          setSubmitError(response.message || 'Failed to update sub-admin');
          return;
        }
      }

      closeDialog();
      await fetchUsers();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (user: SystemUser) => {
    const confirmed = window.confirm(`Delete sub-admin "${user.name}"? This action cannot be undone.`);
    if (!confirmed) return;

    const response = await userService.deleteUser(user._id);
    if (!response.success) {
      window.alert(response.message || 'Failed to delete sub-admin');
      return;
    }

    await fetchUsers();
  };

  const paginatedUsers = useMemo(() => {
    const startIndex = (page - 1) * limit;
    return subAdmins.slice(startIndex, startIndex + limit);
  }, [limit, page, subAdmins]);

  const getStatusBadgeColor = (status: string) => {
    const normalizedStatus = status?.toUpperCase();
    if (normalizedStatus === 'ACTIVE') return 'bg-green-100 text-green-800 hover:bg-green-100';
    if (normalizedStatus === 'INACTIVE') return 'bg-red-100 text-red-800 hover:bg-red-100';
    if (normalizedStatus === 'SUSPENDED') return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
    return 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <Users className="text-primary w-10 h-10 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Sub Admins</h1>
            <p className="text-muted-foreground">Create, edit, list, and delete sub-admin users from the system user APIs.</p>
          </div>
        </div>
        {hasPermission('sub_admins', 'create') && (
          <Button onClick={openCreateDialog} className="gap-2" disabled={isRolesLoading}>
            <Plus className="w-4 h-4" />
            New Sub Admin
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sub Admin Directory</CardTitle>
          <CardDescription>
            {isLoading ? 'Loading...' : `${total} sub-admin user${total === 1 ? '' : 's'} found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading sub-admins...</span>
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
                      <TableHead>Countries</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="py-8 text-center text-muted-foreground">
                          No sub-admin users found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedUsers.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user._id}</p>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.phoneCode && user.phoneNumber ? `${user.phoneCode} ${user.phoneNumber}` : '-'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{mapRoleName(user.role)}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(user.status)}>{user.status}</Badge>
                          </TableCell>
                          <TableCell>{user.allowedCountries?.join(', ') || '-'}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {hasPermission('sub_admins', 'edit') && (
                                <Button variant="ghost" size="sm" onClick={() => openEditDialog(user)}>
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                              )}
                              {hasPermission('sub_admins', 'delete') && (
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(user)}>
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

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))} disabled={page === 1}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))} disabled={page === totalPages}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{total}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Matching Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{subAdmins.filter((user) => user.status?.toUpperCase() === 'ACTIVE').length}</p>
              <p className="text-sm text-muted-foreground mt-1">Active Sub Admins</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">{subAdminRoles.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Available Sub-Admin Roles</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => (open ? setIsDialogOpen(true) : closeDialog())}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{formMode === 'create' ? 'Create Sub Admin' : 'Edit Sub Admin'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subadmin-name">Name</Label>
                <Input id="subadmin-name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
              </div>
              <div>
                <Label htmlFor="subadmin-email">Email</Label>
                <Input id="subadmin-email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="subadmin-phone-code">Phone Code</Label>
                <Input id="subadmin-phone-code" value={form.phoneCode} onChange={(event) => setForm((current) => ({ ...current, phoneCode: event.target.value }))} placeholder="+1" />
              </div>
              <div>
                <Label htmlFor="subadmin-phone-number">Phone Number</Label>
                <Input id="subadmin-phone-number" value={form.phoneNumber} onChange={(event) => setForm((current) => ({ ...current, phoneNumber: event.target.value }))} />
              </div>
            </div>

            {formMode === 'create' && (
              <div>
                <Label htmlFor="subadmin-password">Password</Label>
                <Input id="subadmin-password" type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Role</Label>
                <Select value={form.roleId} onValueChange={(value) => setForm((current) => ({ ...current, roleId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder={isRolesLoading ? 'Loading roles...' : 'Select sub-admin role'} />
                  </SelectTrigger>
                  <SelectContent>
                    {subAdminRoles.map((role) => {
                      const roleId = role._id || role.id;
                      if (!roleId) return null;
                      return (
                        <SelectItem key={roleId} value={roleId}>
                          {mapRoleName(role)}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(value) => setForm((current) => ({ ...current, status: value as SubAdminFormState['status'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                    <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                    <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="subadmin-countries">Allowed Countries</Label>
              <Input
                id="subadmin-countries"
                value={form.allowedCountriesInput}
                onChange={(event) => setForm((current) => ({ ...current, allowedCountriesInput: event.target.value }))}
                placeholder="IN, US, AE"
              />
            </div>

            {submitError && <p className="text-sm text-red-500">{submitError}</p>}

            <div className="flex gap-2 pt-2">
              <Button onClick={handleSubmit} disabled={isSubmitting || isRolesLoading} className="flex-1">
                {isSubmitting ? 'Saving...' : formMode === 'create' ? 'Create Sub Admin' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={closeDialog} disabled={isSubmitting} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function SubAdminsPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <SubAdminsPageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
