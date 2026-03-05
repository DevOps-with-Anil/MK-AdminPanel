'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/contexts/AdminContext';
import { MODULES } from '@/lib/mock-data';
import { Menu, X, Globe, LanguagesIcon, LogOut, ChevronDown, Lock, Crown, Zap } from 'lucide-react';
import { logout } from '@/components/AuthGuard';

interface MenuItem {
  label: string;
  href: string;
  module: string;
  feature?: string;
  requiredPlan?: 'pro' | 'enterprise';
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const {
    currentLanguage,
    currentCountry,
    currentUser,
    subscriptionPlan,
    setLanguage,
    setCountry,
    t,
    canAccessModule,
  } = useAdmin();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  // COMMENTED OUT: Original logic for expanded categories
  // const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
  //   system: true,
  //   business: true,
  //   content: true,
  //   support: true,
  // });

  // NEW: Always show content and support sections expanded by default for all users
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    system: true,
    business: true,
    content: true,  // Always expanded by default
    support: true, // Always expanded by default
  });

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Get organized menu items by category - filtered by subscription plan
  const getMenuByCategory = (): Record<string, MenuItem[]> => {
    const categoryMenus: Record<string, MenuItem[]> = {
      system: [],
      business: [],
      content: [],
      support: [],
    };

    if (canAccessModule(MODULES.ADMIN_USERS)) {
      categoryMenus.system.push({
        label: t('sidebar.admin_users'),
        href: '/admin/users',
        module: MODULES.ADMIN_USERS,
        feature: 'admin_users',
      });
    }
    if (canAccessModule(MODULES.ROLES_PERMISSIONS)) {
      categoryMenus.system.push({
        label: t('sidebar.roles_permissions'),
        href: '/admin/roles',
        module: MODULES.ROLES_PERMISSIONS,
        feature: 'roles_permissions',
      });
    }
    if (canAccessModule(MODULES.MODULES_ACTIONS)) {
      categoryMenus.system.push({
        label: t('sidebar.modules_actions'),
        href: '/admin/modules',
        module: MODULES.MODULES_ACTIONS,
        feature: 'modules_actions',
      });
    }
    if (canAccessModule('audit_logs')) {
      categoryMenus.system.push({
        label: 'Audit Logs',
        href: '/admin/audit-logs',
        module: 'audit_logs',
      });
    }
    if (canAccessModule(MODULES.PERMISSION_PACKAGES)) {
      categoryMenus.system.push({
        label: t('sidebar.permission_packages'),
        href: '/admin/permissions',
        module: MODULES.PERMISSION_PACKAGES,
        feature: 'permission_packages',
      });
    }
    if (canAccessModule(MODULES.SETTINGS)) {
      categoryMenus.system.push({
        label: t('sidebar.settings'),
        href: '/admin/settings',
        module: MODULES.SETTINGS,
        feature: 'settings',
      });
    }

    if (canAccessModule(MODULES.SUBSCRIPTION_PLANS)) {
      categoryMenus.business.push({
        label: t('sidebar.subscription_plans'),
        href: '/admin/plans',
        module: MODULES.SUBSCRIPTION_PLANS,
        feature: 'subscription_plans',
      });
    }
    if (canAccessModule(MODULES.AFFILIATES)) {
      categoryMenus.business.push({
        label: t('sidebar.affiliates'),
        href: '/admin/affiliates',
        module: MODULES.AFFILIATES,
        feature: 'affiliates',
      });
    }
    if (canAccessModule(MODULES.COUNTRIES)) {
      categoryMenus.business.push({
        label: t('sidebar.countries'),
        href: '/admin/countries',
        module: MODULES.COUNTRIES,
        feature: 'countries',
      });
    }
    if (canAccessModule(MODULES.SUB_ADMINS)) {
      categoryMenus.business.push({
        label: t('sidebar.sub_admins'),
        href: '/admin/sub-admins',
        module: MODULES.SUB_ADMINS,
        feature: 'sub_admins',
      });
    }

    if (canAccessModule(MODULES.CMS)) {
      categoryMenus.content.push({
        label: t('sidebar.cms'),
        href: '/admin/cms',
        module: MODULES.CMS,
        feature: 'cms_full',
      });
      categoryMenus.content.push({
        label: 'Articles',
        href: '/admin/articles',
        module: 'articles',
        feature: 'articles',
      });
      categoryMenus.content.push({
        label: 'Videos',
        href: '/admin/videos',
        module: 'videos',
        feature: 'videos',
      });
      categoryMenus.content.push({
        label: 'Categories',
        href: '/admin/categories',
        module: 'categories',
        feature: 'categories',
      });
    }
    if (canAccessModule(MODULES.CHALLENGES)) {
      categoryMenus.content.push({
        label: 'Challenges',
        href: '/admin/challenges',
        module: MODULES.CHALLENGES,
        feature: 'challenges',
        requiredPlan: 'pro',
      });
    }
    if (canAccessModule(MODULES.ADS)) {
      categoryMenus.content.push({
        label: t('sidebar.ads'),
        href: '/admin/ads',
        module: MODULES.ADS,
        feature: 'ads_full',
      });
    }

    if (canAccessModule(MODULES.SUPPORT_TICKETS)) {
      categoryMenus.support.push({
        label: t('sidebar.support_tickets'),
        href: '/admin/tickets',
        module: MODULES.SUPPORT_TICKETS,
        feature: 'support_tickets',
      });
    }
    if (canAccessModule(MODULES.POLICIES_FAQ)) {
      categoryMenus.support.push({
        label: t('sidebar.policies_faq'),
        href: '/admin/policies',
        module: MODULES.POLICIES_FAQ,
        feature: 'policies_faq',
        requiredPlan: 'enterprise',
      });
    }
    if (canAccessModule(MODULES.PROFILE)) {
      categoryMenus.support.push({
        label: t('sidebar.profile'),
        href: '/admin/profile',
        module: MODULES.PROFILE,
        feature: 'profile',
      });
    }
    if (canAccessModule(MODULES.VERIFICATION)) {
      categoryMenus.support.push({
        label: t('sidebar.verification'),
        href: '/admin/verification',
        module: MODULES.VERIFICATION,
        feature: 'verification',
      });
    }

    return categoryMenus;
  };

  const categoryMenus = getMenuByCategory();
  const categoryLabels: Record<string, string> = {
    system: 'System',
    business: 'Business',
    content: 'Content',
    support: 'Support',
  };
  const categoryIcons: Record<string, string> = {
    system: '⚙️',
    business: '💼',
    content: '📝',
    support: '🎯',
  };

  const isRTL = currentLanguage === 'ar';

  const renderMenuCategory = (categoryKey: string, items: MenuItem[]) => {
    const visibleItems = items;

    if (visibleItems.length === 0) return null;

    const isExpanded = expandedCategories[categoryKey];

    return (
      <div key={categoryKey} className="mb-2">
        {sidebarOpen ? (
          <>
            <button
              onClick={() => toggleCategory(categoryKey)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-sidebar-foreground/60 hover:text-sidebar-foreground uppercase tracking-wider transition-colors"
            >
              <span className="flex items-center gap-2">
                <span>{categoryIcons[categoryKey]}</span>
                {categoryLabels[categoryKey]}
              </span>
              <ChevronDown
                size={14}
                className={`transition-transform ${isExpanded ? 'rotate-0' : isRTL ? 'rotate-90' : '-rotate-90'}`}
              />
            </button>
            {isExpanded && (
              <div className="space-y-1 ml-2 border-l border-sidebar-border pl-2">
                {visibleItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className=" px-3 py-2 text-sm rounded-md hover:bg-sidebar-accent/50 text-sidebar-foreground transition-colors truncate flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    {item.requiredPlan && subscriptionPlan === 'free' && (
                      <Lock size={12} className="ml-2 text-amber-500" />
                    )}
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-1">
            {visibleItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className="block px-2 py-2 text-center text-xs rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
              >
                {item.label.charAt(0).toUpperCase()}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Get plan badge icon
  const getPlanIcon = () => {
    switch (subscriptionPlan) {
      case 'enterprise':
        return <Crown size={14} className="mr-1" />;
      case 'pro':
        return <Zap size={14} className="mr-1" />;
      default:
        return null;
    }
  };

  // Get plan badge color
  const getPlanBadgeClass = () => {
    switch (subscriptionPlan) {
      case 'enterprise':
        return 'bg-gradient-to-r from-purple-600 to-purple-800 text-white';
      case 'pro':
        return 'bg-gradient-to-r from-blue-600 to-blue-800 text-white';
      default:
        return 'bg-accent text-accent-foreground';
    }
  };

  return (
    <div className={`flex h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col overflow-hidden`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground text-sm">MK</div>
              <h1 className="font-bold text-lg text-sidebar-primary truncate">MK Project</h1>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-sidebar-accent rounded-md transition-colors "
          >
            {sidebarOpen ? (
              <X size={20} className="text-sidebar-foreground" />
            ) : (
              <Menu size={20} className="text-sidebar-foreground" />
            )}
          </button>
        </div>

        {/* Menu Items by Category */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-3">
          {renderMenuCategory('system', categoryMenus.system)}
          {renderMenuCategory('business', categoryMenus.business)}
          {renderMenuCategory('content', categoryMenus.content)}
          {renderMenuCategory('support', categoryMenus.support)}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-card border-b border-border p-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">Welcome, {currentUser.name}</h2>
          </div>

          {/* Switchers */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Language Switcher */}
            <div className="flex items-center gap-2">
              <LanguagesIcon size={18} className="text-muted-foreground " />
              <select
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="px-3 py-1 rounded-md bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="ar">العربية</option>
              </select>
            </div>

            {/* Country Switcher */}
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-muted-foreground " />
              <select
                value={currentCountry}
                onChange={(e) => setCountry(e.target.value as any)}
                className="px-3 py-1 rounded-md bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="IN">India</option>
                <option value="AE">UAE</option>
                <option value="US">USA</option>
              </select>
            </div>

            {/* Plan Badge */}
            <div className={`px-3 py-1 rounded-md text-sm font-medium whitespace-nowrap flex items-center ${getPlanBadgeClass()}`}>
              {getPlanIcon()}
              {subscriptionPlan.toUpperCase()}
            </div>

            {/* Logout */}
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-background rounded-md transition-colors"
              title="Logout"
            >
              <LogOut size={18} className="text-muted-foreground" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-background p-6">{children}</main>
      </div>
    </div>
  );
}
