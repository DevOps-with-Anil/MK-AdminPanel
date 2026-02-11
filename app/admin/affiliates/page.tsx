'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit2, Trash2, MoreVertical, Handshake } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Affiliate {
  id: string;
  name: string;
  email: string;
  plan: string;
  commission: number;
  revenue: number;
  status: 'active' | 'inactive' | 'suspended';
  joinedAt: string;
}

const mockAffiliates: Affiliate[] = [
  {
    id: 'AFF001',
    name: 'Ahmed Trading Co.',
    email: 'info@ahmedtrading.com',
    plan: 'Pro',
    commission: 15,
    revenue: 45230,
    status: 'active',
    joinedAt: '2024-01-10',
  },
  {
    id: 'AFF002',
    name: 'Islamic Learning Hub',
    email: 'admin@islamichub.com',
    plan: 'Enterprise',
    commission: 20,
    revenue: 125650,
    status: 'active',
    joinedAt: '2023-11-15',
  },
  {
    id: 'AFF003',
    name: 'Quranic Studies',
    email: 'contact@quranstudies.com',
    plan: 'Pro',
    commission: 15,
    revenue: 28900,
    status: 'active',
    joinedAt: '2024-02-01',
  },
  {
    id: 'AFF004',
    name: 'Global Islamic Network',
    email: 'hello@globalislamic.com',
    plan: 'Free',
    commission: 10,
    revenue: 5200,
    status: 'inactive',
    joinedAt: '2023-08-20',
  },
];

function AffiliatesPageContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [affiliates] = useState<Affiliate[]>(mockAffiliates);

  const filteredAffiliates = affiliates.filter(
    (aff) =>
      aff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      aff.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-primary',
      inactive: 'bg-secondary',
      suspended: 'bg-destructive',
    };
    return colors[status] || 'bg-gray-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <Handshake className="text-primary w-10 h-10 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Affiliates</h1>
            <p className="text-muted-foreground">Manage affiliate partners and their performance</p>
          </div>
        </div>
        <Link href="/admin/affiliates/new">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            New Affiliate
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search affiliates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Affiliate Partners</CardTitle>
          <CardDescription>{filteredAffiliates.length} affiliate(s) found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Plan</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Revenue</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAffiliates.map((aff) => (
                  <tr key={aff.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 px-4 font-mono text-sm">{aff.id}</td>
                    <td className="py-4 px-4 font-medium">{aff.name}</td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">{aff.email}</td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">{aff.plan}</Badge>
                    </td>
                    <td className="py-4 px-4 font-medium">${aff.revenue.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(aff.status)}>{aff.status}</Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/affiliates/edit/${aff.id}`} className="gap-2 flex items-center">
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <Trash2 className="w-4 h-4" />
                            Remove
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{affiliates.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Affiliates</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">${affiliates.reduce((sum, a) => sum + a.revenue, 0).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Revenue</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">{affiliates.filter((a) => a.status === 'active').length}</p>
              <p className="text-sm text-muted-foreground mt-1">Active Affiliates</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AffiliatesPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <AffiliatesPageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
