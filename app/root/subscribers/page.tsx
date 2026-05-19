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
  }, [page, limit, debouncedSearch]);

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
  }, [fetchSubscribers, fetchPlans]);


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

  /* ================= PLAN COLORS ================= */

  // const getPlanColor = (
  //   plan: string
  // ) => {
  //   const colors: Record<
  //     string,
  //     string
  //   > = {
  //     FREE: 'bg-gray-400 text-gray-700',

  //     BASIC:
  //       'bg-blue-300 text-blue-700',

  //     STANDARD:
  //       'bg-purple-100 text-purple-700',

  //     PREMIUM:
  //       'bg-orange-300 text-orange-700',

  //     ENTERPRISE:
  //       'bg-green text-green-700',
  //   };

  //   return (
  //     colors[
  //     plan.toUpperCase()
  //     ] ||
  //     'bg-primary text-white'
  //   );
  // };

  const planColorPalette = [
    'bg-blue-200 text-blue-700',
    'bg-purple-200 text-purple-700',
    'bg-green-200 text-green-700',
    'bg-orange-200 text-orange-700',
    'bg-pink-200 text-pink-700',
    'bg-cyan-200 text-cyan-700',
    'bg-yellow-200 text-yellow-700',
    'bg-indigo-200 text-indigo-700',
    'bg-red-200 text-red-700',
    'bg-emerald-200 text-emerald-700',
  ];

  const getPlanColor = (plan: string) => {
    if (!plan) {
      return 'bg-gray-100 text-gray-700';
    }

    // generate stable index from plan name
    const hash = plan
      .split('')
      .reduce(
        (acc, char) => acc + char.charCodeAt(0),
        0
      );

    return planColorPalette[
      hash % planColorPalette.length
    ];
  };

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
                Subscribers
              </h1>

              <p className="text-muted-foreground">
                Manage subscribers and plans
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">

            {/* SEARCH */}

            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

              <Input
                placeholder="Search subscriber..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                className="pl-10"
              />
            </div>

            {/* PLAN FILTER */}

            <select
              value={selectedPlan}
              onChange={(e) =>
                setSelectedPlan(
                  e.target.value
                )
              }
              className="border rounded-md px-3 py-2 text-sm min-w-[180px] bg-background"
            >
              {plans.map((plan) => (
                <option
                  key={plan}
                  value={plan}
                >
                  {plan === 'ALL'
                    ? 'Filter by Plan'
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
                Subscribers
              </CardTitle>

              <CardDescription>
                {loading
                  ? 'Loading subscribers...'
                  : `${filteredSubscribers.length} subscriber(s) found`}
              </CardDescription>
            </div>
            {/* LIMIT DROPDOWN */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                >
                  Show: {limit}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {PAGE_LIMIT_OPTIONS.map(
                  (option) => (
                    <DropdownMenuItem
                      key={option}
                      onClick={() => {
                        setLimit(
                          option === 'All'
                            ? 'All'
                            : Number(option)
                        );

                        setPage(1);
                      }}
                    >
                      {option}
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>

          </CardHeader>

          <CardContent>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b">

                    <th className="text-left py-3 px-4">
                      Subscriber ID
                    </th>

                    <th className="text-left py-3 px-4">
                      Subscriber
                    </th>

                    <th className="text-left py-3 px-4">
                      Contact
                    </th>

                    <th className="text-left py-3 px-4">
                      Plan
                    </th>

                    <th className="text-left py-3 px-4">
                      Start Date
                    </th>

                    <th className="text-left py-3 px-4">
                      Expiry Date
                    </th>

                    <th className="text-right py-3 px-4">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {loading ? (

                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-8"
                      >
                        Loading...
                      </td>
                    </tr>

                  ) : filteredSubscribers.length === 0 ? (

                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No subscribers found
                      </td>
                    </tr>

                  ) : (

                    filteredSubscribers.map(
                      (sub) => (

                        <tr
                          key={sub.id}
                          className="border-b hover:bg-muted/40"
                        >

                          <td className="py-4 px-4 font-medium">
                            {sub.tenantId}
                          </td>

                          <td className="py-4 px-4">

                            <p className="font-medium">
                              {
                                sub.companyName
                              }
                            </p>

                            {sub.isVerified && (
                              <p className="text-sm text-primary flex items-center gap-1 mt-1">
                                <CheckCircle className="w-4 h-4" />
                                Verified
                              </p>
                            )}

                          </td>

                          <td className="py-4 px-4 text-sm">

                            <p>
                              {
                                sub.contact
                                  .email
                              }
                            </p>

                            <p className="text-muted-foreground">
                              {
                                sub.contact
                                  .phone
                                  .code
                              }{' '}
                              {
                                sub.contact
                                  .phone
                                  .number
                              }
                            </p>

                          </td>

                          <td className="py-4 px-4">

                            <Badge
                              className={getConsistentBadgeColor(
                                sub.plan
                              )}
                            >
                              {sub.plan}
                            </Badge>

                          </td>

                          <td className="py-4 px-4 text-sm">
                            {formatDate(
                              sub.startDate
                            )}
                          </td>

                          <td className="py-4 px-4 text-sm">
                            {formatDate(
                              sub.expiryDate
                            )}
                          </td>

                          <td className="py-4 px-4 text-right">
                            <Link href={`/root/subscribers/${sub.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                          </td>

                        </tr>
                      )
                    )
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
                  Prev
                </Button>

                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    size="sm"
                    variant={page === i + 1 ? 'default' : 'outline'}
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
                  Next
                </Button>
              </div>

            </div>

          </CardContent>

        </Card>

      </div>
    </AdminProvider>
  );
}