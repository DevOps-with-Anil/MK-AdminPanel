'use client';

import { AdminProvider, useAdmin } from '@/contexts/AdminContext';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  MoreVertical,
  Shield,
  Settings,
  Settings2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getSystemRoles, updateStatus, deleteEntity } from '@/services/auth.service';
// import { useDeleteEntity } from '@/hooks/useDeleteEntity';
import { useRouter } from 'next/navigation';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { AppMessage } from '@/components/common/AppMessage';
import { useAppMessage } from '@/hooks/ui/useAppMessage';

/* ================= TYPES ================= */

interface Role {
  id: string;
  name: string;
  description: string;
  permissionsCount: number;
  usersCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updating?: boolean;
}

const PAGE_LIMIT_OPTIONS = [10, 25, 50, 'All'];

/* ================= COMPONENT ================= */

export default function RolesPageContent() {
  const { t } = useAdmin();
  const router = useRouter();

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number | 'All'>(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  /**
   * Delete confirmation dialog state
   */
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


  /**
   * Global app message hook
   */
  const {
    message,
    type,
    visible,
    showMessage,
    clearMessage
  } = useAppMessage();

  /* ================= SEARCH ROLE ================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  /* ================= LIST ROELS ================= */

  useEffect(() => {
    fetchRoles();
  }, [page, limit, debouncedSearch, t]);

  const fetchRoles = async () => {
    try {
      setLoading(true);

      const fetchLimit = limit === 'All' ? 0 : limit;

      const res = await getSystemRoles({
        page,
        limit: fetchLimit,
        search: debouncedSearch,
      });

      const formatted: Role[] = res.data.map((r: any) => ({
        id: r._id,
        name: r.name,
        description: r.description,
        permissionsCount: r.permissions?.length || 0,
        usersCount: r.assignedUserCount || 0,
        status: r.status === 'ACTIVE' ? 'active' : 'inactive',
        createdAt: r.createdAt,
      }));

      setRoles(formatted);
      setTotalPages(res.meta?.totalPages || 1);
    } catch (err) {
      console.error('Fetch roles error', err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPDATE STATUS ================= */

  const handleToggleStatus = async (
    roleId: string,
    currentStatus: 'active' | 'inactive'
  ) => {
    const newStatus =
      currentStatus === 'active' ? 'inactive' : 'active';

    // optimistic UI
    setRoles(prev =>
      prev.map(r =>
        r.id === roleId
          ? { ...r, status: newStatus, updating: true }
          : r
      )
    );

    try {
      await updateStatus('role', roleId, {
        status:
          newStatus === 'active' ? 'ACTIVE' : 'INACTIVE',
      });

      setRoles(prev =>
        prev.map(r =>
          r.id === roleId
            ? { ...r, updating: false }
            : r
        )
      );
    } catch (err) {
      console.error(err);

      // rollback
      setRoles(prev =>
        prev.map(r =>
          r.id === roleId
            ? { ...r, status: currentStatus, updating: false }
            : r
        )
      );
    }
  };

  /* ================= HELPERS ================= */

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });


  /* ================= DELETE ROLE ================= */

  const handleDelete = async (id: string) => {

    try {
      setConfirmDialog(prev => ({
        ...prev,
        loading: true,
      }));

      const res = await deleteEntity('role', id);

      const isSuccess = res?.status === 200 || res?.status === 201;

      if (isSuccess) {
        setRoles(prev =>
          prev.filter(r => r.id !== id)
        );

        showMessage(
          res?.message || 'Role deleted successfully',
          'success'
        );
      } else {
        showMessage(
          res?.message || 'Failed to delete role',
          'danger'
        );
      }
    } catch (err) {
      console.error('Delete role error:', err);

      showMessage(
        (err as any)?.message || 'Something went wrong',
        'danger'
      );
    } finally {
      setConfirmDialog(prev => ({
        ...prev,
        open: false,
        loading: false,
      }));
    }
  };

  /* =====================================================
  * OPEN DELETE CONFIRMATION
  * ===================================================*/

  const openDeleteDialog = (
    id: string,
    roleName: string
  ) => {
    setConfirmDialog({
      open: true,
      title: `${t("translate.delete_role_title")} - ${roleName}`,
      description: t("translate.delete_role_description"),
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
          label: t("translate.delete_role_confirm"),
          variant: "destructive",
          onClick: () => handleDelete(id),
        },
      ],
    });
  };
  /* ================= UI ================= */

  // return (
  //   <div className="space-y-6">
  //     {/* HEADER */}
  //     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
  //       <div className="flex items-start gap-4">
  //         <Shield className="text-primary w-7 h-7 mt-1" />
  //         <div>
  //           <h1 className="text-xl font-medium">
  //             Roles & Permissions
  //           </h1>
  //           <p className="text-muted-foreground">
  //             Manage user roles and permission sets
  //           </p>
  //         </div>
  //       </div>

  //       <div className="flex flex-col md:flex-row gap-2 items-center">
  //         {/* Search */}
  //         <div className="relative w-full md:w-64">
  //           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
  //           <Input
  //             placeholder="Search roles..."
  //             value={searchQuery}
  //             onChange={e => setSearchQuery(e.target.value)}
  //             className="pl-10"
  //           />
  //         </div>

  //         {/* Add */}
  //         <Link href="/root/roles/new">
  //           <Button className="gap-2">
  //             <Plus className="w-4 h-4" /> New Role
  //           </Button>
  //         </Link>
  //       </div>
  //     </div>

  //     {/* TABLE */}
  //     <Card>
  //       <CardHeader className="flex items-center justify-between">
  //         <div>
  //           <CardTitle>Roles Directory</CardTitle>
  //           <CardDescription>
  //             {roles.length} role(s)
  //           </CardDescription>
  //         </div>

  //         {/* LIMIT */}
  //         <DropdownMenu>
  //           <DropdownMenuTrigger asChild>
  //             <Button variant="outline" size="sm">
  //               Show: {limit}
  //             </Button>
  //           </DropdownMenuTrigger>
  //           <DropdownMenuContent align="end">
  //             {PAGE_LIMIT_OPTIONS.map(option => (
  //               <DropdownMenuItem
  //                 key={option}
  //                 onClick={() => {
  //                   const newLimit =
  //                     option === 'All'
  //                       ? 'All'
  //                       : Number(option);
  //                   setLimit(newLimit);
  //                   setPage(1);
  //                 }}
  //               >
  //                 {option}
  //               </DropdownMenuItem>
  //             ))}
  //           </DropdownMenuContent>
  //         </DropdownMenu>
  //       </CardHeader>

  //       <CardContent>
  //         <div className="overflow-x-auto">
  //           <table className="w-full">
  //             <thead>
  //               <tr className="border-b">
  //                 <th className="text-left py-3 px-4">
  //                   Role
  //                 </th>
  //                 <th className="text-left py-3 px-4">
  //                   Description
  //                 </th>
  //                 <th className="text-left py-3 px-4">
  //                   Permissions
  //                 </th>
  //                 <th className="text-left py-3 px-4">
  //                   Users
  //                 </th>
  //                 <th className="text-left py-3 px-4">
  //                   Status
  //                 </th>
  //                 <th className="text-left py-3 px-4">
  //                   Created
  //                 </th>
  //                 <th className="text-right py-3 px-4">
  //                   Actions
  //                 </th>
  //               </tr>
  //             </thead>

  //             <tbody>
  //               {loading ? (
  //                 <tr>
  //                   <td colSpan={7} className="text-center py-6">
  //                     Loading roles...
  //                   </td>
  //                 </tr>
  //               ) : roles.length === 0 ? (
  //                 <tr>
  //                   <td colSpan={7} className="text-center py-6">
  //                     No roles found
  //                   </td>
  //                 </tr>
  //               ) : (
  //                 roles.map(role => (
  //                   <tr
  //                     key={role.id}
  //                     className="border-b hover:bg-muted/50"
  //                   >
  //                     <td className="py-4 px-4 font-medium">
  //                       {role.name}
  //                     </td>

  //                     <td className="py-4 px-4 text-sm text-muted-foreground">
  //                       {role.description}
  //                     </td>

  //                     <td className="py-4 px-4">
  //                       <Badge variant="secondary">
  //                         {role.permissionsCount} permissions
  //                       </Badge>
  //                     </td>

  //                     <td className="py-4 px-4">
  //                       <Badge variant="outline">
  //                         {role.usersCount} user(s)
  //                       </Badge>
  //                     </td>

  //                     <td className="py-4 px-4">
  //                       <Switch
  //                         checked={role.status === 'active'}
  //                         disabled={role.updating}
  //                         onCheckedChange={() =>
  //                           handleToggleStatus(
  //                             role.id,
  //                             role.status
  //                           )
  //                         }
  //                       />
  //                     </td>

  //                     <td className="py-4 px-4 text-sm text-muted-foreground">
  //                       {formatDate(role.createdAt)}
  //                     </td>

  //                     <td className="py-4 px-4 text-right">
  //                       <DropdownMenu>
  //                         <DropdownMenuTrigger asChild>
  //                           <Button
  //                             variant="ghost"
  //                             size="sm"
  //                           >
  //                             <MoreVertical className="w-4 h-4" />
  //                           </Button>
  //                         </DropdownMenuTrigger>

  //                         <DropdownMenuContent align="end">
  //                           <DropdownMenuItem
  //                             onClick={() =>
  //                               router.push(
  //                                 `/root/roles/edit/${role.id}`
  //                               )
  //                             }
  //                           >
  //                             <Edit2 className="w-4 h-4 mr-2" />
  //                             Edit Role
  //                           </DropdownMenuItem>

  //                           <DropdownMenuItem
  //                             onClick={() =>
  //                               router.push(
  //                                 `/root/roles/modules/${role.id}`
  //                               )
  //                             }
  //                           >
  //                             <Settings2 className="w-4 h-4 mr-2" />
  //                             Assing Permissions
  //                           </DropdownMenuItem>


  //                           <DropdownMenuItem

  //                             onClick={() =>
  //                               openDeleteDialog(
  //                                 role.id,
  //                                 role.name
  //                               )
  //                             }
  //                             className="text-destructive"
  //                           >
  //                             <Trash2 className="w-4 h-4 mr-2" />
  //                             Delete Role
  //                           </DropdownMenuItem>

  //                         </DropdownMenuContent>
  //                       </DropdownMenu>
  //                     </td>
  //                   </tr>
  //                 ))
  //               )}
  //             </tbody>
  //           </table>
  //         </div>

  //         {/* PAGINATION */}
  //         <div className="flex justify-end gap-2 p-4">
  //           <Button
  //             size="sm"
  //             variant="outline"
  //             disabled={page === 1}
  //             onClick={() => setPage((p) => p - 1)}
  //           >
  //             Prev
  //           </Button>

  //           {[...Array(totalPages)].map((_, i) => (
  //             <Button
  //               key={i}
  //               size="sm"
  //               variant={page === i + 1 ? 'default' : 'outline'}
  //               onClick={() => setPage(i + 1)}
  //             >
  //               {i + 1}
  //             </Button>
  //           ))}

  //           <Button
  //             size="sm"
  //             variant="outline"
  //             disabled={page === totalPages}
  //             onClick={() => setPage((p) => p + 1)}
  //           >
  //             Next
  //           </Button>
  //         </div>
  //       </CardContent>
  //     </Card>


  //     {/* =================================================
  //               DELETE CONFIRMATION DIALOG
  //           ================================================== */}

  //     <ConfirmDialog
  //       open={confirmDialog.open}
  //       title={confirmDialog.title}
  //       description={
  //         confirmDialog.description
  //       }
  //       confirmText={
  //         confirmDialog.confirmText
  //       }
  //       loading={confirmDialog.loading}
  //       variant="destructive"
  //       onCancel={() =>
  //         setConfirmDialog((prev) => ({
  //           ...prev,
  //           open: false
  //         }))
  //       }
  //       onConfirm={
  //         confirmDialog.onConfirm
  //       }
  //     />




  //     {/* =================================================
  //               GLOBAL APP MESSAGE
  //           ================================================== */}

  //     <AppMessage
  //       visible={visible}
  //       message={message}
  //       type={type}
  //       onClose={clearMessage}
  //     />
  //   </div>
  // );

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div className="flex items-start gap-4">
          <Shield className="text-primary w-7 h-7 mt-1" />

          <div>
            <h1 className="text-xl font-medium">
              {t("translate.roles_title")}
            </h1>

            <p className="text-muted-foreground">
              {t("translate.roles_description")}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 items-center">

          {/* SEARCH */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <Input
              placeholder={t("translate.roles_search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* ADD */}
          <Link href="/root/roles/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              {t("translate.new_role")}
            </Button>
          </Link>

        </div>
      </div>

      {/* TABLE */}
      <Card>

        <CardHeader className="flex items-center justify-between">

          <div>
            <CardTitle>
              {t("translate.roles_directory")}
            </CardTitle>

            <CardDescription>
              {roles.length} {t("translate.roles_count_label")}
            </CardDescription>
          </div>

          {/* LIMIT */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {t("translate.show")} {limit}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {PAGE_LIMIT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => {
                    const newLimit =
                      option === "All" ? "All" : Number(option);

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
                    {t("translate.role_col_role")}
                  </th>

                  <th className="text-left py-3 px-4">
                    {t("translate.role_col_description")}
                  </th>

                  <th className="text-left py-3 px-4">
                    {t("translate.role_col_permissions")}
                  </th>

                  <th className="text-left py-3 px-4">
                    {t("translate.role_col_users")}
                  </th>

                  <th className="text-left py-3 px-4">
                    {t("translate.role_col_status")}
                  </th>

                  <th className="text-left py-3 px-4">
                    {t("translate.role_col_created")}
                  </th>

                  <th className="text-right py-3 px-4">
                    {t("translate.role_col_actions")}
                  </th>

                </tr>
              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6">
                      {t("translate.loading_roles")}
                    </td>
                  </tr>
                ) : roles.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6">
                      {t("translate.no_roles_found")}
                    </td>
                  </tr>
                ) : (
                  roles.map((role) => (
                    <tr
                      key={role.id}
                      className="border-b hover:bg-muted/50"
                    >

                      <td className="py-4 px-4 font-medium">
                        {role.name}
                      </td>

                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {role.description}
                      </td>

                      <td className="py-4 px-4">
                        <Badge variant="secondary">
                          {role.permissionsCount}{" "}
                          {t("translate.permissions")}
                        </Badge>
                      </td>

                      <td className="py-4 px-4">
                        <Badge variant="outline">
                          {role.usersCount}{" "}
                          {t("translate.users")}
                        </Badge>
                      </td>

                      <td className="py-4 px-4">
                        <Switch
                          checked={role.status === "active"}
                          disabled={role.updating}
                          onCheckedChange={() =>
                            handleToggleStatus(role.id, role.status)
                          }
                        />
                      </td>

                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {formatDate(role.createdAt)}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <DropdownMenu>

                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">

                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/root/roles/edit/${role.id}`
                                )
                              }
                            >
                              <Edit2 className="w-4 h-4 mr-2" />
                              {t("translate.edit_role")}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/root/roles/modules/${role.id}`
                                )
                              }
                            >
                              <Settings2 className="w-4 h-4 mr-2" />
                              {t("translate.assign_permissions")}
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() =>
                                openDeleteDialog(role.id, role.name)
                              }
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              {t("translate.delete_role")}
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

