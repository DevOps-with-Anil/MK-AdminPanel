// 'use client';

// import { AdminProvider } from '@/contexts/AdminContext';
// import { useState } from 'react';
// import Link from 'next/link';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Plus, Edit2, Trash2, MoreVertical, CreditCard } from 'lucide-react';
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

// interface Plan {
//   id: string;
//   name: { en: string; fr?: string; ar?: string; hi?: string };
//   description: { en: string; fr?: string; ar?: string; hi?: string };
//   price: number;
//   currency: string;
//   type: 'MONTHLY' | 'YEARLY';
//   features: string[];
//   subscribers: number;
//   status: 'active' | 'inactive';
// }

// // Mock data
// const mockPlans: Plan[] = [
//   {
//     id: '1',
//     name: { en: 'Free', fr: 'Gratuit', ar: 'مجاني', hi: 'फ्री' },
//     description: { en: 'Basic free plan', fr: 'Plan gratuit', ar: 'خطة مجانية', hi: 'मुफ्त योजना' },
//     price: 0,
//     currency: 'USD',
//     type: 'MONTHLY',
//     features: ['Dashboard', 'Basic CMS', 'Support Tickets'],
//     subscribers: 1250,
//     status: 'active',
//   },
//   {
//     id: '2',
//     name: { en: 'Pro', fr: 'Pro', ar: 'محترف', hi: 'प्रो' },
//     description: { en: 'Professional plan with advanced features', fr: 'Plan professionnel', ar: 'خطة محترف', hi: 'पेशेवर योजना' },
//     price: 99,
//     currency: 'USD',
//     type: 'MONTHLY',
//     features: ['Dashboard', 'Full CMS', 'Analytics', 'Ad Management', 'Challenges'],
//     subscribers: 450,
//     status: 'active',
//   },
//   {
//     id: '3',
//     name: { en: 'Enterprise', fr: 'Entreprise', ar: 'مؤسسة', hi: 'एंटरप्राइज़' },
//     description: { en: 'All features with priority support', fr: 'Toutes les fonctionnalités', ar: 'كل الميزات', hi: 'सभी सुविधाएँ' },
//     price: 499,
//     currency: 'USD',
//     type: 'MONTHLY',
//     features: ['All Pro Features', 'API Access', 'Custom Roles', 'Priority Support', 'Bulk Export'],
//     subscribers: 85,
//     status: 'active',
//   },
// ];

// function PlansPageContent() {
//   const [plans] = useState<Plan[]>(mockPlans);

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-start gap-4">
//           <CreditCard className="text-primary w-7 h-7 mt-1" />
//           <div>
//             <h1 className="text-xl font-medium text-foreground">Subscription Plans</h1>
//             <p className="text-muted-foreground">Manage subscription tiers and features</p>
//           </div>
//         </div>
//         <Link href="/admin/plans/new">
//           <Button className="gap-2 bg-primary hover:bg-primary/90">
//             <Plus className="w-4 h-4" />
//             New Plan
//           </Button>
//         </Link>
//       </div>

//       {/* Plan Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {plans.map((plan) => (
//           <Card key={plan.id} className="flex flex-col">
//             <CardHeader>
//               <div className="flex items-start justify-between">
//                 <div>
//                   <CardTitle className="text-2xl">{plan.name.en}</CardTitle>
//                   <CardDescription className="mt-1 text-sm text-muted-foreground">
//                     {plan.description?.en}
//                   </CardDescription>
//                   <div className="mt-2 flex items-center gap-2 text-foreground">
//                     <span className="font-bold">{plan.currency} {plan.price}</span>
//                     <span className="text-sm text-muted-foreground">/ {plan.type.toLowerCase()}</span>
//                   </div>
//                 </div>
//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                       <MoreVertical className="w-4 h-4" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end">
//                     <DropdownMenuItem asChild>
//                       <Link href={`/admin/plans/edit/${plan.id}`} className="gap-2 flex items-center">
//                         <Edit2 className="w-4 h-4" /> Edit
//                       </Link>
//                     </DropdownMenuItem>
//                     <DropdownMenuItem className="gap-2 text-destructive">
//                       <Trash2 className="w-4 h-4" /> Delete
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </CardHeader>

//             <CardContent className="flex-1 flex flex-col gap-4">
//               <div className="text-sm text-muted-foreground">
//                 <p><strong>Modules / Features:</strong> {plan.features.length}</p>
//                 <p><strong>Total Subscribers:</strong> {plan.subscribers}</p>
//               </div>
//               <div className="pt-4 border-t border-border flex justify-between items-center">
//                 <Badge className={plan.status === 'active' ? 'bg-primary' : 'bg-secondary'}>
//                   {plan.status.toUpperCase()}
//                 </Badge>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card>
//           <CardContent className="pt-6 text-center">
//             <p className="text-3xl font-bold text-primary">{plans.length}</p>
//             <p className="text-sm text-muted-foreground mt-1">Total Plans</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6 text-center">
//             <p className="text-3xl font-bold text-secondary">
//               ${plans.reduce((sum, p) => sum + p.price * p.subscribers, 0).toLocaleString()}
//             </p>
//             <p className="text-sm text-muted-foreground mt-1">Total Revenue</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6 text-center">
//             <p className="text-3xl font-bold text-accent">
//               {plans.reduce((sum, p) => sum + p.subscribers, 0).toLocaleString()}
//             </p>
//             <p className="text-sm text-muted-foreground mt-1">Total Subscribers</p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

// export default function PlansPage() {
//   return (
//     <AdminProvider>
//       <PlansPageContent />
//     </AdminProvider>
//   );
// }

'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, MoreVertical, CreditCard, Settings } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface Plan {
  id: string;
  name: { en: string; fr?: string; ar?: string; hi?: string };
  description: { en: string; fr?: string; ar?: string; hi?: string };
  price: number;
  currency: string;
  type: 'MONTHLY' | 'YEARLY';
  features: string[];
  subscribers: number;
  status: 'active' | 'inactive';
}

// Mock plans
const mockPlans: Plan[] = [
  {
    id: '1',
    name: { en: 'Free' },
    description: { en: 'Basic free plan' },
    price: 0,
    currency: 'USD',
    type: 'MONTHLY',
    features: ['Dashboard', 'Basic CMS', 'Support Tickets'],
    subscribers: 1250,
    status: 'active',
  },
  {
    id: '2',
    name: { en: 'Pro' },
    description: { en: 'Professional plan with advanced features' },
    price: 99,
    currency: 'USD',
    type: 'MONTHLY',
    features: ['Dashboard', 'Full CMS', 'Analytics', 'Ad Management', 'Challenges'],
    subscribers: 450,
    status: 'active',
  },
  {
    id: '3',
    name: { en: 'Enterprise' },
    description: { en: 'All features with priority support' },
    price: 499,
    currency: 'USD',
    type: 'MONTHLY',
    features: ['All Pro Features', 'API Access', 'Custom Roles', 'Priority Support', 'Bulk Export'],
    subscribers: 85,
    status: 'active',
  },
];

function PlansPageContent() {
  const [plans] = useState<Plan[]>(mockPlans);

  const handleViewModules = (planId: string) => {
    alert(`Viewing modules & permissions for plan ${planId}`);
  };

  const handleUpdatePermissions = (planId: string) => {
    alert(`Update permissions for plan ${planId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <CreditCard className="text-primary w-7 h-7 mt-1" />
          <div>
            <h1 className="text-xl font-medium text-foreground">Subscription Plans</h1>
            <p className="text-muted-foreground">Manage subscription tiers and features</p>
          </div>
        </div>
        <Link href="/admin/plans/new">
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" />
            New Plan
          </Button>
        </Link>
      </div>

{/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">{plans.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Total Plans</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-secondary">
              ${plans.reduce((sum, p) => sum + p.price * p.subscribers, 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Total Revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-accent">
              {plans.reduce((sum, p) => sum + p.subscribers, 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Total Subscribers</p>
          </CardContent>
        </Card>
      </div>


      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{plan.name.en}</CardTitle>
                  <CardDescription className="mt-1 text-sm text-muted-foreground">
                    {plan.description.en}
                  </CardDescription>
                  <div className="mt-2 flex items-center gap-2 text-foreground">
                    <span className="font-bold">{plan.currency} {plan.price}</span>
                    <span className="text-sm text-muted-foreground">/ {plan.type.toLowerCase()}</span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/plans/edit/${plan.id}`} className="gap-2 flex items-center">
                        <Edit2 className="w-4 h-4" /> Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2" onClick={() => handleUpdatePermissions(plan.id)}>
                      <Settings className="w-4 h-4" /> Update Permissions
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-destructive">
                      <Trash2 className="w-4 h-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col gap-4">
              <div className="text-sm text-muted-foreground">
                <p><strong>Modules / Features:</strong> {plan.features.length}</p>
                <p><strong>Total Subscribers:</strong> {plan.subscribers}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Badge className={plan.status === 'active' ? 'bg-primary' : 'bg-secondary'}>
                  {plan.status.toUpperCase()}
                </Badge>
                <Button size="sm" onClick={() => handleViewModules(plan.id)}>
                  View Modules & Permissions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      
    </div>
    
  );
}

export default function PlansPage() {
  return (
    <AdminProvider>
      <PlansPageContent />
    </AdminProvider>
  );
}