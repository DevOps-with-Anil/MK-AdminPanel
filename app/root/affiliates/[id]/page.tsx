'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { useParams } from 'next/navigation';
import {
    useEffect,
    useState,
    useContext,
    useCallback,
} from 'react'; import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Download,
    ExternalLink,
    UploadCloud,
    Loader2,
    CheckCircle,
    Plus,
    Trash2,
    FileText,
    Eye,
    MapPin,
    Globe,
    Phone,
    Mail,
    Building2,
    Settings,
    User,
    KeyRound,
    Upload,
    ImageIcon,
} from 'lucide-react';
import Link from 'next/link';
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { I18nContext } from '@/i18n/provider';
import {
    getTenantById,
    getTenantKYB,
    getKYBDocTypes,
    getPlans,
    cancelTenantPlan,
    updateTenantPlan,
    assignTenantPlan,
    uploadTenantKYB,
    updateLogo
} from '@/services/auth.service';
// import { useFeedbackMessage } from '@/hooks/ui/useResponseMessage';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { getConsistentBadgeColor } from '@/utils/getDynamicBadgeColor';
import { AppMessage } from '@/components/common/AppMessage';
import { useAppMessage } from '@/hooks/ui/useAppMessage';
import { formatDate } from "@/utils/dateFormatter";

// import { DateTimePicker } from "@/components/common/DateTimePicker";
import { ImageCropModal } from "@/components/common/ImageCropModal";
import {
    ZoomIn,
    ZoomOut,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";


type Props = {
    value?: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    min?: string;
    max?: string;
};

export const DateTimePicker = ({
    value,
    onChange,
    disabled,
    min,
    max,
}: Props) => {
    return (
        <Input
            type="datetime-local"
            disabled={disabled}
            value={value || ""}
            min={min}
            max={max}
            onChange={(e) => onChange(e.target.value)}
        />
    );
};



interface KYBDocument {
    type: string;
    files: {
        name: string;
        url: string;
    }[];
    required?: boolean;
}

interface KYBRequest {
    id: string;
    companyName: string;
    email: string;
    phone: string;
    website?: string;
    country?: string;
    submittedAt: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    documents: KYBDocument[];
}

interface LogoForm {
    photo?: File | null;     // new upload
    photoUrl?: string;       // display (server OR preview)
}


/* ================= TYPES ================= */

interface TenantPayload {
    _id: string;
    companyName: any;
    description: any;
    logoUrl?: string;
    contact?: {
        email?: string;
        phone?: { code?: string; number?: string };
    };
    platform?: {
        website?: string;
        adminPanelUrl?: string;
    };
    apiDomains?: string[];
    address?: {
        addressLine1?: string;
        addressLine2: string;
        landmark: string;
        city?: string;
        state?: string;
        country?: string;
        zipCode?: string;
    };
    kybStatus: string;
    currentSubscriptionId?: {
        _id: string;
        planId: string;
        planName: string;
        startDate: string;
        expiryDate: string;
        status: string;
    } | null;
    status: string;
    tenantId: string;
    createdAt: string;
    createdBy: string;
}

interface SubscriptionPlan {
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


/* ================= COMPONENT ================= */

function ViewTenantContent() {
    const params = useParams();
    // const { message, type, showMessage, clearMessage } = useFeedbackMessage(3000);
    const { message, type, visible, showMessage, clearMessage } = useAppMessage();
    const AffiliateId = params.id as string;

    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [plansLoading, setPlansLoading] = useState(false);

    const [subscriptionModalOpen, setSubscriptionModalOpen] =
        useState(false);

    const [cancelDialogOpen, setCancelDialogOpen] =
        useState(false);

    const [cancelLoading, setCancelLoading] =
        useState(false);

    const [updatePlanLoading, setUpdatePlanLoading] =
        useState(false);


    const [uploadDialogOpen, setUploadDialogOpen] =
        useState(false);

    const [selectedDoc, setSelectedDoc] =
        useState<any>(null);

    const [uploadLoading, setUploadLoading] =
        useState(false);

    const [uploadForm, setUploadForm] =
        useState({
            documentNumber: '',
            issueDate: '',
            expiryDate: '',
            files: [] as File[],
        });

    const [previewFiles, setPreviewFiles] = useState<string[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const [zoom, setZoom] = useState(1);


    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    });

    const [dragging, setDragging] = useState(false);

    const [dragStart, setDragStart] = useState({
        x: 0,
        y: 0,
    });

    const [logoForm, setLogoForm] = useState<LogoForm>({
        photo: null,
    });

    const [cropOpen, setCropOpen] = useState(false);
    const [tempImage, setTempImage] = useState<string | null>(null);

    const { locale } = useContext(I18nContext);

    const [tenant, setTenant] = useState<TenantPayload | null>(null);
    const [loading, setLoading] = useState(true);

    const [kybDocuments, setKybDocuments] = useState<any[]>([]);
    const [kybStatus, setKybStatus] = useState<string>('PENDING');

    // ================= DYNAMIC KYB STATE =================

    const [dynamicKYB, setDynamicKYB] = useState<any[]>([]);

    const isKYBLocked =
        tenant?.kybStatus === 'UPLOADED';

    const [previewOpen, setPreviewOpen] = useState(false);


    /* ================= SET DYNAMIC KYB ================= */

    useEffect(() => {
        if (kybDocuments.length > 0) {
            setDynamicKYB(
                kybDocuments.map((doc) => ({
                    ...doc,
                    localFiles: [],
                }))
            );

        }
    }, [kybDocuments]);

    /* ================= HANDLE INPUT CHANGE ================= */

    const handleKYBInputChange = (
        index: number,
        field: string,
        value: string
    ) => {
        setDynamicKYB((prev) =>
            prev.map((doc, i) =>
                i === index
                    ? {
                        ...doc,
                        [field]: value,
                    }
                    : doc
            )
        );
    };

    /* ================= HANDLE FILE CHANGE ================= */

    const handleKYBFileChange = (
        docIndex: number,
        files: FileList | null
    ) => {
        if (!files) return;

        const mappedFiles = Array.from(files).map((file) => ({
            file,
            name: file.name,
            url: URL.createObjectURL(file),
        }));

        setDynamicKYB((prev) =>
            prev.map((doc, index) => {
                if (index !== docIndex) return doc;

                return {
                    ...doc,
                    localFiles: [
                        ...(doc.localFiles || []),
                        ...mappedFiles,
                    ],
                };
            })
        );
    };

    /* ================= REMOVE LOCAL FILE ================= */

    const handleRemoveLocalFile = (
        docIndex: number,
        fileIndex: number
    ) => {
        setDynamicKYB((prev) =>
            prev.map((doc, index) => {
                if (index !== docIndex) return doc;

                return {
                    ...doc,
                    localFiles: doc.localFiles.filter(
                        (_: any, i: number) => i !== fileIndex
                    ),
                };
            })
        );
    };
    /* ================= VALIDATE + SUBMIT DYNAMIC KYB ================= */

    const handleSubmitDynamicKYB = async () => {
        try {
            clearMessage();

            /* ================= VALIDATION ================= */

            for (const doc of dynamicKYB) {
                const hasServerFiles =
                    Array.isArray(doc.files) && doc.files.length > 0;

                const hasLocalFiles =
                    Array.isArray(doc.localFiles) &&
                    doc.localFiles.length > 0;

                const hasAnyFiles = hasServerFiles || hasLocalFiles;

                const hasDocumentNumber =
                    !!doc.documentNumber?.trim();

                const hasIssueDate =
                    !!doc.issueDate;

                const hasExpiryDate =
                    !!doc.expiryDate;

                /* =========================================
                   REQUIRED DOCUMENT
                   -> files required
                   -> document number required
                   -> dates required
                ========================================= */

                if (doc.isRequired) {
                    if (!hasAnyFiles) {
                        showMessage(
                            `${doc.type}: document files are required`,
                            'danger'
                        );

                        return;
                    }

                    if (!hasDocumentNumber) {
                        showMessage(
                            `${doc.type}: document number is required`,
                            'danger'
                        );

                        return;
                    }

                    if (!hasIssueDate || !hasExpiryDate) {
                        showMessage(
                            `${doc.type}: valid dates are required`,
                            'danger'
                        );

                        return;
                    }
                }

                /* =========================================
                   OPTIONAL DOCUMENT
                   IF FILES EXIST
                   -> document number required
                   -> dates required
                ========================================= */

                if (!doc.isRequired && hasAnyFiles) {
                    if (!hasDocumentNumber) {
                        showMessage(
                            `${doc.type}: document number is required`,
                            'danger'
                        );

                        return;
                    }

                    if (!hasIssueDate || !hasExpiryDate) {
                        showMessage(
                            `${doc.type}: valid dates are required`,
                            'danger'
                        );

                        return;
                    }
                }
            }

            /* ================= FORM DATA ================= */

            setUploadLoading(true);

            const formData = new FormData();

            formData.append('tenantId', AffiliateId);

            const documentsPayload: any[] = [];

            let fileIndexCounter = 0;

            dynamicKYB.forEach((doc) => {
                const localFiles = doc.localFiles || [];

                /* skip optional empty docs */
                const hasExistingFiles =
                    Array.isArray(doc.files) &&
                    doc.files.length > 0;

                if (
                    !doc.isRequired &&
                    localFiles.length === 0 &&
                    !hasExistingFiles
                ) {
                    return;
                }

                const fileIndexes = localFiles.map(
                    (_: any, index: number) => fileIndexCounter + index
                );

                documentsPayload.push({
                    type: doc.docKey,
                    documentNumber: doc.documentNumber,
                    issueDate: doc.issueDate,
                    expiryDate: doc.expiryDate,

                    /**
                     * NEW FILES
                     */
                    fileIndexes,

                    /**
                     * EXISTING SERVER FILES
                     */
                    existingFiles:
                        localFiles.length === 0
                            ? (doc.files || [])
                            : [],
                });

                localFiles.forEach((file: any) => {
                    formData.append('KYBDocs', file.file);
                });

                fileIndexCounter += localFiles.length;
            });

            formData.append(
                'documents',
                JSON.stringify(documentsPayload)
            );

            console.log("R. D. :   " + JSON.stringify(documentsPayload))

            /* ================= API ================= */

            const res = await uploadTenantKYB(formData);

            if (res?.status) {
                showMessage(
                    res?.message || 'KYB submitted successfully',
                    'success'
                );

                const [docTypeRes, kybRes] = await Promise.all([
                    getKYBDocTypes(),
                    getTenantKYB(AffiliateId),
                ]);

                const mergedDocs = mergeKYB(
                    docTypeRes?.data || [],
                    kybRes?.data?.documents || []
                );

                setDynamicKYB(
                    mergedDocs.map((doc: any) => ({
                        ...doc,
                        localFiles: [],
                    }))
                );

                setTenant((prev: any) => ({
                    ...prev,
                    kybStatus: "UPLOADED",
                }));


            } else {
                showMessage(
                    res?.message || 'Failed to submit KYB',
                    'danger'
                );
            }
        } catch (err) {
            console.error(err);

            showMessage(
                'Failed to submit KYB request',
                'danger'
            );
        } finally {
            setUploadLoading(false);
        }
    };


    const mergeKYB = (docTypes: any[], tenantDocs: any[]) => {
        const merged = docTypes.map((docType) => {
            const existing = tenantDocs.find(
                (d: any) => d.type === docType.type
            );

            if (existing) {
                return {
                    type: docType.label,
                    docKey: docType.type,
                    description: docType.description,
                    documentNumber: existing.documentNumber,
                    status: existing.status,
                    issueDate: existing.issueDate,
                    expiryDate: existing.expiryDate,
                    files: existing.files || [],
                    isRequired: docType.isRequired,
                };
            }

            return {
                type: docType.label,
                docKey: docType.type,
                description: docType.description,
                documentNumber: '',
                status: 'PENDING',
                issueDate: '',
                expiryDate: '',
                files: [],
                isRequired: docType.isRequired,
            };
        });

        return merged;
    };


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);

        setTempImage(url);
        setCropOpen(true);
    };


    const handleSave = async (file?: File) => {
        try {
            const payload = new FormData();

            // use passed file OR state fallback
            if (file) {
                payload.append("tenantLogo", file);
            } else if (logoForm.photo) {
                payload.append("tenantLogo", logoForm.photo);
            }

            console.log("Update Logo Data:", logoForm);

            const res = await updateLogo(AffiliateId, payload);

            showMessage(res?.message || "Logo updated successfully", "success");

            // optional cleanup
            setLogoForm((prev) => ({
                ...prev,
                photo: null,
            }));
        } catch (err: any) {
            alert(err?.message || "Failed to update logo");
        }
    };



    /* ================= API CALL ================= */
    useEffect(() => {
        if (!AffiliateId) return;

        const fetchAll = async () => {
            try {
                setLoading(true);

                const [tenantRes, docTypeRes, kybRes] = await Promise.all([
                    getTenantById(AffiliateId),
                    getKYBDocTypes(),
                    getTenantKYB(AffiliateId),
                ]);

                setTenant(tenantRes?.data);
                setLogoForm({
                    photo: null,          // no new file yet
                    photoUrl: tenantRes?.data.logo // server URL goes here
                });

                const mergedDocs = mergeKYB(
                    docTypeRes?.data || [],
                    kybRes?.data?.documents || []
                );

                setKybDocuments(mergedDocs);

                const needsReverify = mergedDocs.some(
                    (d) => d.isRequired && d.status !== 'APPROVED'
                );

                setKybStatus(
                    needsReverify
                        ? 'PENDING'
                        : kybRes?.data?.status || 'PENDING'
                );

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [AffiliateId]);

    // ================= FETCH PLANS =================

    const fetchPlans = useCallback(async () => {
        try {
            setPlansLoading(true);

            const res = await getPlans({
                page: 1,
                limit: 100,
                search: '',
            });

            const formatted: SubscriptionPlan[] =
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

    const handleUpdateSubscription = async () => {
        setSubscriptionModalOpen(true);
        if (plans.length === 0) {
            await fetchPlans();
        }
    };


    // ================= HANDLERS =================


    const handleSelectPlan = async (planId: string) => {
        try {
            setUpdatePlanLoading(true);

            const hasActiveSubscription = !!tenant?.currentSubscriptionId;

            const res = hasActiveSubscription
                ? await updateTenantPlan({
                    tenantId: AffiliateId,
                    newPlanId: planId,
                })
                : await assignTenantPlan({
                    tenantId: AffiliateId,
                    planId,
                });

            if (res?.status === 201) {
                setSubscriptionModalOpen(false);
                setCancelDialogOpen(false);

                showMessage(
                    res?.message ||
                    (hasActiveSubscription
                        ? "Subscription updated successfully"
                        : "Subscription assigned successfully"),
                    "success"
                );

                const tenantRes = await getTenantById(AffiliateId);
                setTenant(tenantRes?.data);
            } else {
                showMessage(
                    res?.message || "Failed to update subscription",
                    "danger"
                );
            }
        } catch (err) {
            console.error("Subscription update error", err);

            showMessage("Failed to update subscription", "danger");
        } finally {
            setUpdatePlanLoading(false);
        }
    };

    const handleCancelPlan = () => {
        setCancelDialogOpen(true);
    };

    const handleConfirmCancel = async () => {
        try {
            setCancelLoading(true);

            const res = await cancelTenantPlan({
                tenantId: AffiliateId,
            });

            const isSuccess = res?.status === 201;

            if (isSuccess) {
                setCancelDialogOpen(false);

                showMessage(
                    res?.message || "Subscription cancelled successfully",
                    "danger" // you can also use "danger" if you want red styling for cancel
                );

                // refresh tenant details
                const tenantRes = await getTenantById(AffiliateId);
                setTenant(tenantRes?.data);
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


    const handleDownloadFile = async (
        fileUrl: string,
        fileName?: string
    ) => {
        try {
            const response = await fetch(fileUrl);

            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;

            link.download =
                fileName ||
                fileUrl.split("/").pop() ||
                "download";

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed", error);
        }
    };


    /* ================= COMMON HELPERS ================= */


    /* ================= STATES ================= */

    if (loading) return <div className="text-center py-10">Loading...</div>;

    if (!tenant)
        return (
            <div className="text-center py-10 text-red-500">
                Tenant not found
            </div>
        );


    const handleIssueDateChange = (
        value: string,
        index: number,
        doc: any
    ) => {
        if (!value) return;

        const issueDate = new Date(value).getTime();

        const expiryDate = doc?.expiryDate
            ? new Date(doc.expiryDate).getTime()
            : null;

        const now = Date.now();

        // Valid From should not be future date
        if (issueDate > now) {
            showMessage(
                "Valid From date cannot be greater than current date",
                "danger"
            );
            return;
        }

        // Valid From must be earlier than Valid To
        if (expiryDate && issueDate >= expiryDate) {
            showMessage(
                "Valid From date must be earlier than Valid To date",
                "danger"
            );
            return;
        }

        handleKYBInputChange(index, "issueDate", value);
    };

    const handleExpiryDateChange = (
        value: string,
        index: number,
        doc: any
    ) => {
        if (!value) return;

        const expiryDate = new Date(value).getTime();

        const issueDate = doc?.issueDate
            ? new Date(doc.issueDate).getTime()
            : null;

        const now = Date.now();

        // Valid To should not be past date
        if (expiryDate < now) {
            showMessage(
                "Valid To date cannot be earlier than current date",
                "danger"
            );
            return;
        }

        // Valid To must be later than Valid From
        if (issueDate && expiryDate <= issueDate) {
            showMessage(
                "Valid To date must be later than Valid From date",
                "danger"
            );
            return;
        }

        handleKYBInputChange(index, "expiryDate", value);
    };
    /* ================= UI ================= */

    return (
        <div className="space-y-6 max-w-8xl mx-auto">

            {/* PAGE Header */}

            <Card className="shadow-sm border">
                <CardContent className="p-6">
                    <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-8">
                        {/* LEFT CONTENT */}
                        <div className="flex-1 space-y-5">
                            {/* COMPANY INFO */}
                            <div>
                                <h1 className="text-3xl font-semibold text-foreground leading-tight">
                                    {tenant.companyName}
                                </h1>
                                <div className="text-xm font-semibold text-muted-foreground mt-1">
                                    Tenant ID: {tenant.tenantId}
                                </div>
                            </div>

                            {/* CONTACT INFO */}
                            <div className="flex flex-wrap items-center gap-5 text-xm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    {tenant.contact?.email || 'N/A'}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    {tenant.contact?.phone?.code}{' '}
                                    {tenant.contact?.phone?.number || 'N/A'}
                                </div>
                                {tenant.platform?.website && (
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4" />
                                        <a
                                            href={tenant.platform?.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline flex items-center gap-1 break-all"
                                        >
                                            {tenant.platform?.website}
                                            <ExternalLink className="w-4 h-4 shrink-0" />
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* ADDRESS */}
                            <div className="flex items-start gap-2 text-xm text-muted-foreground">
                                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                <div className="space-y-1">
                                    <p>
                                        {tenant.address?.addressLine1},{' '}
                                        {tenant.address?.addressLine2},{' '}
                                        {tenant.address?.landmark}
                                        {tenant.address?.city},{' '}
                                        {tenant.address?.state},{' '}
                                        {tenant.address?.country} -{' '}
                                        {tenant.address?.zipCode}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT LOGO */}
                        <div className="flex flex-col items-center gap-3">
                            {/* LOGO PREVIEW BOX */}
                            <div className="w-28 h-28 rounded-2xl border border-gray-300 bg-muted/20 flex items-center justify-center overflow-hidden">
                                {logoForm.photoUrl ? (
                                    <img
                                        src={logoForm.photoUrl}
                                        alt={tenant.companyName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Building2 className="w-14 h-14 text-muted-foreground" />
                                )}

                            </div>

                            {/* UPLOAD BUTTON */}
                            <label className="flex items-center justify-center gap-1 text-sm px-1 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 active:scale-95 transition cursor-pointer">
                                <Upload className="w-4 h-4" />
                                Update Logo
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    // onChange={(e) => {
                                    //     const file = e.target.files?.[0];
                                    //     if (!file) return;
                                    //     const previewUrl = URL.createObjectURL(file);
                                    //     setLogoForm((prev) => ({
                                    //         ...prev,
                                    //         photoUrl: previewUrl,
                                    //         file,
                                    //     }));
                                    // }}
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT SIDE */}
                <div className="lg:col-span-2 space-y-6">
                    {/* New KYB DOCUMENTS */}
                    <Card className="shadow-sm border">
                        <CardHeader className="border-b pb-4">
                            <div className="flex items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <CardTitle>Upload Verification Documents</CardTitle>
                                    <CardDescription>
                                        Upload all required business verification documents
                                        for KYB approval.
                                    </CardDescription>
                                    {/* OPTIONAL LOCK MESSAGE */}
                                    {isKYBLocked && (
                                        <div className="mt-4 rounded-xl border border-red-200 bg-red-100 px-4 py-3 text-sm text-yellow-900">
                                            KYB request has already been submitted.
                                            Document fields and uploads are locked until review is completed.
                                        </div>
                                    )}
                                </div>
                                {/* SUBMIT BUTTON */}
                                {!isKYBLocked && (
                                    <Button
                                        onClick={handleSubmitDynamicKYB}
                                        disabled={uploadLoading}
                                    >
                                        {uploadLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-4 h-4 mr-2" />
                                                Submit KYB Request
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            {dynamicKYB.map((doc, index) => (
                                <div
                                    key={index}
                                    className="rounded-2xl border overflow-hidden bg-muted/10 border-gray-300"
                                >
                                    {/* HEADER */}
                                    <div className="border-b bg-muted/20 px-5 py-4 border-gray-300">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 space-y-5">
                                                {/* TITLE */}
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <div className="flex items-center gap-2 flex-wrap">

                                                            <div className="font-semibold text-base">
                                                                {doc.type}
                                                            </div>
                                                            <Badge
                                                                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide border ${doc.isRequired
                                                                    ? 'bg-red-100 text-red-700 border-red-200'
                                                                    : 'bg-muted text-muted-foreground border-border'
                                                                    }`}
                                                            >
                                                                {doc.isRequired
                                                                    ? 'Required'
                                                                    : 'Optional'}
                                                            </Badge>

                                                            <Badge
                                                                className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide border ${getConsistentBadgeColor(
                                                                    doc.status
                                                                )}`}
                                                            >
                                                                {doc.status}
                                                            </Badge>
                                                        </div>
                                                        <div className="text-sm text-muted-foreground mt-1">
                                                            {doc.description}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* FORM */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {/* DOCUMENT NUMBER */}
                                                    <div className="space-y-2">
                                                        <Label>
                                                            Document Number
                                                        </Label>

                                                        <Input
                                                            disabled={isKYBLocked}
                                                            value={doc.documentNumber || ''}
                                                            placeholder="Enter document number"
                                                            onChange={(e) =>
                                                                handleKYBInputChange(
                                                                    index,
                                                                    'documentNumber',
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    {/* ISSUE DATE */}
                                                    <div className="space-y-2">
                                                        <Label>Valid From</Label>

                                                        <DateTimePicker
                                                            disabled={isKYBLocked}
                                                            value={doc.issueDate}
                                                            max={new Date().toISOString().slice(0, 16)} // disable future date & time
                                                            onChange={(value) =>
                                                                handleIssueDateChange(value, index, doc)
                                                            }
                                                        />
                                                    </div>

                                                    {/* EXPIRY DATE */}
                                                    <div className="space-y-2">
                                                        <Label>Valid To</Label>

                                                        <DateTimePicker
                                                            disabled={isKYBLocked}
                                                            value={doc.expiryDate}
                                                            min={new Date().toISOString().slice(0, 16)} // disable past date & time
                                                            onChange={(value) =>
                                                                handleExpiryDateChange(value, index, doc)
                                                            }
                                                        />
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    {/* FILE GRID */}
                                    <div className="overflow-x-auto">
                                        <div className="p-3 flex items-start gap-3 min-w-max">
                                            {/* EXISTING SERVER FILES */}
                                            {doc.files?.map((file: string, fileIndex: number) => {
                                                const extension =
                                                    file.split(".").pop()?.toLowerCase() || "";

                                                const isImage = [
                                                    "png",
                                                    "jpg",
                                                    "jpeg",
                                                    "webp",
                                                    "gif",
                                                ].includes(extension);

                                                const isPDF = extension === "pdf";

                                                return (
                                                    <div
                                                        key={fileIndex}
                                                        className="group w-[180px] shrink-0 rounded-xl border bg-background overflow-hidden"
                                                    >
                                                        <div className="aspect-square border-b bg-muted/20 relative overflow-hidden">

                                                            {/* CLICKABLE PREVIEW */}
                                                            <button
                                                                type="button"
                                                                className="w-full h-full"
                                                                onClick={() => {
                                                                    const allFiles = [
                                                                        ...(doc.files || []),
                                                                        ...(doc.localFiles || []).map(
                                                                            (f: any) => f.url
                                                                        ),
                                                                    ];

                                                                    setPreviewFiles(allFiles);
                                                                    setActiveIndex(fileIndex);
                                                                    setPreviewOpen(true);
                                                                }}
                                                            >
                                                                {isImage ? (
                                                                    <img
                                                                        src={file}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : isPDF ? (
                                                                    <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 dark:bg-red-950/20">
                                                                        <FileText className="w-10 h-10 text-red-500" />
                                                                        <span className="text-xs mt-2">PDF</span>
                                                                    </div>
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center">
                                                                        <FileText className="w-10 h-10" />
                                                                    </div>
                                                                )}
                                                            </button>

                                                            {/* HOVER ACTION */}
                                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                                                <Button
                                                                    size="icon"
                                                                    variant="secondary"
                                                                    onClick={() => {
                                                                        const allFiles = [
                                                                            ...(doc.files || []),
                                                                            ...(doc.localFiles || []).map(
                                                                                (f: any) => f.url
                                                                            ),
                                                                        ];

                                                                        setPreviewFiles(allFiles);
                                                                        setActiveIndex(fileIndex);
                                                                        setPreviewOpen(true);
                                                                    }}
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </Button>

                                                                {/* DOWNLOAD */}
                                                                <Button
                                                                    size="icon"
                                                                    variant="default"
                                                                    onClick={() =>
                                                                        handleDownloadFile(file)
                                                                    }
                                                                >
                                                                    <Download className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}


                                            {/* LOCAL FILES */}
                                            {doc.localFiles?.map(
                                                (file: any, fileIndex: number) => {
                                                    const extension =
                                                        file.name.split(".").pop()?.toLowerCase() || "";

                                                    const isImage = [
                                                        "png",
                                                        "jpg",
                                                        "jpeg",
                                                        "webp",
                                                        "gif",
                                                    ].includes(extension);

                                                    return (
                                                        <div
                                                            key={fileIndex}
                                                            className="group w-[180px] shrink-0 rounded-xl border bg-background overflow-hidden"
                                                        >
                                                            <div className="aspect-square border-b bg-muted/20 relative overflow-hidden">

                                                                {/* CLICKABLE PREVIEW */}
                                                                <button
                                                                    type="button"
                                                                    className="w-full h-full"
                                                                    onClick={() => {
                                                                        const allFiles = [
                                                                            ...(doc.files || []),
                                                                            ...(doc.localFiles || []).map(
                                                                                (f: any) => f.url
                                                                            ),
                                                                        ];

                                                                        setPreviewFiles(allFiles);

                                                                        setActiveIndex(
                                                                            (doc.files?.length || 0) +
                                                                            fileIndex
                                                                        );

                                                                        setPreviewOpen(true);
                                                                    }}
                                                                >
                                                                    {isImage ? (
                                                                        <img
                                                                            src={file.url}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center">
                                                                            <FileText className="w-10 h-10" />
                                                                        </div>
                                                                    )}
                                                                </button>

                                                                {/* ACTIONS */}
                                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                                                    <Button
                                                                        size="icon"
                                                                        variant="secondary"
                                                                        onClick={() => {
                                                                            const allFiles = [
                                                                                ...(doc.files || []),
                                                                                ...(doc.localFiles || []).map(
                                                                                    (f: any) => f.url
                                                                                ),
                                                                            ];

                                                                            setPreviewFiles(allFiles);

                                                                            setActiveIndex(
                                                                                (doc.files?.length || 0) +
                                                                                fileIndex
                                                                            );

                                                                            setPreviewOpen(true);
                                                                        }}
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                    </Button>

                                                                    {/* DOWNLOAD */}
                                                                    <Button
                                                                        size="icon"
                                                                        variant="default"
                                                                        onClick={() =>
                                                                            handleDownloadFile(
                                                                                file.url,
                                                                                file.name
                                                                            )
                                                                        }
                                                                    >
                                                                        <Download className="w-4 h-4" />
                                                                    </Button>

                                                                    {!isKYBLocked && (
                                                                        <Button
                                                                            size="icon"
                                                                            variant="destructive"
                                                                            onClick={() =>
                                                                                handleRemoveLocalFile(
                                                                                    index,
                                                                                    fileIndex
                                                                                )
                                                                            }
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="p-2 text-sm truncate">
                                                                {file.name}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                            )}

                                            {/* UPLOAD CARD */}
                                            {!isKYBLocked && (
                                                <label className="group cursor-pointer w-[180px] shrink-0 rounded-xl border-2 border-dashed bg-background hover:bg-muted/40 transition-all duration-300 flex flex-col items-center justify-center aspect-square">

                                                    <input
                                                        type="file"
                                                        multiple
                                                        className="hidden"
                                                        onChange={(e) =>
                                                            handleKYBFileChange(
                                                                index,
                                                                e.target.files
                                                            )
                                                        }
                                                    />

                                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                                        <UploadCloud className="w-5 h-5 text-primary" />
                                                    </div>

                                                    <div className="text-sm font-medium">
                                                        Add Files
                                                    </div>

                                                    <div className="text-[10px] text-muted-foreground mt-1">
                                                        PNG, JPG, PDF
                                                    </div>
                                                </label>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>

                    </Card>

                </div>

                {/* RIGHT SIDE */}
                <div className="space-y-2">

                    {/* ACCOUNT OVERVIEW DETAILS */}

                    <Card>
                        <CardHeader className="border-b pb-4">

                            <div className="flex items-center justify-between gap-4">

                                <div className="space-y-1">

                                    <CardTitle>
                                        Account Summary
                                    </CardTitle>

                                    <CardDescription>
                                        Overview of tenant account, subscription, and platform status
                                    </CardDescription>

                                </div>

                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <Settings className="w-6 h-6 text-primary" />
                                </div>

                            </div>

                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span>Account Status:</span>
                                <Badge className={getConsistentBadgeColor(tenant.status)}>
                                    {tenant.status}
                                </Badge>
                            </div>

                            <div className="flex justify-between">
                                <span>KYB Status:</span>
                                <Badge className={getConsistentBadgeColor(tenant.kybStatus)}>
                                    {tenant.kybStatus}
                                </Badge>
                            </div>

                            {tenant.currentSubscriptionId ? (
                                <>
                                    <div className="flex justify-between">
                                        <span>Current Plan:</span>
                                        <span className="font-medium">
                                            {tenant.currentSubscriptionId.planName}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Plan Status:</span>

                                        <Badge className={getConsistentBadgeColor(tenant.currentSubscriptionId.status)}>
                                            {tenant.currentSubscriptionId.status}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Start Date:</span>

                                        <span>

                                            {formatDate(
                                                tenant.currentSubscriptionId.startDate
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Expiry Date:</span>

                                        <span>
                                            {formatDate(
                                                tenant.currentSubscriptionId.expiryDate
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-2 pt-2">

                                        <Button
                                            className="w-full"
                                            onClick={handleUpdateSubscription}
                                        >
                                            <UploadCloud className="w-4 h-4 mr-2" />
                                            Update Membership
                                        </Button>

                                        <Button
                                            variant="destructive"
                                            className="w-full"
                                            onClick={handleCancelPlan}
                                        >
                                            Cancel Plan
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-4">

                                    <div className="text-red-500 text-center">
                                        No active subscription found
                                    </div>

                                    <Button
                                        className="w-full"
                                        onClick={handleUpdateSubscription}
                                    >
                                        <UploadCloud className="w-4 h-4 mr-2" />
                                        Add Subscription
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>

                        <CardHeader className="border-b pb-2">

                            <div className="flex items-center justify-between gap-4">

                                <div className="space-y-1">

                                    <CardTitle>
                                        Account Admin Details
                                    </CardTitle>

                                    <CardDescription>
                                        Primary administrator and tenant account management information
                                    </CardDescription>

                                </div>

                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <User className="w-6 h-6 text-primary" />
                                </div>

                            </div>

                        </CardHeader>

                        <CardContent className="p-6 space-y-5">

                            {/* ADMIN PROFILE */}
                            <div className="rounded-2xl border p-5 bg-muted/10">

                                <div className="flex items-start gap-4">

                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <User className="w-6 h-6 text-primary" />
                                    </div>

                                    <div className="space-y-1">

                                        <div className="text-lg font-semibold">
                                            John Anderson
                                        </div>

                                        <div className="text-sm text-muted-foreground">
                                            Super Administrator
                                        </div>

                                        <Badge className={getConsistentBadgeColor('ACTIVE')}>
                                            ACTIVE
                                        </Badge>

                                    </div>

                                </div>

                            </div>

                            {/* EMAIL */}
                            <div className="rounded-2xl border p-5 bg-muted/10 space-y-3">

                                <div>
                                    <div className="text-xs text-muted-foreground mb-1">
                                        Email Address
                                    </div>

                                    <div className="font-medium">
                                        admin@veltrixlabs.com
                                    </div>
                                </div>


                                {/* PHONE */}

                                <div className="text-xs text-muted-foreground mb-1">
                                    Contact Number
                                </div>

                                <div className="font-medium">
                                    +91 9876543210
                                </div>


                                {/* ROLE */}

                                <div className="text-xs text-muted-foreground mb-1">
                                    Access Role
                                </div>

                                <div className="font-medium">
                                    Enterprise Tenant Administrator
                                </div>


                                {/* LAST LOGIN */}

                                <div className="text-xs text-muted-foreground mb-1">
                                    Last Login Activity
                                </div>

                                <div className="font-medium">
                                    14 May 2026, 09:42 AM
                                </div>

                            </div>

                            <div className="flex flex-col gap-3 pt-2">

                                <Button className="w-full rounded-xl">
                                    <Mail className="w-4 h-4 mr-2" />
                                    Contact Admin
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full rounded-xl"
                                >
                                    <KeyRound className="w-4 h-4 mr-2" />
                                    Reset Password
                                </Button>

                            </div>

                        </CardContent>

                    </Card>

                    {/* PLATFORM */}
                    <Card>
                        <CardHeader className="border-b pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>
                                        Platform Information
                                    </CardTitle>
                                    <CardDescription>
                                        Connected platform endpoints and service domains
                                    </CardDescription>
                                </div>
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div className="grid gap-y-2 text-sm">
                                {/* Admin Panel */}
                                <span>Admin Panel:</span>
                                <a
                                    href={tenant.platform?.adminPanelUrl || '#'}
                                    target="_blank"
                                    className="text-primary underline flex items-center gap-1"
                                >
                                    {tenant.platform?.adminPanelUrl || 'N/A'}
                                    <ExternalLink className="w-4 h-4" />
                                </a>

                                {/* API Domains */}
                                <span>API Domains:</span>
                                <div className="flex flex-col gap-1">
                                    {Array.isArray(tenant.apiDomains) && tenant.apiDomains.length > 0 ? (
                                        tenant.apiDomains.map((domain, index) => (
                                            <a
                                                key={index}
                                                href={domain}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary underline flex items-center gap-1 break-all"
                                            >
                                                {domain}
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        ))
                                    ) : (
                                        <span>N/A</span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* COMMON UI LIKE MODEL, CONFIRMATION DIALOG, APIS RESPONSE ETC... */}
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
                                plans.map((plan) => {
                                    const isCurrentPlan =
                                        tenant.currentSubscriptionId?.planId ===
                                        plan.id;

                                    return (
                                        <div
                                            key={plan.id}
                                            className={`border rounded-2xl p-5 space-y-4 transition ${isCurrentPlan
                                                ? 'border-primary bg-primary/5'
                                                : ''
                                                }`}
                                        >
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

                                            <div className="text-2xl font-bold">
                                                {plan.currency} {plan.price}

                                                <span className="text-2xl font-bold">
                                                    /{plan.type.charAt(0).toUpperCase() + plan.type.slice(1).toLowerCase()}

                                                </span>
                                            </div>


                                            <Button
                                                className="w-full"
                                                disabled={
                                                    isCurrentPlan ||
                                                    updatePlanLoading
                                                }
                                                variant={
                                                    isCurrentPlan
                                                        ? 'secondary'
                                                        : 'default'
                                                }
                                                onClick={() =>
                                                    handleSelectPlan(plan.id)
                                                }
                                            >
                                                {isCurrentPlan ? (
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
                                })
                            )}

                        </div>

                    </DialogContent>
                </Dialog>

                {/*Confirm Cancel Subscription Dialog */}
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

                {/* RIGHT SIDE RESPONSE MESSAGE */}
                <AppMessage
                    visible={visible}
                    message={message}
                    type={type}
                    onClose={clearMessage}
                />
            </div>

            <ImageCropModal
                open={cropOpen}
                image={tempImage}
                aspect={1}
                onCancel={() => {
                    setCropOpen(false);
                    setTempImage(null);
                }}
                onComplete={(file) => {
                    setLogoForm((prev) => ({
                        ...prev,
                        photo: file,
                        photoUrl: URL.createObjectURL(file),
                    }));

                    setCropOpen(false);
                    setTempImage(null);

                    handleSave(file);
                }}
            />

            <Dialog
                open={previewOpen}
                onOpenChange={(open) => {
                    setPreviewOpen(open);

                    if (!open) {
                        setZoom(1);

                        setPosition({
                            x: 0,
                            y: 0,
                        });

                        setDragging(false);
                    }
                }}
            >
                <DialogContent className="!max-w-none w-screen h-screen p-0 m-0 border-0 rounded-none bg-black overflow-hidden">

                    <DialogTitle asChild>
                        <VisuallyHidden>
                            <span>File Preview</span>
                        </VisuallyHidden>
                    </DialogTitle>

                    <div className="relative w-full h-full bg-black flex flex-col overflow-hidden">

                        {/* HEADER */}
                        <div className="h-16 border-b border-white/10 bg-black/80 backdrop-blur-xl flex items-center justify-between px-5 shrink-0 z-50">

                            {/* LEFT */}
                            <div className="flex items-center gap-4">

                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                                    {previewFiles?.[activeIndex]
                                        ?.toLowerCase()
                                        ?.includes(".pdf") ? (
                                        <FileText className="w-5 h-5 text-red-400" />
                                    ) : (
                                        <ImageIcon className="w-5 h-5 text-white" />
                                    )}
                                </div>

                                <div>
                                    <div className="text-sm font-medium text-white">
                                        Preview File
                                    </div>

                                    <div className="text-xs text-zinc-400">
                                        {activeIndex + 1} of {previewFiles.length}
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT */}
                            <div className="flex items-center gap-2">

                                {/* IMAGE CONTROLS ONLY */}
                                {!previewFiles?.[activeIndex]
                                    ?.toLowerCase()
                                    ?.includes(".pdf") && (
                                        <>
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="bg-white/10 border-white/10 hover:bg-white/20 text-white"
                                                disabled={zoom <= 0.5}
                                                onClick={() =>
                                                    setZoom((prev) =>
                                                        Math.max(prev - 0.25, 0.5)
                                                    )
                                                }
                                            >
                                                <ZoomOut className="w-4 h-4" />
                                            </Button>

                                            <div className="min-w-[70px] text-center text-sm text-white font-medium">
                                                {Math.round(zoom * 100)}%
                                            </div>

                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="bg-white/10 border-white/10 hover:bg-white/20 text-white"
                                                disabled={zoom >= 6}
                                                onClick={() =>
                                                    setZoom((prev) =>
                                                        Math.min(prev + 0.25, 6)
                                                    )
                                                }
                                            >
                                                <ZoomIn className="w-4 h-4" />
                                            </Button>

                                            <Button
                                                variant="secondary"
                                                className="bg-white/10 border-white/10 hover:bg-white/20 text-white"
                                                onClick={() => {
                                                    setZoom(1);

                                                    setPosition({
                                                        x: 0,
                                                        y: 0,
                                                    });
                                                }}
                                            >
                                                Reset
                                            </Button>
                                        </>
                                    )}

                                {/* DOWNLOAD */}
                                <Button
                                    variant="secondary"
                                    className="bg-white/10 border-white/10 hover:bg-white/20 text-white"
                                    onClick={() =>
                                        handleDownloadFile(
                                            previewFiles[activeIndex]
                                        )
                                    }
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>

                                {/* CLOSE */}
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    onClick={() => setPreviewOpen(false)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* BODY */}
                        <div className="relative flex-1 overflow-hidden bg-[#050505]">

                            {/* LEFT NAV */}
                            {activeIndex > 0 && (
                                <button
                                    onClick={() => {
                                        setActiveIndex((prev) => prev - 1);

                                        setZoom(1);

                                        setPosition({
                                            x: 0,
                                            y: 0,
                                        });
                                    }}
                                    className="absolute left-5 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 flex items-center justify-center transition"
                                >
                                    <ChevronLeft className="w-6 h-6 text-white" />
                                </button>
                            )}

                            {/* RIGHT NAV */}
                            {activeIndex < previewFiles.length - 1 && (
                                <button
                                    onClick={() => {
                                        setActiveIndex((prev) => prev + 1);

                                        setZoom(1);

                                        setPosition({
                                            x: 0,
                                            y: 0,
                                        });
                                    }}
                                    className="absolute right-5 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 flex items-center justify-center transition"
                                >
                                    <ChevronRight className="w-6 h-6 text-white" />
                                </button>
                            )}

                            {/* PDF */}
                            {previewFiles?.[activeIndex]
                                ?.toLowerCase()
                                ?.includes(".pdf") ? (
                                <iframe
                                    src={`${previewFiles[activeIndex]}#toolbar=0`}
                                    className="w-full h-full bg-white"
                                />
                            ) : (
                                /* IMAGE */
                                <div
                                    className={`w-full h-full overflow-auto ${zoom > 1
                                            ? "cursor-grab active:cursor-grabbing"
                                            : "cursor-default"
                                        }`}
                                >
                                    <div
                                        className="min-w-full min-h-full flex items-center justify-center p-10"
                                        onMouseDown={(e) => {
                                            if (zoom <= 1) return;

                                            setDragging(true);

                                            setDragStart({
                                                x:
                                                    e.clientX +
                                                    e.currentTarget.scrollLeft,
                                                y:
                                                    e.clientY +
                                                    e.currentTarget.scrollTop,
                                            });
                                        }}
                                        onMouseMove={(e) => {
                                            if (!dragging || zoom <= 1)
                                                return;

                                            const container =
                                                e.currentTarget;

                                            container.scrollLeft =
                                                dragStart.x - e.clientX;

                                            container.scrollTop =
                                                dragStart.y - e.clientY;
                                        }}
                                        onMouseUp={() => setDragging(false)}
                                        onMouseLeave={() =>
                                            setDragging(false)
                                        }
                                    >
                                        <img
                                            src={previewFiles?.[activeIndex]}
                                            draggable={false}
                                            className="select-none object-contain transition-transform duration-150 ease-out shadow-2xl rounded-xl"
                                            style={{
                                                transform: `scale(${zoom})`,
                                                transformOrigin:
                                                    "center center",
                                                maxWidth: "unset",
                                                maxHeight: "unset",
                                                width:
                                                    zoom > 1
                                                        ? "auto"
                                                        : "80%",
                                                height:
                                                    zoom > 1
                                                        ? "auto"
                                                        : "80%",
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* THUMBNAILS */}
                        {previewFiles.length > 1 && (
                            <div className="h-28 border-t border-white/10 bg-black/40 backdrop-blur-xl overflow-x-auto shrink-0">

                                <div className="flex items-center gap-3 px-5 py-3 min-w-max">

                                    {previewFiles.map((file, index) => {
                                        const isPDF =
                                            file
                                                ?.toLowerCase()
                                                ?.includes(".pdf");

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setActiveIndex(index);

                                                    setZoom(1);

                                                    setPosition({
                                                        x: 0,
                                                        y: 0,
                                                    });
                                                }}
                                                className={`relative w-24 h-20 rounded-xl overflow-hidden border transition-all duration-200 shrink-0 ${activeIndex === index
                                                        ? "border-primary ring-2 ring-primary/30 scale-105"
                                                        : "border-white/10 hover:border-white/30"
                                                    }`}
                                            >
                                                {isPDF ? (
                                                    <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center">
                                                        <FileText className="w-7 h-7 text-red-400" />

                                                        <span className="text-[10px] text-white mt-1">
                                                            PDF
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <img
                                                        src={file}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}

                                                {activeIndex === index && (
                                                    <div className="absolute inset-0 bg-primary/10 border border-primary rounded-xl" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}

/* ================= PAGE ================= */

export default function ViewTenantPage() {
    return (
        <AdminProvider>
            <ViewTenantContent />
        </AdminProvider>
    );
}

