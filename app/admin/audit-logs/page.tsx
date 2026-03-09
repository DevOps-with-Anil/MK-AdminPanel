'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { getAuditLogs } from '@/services/audit-service';

// Mock audit logs for demonstration
const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    tenantId: 'tenant-1',
    userId: 'user-1',
    userName: 'Ahmed Khan',
    action: 'create',
    module: 'users',
    entityType: 'User',
    entityId: 'user-99',
    newValues: { name: 'New User', email: 'newuser@test.com' },
    status: 'success',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: '2',
    tenantId: 'tenant-1',
    userId: 'user-2',
    userName: 'Fatima Ali',
    action: 'update',
    module: 'roles',
    entityType: 'Role',
    entityId: 'role-1',
    changes: 'Updated permissions',
    status: 'success',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: '3',
    tenantId: 'tenant-1',
    userId: 'user-3',
    userName: 'Hassan Malik',
    action: 'delete',
    module: 'articles',
    entityType: 'Article',
    entityId: 'article-42',
    status: 'success',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '4',
    tenantId: 'tenant-1',
    userId: 'user-1',
    userName: 'Ahmed Khan',
    action: 'login',
    module: 'auth',
    entityType: 'User',
    entityId: 'user-1',
    status: 'success',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: '5',
    tenantId: 'tenant-1',
    userId: 'user-4',
    userName: 'Aisha Ahmed',
    action: 'view',
    module: 'permissions',
    entityType: 'Module',
    entityId: 'mod-1',
    status: 'success',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
];

function AuditLogsPageContent() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [filterModule, setFilterModule] = useState<string>('');

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

  const uniqueModules = Array.from(new Set(auditLogs.map(log => log.module)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground mt-2">Track all admin actions and system events</p>
        </div>
        <Button className="gap-2">
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
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
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
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                        >
                          {t('ui.view')}
                        </Button>
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
