'use client';

import React from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminPageTemplateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export default function AdminPageTemplate({
  title,
  description,
  icon,
  children,
}: AdminPageTemplateProps) {
  const { currentCountry } = useAdmin();

  const countryNames: Record<string, string> = {
    IN: 'India',
    AE: 'United Arab Emirates',
    US: 'United States',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {icon && <div className="text-2xl">{icon}</div>}
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            </div>
            <p className="text-muted-foreground">{description}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Region: <span className="font-semibold">{countryNames[currentCountry]}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      {children}

      {/* Empty State */}
      {!children && (
        <Card>
          <CardHeader>
            <CardTitle>Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This page is under development. Check back soon for the full
              interface with data tables, forms, and management features.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
