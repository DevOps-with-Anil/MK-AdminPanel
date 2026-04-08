'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { useParams } from 'next/navigation';
import { useEffect, useState, useContext } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
    ArrowLeft,
    AlertCircle,
    ExternalLink,
    UploadCloud,
} from 'lucide-react';
import Link from 'next/link';

import { I18nContext } from '@/i18n/provider';
import { getAffiliateById } from '@/services/auth.service';

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
        landmark?: string;
        zipCode?: string;
        city?: string;
        state?: string;
        country?: string;
    };
    kybStatus: string;
    currentSubscriptionId: string | null;
    status: string;
    tenantId: string;
    createdAt: string;
    createdBy: string;
}

/* ================= COMPONENT ================= */

function ViewTenantContent() {
    const params = useParams();
    const AffiliateId = params.id as string;

    const { locale } = useContext(I18nContext);

    const [tenant, setTenant] = useState<TenantPayload | null>(null);
    const [loading, setLoading] = useState(true);

    /* ================= API CALL ================= */
    useEffect(() => {
        if (!AffiliateId) return;

        const fetchAffiliate = async () => {
            try {
                setLoading(true);

                const res = await getAffiliateById(AffiliateId);
                const data = res?.data;

                setTenant(data);
            } catch (err) {
                console.error('Fetch error:', err);
                setTenant(null);
            } finally {
                setLoading(false);
            }
        };

        fetchAffiliate();
    }, [AffiliateId]);

    const handleUpdateSubscription = () => {
        alert('Update subscription logic goes here!');
    };

    /* ================= STATES ================= */

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    if (!tenant) {
        return (
            <div className="text-center py-10 text-red-500">
                Tenant not found
            </div>
        );
    }

    /* ✅ multilingual safe getter */
    const getLangValue = (field: any) => {
        if (!field) return '';
        if (typeof field === 'object') {
            return field[locale] || field.en || '';
        }
        return field;
    };

    const companyName = getLangValue(tenant.companyName);

    /* ================= UI ================= */

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* HEADER */}
            <div className="flex items-center gap-4">
                <Link href="/root/tenants">
                    <ArrowLeft className="w-6 h-6 text-primary cursor-pointer" />
                </Link>

                <div className="flex-1">
                    <h2 className="text-xl font-medium">{companyName}</h2>
                    <h3 className="text-muted-foreground">
                        Affiliate ID : {tenant.tenantId}
                    </h3>
                </div>

                {tenant.logoUrl && (
                    <img
                        // src={tenant.logoUrl}
                        src='/apple-icon.png'
                        alt="logo"
                        className="w-20 h-20 rounded-md object-contain"
                    />
                )}
            </div>

            {/* KYB WARNING */}
            {tenant.kybStatus !== 'APPROVED' && (
                <Card className="border-red-200 bg-red-50/50">
                    <CardHeader>
                        <CardTitle className="flex text-md items-center gap-2 text-red-500">
                            <AlertCircle className="w-5 h-5" />
                            KYB is pending. Verify documents.
                        </CardTitle>
                    </CardHeader>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT SIDE */}
                <div className="lg:col-span-2 space-y-6">
                    {/* CONTACT */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <div className="flex justify-between">
                                <span>Email:</span>
                                <span>{tenant.contact?.email || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between">
                                <span>Phone:</span>
                                <span>
                                    {tenant.contact?.phone?.code || ''}{' '}
                                    {tenant.contact?.phone?.number || 'N/A'}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                    {/* Address Card*/}
                    <Card>
                        <CardHeader>
                            <CardTitle>Address</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                            <p>{tenant.address?.addressLine1 || ''},{' '} {tenant.address?.addressLine2 || 'N/A'}</p>
                            <p>
                                {tenant.address?.city || ''},{' '}
                                {tenant.address?.state || ''},{' '}
                                {tenant.address?.country || ''} -{' '}
                                {tenant.address?.zipCode || ''}
                            </p>
                        </CardContent>
                    </Card>
                    {/* Plateform Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Platform Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">

                            <div className="flex justify-between">
                                <span>Website:</span>
                                <a
                                    href={tenant.platform?.website || '#'}
                                    target="_blank"
                                    className="text-primary underline flex items-center gap-1"
                                >
                                    {tenant.platform?.website || 'N/A'}
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>

                            <div className="flex justify-between">
                                <span>Admin Panel:</span>
                                <a
                                    href={tenant.platform?.adminPanelUrl || '#'}
                                    target="_blank"
                                    className="text-primary underline flex items-center gap-1"
                                >
                                    {tenant.platform?.adminPanelUrl || 'N/A'}
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </div>

                            <div className="flex justify-between">
                                <span>API Domains:</span>
                                <div>
                                    {tenant.apiDomains?.length ? (
                                        tenant.apiDomains.map((d) => (
                                            <div key={d}>
                                                <a
                                                    href={d}
                                                    target="_blank"
                                                    className="text-primary underline flex items-center gap-1"
                                                >
                                                    {d}
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </div>
                                        ))
                                    ) : (
                                        <span>N/A</span>
                                    )}
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT SIDE View*/}
                {/* Status Card */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Status   </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Tenant Status:</span>
                                <Badge className={tenant.status === 'ACTIVE' ? 'bg-primary' : 'bg-destructive'}>
                                    {tenant.status}
                                </Badge>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">KYB Status:</span>
                                <Badge className={tenant.kybStatus === 'APPROVED' ? 'bg-primary' : 'bg-yellow-100 text-yellow-800'}>                                    {tenant.kybStatus}
                                </Badge>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Created By:</span>
                                <span>{tenant.createdBy}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Created At:</span>
                                <span>{new Date(tenant.createdAt).toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                {/* Subscriptin Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Subscription</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Subscription ID:</span>
                                <span>{tenant.currentSubscriptionId || 'N/A'}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Plan Name:</span>
                                <span>{tenant.currentSubscriptionId ? 'Pro Plan' : 'N/A'}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Start Date:</span>
                                <span>{tenant.currentSubscriptionId ? '2026-04-01' : 'N/A'}</span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">End Date:</span>
                                <span>{tenant.currentSubscriptionId ? '2027-04-01' : 'N/A'}</span>
                            </div>

                            {/* Upgrade Button */}
                            <div className="flex justify-end mt-2">

                                <Button className="w-full mt-2 flex items-center justify-center gap-2" onClick={handleUpdateSubscription}>
                                    <UploadCloud className="w-4 h-4" /> Update Membership
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
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