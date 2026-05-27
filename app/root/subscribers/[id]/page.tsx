'use client';

import { useRouter } from 'next/navigation';
import { AdminProvider } from '@/contexts/AdminContext';
import {
    useEffect,
    useMemo,
    useState,
    useCallback
} from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    CheckCircle,
    Layers,
    Loader2,
    Plus,
    Search,
    ShieldCheck,
} from 'lucide-react';
import { getTenantPlan } from '@/services/auth.service';
import { getConsistentBadgeColor } from '@/utils/getDynamicBadgeColor';
import { usePagination } from '@/hooks/ui/usePagination';
import { useFeedbackMessage } from '@/hooks/ui/useResponseMessage';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import {

    getPlans,
    updateTenantPlan,
    cancelTenantPlan,
    getTenantPlanHistory

} from '@/services/auth.service';

import { AppMessage } from '@/components/common/AppMessage';
import { useAppMessage } from '@/hooks/ui/useAppMessage';
import { formatDate } from "@/utils/dateFormatter";



/* ================= TYPES ================= */

interface SubscriptionAction {
    actionKey: string;
    actionName: string;
    allowed: boolean;
}

interface SubscriptionModule {
    moduleKey: string;
    moduleName: string;
    actions: SubscriptionAction[];
}

interface tenantdata {
    companyName: string;
    tenantId: string
}

interface SubscriptionPlanRef {
    _id: string;
    price?: number;
}

interface Subscription {
    _id?: string;

    tenantId?: tenantdata,

    planId?: SubscriptionPlanRef;

    planName?: string;

    status?: string;

    startDate?: string;
    expiryDate?: string;

    modules?: SubscriptionModule[];

    createdAt?: string;
    updatedAt?: string;
}

interface SubscriptionPlans {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    type: string;
    features: {
        _id: string;
        moduleKey: string;
        moduleName: string;
    }[];
    subscribers: number;
    status: 'active' | 'inactive';
}

interface SubscriptionAction {
    actionKey: string;
    actionName: string;
    allowed: boolean;
}

interface SubscriptionModule {
    moduleKey: string;
    moduleName: string;
    actions: SubscriptionAction[];
}

interface SubscriptionHistoryItem {
    _id: string;
    tenantId: string;

    planId: {
        _id: string;
        price: number;
    };

    planName: {
        en: string;
        fr: string;
    };

    startDate: string;
    expiryDate: string;

    modules: SubscriptionModule[];

    status:
    | 'ACTIVE'
    | 'CANCELLED'
    | 'EXPIRED'
    | 'PENDING';

    createdAt: string;
    updatedAt: string;

    cancelledAt?: string;

    __v: number;
}


/* ================= COMPONENT ================= */

function ModulesPageContent() {
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [plansLoading, setPlansLoading] = useState(false);
    const [updatePlanLoading, setUpdatePlanLoading] =
        useState(false);
    const router = useRouter();



    const [searchQuery, setSearchQuery] = useState('');

    const [totalPages, setTotalPages] = useState(1);
    const PAGE_LIMIT_OPTIONS = [10, 25, 50, 'All'];
    const { page, setPage, limit, setLimit } = usePagination(10);
    // const { message, type, showMessage, clearMessage } = useFeedbackMessage(3000);

    const { message, type, visible, showMessage, clearMessage } = useAppMessage();



    const [selectedModule, setSelectedModule] = useState<string | null>(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);

    const [subscriptionModalOpen, setSubscriptionModalOpen] =
        useState(false);

    const [subscriptionHistory, setSubscriptionHistory] = useState<
        SubscriptionHistoryItem[]
    >([]);

    const [historyLoading, setHistoryLoading] =
        useState(false);

    const [historyModalOpen, setHistoryModalOpen] =
        useState(false);
    const [plans, setPlans] = useState<SubscriptionPlans[]>([]);
    const [cancelDialogOpen, setCancelDialogOpen] =
        useState(false);
    const [cancelLoading, setCancelLoading] =
        useState(false);

    /* ================= FETCH ================= */

    useEffect(() => {
        if (!params?.id) return;

        const fetchTenantSubscription = async () => {
            try {
                setLoading(true);
                const res = await getTenantPlan(params.id as string);
                if (res?.data) {
                    setSubscription(res.data);
                    // console.log('Subscription Data ', JSON.stringify(subscription));
                }
            } catch (err) {
                console.error('Fetch subscription error', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTenantSubscription();
    }, [params?.id]);
    // ================= FETCH PLANS =================

    const fetchPlans = useCallback(async () => {
        try {
            setPlansLoading(true);

            const res = await getPlans({
                page: 1,
                limit: 100,
                search: '',
            });

            const formatted: SubscriptionPlans[] =
                res?.data?.map((r: any) => ({
                    id: r._id,
                    name: r.name ?? '',
                    description: r.description ?? '',
                    price: r.price ?? 0,
                    currency: r.currency ?? 'USD',
                    type: r.duration ?? 'MONTHLY',
                    features: r.modules ?? [],
                    subscribers: r.assignedUserCount ?? 0,
                    status:
                        r.status === 'ACTIVE'
                            ? 'active'
                            : 'inactive',
                })) || [];

            setPlans(formatted);

        } catch (err) {
            console.error('Fetch plans error', err);
        } finally {
            setPlansLoading(false);
        }
    }, []);

    /* ================= HELPERS ================= */

    const getPlanName = (
        value?: Subscription['planName']
    ) => {
        if (!value) return '-';

        if (typeof value === 'string') {
            return value;
        }
        return (
            value || '-'
        );
    };

    // const getCurrentPlanId = () => {
    //     const planId = subscription?.planId?._id;

    //     if (!planId) return null;

    //     if (typeof planId === 'string') return planId;

    //     return planId._id || null;
    // };

    // const currentPlanId = useMemo(() => {
    //     const planId = subscription?.planId?._id;

    //     if (!planId) return null;

    //     if (typeof planId === 'string') return planId;

    //     return planId._id || null;
    // }, [subscription?.planId?._id]);


    // const isCurrentPlan = useCallback(
    //     (planId: string) => currentPlanId === planId,
    //     [currentPlanId]
    // );
    /* ================= FILTER MODULES ================= */

    const filteredModules = useMemo(() => {
        if (!subscription?.modules) return [];

        const query = searchQuery.toLowerCase();

        return subscription.modules.filter((module) => {
            const name = module.moduleName?.toLowerCase() || '';
            const key = module.moduleKey?.toLowerCase() || '';

            return name.includes(query) || key.includes(query);
        });
    }, [subscription?.modules, searchQuery]);

    const selectedModuleData =
        filteredModules.find(
            (module) =>
                module.moduleKey ===
                selectedModule
        );



    // ================= HANDLE SELECT PLAN =================
    const handleSelectPlan = useCallback(async (planId: string) => {
        if (subscription?.planId?._id === planId) return;

        try {
            setUpdatePlanLoading(true);

            const tenantId = params?.id as string;

            const res = await updateTenantPlan({
                tenantId,
                newPlanId: planId,
            });

            if (![200, 201].includes(res?.status)) {
                showMessage(res?.message || 'Failed to update subscription', 'danger');
                return;
            }

            setSubscriptionModalOpen(false);
            setCancelDialogOpen(false);

            showMessage(res?.message || 'Subscription updated successfully', 'success');

            const updated = await getTenantPlan(tenantId);

            if (updated?.data) {
                setSubscription(updated.data);
            }
        } catch (err) {
            console.error(err);
            showMessage('Failed to update subscription', 'danger');
        } finally {
            setUpdatePlanLoading(false);
        }
    }, [subscription?.planId?._id, params?.id]);

    const handleUpdateSubscription = async () => {
        // console.log('Update subscription clicked');
        setSubscriptionModalOpen(true);
        if (plans.length === 0) {
            await fetchPlans();
        }
    };


    const fetchSubscriptionHistory = async () => {
        try {
            setHistoryLoading(true);

            const res = await getTenantPlanHistory(
                params?.id as string
            );

            // console.log(
                'Subscription history response:',
                JSON.stringify(res)
            );

            setSubscriptionHistory(
                res?.data || []
            );

        } catch (error) {

            console.error(
                'Failed to fetch subscription history:',
                error
            );

            setSubscriptionHistory([]);

        } finally {

            setHistoryLoading(false);
        }
    };

    const handleOpenHistoryModal = async () => {
        setHistoryModalOpen(true);

        await fetchSubscriptionHistory();
    };


    function handleCancelPlan() {
        setCancelDialogOpen(true);
    }

    const handleConfirmCancel = async () => {
        try {
            setCancelLoading(true);

            const res = await cancelTenantPlan({
                tenantId: params?.id as string,
            });

            const isSuccess = res?.status === 201;

            if (isSuccess) {
                setCancelDialogOpen(false);

                showMessage(
                    res?.message || "Subscription cancelled successfully",
                    "danger" // you can also use "danger" if you want red styling for cancel
                );

                setTimeout(() => {
                    router.replace("/root/subscribers");
                }, 1500);
            } else {
                showMessage(
                    res?.message || "Failed to cancel subscription",
                    "danger"
                );
            }
        } catch (err) {
            console.error("Cancel subscription error", err);

            showMessage("Failed to cancel subscription", "danger");
        } finally {
            setCancelLoading(false);
        }
    };



    /* ================= LOADING ================= */

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                Loading subscription...
            </div>
        );
    }
    /* ================= UI ================= */

    return (
        <div className="space-y-6">
            {/* PLAN OVERVIEW */}
            <Card>
                {/* PLAN OVERVIEW */}
                <CardHeader >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Link href="/root/subscribers" className="flex items-center gap-2">
                                <ArrowLeft className="w-6 h-6 text-primary cursor-pointer" />
                            </Link>

                            {/* LEFT */}
                            <div>
                                <CardTitle>
                                    Subscription Overview : {subscription?.tenantId?.companyName}
                                </CardTitle>
                                <CardDescription>
                                    Active plan details and
                                    module access
                                </CardDescription>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">

                            {/* UPDATE SUBSCRIPTION */}
                            <Button
                                onClick={handleUpdateSubscription}
                                size="sm"
                                className="min-w-[145px] h-9 text-sm"
                            >
                                Update Subscription
                            </Button>

                            {/* CANCEL SUBSCRIPTION */}
                            <Button
                                variant="destructive"
                                onClick={handleCancelPlan}
                                size="sm"
                                className="min-w-[145px] h-9 text-sm"
                            >
                                Cancel Subscription
                            </Button>

                            <ConfirmDialog
                                open={cancelDialogOpen}
                                title="Cancel Subscription"
                                description="Are you sure you want to cancel this subscription? This action cannot be undone."
                                confirmText="Confirm Cancel Subscription"
                                loading={cancelLoading}
                                variant="destructive"
                                onCancel={() => setCancelDialogOpen(false)}
                                onConfirm={handleConfirmCancel}
                            />



                            {/* SUBSCRIPTION HISTORY */}
                            <Button
                                variant="secondary"
                                onClick={handleOpenHistoryModal}
                                size="sm"
                                className="min-w-[145px] h-9 text-sm"
                            >
                                Subscription History
                            </Button>



                        </div>
                    </div>

                    {/* COMPANY INFO */}
                    {/* <div className="pt-4">
                        <div>
                            <h1 className="text-2xl font-semibold text-foreground leading-tight">
                                {subscription?.tenantId?.companyName} 
                            </h1>

                            <div className="text-md font-semibold text-muted-foreground mt-1">
                                Tenant ID: {subscription?.tenantId?.tenantId}
                            </div>
                        </div>

                    </div> */}

                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* PLAN NAME */}
                        <div className="border rounded-2xl p-5">
                            <p className="text-sm text-muted-foreground mb-1">
                                Active Plan Name
                            </p>
                            <p className="font-semibold text-base">
                                {getPlanName(
                                    subscription?.planName
                                )}
                            </p>
                        </div>
                        {/* START DATE */}
                        <div className="border rounded-2xl p-5">
                            <p className="text-sm text-muted-foreground mb-1">
                                Start Date
                            </p>

                            <p className="font-medium">
                                {formatDate(
                                    subscription?.startDate
                                )}
                            </p>
                        </div>

                        {/* EXPIRY DATE */}
                        <div className="border rounded-2xl p-5">
                            <p className="text-sm text-muted-foreground mb-1">
                                Expiry Date
                            </p>

                            <p className="font-medium">
                                {formatDate(
                                    subscription?.expiryDate
                                )}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT */}
                <div className="lg:col-span-2">

                    <Card>
                        <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            {/* LEFT SIDE MODULES LIST */}
                            <div>
                                <CardTitle>
                                    Plan Modules
                                </CardTitle>

                                <CardDescription>
                                    Available modules and permissions
                                    for this subscription
                                </CardDescription>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                {/* SEARCH */}
                                <div className="relative w-full sm:w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                                    <Input
                                        placeholder="Search modules..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(
                                                e.target.value
                                            )
                                        }
                                        className="pl-10"
                                    />
                                </div>
                                {/* LIMIT */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full sm:w-auto"
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
                                                        const newLimit:
                                                            | number
                                                            | 'All' =
                                                            option === 'All'
                                                                ? 'All'
                                                                : Number(option);

                                                        setLimit(newLimit);
                                                        setPage(1);
                                                    }}
                                                >
                                                    {option}
                                                </DropdownMenuItem>
                                            )
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                            </div>

                        </CardHeader>

                        <CardContent>

                            {!filteredModules.length ? (
                                <div className="border rounded-2xl py-14 text-center bg-muted/30">
                                    <p className="text-muted-foreground">
                                        No modules found
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 xl:grid-cols-1 gap-4">

                                    {filteredModules.map(
                                        (
                                            module,
                                            index
                                        ) => (
                                            <div
                                                key={`${module.moduleKey}-${index}`}
                                                onClick={() =>
                                                    setSelectedModule(module.moduleKey)
                                                }
                                                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedModule === module.moduleKey
                                                    ? 'border-primary bg-primary/5'
                                                    : ''
                                                    }`}
                                            >
                                                {/* TOP */}
                                                <div className="flex justify-between">
                                                    <div>
                                                        <h3 className="font-semibold">
                                                            {module.moduleName}
                                                        </h3>

                                                        <p className="text-sm text-muted-foreground">
                                                            {module.moduleKey}
                                                        </p>
                                                    </div>

                                                </div>

                                                {/* BOTTOM */}
                                                <div className="flex justify-between mt-3">
                                                    <div className="flex gap-2 flex-wrap">
                                                        <Badge variant="secondary">
                                                            {module.actions?.length || 0}{' '}
                                                            Permissions
                                                        </Badge>

                                                        <Badge className="bg-primary text-white border-green-200">
                                                            Active
                                                        </Badge>
                                                    </div>

                                                    {selectedModule ===
                                                        module.moduleKey && (
                                                            <CheckCircle className="w-5 h-5 text-primary" />
                                                        )}
                                                </div>
                                            </div>
                                        )
                                    )}

                                </div>
                            )}

                        </CardContent>
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

                    </Card>
                </div>

                {/* RIGHT SIDE MODULE'S PERMISSIONS */}
                <div>
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle>
                                Module Permissions
                            </CardTitle>

                            <CardDescription>
                                Detailed actions for
                                selected module
                            </CardDescription>
                        </CardHeader>

                        <CardContent>

                            {!selectedModuleData ? (
                                <div className="py-10 text-center">
                                    <ShieldCheck className="w-10 h-10 mx-auto text-muted-foreground mb-3" />

                                    <p className="text-muted-foreground">
                                        Select a module to
                                        view permissions
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">

                                    {selectedModuleData.actions.map(
                                        (
                                            action,
                                            index
                                        ) => (
                                            <div
                                                key={`${action.actionKey}-${index}`}
                                                className="flex items-center justify-between border rounded-xl px-3 py-3"
                                            >

                                                <div className="pr-3">
                                                    <p className="text-sm font-medium">
                                                        {
                                                            action.actionName
                                                        }
                                                    </p>

                                                    <p className="text-xs text-muted-foreground">
                                                        {
                                                            action.actionKey
                                                        }
                                                    </p>
                                                </div>

                                                <Badge
                                                    className={
                                                        action.allowed
                                                            ? 'bg-green-100 text-green-800 border-green-200'
                                                            : 'bg-red-100 text-red-700 border-red-200'
                                                    }
                                                >
                                                    {action.allowed
                                                        ? 'Allowed'
                                                        : 'Restricted'}
                                                </Badge>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

            </div>

            {/* MODEL TO UPDATE SUBSCRIPTION PLAN */}
            <Dialog
                open={subscriptionModalOpen}
                onOpenChange={setSubscriptionModalOpen}
            >
                <DialogContent className="max-w-2xl">

                    <DialogHeader>
                        <DialogTitle>
                            Available Subscription Plans
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto">

                        {plansLoading ? (
                            <div className="text-center py-6">
                                Loading plans...
                            </div>
                        ) : plans.length === 0 ? (
                            <div className="text-center py-6 text-muted-foreground">
                                No plans available
                            </div>
                        ) : (
                            (() => {

                                return plans.map((plan) => {

                                    const isPlanActive = subscription?.planId?._id === plan.id

                                    return (
                                        <div
                                            key={plan.id}
                                            className={`border rounded-2xl p-5 space-y-4 transition ${isPlanActive
                                                ? 'border-primary bg-primary/5'
                                                : ''
                                                }`}
                                        >
                                            {/* HEADER */}
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className="font-semibold text-lg">
                                                        {plan.name}
                                                    </h3>

                                                    <p className="text-sm text-muted-foreground">
                                                        {plan.description}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* PRICE */}
                                            <div className="text-2xl font-bold">
                                                {plan.currency} {plan.price}
                                                <span className="text-2xl font-bold">
                                                    /{plan.type.charAt(0).toUpperCase() + plan.type.slice(1).toLowerCase()}
                                                </span>
                                            </div>

                                            {/* BUTTON */}
                                            <Button
                                                className="w-full"
                                                disabled={isPlanActive || updatePlanLoading}
                                                variant={isPlanActive ? 'secondary' : 'default'}
                                                onClick={() => {
                                                    if (isPlanActive) return;
                                                    handleSelectPlan(plan.id);
                                                }}
                                            >
                                                {isPlanActive ? (
                                                    <>
                                                        <CheckCircle className="w-4 h-4 mr-2" />
                                                        Current Plan
                                                    </>
                                                ) : updatePlanLoading ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Updating...
                                                    </>
                                                ) : (
                                                    'Select Plan'
                                                )}
                                            </Button>


                                        </div>
                                    );
                                });
                            })()
                        )}
                    </div>

                </DialogContent>
            </Dialog>

            {/* ================= SUBSCRIPTION HISTORY MODAL ================= */}
            <Dialog
                open={historyModalOpen}
                onOpenChange={setHistoryModalOpen}
            >
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>
                            Subscription History
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">

                        {historyLoading ? (
                            <div className="py-10 text-center">
                                Loading history...
                            </div>
                        ) : subscriptionHistory.length === 0 ? (
                            <div className="py-10 text-center text-muted-foreground">
                                No subscription history found
                            </div>
                        ) : (
                            subscriptionHistory.map((item) => {

                                const isActive =
                                    item.status === 'ACTIVE';

                                return (
                                    <Card
                                        key={item._id}
                                        className={`rounded-2xl border ${isActive
                                            ? 'border-primary bg-primary/5'
                                            : ''
                                            }`}
                                    >
                                        <CardContent className="p-5 space-y-5">

                                            {/* HEADER */}
                                            <div className="flex items-start justify-between gap-4">

                                                <div>
                                                    <h3 className="text-lg font-semibold">
                                                        {item.planName.en}
                                                    </h3>

                                                    <p className="text-sm text-muted-foreground">
                                                        Plan ID:
                                                        {' '}
                                                        {item.planId._id}
                                                    </p>
                                                </div>

                                                <Badge
                                                    variant={
                                                        isActive
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {item.status}
                                                </Badge>
                                            </div>

                                            {/* PRICE */}
                                            <div>
                                                <p className="text-sm text-muted-foreground">
                                                    Price
                                                </p>

                                                <h2 className="text-3xl font-bold">
                                                    ${item.planId.price}
                                                </h2>
                                            </div>

                                            {/* DATES */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                                <div className="border rounded-xl p-3">
                                                    <p className="text-sm font-medium">
                                                        Start Date
                                                    </p>

                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {new Date(
                                                            item.startDate
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>

                                                <div className="border rounded-xl p-3">
                                                    <p className="text-sm font-medium">
                                                        Expiry Date
                                                    </p>

                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {new Date(
                                                            item.expiryDate
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>

                                                {item.cancelledAt && (
                                                    <div className="border rounded-xl p-3">
                                                        <p className="text-sm font-medium">
                                                            Cancelled At
                                                        </p>

                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {new Date(
                                                                item.cancelledAt
                                                            ).toLocaleString()}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                        </CardContent>
                                    </Card>
                                );
                            })
                        )}
                    </div>
                </DialogContent>
            </Dialog>


            {/* RIGHT SIDE RESPONSE MESSAGE */}
            <AppMessage
                visible={visible}
                message={message}
                type={type}
                onClose={clearMessage}
            />
        </div>
    );
}

/* ================= EXPORT ================= */

export default function ModulesPage() {
    return (
        <AdminProvider>
            <ModulesPageContent />
        </AdminProvider>
    );
}