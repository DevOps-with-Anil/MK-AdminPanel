'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
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

const mockPlans: SubscriptionPlan[] = [
  {
    id: 'PLAN001',
    name: { en: 'Free Plan', hi: 'मुफ्त योजना', ar: 'الخطة المجانية' },
    slug: 'free',
    description: { en: 'Basic features for getting started', hi: 'शुरुआत के लिए बुनियादी सुविधाएं', ar: 'ميزات أساسية للبدء' },
    price: 0,
    currency: 'USD',
    billingCycle: 'monthly',
    status: 'active',
    features: [],
    limits: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PLAN002',
    name: { en: 'Pro Plan', hi: 'प्रो योजना', ar: 'خطة Pro' },
    slug: 'pro',
    description: { en: 'Advanced features for professionals', hi: 'पेशेवारों के लिए उन्नत सुविधाएं', ar: 'ميزات متقدمة للمحترفين' },
    price: 99,
    currency: 'USD',
    billingCycle: 'monthly',
    status: 'active',
    features: [],
    limits: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'PLAN003',
    name: { en: 'Enterprise Plan', hi: 'एंटरप्राइज योजना', ar: 'خطة Enterprise' },
    slug: 'enterprise',
    description: { en: 'Complete solution for enterprises', hi: 'उद्यमों के लिए पूर्ण समाधान', ar: 'حل كامل للمؤسसات' },
    price: 299,
    currency: 'USD',
    billingCycle: 'monthly',
    status: 'active',
    features: [],
    limits: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function PlansPageContent() {
  const { t, currentLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [plans, setPlans] = useState<SubscriptionPlan[]>(mockPlans);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

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
    if (confirm('Are you sure you want to delete this plan? This action cannot be undone.')) {
      setPlans(plans.filter(p => p.id !== planId));
      if (selectedPlan?.id === planId) {
        setSelectedPlan(null);
      }
    }
  };

  const handleToggleStatus = (plan: SubscriptionPlan) => {
    const updated = { ...plan, status: plan.status === 'active' ? 'inactive' : 'active' };
    setPlans(plans.map(p => (p.id === plan.id ? updated : p)));
    if (selectedPlan?.id === plan.id) {
      setSelectedPlan(updated);
    }
  };

  const handleFormSubmit = async (data: Partial<SubscriptionPlan>) => {
    if (editingPlan) {
      const updated = { ...editingPlan, ...data, updatedAt: new Date().toISOString() };
      setPlans(plans.map(p => (p.id === editingPlan.id ? updated : p)));
    } else {
      const newPlan: SubscriptionPlan = {
        id: `PLAN${Date.now()}`,
        name: data.name || { en: '', hi: '', ar: '' },
        slug: data.slug || '',
        description: data.description,
        price: data.price || 0,
        currency: data.currency || 'USD',
        billingCycle: data.billingCycle || 'monthly',
        status: data.status || 'active',
        features: data.features || [],
        limits: data.limits || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPlans([...plans, newPlan]);
    }
    setIsFormOpen(false);
    setEditingPlan(null);
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
        {/* Plans List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Available Plans</CardTitle>
              <CardDescription>{filteredPlans.length} plan(s) found</CardDescription>
            </CardHeader>
            <CardContent>
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
                    {filteredPlans.length === 0 ? (
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
                            <Badge className={getStatusBadgeColor(plan.status)}>
                              {plan.status}
                            </Badge>
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

        {/* Plan Details */}
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
                      <span className="text-sm font-normal text-muted-foreground ml-2">
                        / {selectedPlan.billingCycle}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={getStatusBadgeColor(selectedPlan.status)}>
                      {selectedPlan.status}
                    </Badge>
                  </div>
                  <div className="pt-2 space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleToggleStatus(selectedPlan)}
                    >
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
            <DialogTitle>
              {editingPlan ? 'Edit Plan' : 'Create New Plan'}
            </DialogTitle>
          </DialogHeader>
          <PlanForm
            plan={editingPlan}
            onSubmit={handleFormSubmit}
            onClose={() => setIsFormOpen(false)}
          />
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
