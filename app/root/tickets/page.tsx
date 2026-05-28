'use client';

import { useMemo, useState } from 'react';
import { AdminProvider, useAdmin } from '@/contexts/AdminContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  Search,
  Eye,
  Clock3,
  CheckCheck,
  XCircle,
  User,
  Mail,
  Calendar,
  MoreVertical,
  AlertCircle,
  OrigamiIcon,
  Building,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { usePagination } from '@/hooks/ui/usePagination';
import { getConsistentBadgeColor } from '@/utils/getDynamicBadgeColor';
import { formatDate } from "@/utils/dateFormatter";


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

const mockTickets: Ticket[] = [
  {
    id: 'TCK-1001',
    subject: 'Login issue on dashboard',
    requester: 'Veltrix Labs Pvt Ltd',
    email: 'support@veltrixlabs.com',
    priority: 'HIGH',
    createdAt: '2026-05-12',
    status: 'OPEN',
    assignedTo: 'Support Agent 1',
  },
  {
    id: 'TCK-1002',
    subject: 'Payment not reflecting',
    requester: 'NovaEdge Systems',
    email: 'billing@novaedge.com',
    priority: 'MEDIUM',
    createdAt: '2026-05-10',
    status: 'IN_PROGRESS',
    assignedTo: 'Support Agent 2',
  },
  {
    id: 'TCK-1003',
    subject: 'Account deletion request',
    requester: 'Infralynx Technologies',
    email: 'admin@infralynx.io',
    priority: 'LOW',
    createdAt: '2026-05-09',
    status: 'RESOLVED',
    assignedTo: 'Support Lead',
  },
  {
    id: 'TCK-1004',
    subject: 'Unable to reset password',
    requester: 'QuantaVest AI',
    email: 'help@quantavest.ai',
    priority: 'HIGH',
    createdAt: '2026-05-08',
    status: 'OPEN',
  },
  {
    id: 'TCK-1005',
    subject: 'API integration timeout issue',
    requester: 'SkyForge Cloud',
    email: 'tech@skyforgecloud.com',
    priority: 'HIGH',
    createdAt: '2026-05-07',
    status: 'IN_PROGRESS',
    assignedTo: 'DevOps Team',
  },
  {
    id: 'TCK-1006',
    subject: 'Unable to upload KYB documents',
    requester: 'AetherWave Technologies',
    email: 'operations@aetherwave.tech',
    priority: 'MEDIUM',
    createdAt: '2026-05-06',
    status: 'OPEN',
  },
];

export default function SupportTicketContent() {
  const { t } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');

  // Row per Page and Pagination
  const PAGE_LIMIT_OPTIONS = [10, 25, 50, 'All'];
  const { page, setPage, limit, setLimit } = usePagination(10);
  const [totalPages, setTotalPages] = useState(1);



  const filteredTickets = useMemo(() => {
    const q = searchQuery.toLowerCase();

    return mockTickets.filter(
      (t) =>
        t.subject.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div className="flex items-start gap-4">
          <CheckCircle className="text-primary w-7 h-7 mt-1" />

          <div>
            <h1 className="text-xl font-medium">
              {t("translate.support_tickets_title")}
            </h1>

            <p className="text-muted-foreground">
              {t("translate.support_tickets_description")}
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <Input
            placeholder={t("translate.support_tickets_search")}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

      </div>

      {/* TABLE */}
      <Card>

        <CardHeader className="flex items-center justify-between">

          <div>
            <CardTitle>
              {t("translate.support_ticket_inbox")}
            </CardTitle>

            <CardDescription>
              {filteredTickets.length} {t("translate.support_tickets_count")}
            </CardDescription>
          </div>

          {/* LIMIT */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {t("translate.support_show")}: {limit}
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

            <table className="w-full min-w-[900px]">

              <thead>
                <tr className="border-b bg-muted/30">

                  <th className="text-left p-4">
                    {t("translate.ticket_col_ticket")}
                  </th>

                  <th className="text-left p-4">
                    {t("translate.ticket_col_requester")}
                  </th>

                  <th className="text-left p-4">
                    {t("translate.ticket_col_created")}
                  </th>

                  <th className="text-left p-4">
                    {t("translate.ticket_col_priority")}
                  </th>

                  <th className="text-left p-4">
                    {t("translate.ticket_col_assigned")}
                  </th>

                  <th className="text-left p-4">
                    {t("translate.ticket_col_status")}
                  </th>

                  <th className="text-right p-4">
                    {t("translate.ticket_col_actions")}
                  </th>

                </tr>
              </thead>

              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b hover:bg-muted/20">

                    {/* TICKET */}
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{ticket.subject}</div>
                        <div className="text-xs text-muted-foreground">
                          {ticket.id}
                        </div>
                      </div>
                    </td>

                    {/* REQUESTER */}
                    <td className="p-4">
                      <div className="space-y-1">

                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          {ticket.requester}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          {ticket.email}
                        </div>

                      </div>
                    </td>

                    {/* CREATED */}
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {formatDate(ticket.createdAt)}
                      </div>
                    </td>

                    {/* PRIORITY */}
                    <td className="p-4">
                      <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getConsistentBadgeColor(ticket.priority)}`}>
                        {ticket.priority}
                      </div>
                    </td>

                    {/* ASSIGNED */}
                    <td className="p-4 text-sm text-muted-foreground">
                      {ticket.assignedTo || t("translate.ticket_unassigned")}
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getConsistentBadgeColor(ticket.status)}`}>
                        {ticket.status}
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4 text-right">

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-44">

                          <DropdownMenuItem
                            onClick={() =>
                              (window.location.href = `/root/tickets/${ticket.id}`)
                            }
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {t("translate.ticket_view")}
                          </DropdownMenuItem>

                          {ticket.status === "OPEN" && (
                            <DropdownMenuItem className="text-green-600">
                              <CheckCheck className="w-4 h-4 mr-2" />
                              {t("translate.ticket_mark_progress")}
                            </DropdownMenuItem>
                          )}

                          {ticket.status !== "CLOSED" && (
                            <DropdownMenuItem className="text-red-600">
                              <XCircle className="w-4 h-4 mr-2" />
                              {t("translate.ticket_close")}
                            </DropdownMenuItem>
                          )}

                        </DropdownMenuContent>
                      </DropdownMenu>

                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

            {!filteredTickets.length && (
              <div className="py-10 text-center text-muted-foreground">
                {t("translate.ticket_empty")}
              </div>
            )}

          </div>

        </CardContent>
      </Card>

    </div>
  );

}
