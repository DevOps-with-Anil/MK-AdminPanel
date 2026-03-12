'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CheckCircle, Search } from 'lucide-react';

export default function VerificationPage() {
  return (
    <AdminProvider>
      <AdminLayout>
        <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <CheckCircle className="text-primary w-10 h-10 mt-1" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">KYB Requests</h1>
            <p className="text-muted-foreground">Manage and review KYB submissions</p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by affiliate or request ID..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
          <CardDescription>Review and process new KYB submissions.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Table with KYB requests will be here.</p>
        </CardContent>
      </Card>
      </div>
      </AdminLayout>
    </AdminProvider>
  );
}
