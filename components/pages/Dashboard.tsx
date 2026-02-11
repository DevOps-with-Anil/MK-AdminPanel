'use client';

import React from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Zap, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const { currentUser, currentCountry, currentLanguage, hasFeature, t } = useAdmin();

  const countryNames: Record<string, string> = {
    IN: 'India',
    AE: 'United Arab Emirates',
    US: 'United States',
  };

  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12% from last month',
      icon: Users,
      color: 'text-primary',
    },
    {
      title: 'Active Tenants',
      value: '48',
      change: '+5% from last month',
      icon: Zap,
      color: 'text-accent',
    },
    {
      title: 'Subscriptions',
      value: '$12,450',
      change: '+23% from last month',
      icon: TrendingUp,
      color: 'text-secondary',
    },
    {
      title: 'Completed Tasks',
      value: '892',
      change: '+8% from last month',
      icon: CheckCircle,
      color: 'text-primary',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary via-primary/80 to-accent rounded-lg p-8 text-primary-foreground shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="text-primary-foreground/90 max-w-2xl">
              You are logged in as <span className="font-semibold">{currentUser.type.replace('-', ' ').toUpperCase()}</span> in{' '}
              <span className="font-semibold">{countryNames[currentCountry]}</span>. Your subscription plan is{' '}
              <span className="font-semibold uppercase">{currentUser.subscriptionPlan}</span>.
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold opacity-30">🌙</div>
            <p className="text-sm text-primary-foreground/70 mt-2">Islamic Admin</p>
          </div>
        </div>
      </div>

      {/* System Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground mt-2">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {stat.change}
                    </p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color} opacity-80`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Features & Permissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Permissions</CardTitle>
            <CardDescription>Modules and actions you have access to</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-background rounded-lg border border-border">
                <p className="font-medium text-sm text-foreground">Role</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentUser.role.name}
                </p>
              </div>
              <div className="p-3 bg-background rounded-lg border border-border">
                <p className="font-medium text-sm text-foreground">
                  Total Permissions
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {currentUser.role.permissions.length} actions available
                </p>
              </div>
              <div className="p-3 bg-background rounded-lg border border-border">
                <p className="font-medium text-sm text-foreground">
                  Subscription Plan
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="inline-block px-2 py-1 bg-accent text-accent-foreground rounded text-xs font-semibold">
                    {currentUser.subscriptionPlan.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature Access</CardTitle>
            <CardDescription>Features available on your plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { feature: 'cms_full', label: 'Full CMS Management' },
                { feature: 'challenges', label: 'Challenges Module' },
                { feature: 'ads_full', label: 'Advanced Ads System' },
                { feature: 'analytics', label: 'Analytics Dashboard' },
                { feature: 'api_access', label: 'API Access' },
                { feature: 'custom_roles', label: 'Custom Roles' },
              ].map((item) => (
                <div
                  key={item.feature}
                  className="flex items-center gap-2 p-2 rounded hover:bg-background transition-colors"
                >
                  <div
                    className={`w-4 h-4 rounded-full ${
                      hasFeature(item.feature)
                        ? 'bg-primary'
                        : 'bg-muted'
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      hasFeature(item.feature)
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground line-through'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions across the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                user: 'Ahmed Hassan',
                action: 'Created new affiliate account',
                time: '2 hours ago',
              },
              {
                user: 'Fatima Khan',
                action: 'Updated subscription plan',
                time: '4 hours ago',
              },
              {
                user: 'Mohammad Ali',
                action: 'Resolved support ticket #234',
                time: '6 hours ago',
              },
              {
                user: 'Zainab Ahmed',
                action: 'Published new CMS article',
                time: '8 hours ago',
              },
              {
                user: 'Hassan Ibrahim',
                action: 'Created new challenge',
                time: '10 hours ago',
              },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium text-foreground text-sm">
                    {activity.user}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activity.action}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                  {activity.time}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>


    </div>
  );
}
