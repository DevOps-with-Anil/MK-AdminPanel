'use client';

import { useRouter } from 'next/navigation';
import { AdminProvider, useAdmin } from '@/contexts/AdminContext';
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

export default function ModulesPageContent() {

    const { t } = useAdmin();
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

    const [cancelLoading, setCancelLoading] =
        useState(false);

    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        title: "",
        description: "",
        buttons: [] as {
            label: string;
            variant?: | "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
            loading?: boolean;
            disabled?: boolean;
            onClick: () => void;
        }[],
    });

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
    }, [params?.id, t]);
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

    useEffect(() => {
        fetchPlans();
    }, [fetchPlans, t]);

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

    // const handleSelectPlan = useCallback(async (planId: string) => {
    //     if (subscription?.planId?._id === planId) return;

    //     try {
    //         setUpdatePlanLoading(true);
    //         const tenantId = params?.id as string;
    //         const res = await updateTenantPlan({
    //             tenantId,
    //             newPlanId: planId,
    //         });
    //         if (![200, 201].includes(res?.status)) {
    //             showMessage(res?.message || 'Failed to update subscription', 'danger');
    //             return;
    //         }
    //         setSubscriptionModalOpen(false);
    //         showMessage(res?.message || 'Subscription updated successfully', 'success');
    //         const updated = await getTenantPlan(tenantId);
    //         if (updated?.data) {
    //             setSubscription(updated.data);
    //         }
    //     } catch (err) {
    //         console.error(err);
    //         showMessage('Failed to update subscription', 'danger');
    //     } finally {
    //         setUpdatePlanLoading(false);
    //     }
    // }, [subscription?.planId?._id, params?.id, t]);

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

    const openCancelSubscriptionDialog = () => {
        setConfirmDialog({
            open: true,
            title: t("translate.cancel_subscription_title"),
            description: t("translate.cancel_subscription_description"),
            buttons: [
                {
                    label: t("translate.cancel"),
                    variant: "outline",
                    onClick: () =>
                        setConfirmDialog((prev) => ({
                            ...prev,
                            open: false,
                        })),
                },
                {
                    label: t("translate.confirm_cancel_subscription"),
                    variant: "destructive",
                    onClick: handleConfirmCancel,
                },
            ],
        });
    };

    const handleConfirmCancel = async () => {
        try {
            setCancelLoading(true);
            const res = await cancelTenantPlan({
                tenantId: params?.id as string,
            });
            const isSuccess = res?.status === 201;
            if (isSuccess) {
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
                <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                        <div className="flex items-center gap-4">
                            <Link href="/root/subscribers" className="flex items-center gap-2">
                                <ArrowLeft className="w-6 h-6 text-primary cursor-pointer" />
                            </Link>

                            <div>
                                <CardTitle>
                                    {t("translate.subscription_overview")} : {subscription?.tenantId?.companyName}
                                </CardTitle>

                                <CardDescription>
                                    {t("translate.subscription_active_plan_description")}
                                </CardDescription>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">

                            <Button
                                onClick={handleUpdateSubscription}
                                size="sm"
                                className="min-w-[145px] h-9 text-sm"
                            >
                                {t("translate.subscription_update_subscription")}
                            </Button>

                            <Button
                                variant="destructive"
                                onClick={openCancelSubscriptionDialog}
                                size="sm"
                                className="min-w-[145px] h-9 text-sm"
                            >
                                {t("translate.subscription_cancel_subscription")}
                            </Button>

                            <Button
                                variant="secondary"
                                onClick={handleOpenHistoryModal}
                                size="sm"
                                className="min-w-[145px] h-9 text-sm"
                            >
                                {t("translate.subscription_history")}
                            </Button>

                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div className="border rounded-2xl p-5">
                            <p className="text-sm text-muted-foreground mb-1">
                                {t("translate.subscription_active_plan_name")}
                            </p>
                            <p className="font-semibold text-base">
                                {getPlanName(subscription?.planName)}
                            </p>
                        </div>

                        <div className="border rounded-2xl p-5">
                            <p className="text-sm text-muted-foreground mb-1">
                                {t("translate.subscription_start_date")}
                            </p>
                            <p className="font-medium">
                                {formatDate(subscription?.startDate)}
                            </p>
                        </div>

                        <div className="border rounded-2xl p-5">
                            <p className="text-sm text-muted-foreground mb-1">
                                {t("translate.subscription_expiry_date")}
                            </p>
                            <p className="font-medium">
                                {formatDate(subscription?.expiryDate)}
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

                            <div>
                                <CardTitle>
                                    {t("translate.subscription_plan_modules")}
                                </CardTitle>

                                <CardDescription>
                                    {t("translate.subscription_plan_modules_desc")}
                                </CardDescription>
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

                                <div className="relative w-full sm:w-72">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                                    <Input
                                        placeholder={t("translate.subscription_search_modules")}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            {t("translate.subscription_show")}: {limit}
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end">
                                        {PAGE_LIMIT_OPTIONS.map((option) => (
                                            <DropdownMenuItem
                                                key={option}
                                                onClick={() => {
                                                    const newLimit =
                                                        option === 'All' ? 'All' : Number(option);
                                                    setLimit(newLimit);
                                                    setPage(1);
                                                }}
                                            >
                                                {option}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>

                            </div>

                        </CardHeader>

                        <CardContent>

                            {!filteredModules.length ? (
                                <div className="border rounded-2xl py-14 text-center bg-muted/30">
                                    <p className="text-muted-foreground">
                                        {t("translate.subscription_no_modules_found")}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">

                                    {filteredModules.map((module, index) => (
                                        <div
                                            key={`${module.moduleKey}-${index}`}
                                            onClick={() => setSelectedModule(module.moduleKey)}
                                            className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedModule === module.moduleKey
                                                ? 'border-primary bg-primary/5'
                                                : ''
                                                }`}
                                        >

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

                                            <div className="flex justify-between mt-3">

                                                <div className="flex gap-2 flex-wrap">
                                                    <Badge variant="secondary">
                                                        {module.actions?.length || 0}{' '}
                                                        {t("translate.subscription_permissions")}
                                                    </Badge>

                                                    <Badge className="bg-primary text-white">
                                                        {t("translate.subscription_active")}
                                                    </Badge>
                                                </div>

                                                {selectedModule === module.moduleKey && (
                                                    <CheckCircle className="w-5 h-5 text-primary" />
                                                )}

                                            </div>

                                        </div>
                                    ))}

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
                                {t("translate.subscription_prev")}
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
                                {t("translate.subscription_next")}
                            </Button>

                        </div>

                    </Card>
                </div>

                {/* RIGHT */}
                <div>
                    <Card className="sticky top-4">

                        <CardHeader>
                            <CardTitle>
                                {t("translate.subscription_module_permissions")}
                            </CardTitle>

                            <CardDescription>
                                {t("translate.subscription_module_permissions_desc")}
                            </CardDescription>
                        </CardHeader>

                        <CardContent>

                            {!selectedModuleData ? (
                                <div className="py-10 text-center">
                                    <ShieldCheck className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                                    <p className="text-muted-foreground">
                                        {t("translate.subscription_select_module")}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">

                                    {selectedModuleData.actions.map((action, index) => (
                                        <div
                                            key={`${action.actionKey}-${index}`}
                                            className="flex items-center justify-between border rounded-xl px-3 py-3"
                                        >
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {action.actionName}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {action.actionKey}
                                                </p>
                                            </div>

                                            <Badge
                                                className={
                                                    action.allowed
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-700'
                                                }
                                            >
                                                {action.allowed
                                                    ? t("translate.subscription_allowed")
                                                    : t("translate.subscription_restricted")}
                                            </Badge>
                                        </div>
                                    ))}

                                </div>
                            )}

                        </CardContent>

                    </Card>
                </div>

            </div>

            {/* PLAN MODAL */}
            <Dialog open={subscriptionModalOpen} onOpenChange={setSubscriptionModalOpen}>
                <DialogContent className="max-w-2xl">

                    <DialogHeader>
                        <DialogTitle>
                            {t("translate.subscription_available_plans")}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto">

                        {plansLoading ? (
                            <div className="text-center py-6">
                                {t("translate.subscription_loading_plans")}
                            </div>
                        ) : plans.length === 0 ? (
                            <div className="text-center py-6 text-muted-foreground">
                                {t("translate.subscription_no_plans")}
                            </div>
                        ) : (
                            plans.map((plan) => {

                                const isPlanActive =
                                    subscription?.planId?._id === plan.id;

                                return (
                                    <div key={plan.id} className="border rounded-2xl p-5 space-y-4">

                                        <h3 className="font-semibold text-lg">
                                            {plan.name}
                                        </h3>

                                        <p className="text-sm text-muted-foreground">
                                            {plan.description}
                                        </p>

                                        <div className="text-2xl font-bold">
                                            {plan.currency} {plan.price}
                                        </div>

                                        <Button
                                            className="w-full"
                                            disabled={isPlanActive || updatePlanLoading}
                                            variant={isPlanActive ? 'secondary' : 'default'}
                                        >
                                            {isPlanActive
                                                ? t("translate.subscription_current_plan")
                                                : updatePlanLoading
                                                    ? t("translate.subscription_updating")
                                                    : t("translate.subscription_select_plan")}
                                        </Button>

                                    </div>
                                );
                            })
                        )}

                    </div>

                </DialogContent>
            </Dialog>

            {/* HISTORY MODAL */}
            <Dialog open={historyModalOpen} onOpenChange={setHistoryModalOpen}>
                <DialogContent className="max-w-3xl">

                    <DialogHeader>
                        <DialogTitle>
                            {t("translate.subscription_history_title")}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 max-h-[600px] overflow-y-auto">

                        {historyLoading ? (
                            <div className="py-10 text-center">
                                {t("translate.subscription_loading_history")}
                            </div>
                        ) : subscriptionHistory.length === 0 ? (
                            <div className="py-10 text-center text-muted-foreground">
                                {t("translate.subscription_no_history")}
                            </div>
                        ) : (
                            subscriptionHistory.map((item) => (
                                <Card key={item._id}>
                                    <CardContent className="p-5 space-y-5">

                                        <h3 className="text-lg font-semibold">
                                            {item.planName.en}
                                        </h3>

                                        <Badge>
                                            {item.status}
                                        </Badge>

                                        <h2 className="text-3xl font-bold">
                                            ${item.planId.price}
                                        </h2>

                                    </CardContent>
                                </Card>
                            ))
                        )}

                    </div>

                </DialogContent>
            </Dialog>

            <AppMessage
                visible={visible}
                message={message}
                type={type}
                onClose={clearMessage}
            />

            {/* ================= Confirm Cancel Subscription Dialog ================= */}
            <ConfirmDialog
                open={confirmDialog.open}
                title={confirmDialog.title}
                description={confirmDialog.description}
                buttons={confirmDialog.buttons}
                onCancel={() =>
                    setConfirmDialog((prev) => ({
                        ...prev,
                        open: false,
                    }))
                }
            />
        </div>
    );
}

