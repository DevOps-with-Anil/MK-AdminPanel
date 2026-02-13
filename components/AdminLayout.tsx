'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/contexts/AdminContext';
import { MODULES, AdminType } from '@/lib/mock-data';
import { Menu, X, Globe, LanguagesIcon, LogOut, ChevronDown } from 'lucide-react';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const {
    currentAdminType,
    currentLanguage,
    currentCountry,
    currentUser,
    setAdminType,
    setLanguage,
    setCountry,
    t,
    hasPermission,
  } = useAdmin();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    system: true,
    business: true,
    content: true,
    support: true,
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Get organized menu items by category
  const getMenuByCategory = () => {
    const categoryMenus: Record<string, Array<{ label: string; href: string; module: string }>> = {
      system: [
        {
          label: t('sidebar.dashboard'),
          href: '/admin/dashboard',
          module: MODULES.DASHBOARD,
        },
      ],
      business: [],
      content: [],
      support: [],
    };

    if (currentAdminType.startsWith('root')) {
      categoryMenus.system = [
        ...categoryMenus.system,
        {
          label: t('sidebar.admin_users'),
          href: '/admin/users',
          module: MODULES.ADMIN_USERS,
        },
        {
          label: t('sidebar.roles_permissions'),
          href: '/admin/roles',
          module: MODULES.ROLES_PERMISSIONS,
        },
        {
          label: t('sidebar.modules_actions'),
          href: '/admin/modules',
          module: MODULES.MODULES_ACTIONS,
        },
        {
          label: t('sidebar.permission_packages'),
          href: '/admin/permissions',
          module: MODULES.PERMISSION_PACKAGES,
        },
        {
          label: t('sidebar.settings'),
          href: '/admin/settings',
          module: MODULES.SETTINGS,
        },
      ];
      categoryMenus.business = [
        {
          label: t('sidebar.subscription_plans'),
          href: '/admin/plans',
          module: MODULES.SUBSCRIPTION_PLANS,
        },
        {
          label: t('sidebar.affiliates'),
          href: '/admin/affiliates',
          module: MODULES.AFFILIATES,
        },
        {
          label: t('sidebar.countries'),
          href: '/admin/countries',
          module: MODULES.COUNTRIES,
        },
      ];
      categoryMenus.content = [
        {
          label: t('sidebar.cms'),
          href: '/admin/cms',
          module: MODULES.CMS,
        },
        {
          label: 'Articles',
          href: '/admin/articles',
          module: MODULES.CMS,
        },
        {
          label: 'Videos',
          href: '/admin/videos',
          module: MODULES.CMS,
        },
        {
          label: 'Categories',
          href: '/admin/categories',
          module: MODULES.CMS,
        },
        {
          label: 'Challenges',
          href: '/admin/challenges',
          module: MODULES.CMS,
        },
        {
          label: 'About Us',
          href: '/admin/about-us',
          module: MODULES.CMS,
        },
        {
          label: t('sidebar.ads'),
          href: '/admin/ads',
          module: MODULES.ADS,
        },
      ];
      categoryMenus.support = [
        {
          label: t('sidebar.support_tickets'),
          href: '/admin/tickets',
          module: MODULES.SUPPORT_TICKETS,
        },
        {
          label: t('sidebar.policies_faq'),
          href: '/admin/policies',
          module: MODULES.POLICIES_FAQ,
        },
      ];
    } else {
      categoryMenus.business = [
        {
          label: t('sidebar.sub_admins'),
          href: '/admin/sub-admins',
          module: MODULES.SUB_ADMINS,
        },
      ];
      categoryMenus.content = [
        {
          label: t('sidebar.cms'),
          href: '/admin/cms',
          module: MODULES.CMS,
        },
        {
          label: 'Articles',
          href: '/admin/articles',
          module: MODULES.CMS,
        },
        {
          label: 'Videos',
          href: '/admin/videos',
          module: MODULES.CMS,
        },
        {
          label: 'Categories',
          href: '/admin/categories',
          module: MODULES.CMS,
        },
        {
          label: 'Challenges',
          href: '/admin/challenges',
          module: MODULES.CMS,
        },
        {
          label: 'About Us',
          href: '/admin/about-us',
          module: MODULES.CMS,
        },
        {
          label: t('sidebar.ads'),
          href: '/admin/ads',
          module: MODULES.ADS,
        },
      ];
      categoryMenus.support = [
        {
          label: t('sidebar.support_tickets'),
          href: '/admin/tickets',
          module: MODULES.SUPPORT_TICKETS,
        },
        {
          label: t('sidebar.policies_faq'),
          href: '/admin/policies',
          module: MODULES.POLICIES_FAQ,
        },
      ];
      categoryMenus.system = [
        ...categoryMenus.system,
        {
          label: t('sidebar.profile'),
          href: '/admin/profile',
          module: MODULES.PROFILE,
        },
        {
          label: t('sidebar.verification'),
          href: '/admin/verification',
          module: MODULES.VERIFICATION,
        },
      ];
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

  const renderMenuCategory = (categoryKey: string, items: Array<{ label: string; href: string; module: string }>) => {
    const visibleItems = items.filter((item) => hasPermission(item.module, 'view'));

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
                    className="block px-3 py-2 text-sm rounded-md hover:bg-sidebar-accent/50 text-sidebar-foreground transition-colors truncate"
                  >
                    {item.label}
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
            className="p-2 hover:bg-sidebar-accent rounded-md transition-colors flex-shrink-0"
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
              <LanguagesIcon size={18} className="text-muted-foreground flex-shrink-0" />
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
              <Globe size={18} className="text-muted-foreground flex-shrink-0" />
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
            <div className="px-3 py-1 rounded-md bg-accent text-accent-foreground text-sm font-medium whitespace-nowrap">
              {currentUser.subscriptionPlan.toUpperCase()}
            </div>

            {/* Logout */}
            <button className="p-2 hover:bg-background rounded-md transition-colors">
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
