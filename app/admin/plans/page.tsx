'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SubscriptionPlan } from '@/lib/types';
import { getLocalizedText } from '@/i18n/langHelper';
import PlanForm from '@/components/admin/forms/PlanForm';
import { createPlan, deletePlan, getPlans, updatePlan } from '@/services/plan-service';

interface BackendPlan {
  _id: string;
  name: { en?: string; fr?: string; ar?: string };
  description?: { en?: string; fr?: string; ar?: string };
  price?: number;
  currency?: string;
  duration?: 'MONTHLY' | 'YEARLY';
  status?: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

function PlansPageContent() {
  const { currentLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slugify = (input: string) =>
    (input || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const mapBackendPlan = (plan: BackendPlan): SubscriptionPlan => {
    const enName = plan.name?.en || '';
    return {
      id: plan._id,
      name: {
        en: enName,
        hi: plan.name?.fr || enName,
        ar: plan.name?.ar || '',
      },
      slug: slugify(enName),
      description: plan.description
        ? {
            en: plan.description.en || '',
            hi: plan.description.fr || plan.description.en || '',
            ar: plan.description.ar || '',
          }
        : undefined,
      price: plan.price ?? 0,
      currency: plan.currency || 'USD',
      billingCycle: plan.duration === 'YEARLY' ? 'yearly' : 'monthly',
      status: plan.status === 'INACTIVE' ? 'inactive' : 'active',
      features: [],
      limits: {},
      createdAt: plan.createdAt || new Date().toISOString(),
      updatedAt: plan.updatedAt || new Date().toISOString(),
    };
  };

  const loadPlans = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getPlans();
      if (!response.success) {
        setError(response.message || 'Failed to load plans');
        setPlans([]);
        return;
      }

      const payload = response.data as unknown as { data?: BackendPlan[] } | BackendPlan[];
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

      setPlans(list.map(mapBackendPlan));
    } catch (err) {
      console.error('Load plans error:', err);
      setError('Failed to load plans');
      setPlans([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadPlans();
  }, []);

  const filteredPlans = plans.filter(
    (plan) =>
      getLocalizedText(plan.name, currentLanguage).toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddPlan = () => {
    setEditingPlan(null);
    setIsFormOpen(true);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setIsFormOpen(true);
  };

  const handleDeletePlan = (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan? This action cannot be undone.')) return;

    void (async () => {
      const response = await deletePlan(planId);
      if (!response.success) {
        alert(response.message || 'Failed to delete plan');
        return;
      }

      setPlans((prev) => prev.filter((p) => p.id !== planId));
      if (selectedPlan?.id === planId) setSelectedPlan(null);
    })();
  };

  const handleToggleStatus = (plan: SubscriptionPlan) => {
    void (async () => {
      const nextStatus = plan.status === 'active' ? 'INACTIVE' : 'ACTIVE';
      const response = await updatePlan(plan.id, { status: nextStatus });
      if (!response.success) {
        alert(response.message || 'Failed to update plan status');
        return;
      }

      const updated = { ...plan, status: nextStatus === 'ACTIVE' ? 'active' : 'inactive' };
      setPlans((prev) => prev.map((p) => (p.id === plan.id ? updated : p)));
      if (selectedPlan?.id === plan.id) setSelectedPlan(updated);
    })();
  };

  const handleFormSubmit = async (data: Partial<SubscriptionPlan>) => {
    const nameEn = data.name?.en?.trim() || '';
    const nameAr = data.name?.ar?.trim() || '';
    const nameHi = data.name?.hi?.trim() || '';

    if (!nameEn) {
      alert('English plan name is required');
      return;
    }

    const descEn = data.description?.en?.trim() || '';
    const descHi = data.description?.hi?.trim() || '';
    const descAr = data.description?.ar?.trim() || '';
    const hasDescription = !!(descEn || descHi || descAr);

    const commonPayload = {
      name: {
        en: nameEn,
        fr: nameHi || nameEn,
        ar: nameAr || nameEn,
      },
      description: hasDescription
        ? {
            en: descEn || nameEn,
            fr: descHi || descEn || nameEn,
            ar: descAr || descEn || nameEn,
          }
        : undefined,
      price: data.price ?? 0,
      currency: (data.currency || 'USD').toUpperCase(),
      duration: data.billingCycle === 'yearly' ? ('YEARLY' as const) : ('MONTHLY' as const),
      status: data.status === 'inactive' ? ('INACTIVE' as const) : ('ACTIVE' as const),
    };

    try {
      setIsSaving(true);
      if (editingPlan) {
        const response = await updatePlan(editingPlan.id, commonPayload);
        if (!response.success) {
          alert(response.message || 'Failed to update plan');
          return;
        }
      } else {
        const response = await createPlan(commonPayload);
        if (!response.success) {
          alert(response.message || 'Failed to create plan');
          return;
        }
      }

      setIsFormOpen(false);
      setEditingPlan(null);
      await loadPlans();
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
          <Package className="text-primary w-10 h-10 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Subscription Plans</h1>
            <p className="text-muted-foreground">Manage pricing tiers and plan features with multi-language support</p>
          </div>
        </div>
        <Button onClick={handleAddPlan} className="gap-2">
          <Plus className="w-4 h-4" />
          New Plan
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search plans..."
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
              <CardTitle>Available Plans</CardTitle>
              <CardDescription>{filteredPlans.length} plan(s) found</CardDescription>
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
                      <TableHead>Slug</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Loading plans...
                        </TableCell>
                      </TableRow>
                    ) : filteredPlans.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No plans found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPlans.map((plan) => (
                        <TableRow
                          key={plan.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedPlan(plan)}
                        >
                          <TableCell>
                            <div>
                              <p className="font-semibold">{getLocalizedText(plan.name, currentLanguage)}</p>
                              <p className="text-sm text-muted-foreground">ID: {plan.id}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{plan.slug}</Badge>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold">
                              {plan.price === 0 ? 'Free' : `$${plan.price}/${plan.billingCycle}`}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusBadgeColor(plan.status)}>{plan.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditPlan(plan);
                              }}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePlan(plan.id);
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
              <CardTitle>Plan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPlan ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-semibold">{getLocalizedText(selectedPlan.name, currentLanguage)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-sm">{getLocalizedText(selectedPlan.description, currentLanguage)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="text-2xl font-bold">
                      {selectedPlan.price === 0 ? 'Free' : `$${selectedPlan.price}`}
                      <span className="text-sm font-normal text-muted-foreground ml-2">/ {selectedPlan.billingCycle}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={getStatusBadgeColor(selectedPlan.status)}>{selectedPlan.status}</Badge>
                  </div>
                  <div className="pt-2 space-y-2">
                    <Button variant="outline" className="w-full" onClick={() => handleToggleStatus(selectedPlan)}>
                      {selectedPlan.status === 'active' ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Select a plan to view details</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</DialogTitle>
          </DialogHeader>
          <PlanForm plan={editingPlan} onSubmit={handleFormSubmit} onClose={() => setIsFormOpen(false)} />
          {isSaving && <p className="text-sm text-muted-foreground">Saving...</p>}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function PlansPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <PlansPageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
