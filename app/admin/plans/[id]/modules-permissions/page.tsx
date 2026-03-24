'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { getPlanById } from '@/services/auth.service';
import { useAdmin } from '@/contexts/AdminContext';

interface PlanResponseData {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  modules: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function PlanModulesPermissionsPage() {
  const { t } = useAdmin();
  const params = useParams();
  const planIdRaw = params?.id;
  const planId = Array.isArray(planIdRaw) ? planIdRaw[0] : planIdRaw ?? '';
  const [plan, setPlan] = useState<PlanResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!planId) {
      setError('Plan ID is missing');
      setLoading(false);
      return;
    }

    const loadPlan = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await getPlanById(planId);
        if (res?.status === 200 && res?.data) {
          setPlan(res.data);
        } else {
          setError(res?.message || 'Failed to fetch plan data');
        }
      } catch (err) {
        console.error('getPlanById error', err);
        setError('Failed to fetch plan data');
      } finally {
        setLoading(false);
      }
    };

    loadPlan();
  }, [planId]);

  const modules = plan?.modules ?? [];
  const permissions = plan
    ? ['Plan View', 'Plan Create', 'Plan Update', 'Plan Delete', 'Module Assign']
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('plans.modulesPermissionsTitle')}</h1>
        <Link href="/admin/plans">
          <Button variant="secondary" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> {t('plans.backToPlans')}
          </Button>
        </Link>
      </div>

      {loading ? (
        <p className="text-muted-foreground">{t('plans.loadingData')}</p>
      ) : error ? (
        <p className="text-destructive">{error}</p>
      ) : plan ? (
        <>
          <p className="text-muted-foreground">
            {t('plans.viewingMapping')} <strong>{plan.name}</strong> (ID: {planId})
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('plans.assignedModules')}</CardTitle>
                <CardDescription>{t('plans.assignedModulesDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {modules.length === 0 ? (
                  <p className="text-sm text-muted-foreground">{t('plans.noModulesAssigned')}</p>
                ) : (
                  modules.map((module) => (
                    <div key={module} className="rounded-md border border-border p-3">
                      <strong>{module}</strong>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('plans.assignedPermissions')}</CardTitle>
                <CardDescription>{t('plans.assignedPermissionsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {permissions.map((permission) => (
                  <div key={permission} className="rounded-md border border-border p-3">
                    <strong>{permission}</strong>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <p className="text-muted-foreground">{t('plans.planNotFound')}</p>
      )}

      <div className="flex gap-3">
        <Button className="flex-1" disabled>
          {t('plans.syncBackend')}
        </Button>
      </div>
    </div>
  );
}
