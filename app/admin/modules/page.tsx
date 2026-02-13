'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, Layers } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Module } from '@/lib/types';
import { getLocalizedText } from '@/i18n/langHelper';
import ModuleForm from '@/components/admin/forms/ModuleForm';

const mockModules: Module[] = [
  {
    id: 'MOD001',
    name: { en: 'Dashboard', hi: 'डैशबोर्ड', ar: 'لوحة التحكم' },
    slug: 'dashboard',
    description: { en: 'Main dashboard and analytics', hi: 'मुख्य डैशबोर्ड और विश्लेषण', ar: 'لوحة التحكم الرئيسية والتحليلات' },
    order: 1,
    actions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'MOD002',
    name: { en: 'Users Management', hi: 'उपयोगकर्ता प्रबंधन', ar: 'إدارة المستخدمين' },
    slug: 'users',
    description: { en: 'Admin users and role management', hi: 'प्रशासक उपयोगकर्ता और भूमिका प्रबंधन', ar: 'إدارة مستخدمي المسؤول والأدوار' },
    order: 2,
    actions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function ModulesPageContent() {
  const { t, currentLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [modules, setModules] = useState<Module[]>(mockModules);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);

  const filteredModules = modules.filter(
    (mod) =>
      getLocalizedText(mod.name, currentLanguage).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getLocalizedText(mod.description, currentLanguage).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddModule = () => {
    setEditingModule(null);
    setIsFormOpen(true);
  };

  const handleEditModule = (module: Module) => {
    setEditingModule(module);
    setIsFormOpen(true);
  };

  const handleDeleteModule = (moduleId: string) => {
    if (confirm('Are you sure you want to delete this module?')) {
      setModules(modules.filter(m => m.id !== moduleId));
    }
  };

  const handleFormSubmit = async (data: Partial<Module>) => {
    if (editingModule) {
      setModules(modules.map(m => (m.id === editingModule.id ? { ...m, ...data } : m)));
    } else {
      const newModule: Module = {
        id: `MOD${Date.now()}`,
        name: data.name || { en: '', hi: '', ar: '' },
        slug: data.slug || '',
        description: data.description,
        order: modules.length + 1,
        actions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setModules([...modules, newModule]);
    }
    setIsFormOpen(false);
    setEditingModule(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <Layers className="text-primary w-10 h-10 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('nav.modules')}</h1>
            <p className="text-muted-foreground">{t('ui.loading')} Manage system modules with multi-language support</p>
          </div>
        </div>
        <Button onClick={handleAddModule} className="gap-2">
          <Plus className="w-4 h-4" />
          {t('ui.add')} Module
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('ui.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('nav.modules')}</CardTitle>
          <CardDescription>{filteredModules.length} {t('ui.loading')} module(s) found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('form.name')}</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>{t('form.description')}</TableHead>
                  <TableHead className="text-right">{t('ui.edit')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredModules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      {t('ui.noResults')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredModules.map((mod) => (
                    <TableRow key={mod.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold">{getLocalizedText(mod.name, currentLanguage)}</p>
                          <p className="text-sm text-muted-foreground">ID: {mod.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{mod.slug}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {getLocalizedText(mod.description, currentLanguage) || '—'}
                      </TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditModule(mod)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteModule(mod.id)}
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
              {editingModule ? 'Edit Module' : 'Create New Module'}
            </DialogTitle>
          </DialogHeader>
          <ModuleForm
            module={editingModule}
            onSubmit={handleFormSubmit}
            onClose={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ModulesPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <ModulesPageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
