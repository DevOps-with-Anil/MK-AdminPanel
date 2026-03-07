'use client';

import { useCallback, useEffect, useState } from 'react';
import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, Layers, Loader2 } from 'lucide-react';
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
import { SystemModule, systemModuleService } from '@/services/system-module-service';

function ModulesPageContent() {
  const { t, currentLanguage } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);

  const [page] = useState(1);
  const [limit] = useState(100);
  const [status] = useState('ACTIVE');

  const mapSystemModuleToModule = useCallback((mod: SystemModule, index: number): Module => {
    return {
      id: mod._id || mod.key,
      name: {
        en: mod.moduleName?.en || '',
        hi: mod.moduleName?.hi || mod.moduleName?.fr || mod.moduleName?.en || '',
        ar: mod.moduleName?.ar || '',
      },
      slug: (mod.key || '').toLowerCase().replace(/_/g, '-'),
      description: mod.description
        ? {
            en: mod.description.en || '',
            hi: mod.description.hi || mod.description.fr || mod.description.en || '',
            ar: mod.description.ar || '',
          }
        : undefined,
      order: index + 1,
      actions: [],
      createdAt: mod.createdAt || new Date().toISOString(),
      updatedAt: mod.updatedAt || new Date().toISOString(),
    };
  }, []);

  const fetchModules = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await systemModuleService.getModules({
        page,
        limit,
        status,
      });

      if (!response.success) {
        setError(response.message || 'Failed to fetch modules');
        setModules([]);
        return;
      }

      const payload = response.data as unknown;
      const modulesList = Array.isArray(payload)
        ? (payload as SystemModule[])
        : Array.isArray((payload as { data?: unknown })?.data)
          ? ((payload as { data: SystemModule[] }).data || [])
          : [];

      setModules(modulesList.map(mapSystemModuleToModule));
    } catch (err) {
      console.error('Error fetching modules:', err);
      setError('An error occurred while fetching modules');
      setModules([]);
    } finally {
      setIsLoading(false);
    }
  }, [limit, mapSystemModuleToModule, page, status]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const filteredModules = modules.filter((mod) =>
    getLocalizedText(mod.name, currentLanguage).toLowerCase().includes(searchQuery.toLowerCase().trim())
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
      void (async () => {
        const response = await systemModuleService.deleteModule(moduleId);
        if (!response.success) {
          alert(response.message || 'Failed to delete module');
          return;
        }
        await fetchModules();
      })();
    }
  };

  const handleFormSubmit = async (data: Partial<Module>) => {
    if (editingModule) {
      const payload = {
        moduleName: {
          en: data.name?.en || '',
          fr: data.name?.hi || data.name?.en || '',
          ar: data.name?.ar || data.name?.en || '',
        },
      };

      const response = await systemModuleService.updateModule(editingModule.id, payload);
      if (!response.success) {
        alert(response.message || 'Failed to update module');
        return;
      }
      await fetchModules();
    } else {
      const slugValue = (data.slug || '').trim();
      const fallbackFromName = (data.name?.en || '').trim().toLowerCase().replace(/\s+/g, '-');
      const baseForKey = slugValue || fallbackFromName;
      const keyValue = baseForKey.replace(/[^a-z0-9-]/g, '').replace(/-/g, '_').toUpperCase();
      const moduleName = {
        en: data.name?.en || '',
        fr: data.name?.hi || data.name?.en || '',
        ar: data.name?.ar || data.name?.en || '',
      };
      const moduleDescription = {
        en: data.description?.en || '',
        fr: data.description?.hi || data.description?.en || '',
        ar: data.description?.ar || data.description?.en || '',
      };

      const response = await systemModuleService.createModule({
        key: keyValue,
        moduleName,
        description: moduleDescription,
        isActive: true,
        actions: [
          {
            key: 'VIEW',
            actionName: {
              en: 'View',
              fr: 'Voir',
              ar: 'عرض',
            },
            isActive: true,
          },
        ],
      });

      if (!response.success) {
        alert(response.message || 'Failed to create module');
        return;
      }

      await fetchModules();
    }
    setIsFormOpen(false);
    setEditingModule(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <Layers className="text-primary mt-1 h-10 w-10" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('nav.modules')}</h1>
            <p className="text-muted-foreground">Manage system modules with multi-language support</p>
          </div>
        </div>
        <Button onClick={handleAddModule} className="gap-2">
          <Plus className="h-4 w-4" />
          {t('ui.add')} Module
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
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
          <CardDescription>
            {isLoading ? 'Loading modules...' : `${filteredModules.length} module(s) found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
          )}

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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8">
                      <div className="text-muted-foreground flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading modules...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredModules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-muted-foreground py-8 text-center">
                      {t('ui.noResults')}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredModules.map((mod) => (
                    <TableRow key={mod.id}>
                      <TableCell>
                        <div>
                          <p className="font-semibold">{getLocalizedText(mod.name, currentLanguage)}</p>
                          <p className="text-muted-foreground text-sm">ID: {mod.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{mod.slug}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {getLocalizedText(mod.description, currentLanguage) || '-'}
                      </TableCell>
                      <TableCell className="flex items-center justify-end gap-2 text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleEditModule(mod)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteModule(mod.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
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
            <DialogTitle>{editingModule ? 'Edit Module' : 'Create New Module'}</DialogTitle>
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
