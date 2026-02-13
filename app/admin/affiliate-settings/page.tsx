'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Settings, Mail, Globe, Contact } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AffiliateSettings, AffiliateCategory } from '@/lib/types';
import MultiLangInput from '@/components/common/MultiLangInput';
import { initializeMultiLang } from '@/i18n/langHelper';

const mockSettings: AffiliateSettings = {
  id: 'SETTING001',
  tenantId: 'TENANT001',
  categories: [
    {
      id: 'CAT001',
      name: { en: 'Islamic Studies', hi: 'इस्लामिक अध्ययन', ar: 'الدراسات الإسلامية' },
      slug: 'islamic-studies',
      order: 1,
    },
    {
      id: 'CAT002',
      name: { en: 'Technology', hi: 'प्रौद्योगिकी', ar: 'التكنولوجيا' },
      slug: 'technology',
      order: 2,
    },
  ],
  smtpConfig: {
    host: 'smtp.example.com',
    port: 587,
    secure: true,
    email: 'noreply@example.com',
  },
  domainSetup: {
    domain: 'example.com',
    verified: true,
  },
  contactInfo: {
    email: 'contact@example.com',
    phone: '+91-9876543210',
    address: '123 Main Street',
    city: 'Delhi',
    country: 'India',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function AffiliateSettingsContent() {
  const [settings, setSettings] = useState<AffiliateSettings>(mockSettings);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AffiliateCategory | null>(null);
  const [categoryFormData, setCategoryFormData] = useState<Partial<AffiliateCategory>>({
    name: initializeMultiLang(),
  });

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: initializeMultiLang(),
      slug: '',
      order: settings.categories.length + 1,
    });
    setIsFormOpen(true);
  };

  const handleEditCategory = (category: AffiliateCategory) => {
    setEditingCategory(category);
    setCategoryFormData(category);
    setIsFormOpen(true);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setSettings({
        ...settings,
        categories: settings.categories.filter(c => c.id !== categoryId),
      });
    }
  };

  const handleSaveCategory = () => {
    if (!categoryFormData.name?.en?.trim()) {
      alert('Category name is required');
      return;
    }

    if (editingCategory) {
      setSettings({
        ...settings,
        categories: settings.categories.map(c =>
          c.id === editingCategory.id
            ? { ...c, ...categoryFormData, slug: categoryFormData.slug || editingCategory.slug }
            : c
        ),
      });
    } else {
      const newCategory: AffiliateCategory = {
        id: `CAT${Date.now()}`,
        name: categoryFormData.name || initializeMultiLang(),
        slug: categoryFormData.slug || '',
        description: categoryFormData.description,
        order: categoryFormData.order || settings.categories.length + 1,
      };
      setSettings({
        ...settings,
        categories: [...settings.categories, newCategory],
      });
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <Settings className="text-primary w-10 h-10 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Affiliate Settings</h1>
            <p className="text-muted-foreground">Configure CMS, email, domain and contact settings</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="smtp">SMTP</TabsTrigger>
          <TabsTrigger value="domain">Domain</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Content Categories</CardTitle>
                <CardDescription>Manage article and challenge categories</CardDescription>
              </div>
              <Button onClick={handleAddCategory} className="gap-2" size="sm">
                <Plus className="w-4 h-4" />
                Add Category
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Order</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {settings.categories.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          No categories created yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      settings.categories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{category.name.en}</p>
                              <p className="text-xs text-muted-foreground">{category.id}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{category.slug}</Badge>
                          </TableCell>
                          <TableCell>{category.order}</TableCell>
                          <TableCell className="text-right flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCategory(category.id)}
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
        </TabsContent>

        {/* SMTP Tab */}
        <TabsContent value="smtp" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-primary mt-1" />
                <div>
                  <CardTitle>SMTP Configuration</CardTitle>
                  <CardDescription>Configure email sending settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input
                    id="smtp-host"
                    defaultValue={settings.smtpConfig?.host}
                    placeholder="smtp.example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">Port</Label>
                  <Input
                    id="smtp-port"
                    type="number"
                    defaultValue={settings.smtpConfig?.port}
                    placeholder="587"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-email">From Email</Label>
                <Input
                  id="smtp-email"
                  type="email"
                  defaultValue={settings.smtpConfig?.email}
                  placeholder="noreply@example.com"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="smtp-secure"
                  defaultChecked={settings.smtpConfig?.secure}
                  className="w-4 h-4 rounded border-border"
                />
                <Label htmlFor="smtp-secure">Use TLS/SSL</Label>
              </div>
              <Button className="w-full">Save SMTP Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Domain Tab */}
        <TabsContent value="domain" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Globe className="w-5 h-5 text-primary mt-1" />
                <div>
                  <CardTitle>Domain Setup</CardTitle>
                  <CardDescription>Configure your custom domain</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Domain Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="domain"
                    defaultValue={settings.domainSetup?.domain}
                    placeholder="example.com"
                  />
                  <Badge className="bg-green-100 text-green-800 h-fit">
                    {settings.domainSetup?.verified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg space-y-2">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">DNS Records</p>
                <code className="text-xs block p-2 bg-white dark:bg-slate-900 rounded border border-border overflow-x-auto">
                  A    example.com    192.0.2.1
                </code>
                <code className="text-xs block p-2 bg-white dark:bg-slate-900 rounded border border-border overflow-x-auto">
                  CNAME www.example.com example.com
                </code>
              </div>
              <Button className="w-full">Verify Domain</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Contact className="w-5 h-5 text-primary mt-1" />
                <div>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Update contact details for your page</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    defaultValue={settings.contactInfo.email}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Phone</Label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    defaultValue={settings.contactInfo.phone}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-address">Address</Label>
                <Input
                  id="contact-address"
                  defaultValue={settings.contactInfo.address}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-city">City</Label>
                  <Input
                    id="contact-city"
                    defaultValue={settings.contactInfo.city}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-country">Country</Label>
                  <Input
                    id="contact-country"
                    defaultValue={settings.contactInfo.country}
                  />
                </div>
              </div>
              <Button className="w-full">Save Contact Info</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Category Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <MultiLangInput
              label="Category Name"
              value={categoryFormData.name || initializeMultiLang()}
              onChange={(value) =>
                setCategoryFormData({ ...categoryFormData, name: value })
              }
            />
            <div className="space-y-2">
              <Label htmlFor="cat-slug">Slug</Label>
              <Input
                id="cat-slug"
                value={categoryFormData.slug || ''}
                onChange={(e) =>
                  setCategoryFormData({ ...categoryFormData, slug: e.target.value })
                }
                placeholder="e.g., islamic-studies"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-order">Order</Label>
              <Input
                id="cat-order"
                type="number"
                value={categoryFormData.order || 1}
                onChange={(e) =>
                  setCategoryFormData({
                    ...categoryFormData,
                    order: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleSaveCategory} className="flex-1">
                Save Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AffiliateSettingsPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <AffiliateSettingsContent />
      </AdminLayout>
    </AdminProvider>
  );
}
