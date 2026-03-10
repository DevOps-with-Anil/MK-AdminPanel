'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useAdmin } from '@/contexts/AdminContext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cmsService } from '@/services/cms-service';
import { CMSItem, CMSListResponse, CreateCMSPayload, UpdateCMSPayload } from '@/lib/types';
import { ChevronLeft, ChevronRight, Edit2, FileText, Loader2, Plus, Search, Trash2 } from 'lucide-react';

type CmsStatus = 'ALL' | 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
type CmsTypeFilter = 'ALL' | 'PAGE' | 'ARTICLE' | 'POST' | 'BANNER' | 'OTHER';
type CmsFormMode = 'create' | 'edit';

interface CmsFormState {
  type: 'PAGE' | 'ARTICLE' | 'POST' | 'BANNER' | 'OTHER';
  titleEn: string;
  titleFr: string;
  titleAr: string;
  contentEn: string;
  contentFr: string;
  contentAr: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  tagsInput: string;
}

const EMPTY_FORM: CmsFormState = {
  type: 'PAGE',
  titleEn: '',
  titleFr: '',
  titleAr: '',
  contentEn: '',
  contentFr: '',
  contentAr: '',
  slug: '',
  status: 'DRAFT',
  tagsInput: '',
};

function parseTags(tagsInput: string) {
  return tagsInput
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function formatDate(dateString?: string | null) {
  if (!dateString) return '-';
  try {
    return new Date(dateString).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '-';
  }
}

function CMSPageContent() {
  const { currentLanguage, hasPermission } = useAdmin();
  const [items, setItems] = useState<CMSItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CmsStatus>('ALL');
  const [typeFilter, setTypeFilter] = useState<CmsTypeFilter>('ALL');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<CmsFormMode>('create');
  const [editingItem, setEditingItem] = useState<CMSItem | null>(null);
  const [form, setForm] = useState<CmsFormState>(EMPTY_FORM);

  const fetchCmsItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await cmsService.getCMSItems({
        page,
        limit,
        search: searchQuery || undefined,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        type: typeFilter === 'ALL' ? undefined : typeFilter,
      });

      if (!response.success) {
        setError(response.message || 'Failed to fetch CMS content');
        setItems([]);
        setTotal(0);
        setTotalPages(1);
        return;
      }

      const rawData = response.data as unknown;
      const list = Array.isArray(rawData)
        ? (rawData as CMSItem[])
        : ((rawData as CMSListResponse | undefined)?.data || []);
      const meta = ((response.meta as CMSListResponse['meta'] | undefined) || (rawData as CMSListResponse | undefined)?.meta);

      setItems(list);
      setTotal(meta?.total || list.length);
      setTotalPages(meta?.totalPages || 1);
    } catch (fetchError) {
      console.error('Error loading CMS items:', fetchError);
      setError('An error occurred while loading CMS items');
    } finally {
      setIsLoading(false);
    }
  }, [limit, page, searchQuery, statusFilter, typeFilter]);

  useEffect(() => {
    fetchCmsItems();
  }, [fetchCmsItems]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, typeFilter]);

  const getLocalizedTitle = useCallback((item: CMSItem) => {
    const titleMap = item.title as unknown as Record<string, string | undefined>;
    return titleMap[currentLanguage] || titleMap.en || titleMap.fr || titleMap.ar || item.slug;
  }, [currentLanguage]);

  const publishedCount = useMemo(
    () => items.filter((item) => item.status === 'PUBLISHED').length,
    [items]
  );

  const openCreateDialog = () => {
    setFormMode('create');
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setSubmitError(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: CMSItem) => {
    setFormMode('edit');
    setEditingItem(item);
    setForm({
      type: item.type,
      titleEn: item.title.en || '',
      titleFr: item.title.fr || '',
      titleAr: item.title.ar || '',
      contentEn: item.content.en || '',
      contentFr: item.content.fr || '',
      contentAr: item.content.ar || '',
      slug: item.slug || '',
      status: item.status,
      tagsInput: (item.tags || []).join(', '),
    });
    setSubmitError(null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setSubmitError(null);
  };

  const handleSave = async () => {
    setSubmitError(null);

    if (!form.titleEn.trim()) {
      setSubmitError('English title is required.');
      return;
    }

    if (!form.contentEn.trim()) {
      setSubmitError('English content is required.');
      return;
    }

    const basePayload = {
      type: form.type,
      title: {
        en: form.titleEn.trim(),
        fr: form.titleFr.trim(),
        ar: form.titleAr.trim(),
      },
      content: {
        en: form.contentEn.trim(),
        fr: form.contentFr.trim(),
        ar: form.contentAr.trim(),
      },
      slug: form.slug.trim() || undefined,
      status: form.status,
      tags: parseTags(form.tagsInput),
    };

    setIsSaving(true);

    try {
      if (formMode === 'create') {
        const response = await cmsService.createCMSItem(basePayload as CreateCMSPayload);
        if (!response.success) {
          setSubmitError(response.message || 'Failed to create CMS entry');
          return;
        }
      } else if (editingItem) {
        const response = await cmsService.updateCMSItem(editingItem._id, basePayload as UpdateCMSPayload);
        if (!response.success) {
          setSubmitError(response.message || 'Failed to update CMS entry');
          return;
        }
      }

      closeDialog();
      await fetchCmsItems();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: CMSItem) => {
    if (!window.confirm(`Delete CMS entry "${getLocalizedTitle(item)}"?`)) {
      return;
    }

    const response = await cmsService.deleteCMSItem(item._id);
    if (!response.success) {
      window.alert(response.message || 'Failed to delete CMS entry');
      return;
    }

    await fetchCmsItems();
  };

  const getTypeBadge = (type: CMSItem['type']) => {
    const colors: Record<CMSItem['type'], string> = {
      ARTICLE: 'bg-blue-100 text-blue-800',
      BANNER: 'bg-orange-100 text-orange-800',
      OTHER: 'bg-gray-100 text-gray-800',
      PAGE: 'bg-emerald-100 text-emerald-800',
      POST: 'bg-violet-100 text-violet-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: CMSItem['status']) => {
    const colors: Record<CMSItem['status'], string> = {
      DRAFT: 'bg-yellow-100 text-yellow-800',
      PUBLISHED: 'bg-green-100 text-green-800',
      ARCHIVED: 'bg-slate-200 text-slate-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <FileText className="text-primary w-10 h-10 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Content Management</h1>
            <p className="text-muted-foreground">Manage generic CMS entries from the CMS API.</p>
          </div>
        </div>
        {hasPermission('cms', 'create') && (
          <Button className="gap-2" onClick={openCreateDialog}>
            <Plus className="w-4 h-4" />
            New Content
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as CmsStatus)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as CmsTypeFilter)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="PAGE">Page</SelectItem>
                  <SelectItem value="ARTICLE">Article</SelectItem>
                  <SelectItem value="POST">Post</SelectItem>
                  <SelectItem value="BANNER">Banner</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Items</CardTitle>
          <CardDescription>{isLoading ? 'Loading...' : `${total} item(s) found`}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading content...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <Button variant="outline" className="mt-4" onClick={fetchCmsItems}>
                Retry
              </Button>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No CMS items found
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <div className="max-w-[280px] whitespace-normal">
                            <p className="font-medium">{getLocalizedTitle(item)}</p>
                            <p className="text-xs text-muted-foreground">{item.createdBy?.email || '-'}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypeBadge(item.type)}>{item.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(item.status)}>{item.status}</Badge>
                        </TableCell>
                        <TableCell>{item.slug}</TableCell>
                        <TableCell className="max-w-[220px] whitespace-normal">{item.tags?.join(', ') || '-'}</TableCell>
                        <TableCell>{formatDate(item.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {hasPermission('cms', 'edit') && (
                              <Button variant="ghost" size="sm" onClick={() => openEditDialog(item)}>
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            )}
                            {hasPermission('cms', 'delete') && (
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(item)}>
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

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages}>
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
              <p className="text-sm text-muted-foreground mt-1">Total Content</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">{publishedCount}</p>
              <p className="text-sm text-muted-foreground mt-1">Published</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">{items.filter((item) => item.type === 'PAGE').length}</p>
              <p className="text-sm text-muted-foreground mt-1">Pages On This Page</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => (open ? setIsDialogOpen(true) : closeDialog())}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{formMode === 'create' ? 'Create Content' : 'Edit Content'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(value) => setForm((current) => ({ ...current, type: value as CmsFormState['type'] }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAGE">PAGE</SelectItem>
                  <SelectItem value="ARTICLE">ARTICLE</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="BANNER">BANNER</SelectItem>
                  <SelectItem value="OTHER">OTHER</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(value) => setForm((current) => ({ ...current, status: value as CmsFormState['status'] }))}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">DRAFT</SelectItem>
                  <SelectItem value="PUBLISHED">PUBLISHED</SelectItem>
                  <SelectItem value="ARCHIVED">ARCHIVED</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cms-title-en">Title EN</Label>
              <Input id="cms-title-en" value={form.titleEn} onChange={(event) => setForm((current) => ({ ...current, titleEn: event.target.value }))} />
            </div>
            <div>
              <Label htmlFor="cms-slug">Slug</Label>
              <Input id="cms-slug" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} placeholder="optional-auto-generated" />
            </div>

            <div>
              <Label htmlFor="cms-title-fr">Title FR</Label>
              <Input id="cms-title-fr" value={form.titleFr} onChange={(event) => setForm((current) => ({ ...current, titleFr: event.target.value }))} />
            </div>
            <div>
              <Label htmlFor="cms-title-ar">Title AR</Label>
              <Input id="cms-title-ar" value={form.titleAr} onChange={(event) => setForm((current) => ({ ...current, titleAr: event.target.value }))} />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="cms-content-en">Content EN</Label>
              <Textarea id="cms-content-en" value={form.contentEn} onChange={(event) => setForm((current) => ({ ...current, contentEn: event.target.value }))} rows={6} />
            </div>
            <div>
              <Label htmlFor="cms-content-fr">Content FR</Label>
              <Textarea id="cms-content-fr" value={form.contentFr} onChange={(event) => setForm((current) => ({ ...current, contentFr: event.target.value }))} rows={4} />
            </div>
            <div>
              <Label htmlFor="cms-content-ar">Content AR</Label>
              <Textarea id="cms-content-ar" value={form.contentAr} onChange={(event) => setForm((current) => ({ ...current, contentAr: event.target.value }))} rows={4} />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="cms-tags">Tags</Label>
              <Input id="cms-tags" value={form.tagsInput} onChange={(event) => setForm((current) => ({ ...current, tagsInput: event.target.value }))} placeholder="news, homepage, featured" />
            </div>
          </div>

          {submitError && <p className="text-sm text-red-500">{submitError}</p>}

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} disabled={isSaving} className="flex-1">
              {isSaving ? 'Saving...' : formMode === 'create' ? 'Create Content' : 'Save Changes'}
            </Button>
            <Button type="button" variant="outline" onClick={closeDialog} disabled={isSaving} className="flex-1">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function CMSPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <CMSPageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
