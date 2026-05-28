// 'use client';


// import { AdminProvider, useAdmin } from '@/contexts/AdminContext';
// import { useState, useEffect, useContext, useCallback } from 'react';
// import Link from 'next/link';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import {
//   Plus,
//   Search,
//   Edit2,
//   Trash2,
//   MoreVertical,
//   Handshake,
//   CheckCircle,
//   Eye,
//   Mail,
//   Phone,
// } from 'lucide-react';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { getAffiliates, deleteEntity } from '@/services/auth.service';
// // import { useDeleteEntity } from '@/hooks/useDeleteEntity';
// import { getConsistentBadgeColor } from '@/utils/getDynamicBadgeColor';
// import { I18nContext } from '@/i18n/provider';
// import { usePagination } from '@/hooks/ui/usePagination';


// interface Affiliate {
//   id: string;
//   tenantId: string;
//   companyName: string;
//   contact: {
//     email: string;
//     phone: {
//       code: string;
//       number: string;
//     };
//   };
//   kybStatus: string;
//   plan: string;
//   isVerified: boolean;
//   status: 'ACTIVE' | 'INACTIVE' | 'REJECTED' | 'SUSPENDED';
//   photo: null
// }

// export default function AffiliatesPage() {

//   // Contexts & State
//   const { t } = useAdmin();
//   // Loading state
//   const [loading, setLoading] = useState(true);
//   // Search state and debounce  
//   const [searchQuery, setSearchQuery] = useState('');
//   const [debouncedSearch, setDebouncedSearch] = useState('');
//   // const { deleteEntity } = useDeleteEntity();
//   // Pagination
//   const PAGE_LIMIT_OPTIONS = [10, 25, 50, 'All'];
//   const { page, setPage, limit, setLimit } = usePagination(10);
//   // Total pages state
//   const [totalPages, setTotalPages] = useState(1);


//   // Affiliates data
//   const [affiliates, setAffiliates] = useState<Affiliate[]>([]);


//   // debounce
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearch(searchQuery);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   // Fetch Tenants List
//   const fetchAffiliates = useCallback(async () => {
//     try {
//       setLoading(true);
//       const fetchLimit = limit === 'All' ? 0 : limit;
//       const res = await getAffiliates({
//         page,
//         limit: fetchLimit,
//         search: debouncedSearch,
//       });
//       // // console.log("Affiliated data   :  " + JSON.stringify(res.data));
//       const formatted: Affiliate[] =
//         res?.data?.map((r: any) => ({
//           id: r._id,
//           tenantId: r.tenantId,

//           companyName: r.companyName || '',

//           contact: {
//             email: r.contact?.email || '',
//             phone: {
//               code: r.contact?.phone?.code || '',
//               number: r.contact?.phone?.number || '',
//             },
//           },
//           kybStatus: r.kybStatus || 'PENDING',
//           plan: r.currentSubscriptionId?.planName || 'Free',
//           isVerified: r.address?.isVerified ?? false,
//           status:
//             r.status === 'ACTIVE'
//               ? 'ACTIVE'
//               : r.status === 'SUSPENDED'
//                 ? 'SUSPENDED'
//                 : r.status === 'REJECTED'
//                   ? 'REJECTED'
//                   : 'INACTIVE',
//           photo: r.logo
//         })) || [];

//       setAffiliates(formatted);
//       setTotalPages(res?.meta?.totalPages ?? 1);

//     } catch (err) {
//       console.error('Fetch affiliates error', err);
//     } finally {
//       setLoading(false);
//     }
//   }, [page, limit, debouncedSearch]);

//   useEffect(() => {
//     fetchAffiliates();
//   }, [fetchAffiliates]);

//   // delete
//   // const handleDelete = async (id: string, name: string) => {
//   //   if (!confirm(`Delete "${name}" affiliate?`)) return;
//   //   try {
//   //     await deleteEntity('affiliate', id);
//   //     setAffiliates((prev) => prev.filter((a) => a.id !== id));
//   //   } catch (err) {
//   //     console.error(err);
//   //     alert('Failed to delete affiliate');
//   //   }
//   // };

//   // filter (SAFE)
//   const filteredAffiliates = affiliates.filter((aff) => {
//     const name = aff.companyName || '';
//     const email = aff.contact?.email || '';

//     return (
//       name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       email.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   });

//   return (
//     <AdminProvider>
//       <div className="space-y-6">

//         {/* HEADER (UNCHANGED) */}
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
//           <div className="flex items-start gap-4">
//             <Handshake className="text-primary w-7 h-7 mt-1" />
//             <div>
//               <h1 className="text-xl font-medium text-foreground">Tenants</h1>
//               <p className="text-muted-foreground">
//                 Manage tenant partners and their performance
//               </p>
//             </div>
//           </div>

//           <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
//             <div className="relative w-full md:w-64">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//               <Input
//                 type="text"
//                 placeholder="Search by name or email......"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10"
//               />
//             </div>

//             <Link href="/root/affiliates/new">
//               <Button className="gap-2 bg-primary hover:bg-primary/90 w-full md:w-auto">
//                 <Plus className="w-4 h-4" />
//                 New Tenant
//               </Button>
//             </Link>
//           </div>
//         </div>

//         {/* TABLE (UNCHANGED UI) */}
//         <Card>
//           <CardHeader className="flex items-center justify-between">
//             <div>
//               <CardTitle>{t('translate.sidebar_tenants')}</CardTitle>
//               <CardDescription>
//                 {loading
//                   ? 'Loading...'
//                   : `${affiliates.length} Tenant(s)`}
//               </CardDescription>
//             </div>

//             {/* LIMIT DROPDOWN */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                 >
//                   Show: {limit}
//                 </Button>
//               </DropdownMenuTrigger>

//               <DropdownMenuContent align="end">
//                 {PAGE_LIMIT_OPTIONS.map(
//                   (option) => (
//                     <DropdownMenuItem
//                       key={option}
//                       onClick={() => {
//                         setLimit(
//                           option === 'All'
//                             ? 'All'
//                             : Number(option)
//                         );

//                         setPage(1);
//                       }}
//                     >
//                       {option}
//                     </DropdownMenuItem>
//                   )
//                 )}
//               </DropdownMenuContent>
//             </DropdownMenu>

//           </CardHeader>

//           <CardContent>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b border-border">
//                     <th className="text-left py-3 px-4">Logo</th>
//                     <th className="text-left py-3 px-4">Tenant Name</th>
//                     <th className="text-left py-3 px-4">Contact</th>
//                     <th className="text-left py-3 px-4">Membership</th>
//                     <th className="text-left py-3 px-4">KYB</th>
//                     <th className="text-left py-3 px-4">Status</th>
//                     <th className="text-right py-3 px-4">Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {loading ? (
//                     <tr>
//                       <td colSpan={7} className="text-center py-6">
//                         Loading...
//                       </td>
//                     </tr>
//                   ) : (
//                     filteredAffiliates.map((aff) => (
//                       <tr key={aff.id} className="border-b border-border hover:bg-muted/50">
//                         {/* IMAGE COLUMN */}
//                         <td className="py-4 px-4">
//                           <div className="flex items-center gap-3">
//                             {aff.photo ? (
//                               <img
//                                 src={aff.photo}
//                                 alt={aff.companyName}
//                                 className="w-14 h-14 rounded-full object-cover border"
//                               />
//                             ) : (
//                               <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold">
//                                 {aff.companyName?.charAt(0)?.toUpperCase()}
//                               </div>
//                             )}
//                           </div>
//                         </td>

//                         <td className="py-4 px-4 font-medium">
//                           <p>{aff.companyName}</p>
//                           {/* {aff.isVerified && ( */}
//                           {/* <p className="text-sm text-primary flex items-center gap-1 mt-1">
//                             <CheckCircle className="w-4 h-4" />
//                             Verified
//                           </p> */}
//                           <p className="text-sm text-primary flex items-center gap-1 mt-1">{aff.tenantId}</p>
//                           {/* )} */}
//                         </td>

//                         <td className="py-4 px-4 text-sm text-muted-foreground">

//                           {/* <p>{aff.contact?.email}</p>
//                           <p>{aff.contact?.phone?.code}  {aff.contact?.phone?.number}</p> */}

//                           <div className="flex items-center gap-2 text-xm font-medium text-muted-foreground">
//                             <Mail className="w-4 h-4" />
//                             {aff.contact?.email}
//                           </div>
//                           <div className="flex items-center gap-2 text-xm font-medium text-muted-foreground">
//                             <Phone className="w-4 h-4" />
//                             {aff.contact?.phone?.code}  {aff.contact?.phone?.number}
//                           </div>
//                         </td>

//                         <td className="py-4 px-4">
//                           <Badge
//                             className={getConsistentBadgeColor(
//                               aff.plan
//                             )}
//                           >
//                             <span className="text-xs">
//                               {aff.plan}
//                             </span>
//                           </Badge>
//                         </td>

//                         <td className="py-4 px-4">
//                           <Badge
//                             className={getConsistentBadgeColor(
//                               aff.kybStatus
//                             )}
//                           >
//                             <span className="text-xs">
//                               {aff.kybStatus}
//                             </span>
//                           </Badge>
//                         </td>

//                         <td className="py-4 px-4">
//                           <Badge
//                             className={getConsistentBadgeColor(
//                               aff.status
//                             )}
//                           >
//                             <span className="text-xs">
//                               {aff.status}
//                             </span>
//                           </Badge>
//                         </td>

//                         <td className="py-4 px-4 text-right">
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                                 <MoreVertical className="w-4 h-4" />
//                               </Button>
//                             </DropdownMenuTrigger>

//                             <DropdownMenuContent align="end">

//                               <DropdownMenuItem asChild>
//                                 <Link href={`/root/affiliates/${aff.id}`}>
//                                   <Eye className="w-4 h-4 mr-2" />
//                                   Detail
//                                 </Link>
//                               </DropdownMenuItem>

//                               <DropdownMenuItem asChild>
//                                 <Link href={`/root/affiliates/edit/${aff.id}`}>
//                                   <Edit2 className="w-4 h-4 mr-2" />
//                                   Edit
//                                 </Link>
//                               </DropdownMenuItem>

//                               {/* <DropdownMenuItem
//                                 className="text-destructive"
//                                 onClick={() =>
//                                   handleDelete(aff.id, aff.companyName)
//                                 }
//                               >
//                                 <Trash2 className="w-4 h-4 mr-2" />
//                                 Remove
//                               </DropdownMenuItem> */}
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>

//               {/* PAGINATION */}
//               <div className="flex justify-end gap-2 p-4">
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   disabled={page === 1}
//                   onClick={() => setPage((p) => p - 1)}
//                 >
//                   Prev
//                 </Button>

//                 {[...Array(totalPages)].map((_, i) => (
//                   <Button
//                     key={i}
//                     size="sm"
//                     variant={page === i + 1 ? 'default' : 'outline'}
//                     onClick={() => setPage(i + 1)}
//                   >
//                     {i + 1}
//                   </Button>
//                 ))}

//                 <Button
//                   size="sm"
//                   variant="outline"
//                   disabled={page === totalPages}
//                   onClick={() => setPage((p) => p + 1)}
//                 >
//                   Next
//                 </Button>
//               </div>

//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </AdminProvider>
//   );
// }


// Translations all title  :

'use client';

import { AdminProvider, useAdmin } from '@/contexts/AdminContext';
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
  MoreVertical,
  Handshake,
  Eye,
  Mail,
  Phone,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { getAffiliates } from '@/services/auth.service';
import { getConsistentBadgeColor } from '@/utils/getDynamicBadgeColor';
import { usePagination } from '@/hooks/ui/usePagination';

interface Affiliate {
  id: string;
  tenantId: string;
  companyName: string;
  contact: {
    email: string;
    phone: {
      code: string;
      number: string;
    };
  };
  kybStatus: string;
  plan: string;
  isVerified: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'REJECTED' | 'SUSPENDED';
  photo: null;
}

export default function AffiliatesPage() {
  const { t } = useAdmin();

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const PAGE_LIMIT_OPTIONS = [10, 25, 50, 'All'];
  const { page, setPage, limit, setLimit } = usePagination(10);
  const [totalPages, setTotalPages] = useState(1);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchAffiliates = useCallback(async () => {
    try {
      setLoading(true);

      const fetchLimit = limit === 'All' ? 0 : limit;

      const res = await getAffiliates({
        page,
        limit: fetchLimit,
        search: debouncedSearch,
      });

      const formatted: Affiliate[] =
        res?.data?.map((r: any) => ({
          id: r._id,
          tenantId: r.tenantId,

          companyName: r.companyName || '',

          contact: {
            email: r.contact?.email || '',
            phone: {
              code: r.contact?.phone?.code || '',
              number: r.contact?.phone?.number || '',
            },
          },

          kybStatus: r.kybStatus || 'PENDING',

          plan: r.currentSubscriptionId?.planName || 'Free',

          isVerified: r.address?.isVerified ?? false,

          status:
            r.status === 'ACTIVE'
              ? 'ACTIVE'
              : r.status === 'SUSPENDED'
                ? 'SUSPENDED'
                : r.status === 'REJECTED'
                  ? 'REJECTED'
                  : 'INACTIVE',

          photo: r.logo,
        })) || [];

      setAffiliates(formatted);

      setTotalPages(res?.meta?.totalPages ?? 1);
    } catch (err) {
      console.error(t('translate.fetch_affiliates_error'), err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, t]);

  useEffect(() => {
    fetchAffiliates();
  }, [fetchAffiliates]);

  const filteredAffiliates = affiliates.filter((aff) => {
    const name = aff.companyName || '';
    const email = aff.contact?.email || '';

    return (
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <AdminProvider>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-start gap-4">
            <Handshake className="text-primary w-7 h-7 mt-1" />

            <div>
              <h1 className="text-xl font-medium text-foreground">
                {t('translate.sidebar_tenants')}
              </h1>

              <p className="text-muted-foreground">
                {t('translate.tenants_description')}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

              <Input
                type="text"
                placeholder={t('translate.search_by_name_or_email')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Link href="/root/affiliates/new">
              <Button className="gap-2 bg-primary hover:bg-primary/90 w-full md:w-auto">
                <Plus className="w-4 h-4" />
                {t('translate.new_tenant')}
              </Button>
            </Link>
          </div>
        </div>

        {/* TABLE */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>
                {t('translate.sidebar_tenants')}
              </CardTitle>

              <CardDescription>
                {loading
                  ? t('translate.loading')
                  : `${affiliates.length} ${t('translate.tenants_count')}`}
              </CardDescription>
            </div>

            {/* LIMIT */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {t('translate.show')}: {limit}
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
              <table className="w-full">

                <thead>
                  <tr className="border-b border-border">

                    <th className="text-left py-3 px-4">
                      {t('translate.logo')}
                    </th>

                    <th className="text-left py-3 px-4">
                      {t('translate.tenant_name')}
                    </th>

                    <th className="text-left py-3 px-4">
                      {t('translate.contact')}
                    </th>

                    <th className="text-left py-3 px-4">
                      {t('translate.membership')}
                    </th>

                    <th className="text-left py-3 px-4">
                      {t('translate.kyb')}
                    </th>

                    <th className="text-left py-3 px-4">
                      {t('translate.status')}
                    </th>

                    <th className="text-right py-3 px-4">
                      {t('translate.actions')}
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-6">
                        {t('translate.loading')}
                      </td>
                    </tr>
                  ) : (
                    filteredAffiliates.map((aff) => (
                      <tr
                        key={aff.id}
                        className="border-b border-border hover:bg-muted/50"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {aff.photo ? (
                              <img
                                src={aff.photo}
                                alt={aff.companyName}
                                className="w-14 h-14 rounded-full object-cover border"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold">
                                {aff.companyName?.charAt(0)?.toUpperCase()}
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="py-4 px-4 font-medium">
                          <p>{aff.companyName}</p>

                          <p className="text-sm text-primary flex items-center gap-1 mt-1">
                            {aff.tenantId}
                          </p>
                        </td>

                        <td className="py-4 px-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2 text-xm font-medium text-muted-foreground">
                            <Mail className="w-4 h-4" />
                            {aff.contact?.email}
                          </div>

                          <div className="flex items-center gap-2 text-xm font-medium text-muted-foreground">
                            <Phone className="w-4 h-4" />
                            {aff.contact?.phone?.code} {aff.contact?.phone?.number}
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <Badge className={getConsistentBadgeColor(aff.plan)}>
                            <span className="text-xs">
                              {aff.plan}
                            </span>
                          </Badge>
                        </td>

                        <td className="py-4 px-4">
                          <Badge className={getConsistentBadgeColor(aff.kybStatus)}>
                            <span className="text-xs">
                              {aff.kybStatus}
                            </span>
                          </Badge>
                        </td>

                        <td className="py-4 px-4">
                          <Badge className={getConsistentBadgeColor(aff.status)}>
                            <span className="text-xs">
                              {aff.status}
                            </span>
                          </Badge>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">

                              <DropdownMenuItem asChild>
                                <Link href={`/root/affiliates/${aff.id}`}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  {t('translate.detail')}
                                </Link>
                              </DropdownMenuItem>

                              <DropdownMenuItem asChild>
                                <Link href={`/root/affiliates/edit/${aff.id}`}>
                                  <Edit2 className="w-4 h-4 mr-2" />
                                  {t('translate.edit')}
                                </Link>
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
                  {t('translate.prev')}
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
                  {t('translate.next')}
                </Button>

              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminProvider>
  );
}