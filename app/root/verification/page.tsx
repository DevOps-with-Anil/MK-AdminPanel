
'use client';

import { useEffect, useMemo, useState } from 'react';
import { AdminProvider, useAdmin } from '@/contexts/AdminContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  Search,
  Eye,
  CheckCheck,
  XCircle,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { usePagination } from '@/hooks/ui/usePagination';
import { getConsistentBadgeColor } from '@/utils/getDynamicBadgeColor';

import { getKYBListtoVerify } from '@/services/auth.service';
import { formatDate } from "@/utils/dateFormatter";




interface ApiKYBRequest {
  KYBID: string;

  createdAt: string;

  status:
  | 'UPLOADED'
  | 'APPROVED'
  | 'REJECTED'
  | 'INREVIEW';

  submittedByUserType: string;

  submittedByModel: string;

  submittedBY?: {
    _id: string;
    name: string;
    email: string;
  } | null;

  verifiedBy?: {
    name?: string;
  } | null;

  tenantId: {
    _id: string;

    companyName: string;

    contact?: {
      email?: string;

      phone?: {
        code?: string;
        number?: string;
      };
    };
  };
}

interface KYBRequest {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  submittedAt: string;
  status: 'UPLOADED' | 'APPROVED' | 'REJECTED' | 'INREVIEW';
  // documents: KYBDocument[];
  submittedBy?: string;
  approvedBy?: string | null;
}

function VerificationPageContent() {
  const { t } = useAdmin();

  // Loading state
  const [loading, setLoading] = useState(true);

  // API Data
  const [requests, setRequests] = useState<KYBRequest[]>([]);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination
  const PAGE_LIMIT_OPTIONS = [10, 25, 50, 'All'];

  const { page, setPage, limit, setLimit } = usePagination(10);

  const [totalPages, setTotalPages] = useState(1);

  const [debouncedSearch, setDebouncedSearch] = useState('');


  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const fetchKYBRequests = async () => {
      try {
        setLoading(true);

        // Replace with your actual API endpoint
        const res = await getKYBListtoVerify({
          page,
          limit: limit === 'All' ? 1000000 : limit,
          search: debouncedSearch,
        });


        console.log(JSON.stringify(res))

        if (res.status === 201) {
          const transformedData: KYBRequest[] = res.data.map(
            (item: ApiKYBRequest) => ({
              id: item.KYBID,

              companyName:
                item?.tenantId?.companyName || '-',

              email:
                item?.tenantId?.contact?.email || '-',

              phone: `${item?.tenantId?.contact?.phone?.code || ''
                } ${item?.tenantId?.contact?.phone?.number || ''}`,

              submittedAt: item.createdAt,

              status: item.status,

              submittedBy:
                item?.submittedBY?.name || '-',

              approvedBy:
                item?.verifiedBy?.name || null,

            })
          );

          setRequests(transformedData);

          console.log("List Data.  :   " + JSON.stringify(requests))
        }
      } catch (error) {
        console.error(
          'Failed to fetch KYB requests:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchKYBRequests();
  }, []);

  /* ================= COMMON HELPERS ================= */


  /* ================= FILTER ================= */

  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      const q = searchQuery.toLowerCase();

      return (
        item.companyName
          .toLowerCase()
          .includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    });
  }, [requests, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-start gap-4">
          <CheckCircle className="text-primary w-7 h-7 mt-1" />

          <div>
            <h1 className="text-xl font-medium text-foreground">
              KYB Requests
            </h1>

            <p className="text-muted-foreground">
              Manage and review KYB submissions
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <Input
            type="text"
            placeholder="Search requests..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
          />
        </div>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>KYB Requests</CardTitle>

            <CardDescription>
              Review and process new KYB submissions.
            </CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
              >
                Show: {limit}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {PAGE_LIMIT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option}
                  onClick={() => {
                    setLimit(
                      option === 'All'
                        ? 'All'
                        : Number(option)
                    );

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
                  <th className="text-left py-3 px-4">
                    KYB ID
                  </th>

                  <th className="text-left py-3 px-4">
                    Requester
                  </th>

                  <th className="text-left py-3 px-4">
                    Submitted at
                  </th>

                  <th className="text-left py-3 px-4">
                    Submitted by
                  </th>

                  <th className="text-left py-3 px-4">
                    Status
                  </th>

                  {/* <th className="text-left py-3 px-4">
                    Approved By
                  </th> */}

                  <th className="text-right py-3 px-4">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b hover:bg-muted/20 transition-colors"
                  >
                    {/* KYB ID */}
                    <td className="p-4 align-top">
                      <div className="font-medium text-foreground">
                        {request.id}
                      </div>
                    </td>

                    {/* REQUESTER */}
                    <td className="p-4 align-top">
                      <div className="font-medium text-foreground">
                        {request.companyName}
                      </div>
                    </td>

                    {/* SUBMITTED */}
                    <td className="p-4 align-top">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Calendar className="w-4 h-4" />

                        {formatDate(
                          request.submittedAt
                        )}
                      </div>
                    </td>

                    {/* SUBMITTED BY */}
                    <td className="p-4 align-top">
                      <div className="text-sm font-medium text-muted-foreground">
                        {request.submittedBy}
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="p-4 align-top">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getConsistentBadgeColor(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </div>
                    </td>

                    {/* APPROVED BY */}
                    {/* <td className="p-4 align-top">
                      {request.status ===
                        'APPROVED' &&
                        request.approvedBy ? (
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {request.approvedBy}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xm text-muted-foreground italic">
                          Not approved yet
                        </div>
                      )}
                    </td> */}

                    {/* ACTIONS */}
                    <td className="p-4 align-top">
                      <div className="flex items-center justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            align="end"
                            className="w-44"
                          >
                            <DropdownMenuItem
                              onClick={() =>
                                (window.location.href = `/root/verification/${request.id}`)
                              }
                              className="cursor-pointer"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Review Request
                            </DropdownMenuItem>

                            {request.status ===
                              'UPLOADED' && (
                                <DropdownMenuItem className="cursor-pointer text-green-600 focus:text-green-600">
                                  <CheckCheck className="w-4 h-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                              )}

                            {request.status ===
                              'UPLOADED' && (
                                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                              )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!loading &&
              !filteredRequests.length && (
                <div className="py-10 text-center text-muted-foreground">
                  No KYB requests found.
                </div>
              )}

            {loading && (
              <div className="py-10 text-center text-muted-foreground">
                Loading KYB requests...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <AdminProvider>
      <VerificationPageContent />
    </AdminProvider>
  );
}