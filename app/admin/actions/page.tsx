'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Action } from '@/lib/types';
import { getLocalizedText } from '@/i18n/langHelper';
import ActionForm from '@/components/admin/forms/ActionForm';

const mockActions: Action[] = [
  {
    id: 'ACT001',
    name: { en: 'View', hi: 'देखना', ar: 'عرض' },
    slug: 'view',
    label: { en: 'View/Read', hi: 'देखना/पढ़ना', ar: 'عرض/قراءة' },
    module: 'MOD001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ACT002',
    name: { en: 'Create', hi: 'बनाना', ar: 'إنشاء' },
    slug: 'create',
    label: { en: 'Create/Add', hi: 'बनाना/जोड़ना', ar: 'إنشاء/إضافة' },
    module: 'MOD001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ACT003',
    name: { en: 'Edit', hi: 'संपादित', ar: 'تعديل' },
    slug: 'edit',
    label: { en: 'Edit/Update', hi: 'संपादित/अपडेट', ar: 'تعديل/تحديث' },
    module: 'MOD001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ACT004',
    name: { en: 'Delete', hi: 'हटाना', ar: 'حذف' },
    slug: 'delete',
    label: { en: 'Delete/Remove', hi: 'हटाना/निकालना', ar: 'حذف/إزالة' },
    module: 'MOD001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ACT005',
    name: { en: 'Export', hi: 'निर्यात', ar: 'تصدير' },
    slug: 'export',
    label: { en: 'Export Data', hi: 'डेटा निर्यात', ar: 'تصدير البيانات' },
    module: 'MOD002',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function ActionsPageContent() {
  const { t, currentLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [actions, setActions] = useState<Action[]>(mockActions);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAction, setEditingAction] = useState<Action | null>(null);

  const filteredActions = actions.filter(
    (act) =>
      getLocalizedText(act.name, currentLanguage).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getLocalizedText(act.label, currentLanguage).toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAction = () => {
    setEditingAction(null);
    setIsFormOpen(true);
  };

  const handleEditAction = (action: Action) => {
    setEditingAction(action);
    setIsFormOpen(true);
  };

  const handleDeleteAction = (actionId: string) => {
    if (confirm('Are you sure you want to delete this action?')) {
      setActions(actions.filter(a => a.id !== actionId));
    }
  };

  const handleFormSubmit = async (data: Partial<Action>) => {
    if (editingAction) {
      setActions(actions.map(a => (a.id === editingAction.id ? { ...a, ...data } : a)));
    } else {
      const newAction: Action = {
        id: `ACT${Date.now()}`,
        name: data.name || { en: '', hi: '', ar: '' },
        slug: data.slug || '',
        label: data.label || { en: '', hi: '', ar: '' },
        module: data.module || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setActions([...actions, newAction]);
    }
    setIsFormOpen(false);
    setEditingAction(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <Zap className="text-primary w-10 h-10 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Actions</h1>
            <p className="text-muted-foreground">Manage system actions with multi-language support</p>
          </div>
        </div>
        <Button onClick={handleAddAction} className="gap-2">
          <Plus className="w-4 h-4" />
          New Action
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search actions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Actions</CardTitle>
          <CardDescription>{filteredActions.length} action(s) found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Label</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No actions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredActions.map((action) => (
                    <TableRow key={action.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold">{getLocalizedText(action.name, currentLanguage)}</p>
                          <p className="text-sm text-muted-foreground">ID: {action.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{action.slug}</Badge>
                      </TableCell>
                      <TableCell>{getLocalizedText(action.label, currentLanguage)}</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800">{action.module}</Badge>
                      </TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAction(action)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAction(action.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingAction ? 'Edit Action' : 'Create New Action'}
            </DialogTitle>
          </DialogHeader>
          <ActionForm
            action={editingAction}
            onSubmit={handleFormSubmit}
            onClose={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ActionsPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <ActionsPageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
