
// 'use client';
// import { useAdmin } from '@/contexts/AdminContext';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Plus, Edit2, Trash2, MoreVertical, CreditCard, Settings } from 'lucide-react';
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
// import { getPlans, updateStatus, deletePlan } from '@/services/auth.service';
// import { useDeleteEntity } from '@/hooks/useDeleteEntity';


// interface Plan {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   currency: string;
//   type: 'MONTHLY' | 'YEARLY';
//   features: string[];
//   subscribers: number;
//   status: 'active' | 'inactive';
// }


// export default function PlansPage() {
//   const { t } = useAdmin();
//   const router = useRouter();

//   const handleViewModules = (planId: string) => {
//     router.push(`/admin/plans/${planId}/modules-permissions`);
//   };

//   const handleUpdatePermissions = (planId: string) => {
//     alert(`Update permissions for plan ${planId}`);
//   };

//   const handleDelete = async (planId: string) => {
//     if (confirm(t('plans.deleteConfirm'))) {
//       try {
//         await deletePlan(planId);
//         fetchPlans();
//       } catch (err) {
//         console.error('Delete plan error', err);
//       }
//     }
//   };

//  const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState<number | 'All'>(10);
//   const [totalPages, setTotalPages] = useState(1);
//    const [debouncedSearch, setDebouncedSearch] = useState('');
//   const [plans, setPlans] = useState<Plan[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//      fetchPlans();
//    }, [page, limit, debouncedSearch]);
 
//   const fetchPlans = async () => {
//   try {
//     setLoading(true);

//     const fetchLimit = limit === 'All' ? 0 : limit;

//     const res = await getPlans({
//       page,
//       limit: fetchLimit,
//       search: debouncedSearch,
//     });

//     const formatted: Plan[] = res.data.map((r: any) => ({
//       id: r._id,
//       name: r.name || '',
//       description: r.description || '',
//       price: r.price || 0,
//       currency: r.currency || 'USD',
//       type: r.type || 'MONTHLY',

//       // ✅ fallback values (important)
//       features: r.features || [],
//       subscribers: r.assignedUserCount || 0,

//       status: r.status === 'ACTIVE' ? 'active' : 'inactive',
//     }));
    
//     setPlans(formatted);

//     // optional pagination
//     setTotalPages(res.meta?.totalPages || 1);

//   } catch (err) {
//     console.error('Fetch plans error', err);
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-start gap-4">
//             <CreditCard className="text-primary w-7 h-7 mt-1" />
//           <div>
//             <h1 className="text-xl font-medium text-foreground">{t('plans.title')}</h1>
//             <p className="text-muted-foreground">{t('plans.subtitle')}</p>
//           </div>
//         </div>
//         <Link href="/admin/plans/new">
//           <Button className="gap-2 bg-primary hover:bg-primary/90">
//             <Plus className="w-4 h-4" /> 
//             {t('plans.newPlan')}
//           </Button>
//         </Link>
//       </div>

// {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card>
//           <CardContent className="pt-6 text-center">
//             <p className="text-3xl font-bold text-primary">{plans.length}</p>
//             <p className="text-sm text-muted-foreground mt-1">{t('plans.totalPlans')}</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6 text-center">
//             <p className="text-3xl font-bold text-secondary">
//               ${plans.reduce((sum, p) => sum + p.price * p.subscribers, 0).toLocaleString()}
//             </p>
//             <p className="text-sm text-muted-foreground mt-1">{t('plans.totalRevenue')}</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6 text-center">
//             <p className="text-3xl font-bold text-accent">
//               {plans.reduce((sum, p) => sum + p.subscribers, 0).toLocaleString()}
//             </p>
//             <p className="text-sm text-muted-foreground mt-1">{t('plans.totalSubscribers')}</p>
//           </CardContent>
//         </Card>
//       </div>


//       {/* Plan Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {plans.map((plan) => (
//           <Card key={plan.id} className="flex flex-col">
//             <CardHeader>
//               <div className="flex items-start justify-between">
//                 <div>
//                   <CardTitle className="text-2xl">{plan.name}</CardTitle>
//                   <CardDescription className="mt-1 text-sm text-muted-foreground ">{plan.description}</CardDescription>
//                   <div className="mt-2 flex items-center gap-2 text-foreground">
//                     <span className="font-bold">{plan.currency} {plan.price}</span> 
//                     <span className="text-sm text-muted-foreground">{t(`plans.interval_${plan.type.toLowerCase()}`)}</span>
//                   </div>
//                 </div>

//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                       <MoreVertical className="w-4 h-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuItem asChild>
//                       <Link href={`/admin/plans/edit/${plan.id}`} className="gap-2 flex items-center"> 
//                         <Edit2 className="w-4 h-4" /> {t('plans.edit')}
//                       </Link>
//                     </DropdownMenuItem>
//                     {/* <DropdownMenuItem className="gap-2" onClick={() => handleUpdatePermissions(plan.id)}>
//                       <Settings className="w-4 h-4" /> Update Permissions
//                     </DropdownMenuItem> */}
//                     <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(plan.id)}> 
//                       <Trash2 className="w-4 h-4" /> {t('plans.delete')}
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </CardHeader>

//             <CardContent className="flex-1 flex flex-col gap-4">
//               <div className="text-sm text-muted-foreground">
//                 <p><strong>{t('plans.modulesFeatures')}:</strong> {plan.features.length}</p>
//                 {/* <p><strong>Total Subscribers:</strong> {plan.subscribers}</p> */}
//               </div>

//               <div className="flex items-center justify-between pt-4 border-t border-border">
//                 <Badge className={plan.status === 'active' ? 'bg-primary' : 'bg-secondary'}> 
//                   {t(`plans.${plan.status}`)}
//                 </Badge>
//                 <Button size="sm" onClick={() => handleViewModules(plan.id)}>
//                   {t('plans.viewModules')}
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

      
//     </div>
    
//   );
// }

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

interface Plan {
  id: string;
  name: string ;
  description: string ;
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
          features: r.features ?? [],
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
  const handleDelete = async (planId: string) => {
    if (!confirm(t('translate.plans_delete_confirm'))) return;

    // try {
    //   await deletePlan(planId);
    //   fetchPlans();
    // } catch (err) {
    //   console.error('Delete error', err);
    // }
  };

  const handleViewModules = (planId: string) => {
    alert(`Viewing modules & permissions for plan ${planId}`);
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

        <Link href="/admin/plans/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            {t('translate.plans_new_plan')}
          </Button>
        </Link>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>

      {/* LOADING */}
      {loading ? (
        <p className="text-center text-muted-foreground">
          {t('translate.common_loading') || 'Loading...'}
        </p>
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
                        <Link href={`/admin/plans/edit/${plan.id}`}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          {t('translate.plans_edit')}
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(plan.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        {t('translate.plans_delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col justify-between flex-1">
                <div className="text-sm text-muted-foreground">
                  <strong>
                    {t('translate.plans_modules_features')}:
                  </strong>{' '}
                  {plan.features.length}
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <Badge>
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