'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, Building2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tenant } from '@/lib/types';
import { getLocalizedText } from '@/i18n/langHelper';
import AffiliateForm from '@/components/admin/forms/AffiliateForm';
import {
  AffiliateApiItem,
  createAffiliate,
  deleteAffiliate,
  getAffiliateById,
  getAffiliates,
  updateAffiliate,
} from '@/services/affiliate-service';

function AffiliatesPageContent() {
  const { currentLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [affiliates, setAffiliates] = useState<Tenant[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<Tenant | null>(null);
  const [selectedAffiliate, setSelectedAffiliate] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slugify = (input: string) =>
    (input || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const mapApiToTenant = (affiliate: AffiliateApiItem): Tenant => {
    const enName = affiliate.name?.en || '';
    const phone = [affiliate.phoneCode || '', affiliate.phoneNumber || ''].join(' ').trim();
    return {
      id: affiliate._id,
      name: {
        en: enName,
        hi: affiliate.name?.fr || enName,
        ar: affiliate.name?.ar || '',
      },
      slug: slugify(enName || affiliate.email || affiliate._id),
      country: '--',
      website: affiliate.website || '',
      email: affiliate.email || '',
      phone,
      subscriptionPlanId: '',
      status: affiliate.status === 'ACTIVE' ? 'active' : 'inactive',
      features: [],
      limits: {},
      createdAt: affiliate.createdAt || new Date().toISOString(),
      updatedAt: affiliate.updatedAt || new Date().toISOString(),
    };
  };

  const parsePhone = (phone?: string) => {
    if (!phone?.trim()) return { phoneCode: undefined, phoneNumber: undefined };
    const value = phone.trim();
    const match = value.match(/^(\+\d{1,4})[\s-]*(.*)$/);
    if (!match) return { phoneCode: undefined, phoneNumber: value };
    return { phoneCode: match[1], phoneNumber: match[2] || undefined };
  };

  const loadAffiliates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAffiliates();
      if (!response.success) {
        setError(response.message || 'Failed to load affiliates');
        setAffiliates([]);
        return;
      }

      const payload = response.data as unknown as { data?: AffiliateApiItem[] } | AffiliateApiItem[];
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
        ? payload.data
        : [];

      setAffiliates(list.map(mapApiToTenant));
    } catch (err) {
      console.error('Load affiliates error:', err);
      setError('Failed to load affiliates');
      setAffiliates([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadAffiliates();
  }, []);

  const filteredAffiliates = affiliates.filter(
    (aff) =>
      getLocalizedText(aff.name, currentLanguage).toLowerCase().includes(searchQuery.toLowerCase()) ||
      aff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aff.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAffiliate = () => {
    setEditingAffiliate(null);
    setIsFormOpen(true);
  };

  const handleEditAffiliate = (affiliate: Tenant) => {
    setEditingAffiliate(affiliate);
    setIsFormOpen(true);
  };

  const handleDeleteAffiliate = (affiliateId: string) => {
    if (!confirm('Are you sure you want to delete this affiliate? This action cannot be undone.')) return;

    void (async () => {
      const response = await deleteAffiliate(affiliateId);
      if (!response.success) {
        alert(response.message || 'Failed to delete affiliate');
        return;
      }

      setAffiliates((prev) => prev.filter((a) => a.id !== affiliateId));
      if (selectedAffiliate?.id === affiliateId) setSelectedAffiliate(null);
    })();
  };

  const handleSelectAffiliate = (affiliateId: string) => {
    void (async () => {
      const response = await getAffiliateById(affiliateId);
      if (!response.success) {
        alert(response.message || 'Failed to fetch affiliate details');
        return;
      }

      const payload = response.data as unknown as { data?: AffiliateApiItem } | AffiliateApiItem;
      const affiliate = (payload as { data?: AffiliateApiItem })?.data || (payload as AffiliateApiItem);
      if (!affiliate?._id) return;
      setSelectedAffiliate(mapApiToTenant(affiliate));
    })();
  };

  const handleToggleStatus = (affiliate: Tenant) => {
    void (async () => {
      const nextStatus = affiliate.status === 'active' ? 'INACTIVE' : 'ACTIVE';
      const response = await updateAffiliate(affiliate.id, { status: nextStatus });
      if (!response.success) {
        alert(response.message || 'Failed to update affiliate status');
        return;
      }

      const updated = { ...affiliate, status: nextStatus === 'ACTIVE' ? 'active' : 'inactive' };
      setAffiliates((prev) => prev.map((a) => (a.id === affiliate.id ? updated : a)));
      if (selectedAffiliate?.id === affiliate.id) setSelectedAffiliate(updated);
    })();
  };

  const handleFormSubmit = async (data: Partial<Tenant> & { password?: string }) => {
    const nameEn = data.name?.en?.trim() || '';
    const email = data.email?.trim() || '';
    if (!nameEn || !email) {
      alert('Name and email are required');
      return;
    }

    const mappedName = {
      en: nameEn,
      fr: data.name?.hi?.trim() || nameEn,
      ar: data.name?.ar?.trim() || nameEn,
    };
    const { phoneCode, phoneNumber } = parsePhone(data.phone);

    try {
      setIsSaving(true);
      if (editingAffiliate) {
        const response = await updateAffiliate(editingAffiliate.id, {
          email,
          phoneCode,
          phoneNumber,
          website: data.website?.trim() || undefined,
          status: data.status === 'inactive' ? 'INACTIVE' : 'ACTIVE',
        });

        if (!response.success) {
          alert(response.message || 'Failed to update affiliate');
          return;
        }
      } else {
        const password = data.password?.trim() || '';
        if (!password) {
          alert('Password is required for new affiliate');
          return;
        }

        const response = await createAffiliate({
          email,
          phoneCode,
          phoneNumber,
          password,
          website: data.website?.trim() || undefined,
          status: data.status === 'inactive' ? 'INACTIVE' : 'ACTIVE',
          languages: { name: mappedName },
        });

        if (!response.success) {
          alert(response.message || 'Failed to create affiliate');
          return;
        }
      }

      setIsFormOpen(false);
      setEditingAffiliate(null);
      await loadAffiliates();
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadgeColor = (status: 'active' | 'inactive') => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <Building2 className="text-primary w-10 h-10 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Affiliates Management</h1>
            <p className="text-muted-foreground">Manage affiliate partners and their access controls</p>
          </div>
        </div>
        <Button onClick={handleAddAffiliate} className="gap-2">
          <Plus className="w-4 h-4" />
          New Affiliate
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search affiliates by name, email or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Active Affiliates</CardTitle>
              <CardDescription>{filteredAffiliates.length} affiliate(s) found</CardDescription>
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
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Loading affiliates...
                        </TableCell>
                      </TableRow>
                    ) : filteredAffiliates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No affiliates found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAffiliates.map((affiliate) => (
                        <TableRow
                          key={affiliate.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleSelectAffiliate(affiliate.id)}
                        >
                          <TableCell>
                            <div>
                              <p className="font-semibold">{getLocalizedText(affiliate.name, currentLanguage)}</p>
                              <p className="text-sm text-muted-foreground">ID: {affiliate.id}</p>
                            </div>
                          </TableCell>
                          <TableCell>{affiliate.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{affiliate.country}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(affiliate.status)}>{affiliate.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditAffiliate(affiliate);
                              }}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAffiliate(affiliate.id);
                              }}
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
        </div>

        <div>
          <Card className="sticky top-0">
            <CardHeader>
              <CardTitle>Affiliate Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedAffiliate ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-semibold">{getLocalizedText(selectedAffiliate.name, currentLanguage)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-sm">{selectedAffiliate.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="text-sm">{selectedAffiliate.phone || '--'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="text-sm">{selectedAffiliate.country || '--'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={getStatusBadgeColor(selectedAffiliate.status)}>{selectedAffiliate.status}</Badge>
                  </div>
                  <div className="pt-2 space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleToggleStatus(selectedAffiliate)}
                    >
                      {selectedAffiliate.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Select an affiliate to view details</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingAffiliate ? 'Edit Affiliate' : 'Create New Affiliate'}</DialogTitle>
          </DialogHeader>
          <AffiliateForm
            affiliate={editingAffiliate}
            onSubmit={handleFormSubmit}
            onClose={() => setIsFormOpen(false)}
          />
          {isSaving && <p className="text-sm text-muted-foreground">Saving...</p>}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AffiliatesPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <AffiliatesPageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
