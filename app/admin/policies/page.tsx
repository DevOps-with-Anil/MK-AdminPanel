'use client';

import { AdminProvider } from '@/contexts/AdminContext';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BookOpen, CheckCircle, Search } from 'lucide-react';

export default function PoliciesPage() {
  return (
    <AdminProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4">
            <BookOpen className="text-primary w-7 h-7 mt-1" />
            <div>
              <h1 className="text-xl font-medium text-foreground">Policies & FAQ</h1>
              <p className="text-muted-foreground">Manage system policies, terms of service, and frequently asked questions</p>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by policy or question..."
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Policies</CardTitle>
            <CardDescription>Review and update system-wide policies.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Table with system policies will be here.</p>
          </CardContent>
        </Card>
      </div>
    </AdminProvider>
  );
} 
