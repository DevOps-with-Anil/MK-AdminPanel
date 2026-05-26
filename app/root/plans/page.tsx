
'use client';

/* =========================================================
 * IMPORTS
 * =======================================================*/

import {
  useState,
  useEffect,
  useCallback
} from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

import { useAdmin } from '@/contexts/AdminContext';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';

import {
  Plus,
  Edit2,
  Trash2,
  MoreVertical,
  CreditCard
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';

import {
  getPlans,
  deleteEntity
} from '@/services/auth.service';

import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { AppMessage } from '@/components/common/AppMessage';
import { useAppMessage } from '@/hooks/ui/useAppMessage';

/* =========================================================
 * TYPES
 * =======================================================*/

/**
 * Plan interface
 */
interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: 'MONTHLY' | 'YEARLY';
  features: string[];
  subscribers: number;
  status: 'active' | 'inactive';
}

/* =========================================================
 * PAGE COMPONENT
 * =======================================================*/

export default function PlansPage() {

  /* =====================================================
   * CONTEXTS
   * ===================================================*/

  const { t } = useAdmin();
  const router = useRouter();

  /* =====================================================
   * STATE
   * ===================================================*/

  /**
   * Plans list
   */
  const [plans, setPlans] =
    useState<Plan[]>([]);

  /**
   * Page loading state
   */
  const [loading, setLoading] =
    useState(true);

  /**
   * Pagination state
   */
  const [page, setPage] =
    useState(1);

  const [limit, setLimit] =
    useState<number | 'All'>(10);

  const [totalPages, setTotalPages] =
    useState(1);

  /**
   * Search state
   */
  const [search, setSearch] =
    useState('');

  const [
    debouncedSearch,
    setDebouncedSearch
  ] = useState('');

  /**
   * Delete confirmation dialog state
   */
  const [
    confirmDialog,
    setConfirmDialog
  ] = useState({
    open: false,

    title: '',

    description: '',

    confirmText: '',

    loading: false,

    onConfirm: () => { }
  });

  /**
   * Global app message hook
   */
  const {
    message,
    type,
    visible,
    showMessage,
    clearMessage
  } = useAppMessage();

  /* =====================================================
   * SEARCH DEBOUNCE
   * ===================================================*/

  useEffect(() => {

    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);

  }, [search]);

  /* =====================================================
   * FETCH PLANS
   * ===================================================*/

  const fetchPlans = useCallback(
    async () => {
      try {

        setLoading(true);

        /**
         * If limit is "All"
         * send 0 to backend
         */
        const fetchLimit =
          limit === 'All'
            ? 0
            : limit;

        const res = await getPlans({
          page,
          limit: fetchLimit,
          search: debouncedSearch
        });

        /**
         * Format API response
         */
        const formatted: Plan[] =
          res?.data?.map(
            (r: any) => ({
              id: r._id,

              name: r.name ?? '',

              description:
                r.description ?? '',

              price: r.price ?? 0,

              currency:
                r.currency ?? 'USD',

              duration:
                r.duration ??
                'MONTHLY',

              features:
                r.modules ?? [],

              subscribers:
                r.assignedUserCount ??
                0,

              status:
                r.status === 'ACTIVE'
                  ? 'active'
                  : 'inactive'
            })
          ) || [];

        setPlans(formatted);

        setTotalPages(
          res?.meta?.totalPages ?? 1
        );

      } catch (err) {

        console.error(
          'Fetch plans error',
          err
        );

      } finally {
        setLoading(false);
      }
    },

    [page, limit, debouncedSearch]
  );

  /**
   * Fetch plans on dependency change
   */
  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  /* =====================================================
   * DELETE PLAN
   * ===================================================*/

  const handleDelete = async (id: string) => {

    try {

      /**
       * Enable dialog loader
       */
      setConfirmDialog((prev) => ({
        ...prev,
        loading: true
      }));

      /* ===============================================
         DELETE PLAN API
      ================================================ */

      const res = await deleteEntity(
        'plan',
        id
      );

      const isSuccess =
        res?.status === 200;

      /* ===============================================
         SUCCESS
      ================================================ */

      if (isSuccess) {

        /**
         * Remove deleted plan
         */
        setPlans((prev) =>
          prev.filter(
            (p) =>
              p.id !== id
          )
        );

        showMessage(
          res?.message ||
          'Plan deleted successfully',
          'success'
        );

      } else {

        showMessage(
          res?.message ||
          'Failed to delete plan',
          'danger'
        );
      }

    } catch (err) {

      console.error(
        'Delete plan error:',
        err
      );

      showMessage(
        'Something went wrong while deleting the plan',
        'danger'
      );

    } finally {

      /**
       * Close dialog
       */
      setConfirmDialog((prev) => ({
        ...prev,
        open: false,
        loading: false
      }));
    }
  };

  /* =====================================================
   * OPEN DELETE CONFIRMATION
   * ===================================================*/

  const openDeleteDialog = (
    id: string,
    planName: string
  ) => {


    setConfirmDialog({
      open: true,

      title:
        `Delete Plan - ${planName}`,

      description:
        'Are you sure you want to delete this plan? This action cannot be undone.',

      confirmText: 'Delete Plan',

      loading: false,

      onConfirm: () => handleDelete(id)
    });
  };

  /* =====================================================
   * VIEW MODULES PAGE
   * ===================================================*/

  const handleViewModules = (
    planId: string
  ) => {

    if (!planId) {
      alert('Plan ID missing');
      return;
    }

    router.push(
      `/root/plans/modules/${planId}`
    );
  };

  /* =====================================================
   * SUMMARY STATS
   * ===================================================*/

  /**
   * Total revenue
   */
  const totalRevenue =
    plans.reduce(
      (sum, p) =>
        sum +
        p.price * p.subscribers,
      0
    );

  /**
   * Total subscribers
   */
  const totalSubscribers =
    plans.reduce(
      (sum, p) =>
        sum + p.subscribers,
      0
    );

  /* =====================================================
   * UI
   * ===================================================*/

  return (
    <div className="space-y-6">

      {/* =================================================
          PAGE HEADER
      ================================================== */}

      <div
        className="
          flex items-center
          justify-between
        "
      >

        {/* Left section */}
        <div
          className="
            flex items-start gap-4
          "
        >

          <CreditCard
            className="
              text-primary
              w-7 h-7 mt-1
            "
          />

          <div>

            <h1
              className="
                text-xl font-medium
              "
            >
              {t(
                'translate.plans_title'
              )}
            </h1>

            <p
              className="
                text-muted-foreground
              "
            >
              {t(
                'translate.plans_subtitle'
              )}
            </p>

          </div>
        </div>

        {/* Create new plan */}
        <Link href="/root/plans/new">

          <Button className="gap-2">

            <Plus className="w-4 h-4" />

            {t(
              'translate.plans_new_plan'
            )}

          </Button>
        </Link>
      </div>

      {/* =================================================
          LOADING STATE
      ================================================== */}

      {loading ? (

        <p
          className="
            text-center
            text-muted-foreground
          "
        >
          {t(
            'translate.common_loading'
          ) || 'Loading...'}
        </p>

      ) : plans.length === 0 ? (

        /* =============================================
            EMPTY STATE
        ============================================== */

        <div
          className="
            flex justify-center
            items-center py-20
          "
        >

          <Card
            className="
              w-full max-w-md
              text-center
            "
          >

            <CardContent className="pt-6">

              <p
                className="
                  text-lg font-medium
                "
              >
                {t(
                  'translate.no_data'
                ) || 'No Plans Found'}
              </p>

              <p
                className="
                  text-sm
                  text-muted-foreground
                  mt-2
                "
              >
                {
                  t(
                    'translate.no_data_description'
                  ) ||
                  'No plans are available. Create a new plan to get started.'
                }
              </p>

            </CardContent>
          </Card>
        </div>

      ) : (

        /* =============================================
            PLAN LIST
        ============================================== */

        <div
          className="
            grid grid-cols-1
            md:grid-cols-3 gap-6
          "
        >

          {plans.map((plan) => (

            <Card
              key={plan.id}
              className="
                flex flex-col
              "
            >

              {/* =========================================
                  CARD HEADER
              ========================================== */}

              <CardHeader>

                <div
                  className="
                    flex justify-between
                  "
                >

                  {/* Plan details */}
                  <div>

                    <CardTitle
                      className="
                        text-2xl
                      "
                    >
                      {plan.name}
                    </CardTitle>

                    <CardDescription
                      className="
                        mt-1 line-clamp-3
                      "
                    >
                      {plan.description}
                    </CardDescription>

                    {/* Price */}
                    <div
                      className="
                        mt-2 flex gap-2
                      "
                    >

                      <span
                        className="
                          font-bold
                        "
                      >
                        {plan.currency}
                        {' '}
                        {plan.price}
                      </span>

                      <span
                        className="
                          text-sm
                          text-muted-foreground
                        "
                      >
                        {t(
                          `translate.plans_interval_${plan.duration.toLowerCase()}`
                        )}
                      </span>
                    </div>
                  </div>

                  {/* =====================================
                      ACTION MENU
                  ====================================== */}

                  <DropdownMenu>

                    <DropdownMenuTrigger asChild>

                      <Button
                        size="icon"
                        variant="ghost"
                      >
                        <MoreVertical
                          className="
                            w-4 h-4
                          "
                        />
                      </Button>

                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">

                      {/* Edit */}
                      <DropdownMenuItem asChild>

                        <Link
                          href={`/root/plans/edit/${plan.id}`}
                        >

                          <Edit2
                            className="
                              w-4 h-4 mr-2
                            "
                          />

                          {t(
                            'translate.plans_edit'
                          )}

                        </Link>

                      </DropdownMenuItem>

                      {/* Delete */}
                      <DropdownMenuItem
                        className="
                          text-destructive
                        "
                        onClick={() =>
                          openDeleteDialog(
                            plan.id,
                            plan.name
                          )
                        }
                      >

                        <Trash2
                          className="
                            w-4 h-4 mr-2
                          "
                        />

                        {t(
                          'translate.plans_delete'
                        )}

                      </DropdownMenuItem>

                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              {/* =========================================
                  CARD CONTENT
              ========================================== */}

              <CardContent
                className="
                  flex flex-col
                  justify-between
                  flex-1 gap-4
                "
              >

                {/* Footer */}
                <div
                  className="
                    flex justify-between
                    items-center
                    pt-4 border-t
                  "
                >

                  {/* Status */}
                  <Badge
                    className={
                      plan.status === 'active'
                        ? ''
                        : `
                          bg-red-100
                          text-gray-600
                          border-red-300
                        `
                    }
                  >
                    {t(
                      `translate.plans_${plan.status}`
                    )}
                  </Badge>

                  {/* View modules */}
                  <Button
                    size="sm"
                    onClick={() =>
                      handleViewModules(
                        plan.id
                      )
                    }
                  >
                    {t(
                      'translate.plans_view_modules'
                    )}
                  </Button>

                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* =================================================
          DELETE CONFIRMATION DIALOG
      ================================================== */}

      <ConfirmDialog
        open={confirmDialog.open}

        title={confirmDialog.title}

        description={
          confirmDialog.description
        }

        confirmText={
          confirmDialog.confirmText
        }

        loading={confirmDialog.loading}

        variant="destructive"

        onCancel={() =>
          setConfirmDialog((prev) => ({
            ...prev,
            open: false
          }))
        }

        onConfirm={
          confirmDialog.onConfirm
        }
      />

      {/* =================================================
          GLOBAL APP MESSAGE
      ================================================== */}

      <AppMessage
        visible={visible}
        message={message}
        type={type}
        onClose={clearMessage}
      />

    </div>
  );
}