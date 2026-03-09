'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
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

const mockAffiliates: Tenant[] = [
  {
    id: 'TENANT001',
    name: { en: 'TechCorp India', hi: 'टेककॉर्प इंडिया', ar: 'TechCorp الهند' },
    slug: 'techcorp-india',
    country: 'IN',
    website: 'https://techcorp-india.com',
    email: 'admin@techcorp-india.com',
    phone: '+91-9876543210',
    status: 'active',
    subscriptionPlanId: 'PLAN003',
    features: [],
    limits: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'TENANT002',
    name: { en: 'Digital UAE', hi: 'डिजिटल यूएई', ar: 'ديجيتال الإمارات' },
    slug: 'digital-uae',
    country: 'AE',
    website: 'https://digital-uae.com',
    email: 'admin@digital-uae.com',
    phone: '+971-123456789',
    status: 'active',
    subscriptionPlanId: 'PLAN002',
    features: [],
    limits: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function AffiliatesPageContent() {
  const { t, currentLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [affiliates, setAffiliates] = useState<Tenant[]>(mockAffiliates);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<Tenant | null>(null);
  const [selectedAffiliate, setSelectedAffiliate] = useState<Tenant | null>(null);

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
    if (confirm('Are you sure you want to delete this affiliate? This action cannot be undone.')) {
      setAffiliates(affiliates.filter(a => a.id !== affiliateId));
      if (selectedAffiliate?.id === affiliateId) {
        setSelectedAffiliate(null);
      }
    }
  };

  const handleToggleStatus = (affiliate: Tenant) => {
    const updated = { ...affiliate, status: affiliate.status === 'active' ? 'inactive' : 'active' };
    setAffiliates(affiliates.map(a => (a.id === affiliate.id ? updated : a)));
    if (selectedAffiliate?.id === affiliate.id) {
      setSelectedAffiliate(updated);
    }
  };

  const handleFormSubmit = async (data: Partial<Tenant>) => {
    if (editingAffiliate) {
      const updated = { ...editingAffiliate, ...data, updatedAt: new Date().toISOString() };
      setAffiliates(affiliates.map(a => (a.id === editingAffiliate.id ? updated : a)));
    } else {
      const newAffiliate: Tenant = {
        id: `TENANT${Date.now()}`,
        name: data.name || { en: '', hi: '', ar: '' },
        slug: data.slug || '',
        country: data.country || 'IN',
        website: data.website || '',
        email: data.email || '',
        phone: data.phone || '',
        status: data.status || 'active',
        subscriptionPlanId: data.subscriptionPlanId || '',
        features: data.features || [],
        limits: data.limits || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setAffiliates([...affiliates, newAffiliate]);
    }
    setIsFormOpen(false);
    setEditingAffiliate(null);
  };

  const getStatusBadgeColor = (status: 'active' | 'inactive') => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
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
        {/* Affiliates List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Active Affiliates</CardTitle>
              <CardDescription>{filteredAffiliates.length} affiliate(s) found</CardDescription>
            </CardHeader>
            <CardContent>
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
                    {filteredAffiliates.length === 0 ? (
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
                          onClick={() => setSelectedAffiliate(affiliate)}
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
                            <Badge className={getStatusBadgeColor(affiliate.status)}>
                              {affiliate.status}
                            </Badge>
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

        {/* Affiliate Details */}
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
                    <p className="text-sm">{selectedAffiliate.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="text-sm">{selectedAffiliate.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={getStatusBadgeColor(selectedAffiliate.status)}>
                      {selectedAffiliate.status}
                    </Badge>
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
            <DialogTitle>
              {editingAffiliate ? 'Edit Affiliate' : 'Create New Affiliate'}
            </DialogTitle>
          </DialogHeader>
          <AffiliateForm
            affiliate={editingAffiliate}
            onSubmit={handleFormSubmit}
            onClose={() => setIsFormOpen(false)}
          />
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
