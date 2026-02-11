'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Edit2, Trash2, MoreVertical, Headphones } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Ticket {
  id: string;
  title: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  customer: string;
  createdAt: string;
  resolvedAt?: string;
}

const mockTickets: Ticket[] = [
  {
    id: 'TKT001',
    title: 'Cannot access dashboard',
    status: 'in-progress',
    priority: 'high',
    customer: 'Ahmed Khan',
    createdAt: '2024-02-20',
  },
  {
    id: 'TKT002',
    title: 'Feature request: Export data',
    status: 'open',
    priority: 'medium',
    customer: 'Fatima Ali',
    createdAt: '2024-02-21',
  },
  {
    id: 'TKT003',
    title: 'Password reset issue',
    status: 'resolved',
    priority: 'urgent',
    customer: 'Hassan Malik',
    createdAt: '2024-02-18',
    resolvedAt: '2024-02-19',
  },
  {
    id: 'TKT004',
    title: 'Billing inquiry',
    status: 'open',
    priority: 'low',
    customer: 'Aisha Ahmed',
    createdAt: '2024-02-21',
  },
];

function TicketsPageContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tickets] = useState<Ticket[]>(mockTickets);

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-primary',
      'in-progress': 'bg-secondary',
      resolved: 'bg-accent',
      closed: 'bg-muted',
    };
    return colors[status] || 'bg-gray-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <Headphones className="text-primary w-10 h-10 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Support Tickets</h1>
            <p className="text-muted-foreground">Manage customer support requests</p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>{filteredTickets.length} ticket(s) found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Ticket ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Priority</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Created</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4 font-mono text-sm font-medium">{ticket.id}</td>
                    <td className="py-4 px-4">{ticket.title}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{ticket.customer}</td>
                    <td className="py-4 px-4">
                      <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{ticket.createdAt}</td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Edit2 className="w-4 h-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <Trash2 className="w-4 h-4" />
                            Close
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{tickets.filter((t) => t.status === 'open').length}</p>
              <p className="text-sm text-muted-foreground mt-1">Open</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">{tickets.filter((t) => t.status === 'in-progress').length}</p>
              <p className="text-sm text-muted-foreground mt-1">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">{tickets.filter((t) => t.status === 'resolved').length}</p>
              <p className="text-sm text-muted-foreground mt-1">Resolved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-destructive">{tickets.filter((t) => t.priority === 'urgent').length}</p>
              <p className="text-sm text-muted-foreground mt-1">Urgent</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function TicketsPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <TicketsPageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
