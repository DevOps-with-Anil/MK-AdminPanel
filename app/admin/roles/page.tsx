'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminProvider } from '@/contexts/AdminContext';
import { useAdmin } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Search, Edit2, Trash2, MoreVertical, Shield } from 'lucide-react';
import { roleService } from '@/services/role-service';
import { SystemRole } from '@/lib/types';

interface MultiLangValue {
  en: string;
  fr: string;
  ar: string;
}

interface RoleRow {
  id: string;
  name: string;
  description: string;
  permissionsCount: number;
  usersCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  nameRaw: MultiLangValue;
  descriptionRaw: MultiLangValue;
}

function RolesPageContent() {
  const { hasPermission, currentLanguage } = useAdmin();

  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: { en: '', fr: '', ar: '' },
    description: { en: '', fr: '', ar: '' },
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    name: MultiLangValue;
    description: MultiLangValue;
  }>({
    name: { en: '', fr: '', ar: '' },
    description: { en: '', fr: '', ar: '' },
  });

  const mapRole = useCallback(
    (role: SystemRole): RoleRow => {
      const lang = currentLanguage as keyof SystemRole['name'];
      const name = role.name?.[lang] || role.name?.en || 'N/A';
      const description = role.description?.[lang] || role.description?.en || '';
      const permissionsCount =
        role.permissions?.reduce((sum, module) => sum + (module.actions?.length || 0), 0) || 0;

      return {
        id: role._id,
        name,
        description,
        permissionsCount,
        usersCount: (role as unknown as { usersCount?: number }).usersCount || 0,
        status: role.status ? 'active' : 'inactive',
        createdAt: role.createdAt,
        nameRaw: {
          en: role.name?.en || '',
          fr: role.name?.fr || '',
          ar: role.name?.ar || '',
        },
        descriptionRaw: {
          en: role.description?.en || '',
          fr: role.description?.fr || '',
          ar: role.description?.ar || '',
        },
      };
    },
    [currentLanguage]
  );

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await roleService.getRoles({
        page: 1,
        limit: 100,
        search: searchQuery || undefined,
      });

      if (!response.success) {
        setError(response.message || 'Failed to fetch roles');
        setRoles([]);
        return;
      }

      const payload = response.data as unknown;
      const roleList = Array.isArray(payload)
        ? (payload as SystemRole[])
        : Array.isArray((payload as { data?: unknown })?.data)
          ? ((payload as { data: SystemRole[] }).data || [])
          : [];

      setRoles(roleList.map(mapRole));
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError('An error occurred while fetching roles');
      setRoles([]);
    } finally {
      setIsLoading(false);
    }
  }, [mapRole, searchQuery]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const filteredRoles = useMemo(
    () =>
      roles.filter(
        (role) =>
          role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          role.description.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [roles, searchQuery]
  );

  const activeRolesCount = useMemo(
    () => filteredRoles.filter((role) => role.status === 'active').length,
    [filteredRoles]
  );

  const totalUsers = useMemo(
    () => filteredRoles.reduce((sum, role) => sum + role.usersCount, 0),
    [filteredRoles]
  );

  const handleAddRole = () => {
    setIsCreateOpen(true);
  };

  const handleEditRole = (roleId: string) => {
    const role = roles.find((item) => item.id === roleId);
    if (!role) {
      alert('Role not found');
      return;
    }

    setEditingRoleId(roleId);
    setEditForm({
      name: { ...role.nameRaw },
      description: { ...role.descriptionRaw },
    });
    setIsEditOpen(true);
  };

  const handleDeleteRole = (roleId: string) => {
    alert(`Delete role ${roleId} flow is not wired yet.`);
  };

  const resetCreateForm = () => {
    setCreateForm({
      name: { en: '', fr: '', ar: '' },
      description: { en: '', fr: '', ar: '' },
    });
  };

  const handleCreateRole = async () => {
    if (!createForm.name.en.trim()) {
      alert('Name (English) is required');
      return;
    }
    if (!createForm.description.en.trim()) {
      alert('Description (English) is required');
      return;
    }

    try {
      setIsCreating(true);
      const response = await roleService.createRole({
        name: createForm.name,
        description: createForm.description,
      });

      if (!response.success) {
        alert(response.message || 'Failed to create role');
        return;
      }

      await fetchRoles();
      setIsCreateOpen(false);
      resetCreateForm();
    } catch (err) {
      console.error('Error creating role:', err);
      alert('An error occurred while creating role');
    } finally {
      setIsCreating(false);
    }
  };

  const resetEditForm = () => {
    setEditForm({
      name: { en: '', fr: '', ar: '' },
      description: { en: '', fr: '', ar: '' },
    });
    setEditingRoleId(null);
  };

  const handleUpdateRole = async () => {
    if (!editingRoleId) {
      alert('Role not found');
      return;
    }
    if (!editForm.name.en.trim()) {
      alert('Name (English) is required');
      return;
    }
    if (!editForm.description.en.trim()) {
      alert('Description (English) is required');
      return;
    }

    try {
      setIsSavingEdit(true);
      const response = await roleService.updateRole(editingRoleId, {
        name: editForm.name,
        description: editForm.description,
      });

      if (!response.success) {
        alert(response.message || 'Failed to update role');
        return;
      }

      await fetchRoles();
      setIsEditOpen(false);
      resetEditForm();
    } catch (err) {
      console.error('Error updating role:', err);
      alert('An error occurred while updating role');
    } finally {
      setIsSavingEdit(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <Shield className="text-primary mt-1 h-10 w-10" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Roles & Permissions</h1>
            <p className="text-muted-foreground">Manage user roles and permission sets</p>
          </div>
        </div>

        {hasPermission('roles_permissions', 'create') && (
          <Button onClick={handleAddRole} className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            New Role
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
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
          <CardDescription>
            {isLoading ? 'Loading roles...' : `${filteredRoles.length} role(s) found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-border border-b">
                  <th className="text-foreground px-4 py-3 text-left font-semibold">Role Name</th>
                  <th className="text-foreground px-4 py-3 text-left font-semibold">Description</th>
                  <th className="text-foreground px-4 py-3 text-left font-semibold">Permissions</th>
                  <th className="text-foreground px-4 py-3 text-left font-semibold">Users</th>
                  <th className="text-foreground px-4 py-3 text-left font-semibold">Status</th>
                  <th className="text-foreground px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={6} className="text-muted-foreground px-4 py-8 text-center">
                      Loading roles...
                    </td>
                  </tr>
                )}

                {!isLoading && filteredRoles.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-muted-foreground px-4 py-8 text-center">
                      No roles found
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  filteredRoles.map((role) => (
                    <tr key={role.id} className="border-border hover:bg-muted/50 border-b transition-colors">
                      <td className="px-4 py-4">
                        <p className="font-medium text-foreground">{role.name}</p>
                      </td>
                      <td className="text-muted-foreground px-4 py-4 text-sm">{role.description || '-'}</td>
                      <td className="px-4 py-4">
                        <Badge variant="secondary">{role.permissionsCount} permissions</Badge>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="outline">{role.usersCount} users</Badge>
                      </td>
                      <td className="px-4 py-4">
                        <Badge className={role.status === 'active' ? 'bg-primary' : 'bg-muted'}>
                          {role.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {hasPermission('roles_permissions', 'edit') && (
                              <DropdownMenuItem className="gap-2" onClick={() => handleEditRole(role.id)}>
                                <Edit2 className="h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            {hasPermission('roles_permissions', 'delete') && (
                              <DropdownMenuItem
                                className="gap-2 text-destructive"
                                onClick={() => handleDeleteRole(role.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            )}
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{filteredRoles.length}</p>
              <p className="text-muted-foreground mt-1 text-sm">Total Roles</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">{activeRolesCount}</p>
              <p className="text-muted-foreground mt-1 text-sm">Active Roles</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">{totalUsers}</p>
              <p className="text-muted-foreground mt-1 text-sm">Total Users</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={isCreateOpen}
        onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) {
            resetCreateForm();
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium">Name (English) *</label>
                <Input
                  value={createForm.name.en}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      name: { ...prev.name, en: e.target.value },
                    }))
                  }
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Name (French)</label>
                <Input
                  value={createForm.name.fr}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      name: { ...prev.name, fr: e.target.value },
                    }))
                  }
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Name (Arabic)</label>
                <Input
                  value={createForm.name.ar}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      name: { ...prev.name, ar: e.target.value },
                    }))
                  }
                  placeholder="Enter name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium">Description (English) *</label>
                <Input
                  value={createForm.description.en}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      description: { ...prev.description, en: e.target.value },
                    }))
                  }
                  placeholder="Enter description"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Description (French)</label>
                <Input
                  value={createForm.description.fr}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      description: { ...prev.description, fr: e.target.value },
                    }))
                  }
                  placeholder="Enter description"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Description (Arabic)</label>
                <Input
                  value={createForm.description.ar}
                  onChange={(e) =>
                    setCreateForm((prev) => ({
                      ...prev,
                      description: { ...prev.description, ar: e.target.value },
                    }))
                  }
                  placeholder="Enter description"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleCreateRole} disabled={isCreating} className="flex-1">
                {isCreating ? 'Creating...' : 'Create Role'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateOpen(false);
                  resetCreateForm();
                }}
                disabled={isCreating}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) {
            resetEditForm();
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium">Name (English) *</label>
                <Input
                  value={editForm.name.en}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      name: { ...prev.name, en: e.target.value },
                    }))
                  }
                  placeholder="Enter name"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Name (French)</label>
                <Input
                  value={editForm.name.fr}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      name: { ...prev.name, fr: e.target.value },
                    }))
                  }
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Name (Arabic)</label>
                <Input
                  value={editForm.name.ar}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      name: { ...prev.name, ar: e.target.value },
                    }))
                  }
                  placeholder="Enter name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium">Description (English) *</label>
                <Input
                  value={editForm.description.en}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      description: { ...prev.description, en: e.target.value },
                    }))
                  }
                  placeholder="Enter description"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Description (French)</label>
                <Input
                  value={editForm.description.fr}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      description: { ...prev.description, fr: e.target.value },
                    }))
                  }
                  placeholder="Enter description"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Description (Arabic)</label>
                <Input
                  value={editForm.description.ar}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      description: { ...prev.description, ar: e.target.value },
                    }))
                  }
                  placeholder="Enter description"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={handleUpdateRole} disabled={isSavingEdit} className="flex-1">
                {isSavingEdit ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditOpen(false);
                  resetEditForm();
                }}
                disabled={isSavingEdit}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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
