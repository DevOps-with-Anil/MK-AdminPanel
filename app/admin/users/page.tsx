'use client';

import { useContext, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, MoreVertical, Search, Users } from 'lucide-react';
import Link from 'next/link';
import { useDeleteEntity } from '@/hooks/useDeleteEntity';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getSystemUsers, updateStatus } from '@/services/auth.service';
import { I18nContext } from '@/i18n/provider';

const PAGE_LIMIT_OPTIONS = [10, 25, 50, 'All'] as const;

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updating?: boolean;
}

export default function AdminUsersPage() {
  const { messages } = useContext(I18nContext);
  const t = (key: string, placeholders?: Record<string, string | number>) => {
    const normalizedKey = key.replace(/^translate\./, '');
    let value = messages.translate?.[normalizedKey] || key;

    if (placeholders) {
      for (const [ph, phValue] of Object.entries(placeholders)) {
        value = value.replace(`{{${ph}}}`, String(phValue));
        value = value.replace(`{${ph}}`, String(phValue));
      }
    }

    return value;
  };

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number | 'All'>(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { deleteEntity, loadingId } = useDeleteEntity();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch users whenever page, limit, or search changes
  useEffect(() => {
    fetchUsers();
  }, [page, limit, debouncedSearch]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getSystemUsers({
        page,
        limit: limit === 'All' ? 1000000 : limit,
        search: debouncedSearch,
      });

      const formattedUsers: AdminUser[] = res.data.map((u: any) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role?.name?.toLowerCase().replace(/\s/g, '-') || 'unknown',
        status: u.status === 'ACTIVE' ? 'active' : 'inactive',
        createdAt: u.createdAt,
      }));

      setUsers(formattedUsers);
      setTotalPages(res.meta?.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: 'active' | 'inactive') => {
    const newStatus: 'active' | 'inactive' = currentStatus === 'active' ? 'inactive' : 'active';
    setUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, status: newStatus, updating: true } : u))
    );

    try {
      await updateStatus('rootadmin', userId, { status: newStatus === 'active' ? 'ACTIVE' : 'INACTIVE' });
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, status: newStatus, updating: false } : u))
      );
    } catch (err) {
      console.error(err);
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, status: currentStatus, updating: false } : u))
      );
    }
  };

  const formatDateTime = (date: string) =>
    new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

  /* ================= DELETE USER ================= */
  const handleDelete = async (userId: string, adminName: string) => {
    if (!confirm(t('translate.users.deleteConfirm').replace('{name}', adminName))) return;

    try {
      await deleteEntity('rootadmin', userId);

      // instant UI update
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete admin');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-start gap-4">
          <Users className="text-primary w-7 h-7 mt-1" />
          <div>
            <h1 className="text-xl font-medium">{t('translate.users.title')}</h1>
            <p className="text-muted-foreground">{t('translate.users.subtitle')}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('translate.users.searchPlaceholder')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* New User Button */}
          <Link href="/admin/users/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> 
              {t('translate.users.newUser')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex flex-col">
            <CardTitle>{t('translate.users.directory')}</CardTitle>
            <CardDescription>{users.length} {t('translate.users.directory').split(' ')[0].toLowerCase()}(s)</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {t('translate.users.show')}: {limit}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {PAGE_LIMIT_OPTIONS.map(option => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => {
                    const newLimit: number | 'All' = option === 'All' ? 'All' : Number(option);
                    setLimit(newLimit);
                    setPage(1);
                  }}
                >
                  {option}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">{t('translate.users.name')}</th>
                  <th className="text-left py-3 px-4">{t('translate.users.email')}</th>
                  <th className="text-left py-3 px-4">{t('translate.users.role')}</th>
                  <th className="text-left py-3 px-4">{t('translate.users.status')}</th>
                  <th className="text-left py-3 px-4">{t('translate.users.created')}</th>
                  <th className="text-right py-3 px-4">{t('translate.users.actions')}</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6">Loading users...</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6">No users found</td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">
                      <td className="py-4 px-4 font-medium">{user.name}</td>
                      <td className="py-4 px-4 text-muted-foreground">{user.email}</td>
                      <td className="py-4 px-4">
                        <Badge variant="secondary">
                          {user.role.replace('-', ' ')}
                        </Badge>
                        </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={user.status === 'active'}
                            disabled={user.updating}
                            onCheckedChange={() => handleToggleStatus(user.id, user.status)}
                          />
                          <span className="text-sm">{user.status === 'active' ? t('translate.users.active') : t('translate.users.inactive')}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{formatDateTime(user.createdAt)}</td>
                      <td className="py-4 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/users/edit/${user.id}`} className="flex items-center gap-2">
                                <Edit2 className="w-4 h-4" /> 
                                {t('translate.users.edit')}
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive flex items-center gap-2"
                              onClick={() => handleDelete(user.id, user.name)}
                            >
                              <Trash2 className="w-4 h-4" /> 
                              {t('translate.users.delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
            <div className="flex justify-end gap-2 p-4">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </Button>

              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant={page === i + 1 ? 'default' : 'outline'}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                size="sm"
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

