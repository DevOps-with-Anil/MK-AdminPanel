'use client';

import { AdminProvider } from '@/contexts/AdminContext';
<<<<<<< HEAD
=======
import { AdminLayout } from '@/components/layout/AdminLayout';
>>>>>>> 359f3ec (Complete structure UI updated)
import { useState } from 'react';
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';

/* ================= TYPES ================= */

type LangKey = 'en' | 'fr' | 'ar';

interface MultiLang {
    en: string;
    fr: string;
    ar: string;
}

interface TenantForm {
    companyName: MultiLang;
    description: MultiLang;
    contact_email: string;
    phoneCode: string;
    contact_phoneNumber: string;
    website: string;
    adminPanelUrl: string;
    apiDomains: string[];

    country: string;
    state: string;
    city: string;

    addressLine1: string;
    addressLine2: string;
    pincode: string;
}

type Option = {
    code?: string;
    value?: string;
    label: string;
};

interface DropdownProps {
    options: Option[];
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

/* ================= CONSTANTS ================= */

const LANGUAGES = [
    { key: 'en', label: 'English' },
    { key: 'fr', label: 'French' },
    { key: 'ar', label: 'Arabic' },
];

const PHONE_CODES: Option[] = [
    { code: '+91', label: 'India (+91)' },
    { code: '+1', label: 'USA (+1)' },
    { code: '+971', label: 'UAE (+971)' },
];

const COUNTRIES: Option[] = [
    { value: 'india', label: 'India' },
    { value: 'usa', label: 'USA' },
    { value: 'uae', label: 'UAE' },
];

const STATES: Option[] = [
    { value: 'mp', label: 'Madhya Pradesh' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'delhi', label: 'Delhi' },
];

const CITIES: Option[] = [
    { value: 'bhopal', label: 'Bhopal' },
    { value: 'indore', label: 'Indore' },
    { value: 'mumbai', label: 'Mumbai' },
];

/* ================= COMPONENT ================= */

function Dropdown({
    options,
    value,
    onChange,
    placeholder = 'Select',
}: DropdownProps) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {options.map((opt, i) => {
                    const val = opt.code || opt.value || '';
                    return (
                        <SelectItem key={i} value={val}>
                            {opt.label}
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
}

/* ================= PAGE ================= */

function NewTenantContent() {
    const [currentLang, setCurrentLang] = useState<LangKey>('en');

    const [formData, setFormData] = useState<TenantForm>({
        companyName: { en: '', fr: '', ar: '' },
        description: { en: '', fr: '', ar: '' },
        contact_email: '',
        phoneCode: '+91',
        contact_phoneNumber: '',
        website: '',
        adminPanelUrl: '',
        apiDomains: [''],

        country: '',
        state: '',
        city: '',

        addressLine1: '',
        addressLine2: '',
        pincode: '',
    });

    const setLangField = (field: 'companyName' | 'description', value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [currentLang]: value,
            },
        }));
    };

    const setField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const setDomain = (i: number, value: string) => {
        const updated = [...formData.apiDomains];
        updated[i] = value;
        setFormData(prev => ({ ...prev, apiDomains: updated }));
    };

    const addDomain = () => {
        setFormData(prev => ({
            ...prev,
            apiDomains: [...prev.apiDomains, ''],
        }));
    };

    const removeDomain = (i: number) => {
        if (formData.apiDomains.length === 1) return;
        const updated = formData.apiDomains.filter((_, idx) => idx !== i);
        setFormData(prev => ({ ...prev, apiDomains: updated }));
    };

    /* ================= UI ================= */

    return (
        <div className="space-y-6 max-w-6xl">

            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/tenants">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-xl font-medium">Create Tenant</h1>
                    <p className="text-muted-foreground">Multi-tenant setup</p>
                </div>
            </div>

            {/* Language Tabs */}
            <div className="flex gap-2">
                {LANGUAGES.map(lang => (
                    <Button
                        key={lang.key}
                        size="sm"
                        variant={currentLang === lang.key ? 'default' : 'outline'}
                        onClick={() => setCurrentLang(lang.key as LangKey)}
                    >
                        {lang.label}
                    </Button>
                ))}
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* LEFT */}
                <div className="space-y-6">

                    {/* Company Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Company Info</CardTitle>
                            <CardDescription>
                                Provide company name and description in multiple languages
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            <div>
                                <Label className="mb-2 block">Company Name ({currentLang})*</Label>
                                <Input
                                    value={formData.companyName[currentLang]}
                                    onChange={e => setLangField('companyName', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label className="mb-2 block">Description ({currentLang})</Label>
                                <Input
                                    value={formData.description[currentLang]}
                                    onChange={e => setLangField('description', e.target.value)}
                                />
                            </div>

                        </CardContent>
                    </Card>

                    {/* Contact Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Info</CardTitle>
                            <CardDescription>Basic contact and address details</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">

                            {/* Email */}
                            <div>
                                <Label className="mb-2 block">Email*</Label>
                                <Input
                                    value={formData.contact_email}
                                    onChange={e => setField('contact_email', e.target.value)}
                                />
                            </div>

                            {/* Phone */}
                            <div className="grid grid-cols-[120px_1fr] gap-4">
                                <div>
                                    <Label className="mb-2 block">Phone Code</Label>
                                    <Dropdown
                                        options={PHONE_CODES}
                                        value={formData.phoneCode}
                                        onChange={(val) => setField('phoneCode', val)}
                                    />
                                </div>

                                <div>
                                    <Label className="mb-2 block">Phone Number *</Label>
                                    <Input
                                        value={formData.contact_phoneNumber}
                                        onChange={e =>
                                            setField('contact_phoneNumber', e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Address */}
                            <Input
                                placeholder="Address Line 1"
                                value={formData.addressLine1}
                                onChange={e => setField('addressLine1', e.target.value)}
                            />

                            <Input
                                placeholder="Address Line 2"
                                value={formData.addressLine2}
                                onChange={e => setField('addressLine2', e.target.value)}
                            />

                            {/* Location */}
                            <div className="grid grid-cols-3 gap-4">
                                <Dropdown options={COUNTRIES} value={formData.country} onChange={(v) => setField('country', v)} />
                                <Dropdown options={STATES} value={formData.state} onChange={(v) => setField('state', v)} />
                                <Dropdown options={CITIES} value={formData.city} onChange={(v) => setField('city', v)} />
                            </div>

                            <Input
                                placeholder="Pincode"
                                value={formData.pincode}
                                onChange={e => setField('pincode', e.target.value)}
                            />

                        </CardContent>
                    </Card>

                </div>

                {/* RIGHT */}
                <div className="space-y-6">

                    {/* Platform */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Platform Config</CardTitle>
                            <CardDescription>Configure publicly accessible URLs</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Label className="mb-2 block">Company Website*</Label>
                            <Input
                                placeholder=""
                                value={formData.website}
                                onChange={e => setField('website', e.target.value)}
                            />
                            <Label className="mb-2 block">Admin Panel URL*</Label>
                            <Input
                                placeholder=""
                                value={formData.adminPanelUrl}
                                onChange={e => setField('adminPanelUrl', e.target.value)}
                            />
                        </CardContent>
                    </Card>

                    {/* API Domains */}
                    <Card>
                        <CardHeader>
                            <CardTitle>API Domains</CardTitle>
                            <CardDescription>
                                Backend API domains used for service communication
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">

                            {formData.apiDomains.map((d, i) => (
                                <div key={i} className="flex gap-2 items-start">
                                    <div className="flex-1">
                                        <Input
                                            value={d}
                                            onChange={e => setDomain(i, e.target.value)}
                                        />
                                    </div>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeDomain(i)}
                                        disabled={formData.apiDomains.length === 1}
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}

                            <Button variant="outline" onClick={addDomain}>
                                + Add Domain
                            </Button>

                        </CardContent>
                    </Card>

                </div>
            </div>

            {/* ACTION */}
            <div className="flex gap-3">
                <Button className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Create Tenant
                </Button>

                <Link href="/admin/tenants" className="flex-1">
                    <Button variant="outline" className="w-full">
                        Cancel
                    </Button>
                </Link>
            </div>

        </div>
    );
}

export default function NewTenantPage() {
    return (
        <AdminProvider>
            <NewTenantContent />
        </AdminProvider>
    );
}