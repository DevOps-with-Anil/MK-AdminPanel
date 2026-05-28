'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, MoreVertical, Search, Users } from 'lucide-react';
import Link from 'next/link';
// import { useDeleteEntity } from '@/hooks/useDeleteEntity';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAdmin } from '@/contexts/AdminContext';
import { getSystemUsers, updateStatus, deleteEntity } from '@/services/auth.service';
import { formatDate } from "@/utils/dateFormatter";
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { AppMessage } from '@/components/common/AppMessage';
import { useAppMessage } from '@/hooks/ui/useAppMessage';



const PAGE_LIMIT_OPTIONS = [10, 25, 50, 'All'] as const;

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updating?: boolean;
  photo?: string;
}

export default function UsersPageContent() {

  const { t } = useAdmin();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number | 'All'>(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { message, type, visible, showMessage, clearMessage } = useAppMessage();


  /**
  * Delete confirmation dialog state
  */
  // const [
  //   confirmDialog,
  //   setConfirmDialog
  // ] = useState({
  //   open: false,
  //   title: '',
  //   description: '',
  //   cancelText: '',
  //   confirmText: '',
  //   loading: false,
  //   onConfirm: () => { }
  // });

  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    description: "",
    buttons: [] as {
      label: string;
      variant?: | "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
      loading?: boolean;
      disabled?: boolean;
      onClick: () => void;
    }[],
  });

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
  }, [page, limit, debouncedSearch, t]);

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
        photo: u.photo,
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


  /* ================= DELETE USER ================= */
  // const handleDelete = async (userId: string, adminName: string) => {
  //   if (!confirm(`Delete admin "${adminName}"?`)) return;

  //   try {
  //     await deleteEntity('rootadmin', userId);

  //     // instant UI update
  //     setUsers(prev => prev.filter(u => u.id !== userId));
  //   } catch (err) {
  //     console.error(err);
  //     alert('Failed to delete admin');
  //   }
  // };


  /* ================= DELETE USER ================= */

  const handleDeleteUser = async (id: string) => {
    try {
      /**
       * Enable dialog loader
       */
      setConfirmDialog((prev) => ({
        ...prev,
        loading: true,
      }));

      /* ===============================================
         DELETE USER API
      ================================================ */
      const res = await deleteEntity('rootadmin', id);

      // console.log("Delete Res : " + JSON.stringify(res));

      const isSuccess =
        res?.status === 200 || res?.status === 201;

      /* ===============================================
         SUCCESS
      ================================================ */
      if (isSuccess) {
        /**
         * Remove deleted user from list
         */
        setUsers((prev) =>
          prev.filter((u) => u.id !== id)
        );

        showMessage(
          res?.message || 'User deleted successfully',
          'success'
        );
      } else {
        alert(res.message)
        showMessage(
          res?.message || 'Failed to delete user',
          'danger'
        );
      }
    } catch (err) {
      console.error('Delete user error:', err);

      showMessage(
        (err as any)?.message || String(err),
        'danger'
      );
    } finally {
      /**
       * Close dialog
       */
      setConfirmDialog((prev) => ({
        ...prev,
        open: false,
        loading: false,
      }));

    }
  };



  /* =====================================================
     OPEN DELETE USER CONFIRMATION
  ===================================================== */

  const openDeleteUserDialog = (
    id: string,
    userName: string
  ) => {
    setConfirmDialog({
      open: true,
      title: `${t("translate.delete_user_title")} - ${userName}`,
      description: t("translate.delete_user_description"),
      buttons: [
        {
          label: t("translate.cancel"),
          variant: "outline",
          onClick: () =>
            setConfirmDialog((prev) => ({
              ...prev,
              open: false,
            })),
        },
        {
          label: t("translate.delete_user_confirm"),
          variant: "destructive",
          onClick: () => handleDeleteUser(id),
        },
      ],
    });
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">

        <div className="flex items-start gap-4">
          <Users className="text-primary w-7 h-7 mt-1" />

          <div>
            <h1 className="text-xl font-medium">
              {t("translate.system_users_title")}
            </h1>

            <p className="text-muted-foreground">
              {t("translate.system_users_description")}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2">

          {/* SEARCH */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <Input
              placeholder={t("translate.system_users_search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* NEW USER */}
          <Link href="/root/users/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              {t("translate.system_users_new")}
            </Button>
          </Link>

        </div>

      </div>

      {/* TABLE */}
      <Card>

        <CardHeader className="flex items-center justify-between">

          <div className="flex flex-col">
            <CardTitle>
              {t("translate.system_users_directory")}
            </CardTitle>

            <CardDescription>
              {users.length} {t("translate.system_users_count")}
            </CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {t("translate.system_users_show")}: {limit}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {PAGE_LIMIT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => {
                    const newLimit = option === "All" ? "All" : Number(option);
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

                  <th className="text-left py-3 px-4">
                    {t("translate.user_col_image")}
                  </th>

                  <th className="text-left py-3 px-4">
                    {t("translate.user_col_name")}
                  </th>

                  <th className="text-left py-3 px-4">
                    {t("translate.user_col_email")}
                  </th>

                  <th className="text-left py-3 px-4">
                    {t("translate.user_col_role")}
                  </th>

                  <th className="text-left py-3 px-4">
                    {t("translate.user_col_status")}
                  </th>

                  <th className="text-left py-3 px-4">
                    {t("translate.user_col_created")}
                  </th>

                  <th className="text-right py-3 px-4">
                    {t("translate.user_col_actions")}
                  </th>

                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6">
                      {t("translate.loading_users")}
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6">
                      {t("translate.no_users_found")}
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-muted/50">

                      {/* IMAGE */}
                      <td className="py-4 px-4">
                        {user.photo ? (
                          <img
                            src={user.photo}
                            alt={user.name}
                            className="w-14 h-14 rounded-full object-cover border"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                      </td>

                      {/* NAME */}
                      <td className="py-4 px-4 font-medium">
                        {user.name}
                      </td>

                      {/* EMAIL */}
                      <td className="py-4 px-4 text-muted-foreground">
                        {user.email}
                      </td>

                      {/* ROLE */}
                      <td className="py-4 px-4">
                        <Badge variant="secondary">
                          {user.role.replace("-", " ")}
                        </Badge>
                      </td>

                      {/* STATUS */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">

                          <Switch
                            checked={user.status === "active"}
                            disabled={user.updating}
                            onCheckedChange={() =>
                              handleToggleStatus(user.id, user.status)
                            }
                          />

                          <span className="text-sm">
                            {user.status === "active"
                              ? t("translate.active")
                              : t("translate.inactive")}
                          </span>

                        </div>
                      </td>

                      {/* CREATED */}
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </td>

                      {/* ACTIONS */}
                      <td className="py-4 px-4 text-right">

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">

                            <DropdownMenuItem asChild>
                              <Link
                                href={`/root/users/edit/${user.id}`}
                                className="flex items-center gap-2"
                              >
                                <Edit2 className="w-4 h-4" />
                                {t("translate.edit")}
                              </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              className="text-destructive flex items-center gap-2"
                              onClick={() =>
                                openDeleteUserDialog(user.id, user.name)
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                              {t("translate.delete")}
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
              {t("translate.prev")}
            </Button>

            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                size="sm"
                variant={page === i + 1 ? "default" : "outline"}
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
              {t("translate.next")}
            </Button>

          </div>

        </CardContent>
      </Card>

      {/* CONFIRM DIALOG */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        description={confirmDialog.description}
        buttons={confirmDialog.buttons}
        onCancel={() =>
          setConfirmDialog((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />

      {/* MESSAGE */}
      <AppMessage
        visible={visible}
        message={message}
        type={type}
        onClose={clearMessage}
      />

    </div>
  );

}
