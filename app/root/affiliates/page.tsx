'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import {
  Plus,
  Search,
  Edit2,
  Trash2,
  MoreVertical,
  Handshake,
  CheckCircle,
  Eye,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { getAffiliates } from '@/services/auth.service';
import { useDeleteEntity } from '@/hooks/useDeleteEntity';

interface Affiliate {
  id: string;
  tenantId : string;
  companyName: string;
  contact: { 
    email: string;
    phone: { 
      code: string; 
      number: string; 
    };
  };
  plan: string;
  isVerified: boolean;
  // revenue: number;
  status: 'active' | 'inactive' | 'suspended';
}

export default function AffiliatesPage() {
  const { t } = useAdmin();

  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<number | 'All'>(10);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_LIMIT_OPTIONS = [10, 25, 50, 'All'];

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { deleteEntity } = useDeleteEntity();

  // debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // fetch (same pattern as plans)
  const fetchAffiliates = useCallback(async () => {
    try {
      setLoading(true);

      const fetchLimit = limit === 'All' ? 0 : limit;

      const res = await getAffiliates({
        page,
        limit: fetchLimit,
        search: debouncedSearch,
      });

      // console.log("Affiliated data   :  " +JSON.stringify(res.data));

      const formatted: Affiliate[] =
        res?.data?.map((r: any, index: number) => ({
          id: r._id,
          tenantId:r.tenantId,
          companyName: r.companyName || '',
          contact: {
            email: r.contact?.email || r.email || '',
            phone:{
            code: r.contact?.phone.code || '0000',
            number: r.contact?.phone.number || '000000',
            },
            
          },
          plan: r.plan ?? 'Free',
          isVerified: r.isVerified ?? false,
          // revenue: r.revenue ?? 0,
          status:
            r.status === 'ACTIVE'
              ? 'active'
              : r.status === 'SUSPENDED'
                ? 'suspended'
                : 'inactive',
        })) || [];

      setAffiliates(formatted);
      setTotalPages(res?.meta?.totalPages ?? 1);

    } catch (err) {
      console.error('Fetch affiliates error', err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    fetchAffiliates();
    console.log("Affiliated data  Called");

  }, [fetchAffiliates]);

  // delete
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" affiliate?`)) return;

    try {
      await deleteEntity('affiliate', id);
      setAffiliates((prev) => prev.filter((a) => a.id !== id));
      
    } catch (err) {
      console.error(err);
      alert('Failed to delete affiliate');
    }
  };

  // filter (SAFE)
  const filteredAffiliates = affiliates.filter((aff) => {
    const name = aff.companyName || '';
    const email = aff.contact?.email || '';

    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-primary',
      inactive: 'bg-secondary',
      suspended: 'bg-destructive',
    };
    return colors[status] || 'bg-gray-100';
  };

  return (
    <AdminProvider>
      <div className="space-y-6">

        {/* HEADER (UNCHANGED) */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-start gap-4">
            <Handshake className="text-primary w-7 h-7 mt-1" />
            <div>
              <h1 className="text-xl font-medium text-foreground">Affiliates</h1>
              <p className="text-muted-foreground">
                Manage affiliate partners and their performance
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name or email......"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Link href="/root/affiliates/new">
              <Button className="gap-2 bg-primary hover:bg-primary/90 w-full md:w-auto">
                <Plus className="w-4 h-4" />
                New Affiliate
              </Button>
            </Link>
          </div>
        </div>

        {/* TABLE (UNCHANGED UI) */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Affiliate Partners</CardTitle>
              <CardDescription>
                {loading
                  ? 'Loading...'
                  : `${affiliates.length} affiliate(s)`}
              </CardDescription>
            </div>

            {/* LIMIT DROPDOWN */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Show: {limit}
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
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">Affiliate Code</th>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Plan</th>
                    {/* <th className="text-left py-3 px-4">Revenue</th> */}
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-6">
                        Loading...
                      </td>
                    </tr>
                  ) : (
                    filteredAffiliates.map((aff) => (
                      <tr key={aff.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-4 px-4 font-medium text-md">{aff.tenantId}</td>

                        <td className="py-4 px-4 font-medium">
                          <p>{aff.companyName}</p>
                          {/* {aff.isVerified && ( */}
                          <p className="text-sm text-primary flex items-center gap-1 mt-1">
                            <CheckCircle className="w-4 h-4" />
                            Verified
                          </p>
                          {/* )} */}
                        </td>

                        <td className="py-4 px-4 text-sm text-muted-foreground">
                          
                          <p>{aff.contact?.email}</p>
                          <p>{aff.contact?.phone?.code}  {aff.contact?.phone?.number}</p>
                        </td>

                        <td className="py-4 px-4">
                          <Badge variant="secondary">{aff.plan}</Badge>
                        </td>

                        {/* <td className="py-4 px-4 font-medium">
                          ${aff.revenue.toLocaleString()}
                        </td> */}

                        <td className="py-4 px-4">
                          <Badge className={getStatusColor(aff.status)}>
                            {aff.status}
                          </Badge>
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
                                <Link href={`/root/affiliates/details/${aff.id}`}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Detail
                                </Link>
                              </DropdownMenuItem>

                              <DropdownMenuItem asChild>
                                <Link href={`/root/affiliates/edit/${aff.id}`}>
                                  <Edit2 className="w-4 h-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() =>
                                  handleDelete(aff.id, aff.companyName)
                                }
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

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
            </div>
          </CardContent>
        </Card>

        {/* STATS (UNCHANGED) */}

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-primary">{affiliates.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Affiliates</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-secondary">
                ${affiliates.reduce((sum, a) => sum + a.revenue, 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Total Revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-accent">
                {affiliates.filter((a) => a.status === 'active').length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Active Affiliates</p>
            </CardContent>
          </Card>
        </div> */}

      </div>
    </AdminProvider>
  );
}