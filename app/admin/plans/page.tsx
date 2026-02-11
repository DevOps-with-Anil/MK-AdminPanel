'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, MoreVertical, CreditCard } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Plan {
  id: string;
  name: string;
  price: number;
  billing: 'monthly' | 'yearly';
  subscribers: number;
  features: string[];
  status: 'active' | 'inactive';
}

const mockPlans: Plan[] = [
  {
    id: '1',
    name: 'Free',
    price: 0,
    billing: 'monthly',
    subscribers: 1250,
    features: ['Dashboard', 'Basic CMS', 'Support Tickets'],
    status: 'active',
  },
  {
    id: '2',
    name: 'Pro',
    price: 99,
    billing: 'monthly',
    subscribers: 450,
    features: ['Dashboard', 'Full CMS', 'Challenges', 'Analytics', 'Ad Management'],
    status: 'active',
  },
  {
    id: '3',
    name: 'Enterprise',
    price: 499,
    billing: 'monthly',
    subscribers: 85,
    features: ['All Pro Features', 'API Access', 'Custom Roles', 'Priority Support', 'Bulk Export'],
    status: 'active',
  },
];

function PlansPageContent() {
  const [plans] = useState<Plan[]>(mockPlans);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <CreditCard className="text-primary w-10 h-10 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Subscription Plans</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="mt-2">
                    <span className="text-2xl font-bold text-foreground">${plan.price}</span>
                    <span className="text-muted-foreground">/{plan.billing}</span>
                  </CardDescription>
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
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-destructive">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Features:</p>
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <span className="text-primary">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{plan.subscribers} subscribers</span>
                  <Badge className="bg-primary">{plan.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{plans.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Plans</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">${plans.reduce((sum, p) => sum + Math.floor(p.price * p.subscribers / 100), 0).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Monthly Revenue</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">{plans.reduce((sum, p) => sum + p.subscribers, 0).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Total Subscribers</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PlansPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <PlansPageContent />
      </AdminLayout>
    </AdminProvider>
  );
}
