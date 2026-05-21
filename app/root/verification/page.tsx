
'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
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
  User,
  User2,
} from 'lucide-react';
import Link from "next/link";
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
  KYBID: string;
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
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<KYBRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const PAGE_LIMIT_OPTIONS = [10, 25, 50, 'All'];
  const { page, setPage, limit, setLimit } = usePagination(10);
  const [totalPages, setTotalPages] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');


  /* ================= FETCH DATA ================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // useEffect(() => {
  //   const fetchKYBRequests = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await getKYBListtoVerify({
  //         page,
  //         limit: limit === 'All' ? 1000000 : limit,
  //         search: debouncedSearch,
  //       });


  //       console.log(JSON.stringify(res))

  //       if (res.status === 201) {
  //         const transformedData: KYBRequest[] = res.data.map(
  //           (item: ApiKYBRequest) => ({
  //             id: item.tenantId?._id,
  //             KYBID: item.KYBID,
  //             companyName: item?.tenantId?.companyName || '-',
  //             email: item?.tenantId?.contact?.email || '-',
  //             phone: `${item?.tenantId?.contact?.phone?.code || ''} ${item?.tenantId?.contact?.phone?.number || ''}`,
  //             submittedAt: item.createdAt,
  //             status: item.status,
  //             submittedBy: item?.submittedBY?.name || '-',
  //             approvedBy: item?.verifiedBy?.name || null,
  //           })
  //         );

  //         setRequests(transformedData);

  //         console.log("List Data.  :   " + JSON.stringify(requests))
  //       }
  //     } catch (error) {
  //       console.error(
  //         'Failed to fetch KYB requests:',
  //         error
  //       );
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchKYBRequests();
  // }, []);

  // Fetch KYB Requests

  const fetchKYBRequests = useCallback(async () => {
    try {

      // ONLY show full loader first time
      if (requests.length === 0) {
        setLoading(true);
      }

      const fetchLimit =
        limit === 'All' ? 0 : limit;

      const res = await getKYBListtoVerify({
        page,
        limit: fetchLimit,
        search: debouncedSearch,
      });

      const formatted: KYBRequest[] =
        res?.data?.map(
          (item: ApiKYBRequest) => ({
            id: item?.tenantId?._id,

            KYBID:
              item?.KYBID || '',

            companyName:
              item?.tenantId?.companyName || '-',

            email:
              item?.tenantId?.contact?.email || '-',

            phone: `${item?.tenantId?.contact?.phone?.code || ''
              } ${item?.tenantId?.contact?.phone?.number || ''
              }`,

            submittedAt:
              item?.createdAt,

            status:
              item?.status,

            submittedBy:
              item?.submittedBY?.name || '-',

            approvedBy:
              item?.verifiedBy?.name || null,
          })
        ) || [];

      // REPLACE DATA AFTER FETCH
      setRequests(formatted);

      setTotalPages(
        res?.meta?.totalPages ?? 1
      );

    } catch (err) {

      console.error(
        'Failed to fetch KYB requests:',
        err
      );

    } finally {

      setLoading(false);
    }

  }, [
    page,
    limit,
    debouncedSearch,
    requests.length
  ]);

  useEffect(() => {
    fetchKYBRequests();
  }, [fetchKYBRequests]);


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

                  <th className="text-left py-3 px-4">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRequests.map((request) => (
                  <tr
                    key={request.KYBID}
                    className="border-b hover:bg-muted/20 transition-colors"
                  >
                    {/* KYB ID */}
                    <td className="p-4 align-top">
                      <div className="font-medium text-foreground">
                        {request.KYBID}
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
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <User2 className="w-4 h-4" />
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
                      <div className="flex items-center justify-left">
                        <Link href={`/root/verification/${request.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Review KYB
                          </Button>
                        </Link>
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
  );
}

export default function VerificationPage() {
  return (
    <AdminProvider>
      <VerificationPageContent />
    </AdminProvider>
  );
}