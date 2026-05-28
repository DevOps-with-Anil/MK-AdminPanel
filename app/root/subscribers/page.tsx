'use client';

import { AdminProvider, useAdmin } from '@/contexts/AdminContext';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  MoreVertical,
  Handshake,
  CheckCircle,
  Eye,
} from 'lucide-react';
import { getConsistentBadgeColor } from '@/utils/getDynamicBadgeColor';
import { getAffiliates, getPlans } from '@/services/auth.service';
import { usePagination } from '@/hooks/ui/usePagination';


/* ================= TYPES ================= */

interface Subscriber {
  id: string;
  tenantId: string;
  companyName: string;
  contact: {
    email: string;
    phone: {
      code: string;
      number: string;
    };
  };
  plan: string;
  startDate: string;
  expiryDate: string;
  isVerified: boolean;
}

/* ================= PAGE ================= */

export default function SubscribersPage() {

  const { t } = useAdmin();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [plans, setPlans] = useState<string[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [totalPages, setTotalPages] = useState(1);
  const PAGE_LIMIT_OPTIONS = [10, 25, 50, 'All'];
  const { page, setPage, limit, setLimit } = usePagination(10);

  /* ================= SEARCH DEBOUNCE ================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  /* ================= FETCH SUBSCRIBERS ================= */

  const fetchSubscribers = useCallback(async () => {
    try {
      setLoading(true);

      const fetchLimit =
        limit === 'All' ? 0 : limit;

      const res =
        await getAffiliates({
          page,
          limit: fetchLimit,
          search: debouncedSearch,
        });

      const formatted: Subscriber[] =
        res?.data?.map((r: any) => ({
          id: r._id,

          tenantId: r.tenantId,

          companyName:
            r.companyName || '',

          contact: {
            email:
              r.contact?.email || '',

            phone: {
              code:
                r.contact?.phone?.code ||
                '',

              number:
                r.contact?.phone
                  ?.number || '',
            },
          },

          plan:
            r.currentSubscriptionId
              ?.planName || 'Free',

          startDate:
            r.currentSubscriptionId
              ?.startDate || '',

          expiryDate:
            r.currentSubscriptionId
              ?.expiryDate || '',

          isVerified:
            r.address?.isVerified ??
            false,
        })) || [];

      setSubscribers(
        formatted.filter(
          (sub) =>
            sub.plan &&
            sub.plan.toLowerCase() !== 'free'
        )
      );

    } catch (err) {
      console.error(
        'Fetch subscribers error',
        err
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, t]);

  /* ================= FETCH PLANS ================= */

  const fetchPlans = useCallback(async () => {
    try {
      const res = await getPlans({
        page: 1,
        limit: 100,
        search: '',
      });

      const planList: string[] =
        res?.data?.map(
          (p: any) => p.name
        ) || [];

      setPlans(['ALL', ...planList]);

    } catch (err) {
      console.error(
        'Failed to fetch plans',
        err
      );
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
    fetchPlans();
  }, [fetchSubscribers, fetchPlans, t]);


  /* ================= FILTER ================= */

  const filteredSubscribers =
    subscribers.filter((sub) => {

      const matchesSearch =
        sub.companyName
          .toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          ) ||
        sub.contact.email
          .toLowerCase()
          .includes(
            searchQuery.toLowerCase()
          );

      const matchesPlan =
        selectedPlan === 'ALL' ||
        sub.plan === selectedPlan;

      return (
        matchesSearch && matchesPlan
      );
    });


  /* ================= DATE FORMAT ================= */

  const formatDate = (date?: string) => {
    if (!date) return '-';

    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  /* ================= UI ================= */
  return (
    <AdminProvider>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div className="flex items-start gap-4">
            <Handshake className="text-primary w-7 h-7 mt-1" />

            <div>
              <h1 className="text-xl font-medium">
                {t("translate.subscribers_title")}
              </h1>

              <p className="text-muted-foreground">
                {t("translate.subscribers_description")}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">

            {/* SEARCH */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

              <Input
                placeholder={t("translate.subscribers_search_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* PLAN FILTER */}
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm min-w-[180px] bg-background"
            >
              {plans.map((plan) => (
                <option key={plan} value={plan}>
                  {plan === "ALL"
                    ? t("translate.subscribers_filter_plan")
                    : plan}
                </option>
              ))}
            </select>

          </div>
        </div>

        {/* TABLE */}
        <Card>

          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>
                {t("translate.subscribers_table_title")}
              </CardTitle>

              <CardDescription>
                {loading
                  ? t("translate.subscribers_table_loading")
                  : `${filteredSubscribers.length} ${t("translate.subscribers_table_found")}`}
              </CardDescription>
            </div>

            {/* LIMIT DROPDOWN */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {t("translate.subscribers_show")}: {limit}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {PAGE_LIMIT_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => {
                      setLimit(option === "All" ? "All" : Number(option));
                      setPage(1);
                    }}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

          </CardHeader>

          <CardContent>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="border-b">

                    <th className="text-left py-3 px-4">
                      {t("translate.subscribers_col_id")}
                    </th>

                    <th className="text-left py-3 px-4">
                      {t("translate.subscribers_col_name")}
                    </th>

                    <th className="text-left py-3 px-4">
                      {t("translate.subscribers_col_contact")}
                    </th>

                    <th className="text-left py-3 px-4">
                      {t("translate.subscribers_col_plan")}
                    </th>

                    <th className="text-left py-3 px-4">
                      {t("translate.subscribers_col_start_date")}
                    </th>

                    <th className="text-left py-3 px-4">
                      {t("translate.subscribers_col_expiry_date")}
                    </th>

                    <th className="text-right py-3 px-4">
                      {t("translate.subscribers_col_actions")}
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8">
                        {t("translate.subscribers_loading")}
                      </td>
                    </tr>

                  ) : filteredSubscribers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-muted-foreground">
                        {t("translate.subscribers_empty")}
                      </td>
                    </tr>

                  ) : (

                    filteredSubscribers.map((sub) => (
                      <tr key={sub.id} className="border-b hover:bg-muted/40">

                        <td className="py-4 px-4 font-medium">
                          {sub.tenantId}
                        </td>

                        <td className="py-4 px-4">
                          <p className="font-medium">{sub.companyName}</p>

                          {sub.isVerified && (
                            <p className="text-sm text-primary flex items-center gap-1 mt-1">
                              <CheckCircle className="w-4 h-4" />
                              {t("translate.subscribers_verified")}
                            </p>
                          )}
                        </td>

                        <td className="py-4 px-4 text-sm">
                          <p>{sub.contact.email}</p>
                          <p className="text-muted-foreground">
                            {sub.contact.phone.code} {sub.contact.phone.number}
                          </p>
                        </td>

                        <td className="py-4 px-4">
                          <Badge className={getConsistentBadgeColor(sub.plan)}>
                            {sub.plan}
                          </Badge>
                        </td>

                        <td className="py-4 px-4 text-sm">
                          {formatDate(sub.startDate)}
                        </td>

                        <td className="py-4 px-4 text-sm">
                          {formatDate(sub.expiryDate)}
                        </td>

                        <td className="p-4 align-top">
                          <div className="flex items-center justify-left">
                            <Link href={`/root/subscribers/${sub.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                {t('translate.subscribers_col_viewBTN')}
                              </Button>
                            </Link>
                          </div>
                        </td>

                      </tr>
                    ))

                  )}

                </tbody>

              </table>

              {/* PAGINATION */}
              <div className="flex justify-end gap-2 p-4">

                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  {t("translate.subscribers_prev")}
                </Button>

                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    size="sm"
                    variant={page === i + 1 ? "default" : "outline"}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}

                <Button
                  size="sm"
                  variant="outline"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {t("translate.subscribers_next")}
                </Button>

              </div>

            </div>

          </CardContent>

        </Card>

      </div>
    </AdminProvider>
  );

}