'use client';

import { useState } from 'react';
import { AdminProvider, useAdmin } from '@/contexts/AdminContext';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';
import { formatDate } from "@/utils/dateFormatter";


import {
    CheckCircle,
    Search,
    User,
    Mail,
    Calendar,
    Building2,
    Paperclip,
    Send,
    Clock3,
    AlertCircle,
    CheckCheck,
    Building,
} from 'lucide-react';

import { getConsistentBadgeColor } from '@/utils/getDynamicBadgeColor';

interface Ticket {
    id: string;
    subject: string;
    requester: string;
    email: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    createdAt: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    assignedTo?: string;
}

const ticket: Ticket = {
    id: 'TCK-1001',
    subject: 'Login issue on dashboard',
    requester: 'Veltrix Labs Pvt Ltd',
    email: 'support@veltrixlabs.com',
    priority: 'HIGH',
    createdAt: '2026-05-12',
    status: 'IN_PROGRESS',
    assignedTo: 'Support Agent 1',
};

function SupportTicketContent() {
    const { t } = useAdmin();

    const [message, setMessage] = useState('');

   

    return (
        <div className="space-y-6">
            {/* MAIN CONTENT */}
            <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-6 h-[calc(100vh-120px)]">

                {/* LEFT CARD */}
                {/* <Card className="h-full overflow-hidden"> */}

                <Card className="h-full flex flex-col border-b border-gray-300 overflow-hidden">
                    {/* CHAT HEADER */}
                    <CardHeader className="border-b border-gray-300 pb-2 shrink-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>
                                    {ticket.requester}
                                </CardTitle>

                                <CardDescription>
                                    {ticket.email}
                                </CardDescription>
                            </div>
                        </div>

                    </CardHeader>

                    {/* CONTENT */}
                    <CardContent>
                        <div className="space-y-6">
                            {/* ASSIGNED */}
                            <div>
                                <div className="text-xs text-muted-foreground mb-2">
                                    Assigned To
                                </div>

                                <div className="inline-flex items-center gap-3 rounded-xl border px-4 py-3 bg-background w-full">
                                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                                        <User className="w-4 h-4 text-primary-foreground" />
                                    </div>

                                    <div>
                                        <div className="font-sm">
                                            {ticket.assignedTo}
                                        </div>

                                        <div className="text-xs text-muted-foreground">
                                            Support Team
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CREATED */}
                            <div>
                                <div className="text-xs text-muted-foreground mb-2">
                                    Created On
                                </div>

                                <div className="flex items-center gap-2 font-xm">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    {formatDate(ticket.createdAt)}
                                </div>
                            </div>

                            {/* ACTION BUTTON */}
                            <Button className="w-full h-11 rounded-xl">
                                <CheckCheck className="w-4 h-4 mr-2" />
                                Resolve Ticket
                            </Button>

                        </div>

                    </CardContent>

                </Card>

                {/* RIGHT CARD */}
                <Card className="h-full flex flex-col border-b border-gray-300 overflow-hidden">

                    {/* CHAT HEADER */}
                    <CardHeader className="border-b border-gray-300 pb-2 shrink-0">

                        <div className="flex items-center justify-between">

                            <div>
                                <CardTitle>
                                    {ticket.subject}
                                </CardTitle>

                                <CardDescription>
                                    Ticket ID :  {ticket.id}
                                </CardDescription>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                {ticket.status}
                            </div>

                        </div>

                    </CardHeader>

                    {/* MESSAGES */}
                    <div className="flex-1 overflow-y-auto bg-muted/10">

                        <CardContent className="p-6 space-y-8">

                            {/* CUSTOMER MESSAGE */}
                            <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Building2 className="w-5 h-5 text-primary" />
                                </div>

                                <div className="max-w-[75%]">

                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="font-medium text-sm">
                                            {ticket.requester}
                                        </div>

                                        <div className="text-xs text-muted-foreground">
                                            Today at 10:32 AM
                                        </div>
                                    </div>

                                    <div className="rounded-2xl rounded-tl-sm border bg-background px-5 py-4 shadow-sm text-sm leading-relaxed">
                                        We are unable to login into the dashboard after the latest update.
                                        It keeps showing “Invalid Session” after successful authentication.
                                    </div>
                                </div>
                            </div>

                            {/* SUPPORT MESSAGE */}
                            <div className="flex items-start justify-end gap-4">
                                <div className="max-w-[75%]">
                                    <div className="flex items-center justify-end gap-2 mb-2">

                                        <div className="text-xs text-muted-foreground">
                                            Today at 10:40 AM
                                        </div>

                                        <div className="font-medium text-sm">
                                            Support Agent
                                        </div>
                                    </div>

                                    <div className="rounded-2xl rounded-tr-sm bg-primary text-primary-foreground px-5 py-4 shadow-sm text-sm leading-relaxed">
                                        Thanks for reporting this issue. Our engineering team is currently
                                        checking authentication session logs and token validation flow.
                                    </div>
                                </div>

                                <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center shrink-0">
                                    <User className="w-5 h-5 text-primary-foreground" />
                                </div>
                            </div>

                            {/* CUSTOMER MESSAGE */}
                            <div className="flex items-start gap-4">

                                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Building2 className="w-5 h-5 text-primary" />
                                </div>

                                <div className="max-w-[75%]">
                                    <div className="flex items-center gap-2 mb-2">

                                        <div className="font-medium text-sm">
                                            {ticket.requester}
                                        </div>

                                        <div className="text-xs text-muted-foreground">
                                            Today at 10:45 AM
                                        </div>
                                    </div>

                                    <div className="rounded-2xl rounded-tl-sm border bg-background px-5 py-4 shadow-sm text-sm leading-relaxed">
                                        Sure. Please let us know if you need any logs or additional details
                                        from our side.
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </div>

                    {/* INPUT */}
                    <div className="border-t border-b border-gray-300 bg-background p-5 shrink-0">
                        <div className="flex items-end gap-4">
                            <div className="flex-1">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Write a reply..."
                                    className="w-full min-h-[70px] border-b border-gray-300 rounded-2xl border bg-background px-4 py-4 text-sm resize-none outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div className="flex flex-col gap-3">

                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-xl"
                                >
                                    <Paperclip className="w-4 h-4" />
                                </Button>

                                <Button className="rounded-xl px-5">
                                    <Send className="w-4 h-4 mr-2" />
                                    Send
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default function SupportTicketPage() {
    return (
        <AdminProvider>
            <SupportTicketContent />
        </AdminProvider>
    );
}