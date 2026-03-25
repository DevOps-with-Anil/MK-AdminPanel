
'use client';
import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, MoreVertical, CreditCard, Settings } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { getPlans, updateStatus, deletePlan } from '@/services/auth.service';
import { useDeleteEntity } from '@/hooks/useDeleteEntity';
import { I18nContext } from '@/i18n/provider';


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
  const { messages } = useContext(I18nContext);
  const t = (key: string, placeholders?: Record<string, string | number>) => {
    const normalizedKey = key.replace(/^translate\./, '');
    let value = messages.translate?.[normalizedKey] || key;

    if (placeholders) {
      for (const [ph, phValue] of Object.entries(placeholders)) {
        value = value.replace(`{{${ph}}}`, String(phValue));
        value = value.replace(`{${ph}}`, String(phValue));
      }
    }

    return value;
  };
  const router = useRouter();

  const handleViewModules = (planId: string) => {
    router.push(`/admin/plans/${planId}/modules-permissions`);
  };

  const handleUpdatePermissions = (planId: string) => {
    alert(`Update permissions for plan ${planId}`);
  };

  const handleDelete = async (planId: string) => {
    if (confirm(t('translate.plans.deleteConfirm'))) {
      try {
        await deletePlan(planId);
        fetchPlans();
      } catch (err) {
        console.error('Delete plan error', err);
      }
    }
  };

 const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number | 'All'>(10);
  const [totalPages, setTotalPages] = useState(1);
   const [debouncedSearch, setDebouncedSearch] = useState('');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     fetchPlans();
   }, [page, limit, debouncedSearch]);
 
  const fetchPlans = async () => {
  try {
    setLoading(true);

    const fetchLimit = limit === 'All' ? 0 : limit;

    const res = await getPlans({
      page,
      limit: fetchLimit,
      search: debouncedSearch,
    });

    const formatted: Plan[] = res.data.map((r: any) => ({
      id: r._id,
      name: r.name || '',
      description: r.description || '',
      price: r.price || 0,
      currency: r.currency || 'USD',
      type: r.type || 'MONTHLY',

      // âœ… fallback values (important)
      features: r.features || [],
      subscribers: r.assignedUserCount || 0,

      status: r.status === 'ACTIVE' ? 'active' : 'inactive',
    }));
    
    setPlans(formatted);

    // optional pagination
    setTotalPages(res.meta?.totalPages || 1);

  } catch (err) {
    console.error('Fetch plans error', err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
            <CreditCard className="text-primary w-7 h-7 mt-1" />
          <div>
            <h1 className="text-xl font-medium text-foreground">{t('translate.plans.title')}</h1>
            <p className="text-muted-foreground">{t('translate.plans.subtitle')}</p>
          </div>
        </div>
        <Link href="/admin/plans/new">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" /> 
            {t('translate.plans.newPlan')}
          </Button>
        </Link>
      </div>

{/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">{plans.length}</p>
            <p className="text-sm text-muted-foreground mt-1">{t('translate.plans.totalPlans')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-secondary">
              ${plans.reduce((sum, p) => sum + p.price * p.subscribers, 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{t('translate.plans.totalRevenue')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-accent">
              {plans.reduce((sum, p) => sum + p.subscribers, 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{t('translate.plans.totalSubscribers')}</p>
          </CardContent>
        </Card>
      </div>


      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="mt-1 text-sm text-muted-foreground ">{plan.description}</CardDescription>
                  <div className="mt-2 flex items-center gap-2 text-foreground">
                    <span className="font-bold">{plan.currency} {plan.price}</span> 
                    <span className="text-sm text-muted-foreground">{t(`translate.plans.interval_${plan.type.toLowerCase()}`)}</span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/plans/edit/${plan.id}`} className="gap-2 flex items-center"> 
                        <Edit2 className="w-4 h-4" /> {t('translate.plans.edit')}
                      </Link>
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem className="gap-2" onClick={() => handleUpdatePermissions(plan.id)}>
                      <Settings className="w-4 h-4" /> Update Permissions
                    </DropdownMenuItem> */}
                    <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDelete(plan.id)}> 
                      <Trash2 className="w-4 h-4" /> {t('translate.plans.delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col gap-4">
              <div className="text-sm text-muted-foreground">
                <p><strong>{t('translate.plans.modulesFeatures')}:</strong> {plan.features.length}</p>
                {/* <p><strong>Total Subscribers:</strong> {plan.subscribers}</p> */}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Badge className={plan.status === 'active' ? 'bg-primary' : 'bg-secondary'}> 
                  {t(`translate.plans.${plan.status}`)}
                </Badge>
                <Button size="sm" onClick={() => handleViewModules(plan.id)}>
                  {t('translate.plans.viewModules')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      
    </div>
    
  );
}

