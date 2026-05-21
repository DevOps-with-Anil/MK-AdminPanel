'use client';

import { useAdmin } from '@/contexts/AdminContext';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import {
  Plus,
  Edit2,
  Trash2,
  MoreVertical,
  CreditCard,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

import { getPlans } from '@/services/auth.service';

import { deleteEntity } from '@/services/auth.service';


interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  type: 'MONTHLY' | 'YEARLY';
  features: string[];
  subscribers: number;
  status: 'active' | 'inactive';
}

export default function PlansPage() {
  const { t } = useAdmin();
  const router = useRouter();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number | 'All'>(10);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  // const { deleteEntity, loadingId } = useDeleteEntity();


  // debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // fetch
  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);

      const fetchLimit = limit === 'All' ? 0 : limit;

      const res = await getPlans({
        page,
        limit: fetchLimit,
        search: debouncedSearch,
      });

      const formatted: Plan[] =
        res?.data?.map((r: any) => ({
          id: r._id,
          name: r.name ?? '',
          description: r.description ?? '',
          price: r.price ?? 0,
          currency: r.currency ?? 'USD',
          type: r.type ?? 'MONTHLY',
          features: r.modules ?? [],
          subscribers: r.assignedUserCount ?? 0,
          status: r.status === 'ACTIVE' ? 'active' : 'inactive',
        })) || [];

      setPlans(formatted);
      setTotalPages(res?.meta?.totalPages ?? 1);
    } catch (err) {
      console.error('Fetch plans error', err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // handlers
  const handleDelete = async (
    planId: string,
    planName: string
  ) => {
    if (!confirm(`Delete "${planName}" plan?`)) return;

    try {
      await deleteEntity('plan', planId);

      // ✅ instant UI update
      setPlans(prev => prev.filter(p => p.id !== planId));

    } catch (err) {
      console.error(err);
      alert('Failed to delete plan');
    }
  };

  const handleViewModules = (planId: string) => {
  if (!planId) {
    alert('Plan ID missing');
    return;
  }
  router.push(`/root/plans/modules/${planId}`);
};

  // computed
  const totalRevenue = plans.reduce(
    (sum, p) => sum + p.price * p.subscribers,
    0
  );

  const totalSubscribers = plans.reduce(
    (sum, p) => sum + p.subscribers,
    0
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <CreditCard className="text-primary w-7 h-7 mt-1" />
          <div>
            <h1 className="text-xl font-medium">
              {t('translate.plans_title')}
            </h1>
            <p className="text-muted-foreground">
              {t('translate.plans_subtitle')}
            </p>
          </div>
        </div>

        <Link href="/root/plans/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            {t('translate.plans_new_plan')}
          </Button>
        </Link>
      </div>

      {/* SUMMARY */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{plans.length}</p>
            <p className="text-sm text-muted-foreground">
              {t('translate.plans_total_plans')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">
              ${totalRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('translate.plans_total_revenue')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">
              {totalSubscribers.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('translate.plans_total_subscribers')}
            </p>
          </CardContent>
        </Card>
      </div> */}

      {/* LOADING */}
      {loading ? (
        <p className="text-center text-muted-foreground">
          {t('translate.common_loading') || 'Loading...'}
        </p>
      ) : plans.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
              <p className="text-lg font-medium">
                {t('translate.no_data') || 'No Plans Found'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {t('translate.no_data_description') ||
                  'No plans are available. Create a new plan to get started.'}
              </p>

              {/* <Link href="/root/plans/new">
                <Button className="mt-4 gap-2">
                  <Plus className="w-4 h-4" />
                  {t('translate.plans_new_plan')}
                </Button>
              </Link> */}

            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      {plan.name}
                    </CardTitle>

                    <CardDescription className="mt-1 line-clamp-3">
                      {plan.description}
                    </CardDescription>

                    <div className="mt-2 flex gap-2">
                      <span className="font-bold">
                        {plan.currency} {plan.price}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {t(
                          `translate.plans_interval_${plan.type.toLowerCase()}`
                        )}
                      </span>
                    </div>
                  </div>

                  {/* ACTION MENU */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/root/plans/edit/${plan.id}`}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          {t('translate.plans_edit')}
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(plan.id, plan.name)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {t('translate.plans_delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col justify-between flex-1 gap-4">
                {/* <div className="text-sm text-muted-foreground">
                  <strong>
                    {t('translate.plans_modules_features')}:
                  </strong>{' '}
                  {plan.features.length}
                </div> */}

                <div className="flex justify-between items-center pt-4 border-t">
                  <Badge
                    className={
                      plan.status === 'active'
                        ? ''
                        : 'bg-red-100 text-gray-600 border-red-300'
                    }
                  >
                    {t(`translate.plans_${plan.status}`)}
                  </Badge>

                  <Button
                    size="sm"
                    onClick={() => handleViewModules(plan.id)}
                  >
                    {t('translate.plans_view_modules')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// export default function PlansPage() {
//   return (
//     <AdminProvider>
//       <PlansPageContent />
//     </AdminProvider>
//   );
// }