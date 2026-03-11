'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Search, Download, Filter, Eye, LogOut, Edit, Plus, Trash, LogIn } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AuditLog, AuditAction } from '@/lib/types';
import { AuditLogApiItem, getAuditLogs } from '@/services/audit-service';
import { deleteAffiliate, getAffiliateById, updateAffiliate } from '@/services/affiliate-service';

function AuditLogsPageContent() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [filterModule, setFilterModule] = useState<string>('');
  const [editingLog, setEditingLog] = useState<AuditLog | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    email: '',
    phoneCode: '',
    phoneNumber: '',
    website: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
    kybVerified: false,
  });

  const mapAction = (value: string): AuditAction => {
    const action = value.toLowerCase();
    if (action.includes('create') || action.includes('add')) return 'create';
    if (action.includes('update') || action.includes('edit')) return 'update';
    if (action.includes('delete') || action.includes('remove') || action.includes('disable')) return 'delete';
    if (action.includes('login')) return 'login';
    if (action.includes('logout')) return 'logout';
    if (action.includes('permission')) return 'permission_change';
    return 'view';
  };

  const mapLog = (item: AuditLogApiItem): AuditLog => ({
    id: item._id,
    tenantId: '',
    userId: item.user || '',
    userName: item.userEmail || 'Unknown',
    action: mapAction(item.action || ''),
    module: (item.module || '').toLowerCase(),
    entityType: item.module || 'System',
    entityId: item.entityId || '',
    oldValues: (item.before as Record<string, unknown>) || undefined,
    newValues: (item.after as Record<string, unknown>) || undefined,
    changes: item.message,
    ipAddress: item.ipAddress,
    userAgent: item.userAgent,
    status: (item.status || '').toUpperCase() === 'SUCCESS' ? 'success' : 'failure',
    createdAt: item.createdAt,
  });

  const loadAuditLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAuditLogs({ page: 1, limit: 200 });

      if (!response.success) {
        setError(response.message || 'Failed to fetch audit logs');
        setAuditLogs([]);
        return;
      }

      const payload = response.data as unknown;
      const logs = Array.isArray(payload)
        ? (payload as AuditLogApiItem[])
        : Array.isArray((payload as { data?: unknown })?.data)
          ? ((payload as { data: AuditLogApiItem[] }).data || [])
          : [];

      setAuditLogs(logs.map(mapLog));
    } catch (err) {
      console.error('Error loading audit logs:', err);
      setError('An error occurred while loading audit logs');
      setAuditLogs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAuditLogs();
  }, [loadAuditLogs]);

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.module.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesModule = !filterModule || log.module === filterModule;

    return matchesSearch && matchesModule;
  });

  const getActionIcon = (action: AuditAction) => {
    const iconMap: Record<AuditAction, JSX.Element> = {
      create: <Plus className="w-4 h-4 text-green-500" />,
      update: <Edit className="w-4 h-4 text-blue-500" />,
      delete: <Trash className="w-4 h-4 text-red-500" />,
      view: <Eye className="w-4 h-4 text-gray-500" />,
      login: <LogIn className="w-4 h-4 text-purple-500" />,
      logout: <LogOut className="w-4 h-4 text-orange-500" />,
      permission_change: <Edit className="w-4 h-4 text-indigo-500" />,
    };
    return iconMap[action];
  };

  const getActionBadge = (action: AuditAction) => {
    const variants: Record<AuditAction, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      create: 'default',
      update: 'secondary',
      delete: 'destructive',
      view: 'outline',
      login: 'default',
      logout: 'secondary',
      permission_change: 'default',
    };
    const labels: Record<AuditAction, string> = {
      create: 'Create',
      update: 'Update',
      delete: 'Delete',
      view: 'View',
      login: 'Login',
      logout: 'Logout',
      permission_change: 'Permission Change',
    };
    return <Badge variant={variants[action]}>{labels[action]}</Badge>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  const getActionLabel = (action: AuditAction) => {
    const labels: Record<AuditAction, string> = {
      create: 'Create',
      update: 'Update',
      delete: 'Delete',
      view: 'View',
      login: 'Login',
      logout: 'Logout',
      permission_change: 'Permission Change',
    };
    return labels[action];
  };

  const handleExportLogs = async () => {
    if (filteredLogs.length === 0) return;

    const XLSX = await import('xlsx');
    const rows = filteredLogs.map((log) => ({
      'Date & Time': formatDate(log.createdAt),
      User: log.userName || 'Unknown',
      Action: getActionLabel(log.action),
      Module: log.module,
      Entity: log.entityType,
      Status: log.status.charAt(0).toUpperCase() + log.status.slice(1),
      'Entity ID': log.entityId || '',
      Changes: log.changes || '',
      'IP Address': log.ipAddress || '',
      'User Agent': log.userAgent || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!cols'] = [
      { wch: 22 },
      { wch: 24 },
      { wch: 20 },
      { wch: 18 },
      { wch: 20 },
      { wch: 12 },
      { wch: 26 },
      { wch: 40 },
      { wch: 18 },
      { wch: 40 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Audit Logs');

    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    XLSX.writeFile(workbook, `audit-logs-${timestamp}.xlsx`);
  };

  const uniqueModules = Array.from(new Set(auditLogs.map(log => log.module)));
  const isAffiliateLog = (log: AuditLog) => log.module === 'affiliates' && !!log.entityId;

  const handleOpenEdit = async (log: AuditLog) => {
    if (!isAffiliateLog(log)) return;

    try {
      setActionLoadingId(log.id);
      const response = await getAffiliateById(log.entityId);
      if (!response.success) {
        alert(response.message || 'Failed to load affiliate details');
        return;
      }

      const payload = response.data as unknown as { data?: any };
      const affiliate = payload?.data || payload;
      if (!affiliate) {
        alert('Affiliate details not found');
        return;
      }

      setEditingLog(log);
      setEditForm({
        email: affiliate.email || '',
        phoneCode: affiliate.phoneCode || '',
        phoneNumber: affiliate.phoneNumber || '',
        website: affiliate.website || '',
        status: affiliate.status || 'ACTIVE',
        kybVerified: !!affiliate.kybVerified,
      });
      setIsEditOpen(true);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingLog) return;
    try {
      setIsSavingEdit(true);
      const response = await updateAffiliate(editingLog.entityId, {
        email: editForm.email.trim().toLowerCase(),
        phoneCode: editForm.phoneCode.trim(),
        phoneNumber: editForm.phoneNumber.trim(),
        website: editForm.website.trim(),
        status: editForm.status,
        kybVerified: editForm.kybVerified,
      });

      if (!response.success) {
        alert(response.message || 'Failed to update affiliate');
        return;
      }

      setIsEditOpen(false);
      setEditingLog(null);
      await loadAuditLogs();
      alert('Affiliate updated successfully');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDeleteLogEntity = async (log: AuditLog) => {
    if (!isAffiliateLog(log)) return;
    if (!confirm('Delete this affiliate (soft delete)?')) return;

    try {
      setActionLoadingId(log.id);
      const response = await deleteAffiliate(log.entityId);
      if (!response.success) {
        alert(response.message || 'Failed to delete affiliate');
        return;
      }

      await loadAuditLogs();
      alert('Affiliate deleted successfully');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground mt-2">Track all admin actions and system events</p>
        </div>
        <Button
          className="gap-2"
          onClick={handleExportLogs}
          disabled={isLoading || filteredLogs.length === 0}
        >
          <Download className="w-4 h-4" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by user, entity, or module..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={filterModule}
                onChange={(e) => setFilterModule(e.target.value)}
                className="flex-1 px-3 py-2 rounded-md bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Modules</option>
                {uniqueModules.map(module => (
                  <option key={module} value={module}>
                    {module.charAt(0).toUpperCase() + module.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{auditLogs.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Events</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-500">
                {auditLogs.filter(l => l.status === 'success').length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Successful</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-500">
                {auditLogs.filter(l => l.status === 'failure').length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Failed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-500">
                {new Set(auditLogs.map(l => l.userId)).size}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Active Users</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>{filteredLogs.length} log entries</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Loading audit logs...
                    </TableCell>
                  </TableRow>
                ) : filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No audit logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {formatDate(log.createdAt)}
                      </TableCell>
                      <TableCell className="font-medium">{log.userName || 'Unknown'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          {getActionBadge(log.action)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm capitalize">
                        {log.module}
                      </TableCell>
                      <TableCell className="text-sm">
                        <Badge variant="outline">
                          {log.entityType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                          {t('ui.view')}
                        </Button>
                        {/* <Button
                          variant="ghost"
                          size="sm"
                          disabled={!isAffiliateLog(log) || actionLoadingId === log.id}
                          onClick={() => handleOpenEdit(log)}
                        >
                          Edit
                        </Button> */}
                        {/* <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          disabled={!isAffiliateLog(log) || actionLoadingId === log.id}
                          onClick={() => handleDeleteLogEntity(log)}
                        >
                          Delete
                        </Button> */}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Log Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">User</p>
                  <p className="font-semibold">{selectedLog.userName || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Action</p>
                  <p className="font-semibold capitalize">{selectedLog.action}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Module</p>
                  <p className="font-semibold capitalize">{selectedLog.module}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Entity Type</p>
                  <p className="font-semibold">{selectedLog.entityType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Entity ID</p>
                  <p className="font-mono text-sm">{selectedLog.entityId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold capitalize">{selectedLog.status}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-semibold">{formatDate(selectedLog.createdAt)}</p>
                </div>
              </div>

              {selectedLog.newValues && (
                <div className="p-4 rounded-lg bg-muted">
                  <h4 className="font-semibold mb-2">New Values</h4>
                  <pre className="text-xs overflow-auto max-h-48">
                    {JSON.stringify(selectedLog.newValues, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.oldValues && (
                <div className="p-4 rounded-lg bg-muted">
                  <h4 className="font-semibold mb-2">Old Values</h4>
                  <pre className="text-xs overflow-auto max-h-48">
                    {JSON.stringify(selectedLog.oldValues, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.errorMessage && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950">
                  <h4 className="font-semibold text-red-700 dark:text-red-300 mb-2">Error</h4>
                  <p className="text-sm text-red-600 dark:text-red-400">{selectedLog.errorMessage}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Affiliate Dialog (for AFFILIATES logs only) */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Affiliate</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="affiliate-email">Email</Label>
              <Input
                id="affiliate-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="affiliate-phone-code">Phone Code</Label>
                <Input
                  id="affiliate-phone-code"
                  value={editForm.phoneCode}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, phoneCode: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="affiliate-phone-number">Phone Number</Label>
                <Input
                  id="affiliate-phone-number"
                  value={editForm.phoneNumber}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="affiliate-website">Website</Label>
              <Input
                id="affiliate-website"
                value={editForm.website}
                onChange={(e) => setEditForm((prev) => ({ ...prev, website: e.target.value }))}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="affiliate-status">Status</Label>
              <select
                id="affiliate-status"
                className="w-full px-3 py-2 rounded-md bg-background border border-border text-foreground text-sm"
                value={editForm.status}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    status: e.target.value as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
                  }))
                }
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="affiliate-kyb"
                type="checkbox"
                checked={editForm.kybVerified}
                onChange={(e) => setEditForm((prev) => ({ ...prev, kybVerified: e.target.checked }))}
              />
              <Label htmlFor="affiliate-kyb">KYB Verified</Label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={isSavingEdit}>
                {isSavingEdit ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AuditLogsPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <AuditLogsPageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
