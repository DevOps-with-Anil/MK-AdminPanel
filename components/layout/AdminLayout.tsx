
'use client';

import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAdmin } from '@/contexts/AdminContext';
import { MODULES, MOCK_NOTIFICATIONS } from '@/lib/mock-data';
import {
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Bell,
  Home,
  KeyRound,
  LayoutDashboard,
  Building2,
  CreditCard,
  ShieldCheck,
  BarChart3,
  Ticket,
  Package,
  Users,
  Lock,
  Settings,
  FileCheck,
  UserCircle,
  FileText,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Clock,
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { tokenStorage } from "@/utils/token";
import { logout, profile } from '@/services/auth.service';

import { I18nContext } from '@/i18n/provider';
import { LANGUAGES, Language } from '@/i18n/languages';
import { useTranslation } from '@/hooks/useTranslation';

import { AppMessage } from '@/components/common/AppMessage';
import { useAppMessage } from '@/hooks/ui/useAppMessage';

export function AdminLayout({ children }: { children: React.ReactNode }) {

  const router = useRouter();
  const { locale, changeLanguage } = useContext(I18nContext);
  const { t } = useTranslation();
  const {
    currentAdminType,
    currentLanguage,
    currentCountry,
    currentUser,
    setAdminType,
    setLanguage,
    setCountry,
    hasPermission,
  } = useAdmin();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const savedLanguage = localStorage.getItem('lang') || 'en';
  const currentLanguageData = LANGUAGES[savedLanguage as Language];
  // console.log("current Language.  :  " + savedLanguage)
  // const currentLanguageData = LANGUAGES[locale];
  // const currentCountryData = COUNTRIES[currentCountry as Country] || COUNTRIES.IN;

  const [user, setUser] = useState(null);
  // const ProfilePage = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { message, type, visible, showMessage, clearMessage } = useAppMessage();


  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await profile();
        setProfileData(res);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    // Initial fetch
    fetchProfile();


    // Listen profile updates
    const handleProfileUpdated = () => {
      fetchProfile();
    };

    window.addEventListener(
      "profile-updated",
      handleProfileUpdated
    );

    return () => {
      window.removeEventListener(
        "profile-updated",
        handleProfileUpdated
      );
    };

  }, []);


  const handleLogout = async () => {
    setIsLoading(true);

    try {
      const res = await await logout();
      showMessage(
        res?.message || "Logged out successfully!",
        "success"
      );

      setTimeout(() => {
        router.push('/auth/signin');
      }, 1000);

    } catch (err: any) {
      setError(err.message || "Failed to logout");
    } finally {
      setIsLoading(false);
    }
  };

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (label: string) => {
    setExpandedItems((prev) => ({
      [label]: !prev[label],
    }));
  };


  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    // Filter out admin, dashboard, and 'modules' from clickable breadcrumb
    const filteredPaths = paths.filter(path => path !== 'root' && path !== 'dashboard');
    return filteredPaths.map((path, index) => {
      // Build href from all previous paths INCLUDING 'modules' internally
      const href = `/${paths.slice(0, index + 1).join('/')}`;
      // Map to nice labels
      let label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
      if (path === 'notifications') label = 'Notifications';
      if (path === 'sub-admins') label = 'Sub Administrators';
      if (path === 'verification') label = 'KYB Verifications';
      // Hide modules from breadcrumb (optional: non-clickable)
      if (path === 'modules') {
        return { label: '', href: '', isLast: false }; // hide it completely
      }
      return {
        label,
        href,
        isLast: index === filteredPaths.length - 1
      };
    }).filter(crumb => crumb.label); // remove empty hidden crumbs
  };
  const breadcrumbs = generateBreadcrumbs();
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'error': return <AlertCircle size={16} className="text-rose-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
      default: return <Info size={16} className="text-blue-500" />;
    }
  };

  // Get organized menu items by category
  const getMenuByCategory = () => {
    const categoryMenus: Record<string, Array<{
      label: string;
      href: string;
      module: string;
      icon: React.ElementType;
      children?: Array<{ label: string; href: string }>
    }>> = {
      main: [],
    };

    // if (tokenStorage.getRole() === "ROOT") {
    categoryMenus.main = [
      {
        label: t('translate.sidebar_dashboard'),
        href: '/root/dashboard',
        module: MODULES.DASHBOARD,
        icon: LayoutDashboard,
      },
      {
        label: t('translate.sidebar_tenants'),
        href: '/root/affiliates',
        module: MODULES.AFFILIATES,
        icon: Building2,
      },
      {
        label: t('translate.sidebar_subscription_plans'),
        href: '/root/plans',
        module: MODULES.SUBSCRIPTION_PLANS,
        icon: CreditCard,
        children: [
          { label: t('translate.sidebar_plans_list'), href: '/root/plans' },
          { label: t('translate.sidebar_subscribers'), href: '/root/subscribers' },
        ],
      },
      {
        label: t('translate.sidebar_kyb_requests'),
        href: '/root/verification',
        module: MODULES.KYB_REQUESTS,
        icon: ShieldCheck,
      },
      {
        label: t('translate.sidebar_support_tickets'),
        href: '/root/tickets',
        module: MODULES.SUPPORT_TICKETS,
        icon: Ticket,
      },
      {
        label: t('translate.sidebar_admin_users'),
        href: '/root/users',
        module: MODULES.ADMIN_USERS,
        icon: Users,
        children: [
          { label: t('translate.sidebar_system_admins'), href: '/root/users' },
          { label: t('translate.sidebar_system_roles'), href: '/root/roles' },
        ],
      },
      {
        label: t('translate.sidebar_permission_packages'),
        href: '/root/modules',
        module: MODULES.PERMISSION_PACKAGES,
        icon: Package,
        children: [
          { label: t('translate.sidebar_system_modules'), href: '/root/modules/root-modules' },
          { label: t('translate.sidebar_tenant_modules'), href: '/root/modules/affiliate-modules' },
        ],
      },
      {
        label: t('translate.sidebar_analytics_report'),
        href: '/root/analytics',
        module: MODULES.ANALYTICS_REPORT,
        icon: BarChart3,
      },
      {
        label: t('translate.sidebar_security_compliance'),
        href: '/root/security',
        module: MODULES.SECURITY_COMPLIANCE,
        icon: Lock,
      },
      {
        label: t('translate.sidebar_settings'),
        href: '/root/settings',
        module: MODULES.SETTINGS,
        icon: Settings,
      },
    ];
    // } else {
    //   categoryMenus.main = [
    //     {
    //       label: t('translate.sidebar_dashboard'),
    //       href: '/admin/dashboard',
    //       module: MODULES.DASHBOARD,
    //       icon: LayoutDashboard,
    //     },
    //     {
    //       label: t('translate.sidebar_business_kyb'),
    //       href: '/admin/verification',
    //       module: MODULES.BUSINESS_KYB,
    //       icon: FileCheck,
    //     },
    //     {
    //       label: t('translate.sidebar_subscription_plans'),
    //       href: '/admin/plans',
    //       module: MODULES.SUBSCRIPTION_PLANS,
    //       icon: CreditCard,
    //     },
    //     {
    //       label: t('translate.sidebar_customers'),
    //       href: '/admin/users',
    //       module: MODULES.CUSTOMERS,
    //       icon: UserCircle,
    //     },
    //     {
    //       label: t('translate.sidebar_cms'),
    //       href: '/admin/cms',
    //       module: MODULES.CMS,
    //       icon: FileText,
    //       children: [
    //         { label: t('translate.sidebar_contact'), href: '/admin/cms/contact' },
    //         { label: t('translate.sidebar_video'), href: '/admin/videos' },
    //         { label: t('translate.sidebar_news_articles'), href: '/admin/articles' },
    //         { label: t('translate.sidebar_challenges'), href: '/admin/challenges' },
    //         { label: t('translate.sidebar_about_us'), href: '/admin/about-us' },
    //         { label: t('translate.sidebar_home_page'), href: '/admin/cms/home' },
    //       ],
    //     },
    //     {
    //       label: t('translate.sidebar_analytics_report'),
    //       href: '/admin/analytics',
    //       module: MODULES.ANALYTICS_REPORT,
    //       icon: BarChart3,
    //     },
    //     {
    //       label: t('translate.sidebar_admin_users'),
    //       href: '/admin/sub-admins',
    //       module: MODULES.ADMIN_USERS,
    //       icon: Users,
    //     },
    //     {
    //       label: t('translate.sidebar_support_tickets'),
    //       href: '/admin/tickets',
    //       module: MODULES.SUPPORT_TICKETS,
    //       icon: Ticket,
    //     },
    //     {
    //       label: t('translate.sidebar_security_compliance'),
    //       href: '/admin/security',
    //       module: MODULES.SECURITY_COMPLIANCE,
    //       icon: Lock,
    //     },
    //     {
    //       label: t('translate.sidebar_settings'),
    //       href: '/admin/settings',
    //       module: MODULES.SETTINGS,
    //       icon: Settings,
    //     },
    //   ];
    // }

    return categoryMenus;
  };

  const categoryMenus = getMenuByCategory();

  // const isRTL = currentLanguage === 'ar';
  const isRTL = false;

  const renderMenuCategory = (categoryKey: string, items: Array<{
    label: string;
    href: string;
    module: string;
    icon: React.ElementType;
    children?: Array<{ label: string; href: string }>
  }>) => {
    const visibleItems = items.filter((item) => hasPermission(item.module, 'view'));

    if (visibleItems.length === 0) return null;

    return (
      <div key={categoryKey} className="space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.children && item.children.some(child => pathname === child.href));

          return (
            <div key={item.href}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleItem(item.label)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-[15px] font-medium rounded-lg transition-all duration-200 group ${isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={18} className={`${isActive ? 'text-primary' : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground'} transition-colors`} />
                      {sidebarOpen && <span>{item.label}</span>}
                    </span>
                    {sidebarOpen && (
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${expandedItems[item.label] ? 'rotate-0' : '-rotate-90'}`}
                      />
                    )}
                  </button>
                  {sidebarOpen && expandedItems[item.label] && (
                    <div className="ml-9 mt-1 space-y-1 border-l border-sidebar-border/50 pl-2">
                      {item.children.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block px-3 py-2 text-[14px] rounded-md transition-colors ${isChildActive
                              ? 'text-primary font-medium bg-primary/5'
                              : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/30'
                              }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-[15px] font-medium rounded-lg transition-all duration-200 group ${isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                    }`}
                >
                  <Icon size={18} className={`${isActive ? 'text-primary' : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground'} transition-colors`} />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                  {!sidebarOpen && (
                    <div className="fixed left-20 bg-popover text-popover-foreground px-2 py-1 rounded md shadow-lg text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border border-border">
                      {item.label}
                    </div>
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={`flex h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-50 ${mobileSidebarOpen ? 'w-64' : 'w-0'
          } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col overflow-hidden md:hidden`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground text-sm">MK</div>
            <h1 className="font-bold text-lg text-sidebar-primary truncate">MK Project</h1>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-2 hover:bg-sidebar-accent rounded-md transition-colors"
          >
            <X size={20} className="text-sidebar-foreground" />
          </button>
        </div>

        {/* Menu Items by Category */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-3">
          {renderMenuCategory('main', categoryMenus.main)}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        ></div>
      )}

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex md:flex-col ${sidebarOpen ? 'md:w-64' : 'md:w-20'
          } bg-sidebar border-r border-sidebar-border transition-all duration-300`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground text-sm">MK</div>
              <h1 className="font-semibold text-xl text-sidebar-primary truncate">MK Project</h1>
            </div>
          )}
        </div>

        {/* Menu Items by Category */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-3">
          {renderMenuCategory('main', categoryMenus.main)}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Bar */}
        <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="p-2 hover:bg-sidebar-accent rounded-md transition-colors md:hidden"
            >
              <Menu size={20} className="text-sidebar-foreground" />
            </button>

            {/* System Logo and Title */}
            <div className="flex items-center gap-2 mr-2 md:mr-4 md:border-r md:border-border md:pr-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground text-xl">MK</div>
              <span className="font-medium text-xl text-foreground hidden sm:inline-block">MK Project Admin</span>
            </div>

            {/* Breadcrumbs */}
            <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/root/dashboard" className="flex items-center gap-1 hover:text-primary transition-colors">
                    <Home size={18} />
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs.length > 0 && <BreadcrumbSeparator />}
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.href}>
                    <BreadcrumbItem>
                      {crumb.isLast ? (
                        <BreadcrumbPage className="font-regular text-sm">
                          {crumb.label}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.href} className="hover:text-primary transition-colors">
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Country Selection (Only for Root Panel) */}

            {/* {currentAdminType.startsWith('root') && (
              <div className="flex items-center gap-2 md:border-r md:border-border md:pr-4">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent transition-colors focus:outline-none">
                    <span className="text-lg leading-none">{currentCountryData.flag}</span>
                    <span className="text-sm font-medium text-foreground hidden md:inline-block">{currentCountryData.label}</span>
                    <ChevronDown size={14} className="text-muted-foreground hidden md:inline-block" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuLabel>{t('translate.selectCountry')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {Object.entries(COUNTRIES).map(([code, data]) => (
                      <DropdownMenuItem
                        key={code}
                        onClick={() => setCountry(code as Country)}
                        className={`flex items-center gap-3 cursor-pointer ${currentCountry === code ? 'bg-accent text-accent-foreground' : ''}`}
                      >
                        <span className="text-lg leading-none">{data.flag}</span>
                        <span className="text-sm">{data.label}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )} */}

            {/* Language Selection */}
            <div className="flex items-center gap-2 md:border-r md:border-border md:pr-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent/50 transition-colors focus:outline-none">
                  <span className="text-lg leading-none">{currentLanguageData.flag}</span>
                  <span className="text-sm font-medium text-foreground hidden md:inline-block">{currentLanguageData.label}</span>
                  <ChevronDown size={14} className="text-muted-foreground hidden md:inline-block" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuLabel>{t('translate.selectLanguage')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {Object.entries(LANGUAGES).map(([code, data]) => (
                    <DropdownMenuItem
                      key={code}
                      onClick={() => {
                        setLanguage(code as Language);  // Admin context to set on dropdown
                        changeLanguage(code as Language);           // i18n sync
                      }}
                      className={`flex items-center gap-3 cursor-pointer ${currentLanguage === code ? 'bg-accent/50 text-accent-foreground' : ''}`}
                    >
                      <span className="text-lg leading-none">{data.flag}</span>
                      <span className="text-sm">{data.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 hover:bg-accent/50 rounded-full transition-all border border-transparent hover:border-border group">
                  <Bell size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  {MOCK_NOTIFICATIONS.some(n => !n.isRead) && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0 shadow-2xl border-border overflow-hidden rounded-xl">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20">
                  <div>
                    <h3 className="text-md font-medium font-black text-foreground tracking-wider">Notifications</h3>
                    <p className="text-[13px] text-muted-foreground font-medium">You have {MOCK_NOTIFICATIONS.filter(n => !n.isRead).length} unread alerts</p>
                  </div>
                  <button className="text-[14px] font-medium font-black text-primary hover:underline tracking-tighter">Mark all read</button>
                </div>

                <div className="max-h-[400px] overflow-y-auto custom-scrollbar divide-y divide-border/50">
                  {MOCK_NOTIFICATIONS.slice(0, 10).map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`flex flex-col items-start gap-1 p-4 cursor-pointer focus:bg-muted/50 transition-colors ${!notification.isRead ? 'bg-primary/5' : ''}`}
                    >
                      <div className="flex items-start justify-between w-full gap-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-md bg-background border border-border shadow-sm`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <span className={`text-md font-black font-medium tracking-tight ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </span>
                        </div>
                        <span className="text-[9px] font-medium text-muted-foreground/60 uppercase whitespace-nowrap pt-1">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-[12px] text-muted-foreground font-medium leading-relaxed pl-8">
                        {notification.description}
                      </p>
                    </DropdownMenuItem>
                  ))}
                </div>

                <div className="p-2 border-t border-border bg-muted/50">
                  <button
                    onClick={() => router.push('/root/notifications')}
                    className="w-full py-2 text-[12px] font-black text-center text-primary hover:bg-primary/50 rounded-lg transition-colors uppercase tracking-widest border border-dashed border-primary/20"
                  >
                    View All Activity Log
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-3 md:pl-4 md:border-l md:border-border">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-3 focus:outline-none group">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {profileData?.data?.name || "User"}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {profileData?.data?.role?.name || ""}
                    </p>
                  </div>
                  {/* <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold group-hover:bg-primary/20 transition-all border border-primary/20">
                    {currentUser.name.charAt(0)}
                  </div> */}
                  {/* <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold group-hover:bg-primary/20 transition-all border border-primary/20 overflow-hidden">
                    {profileData?.data?.photo ? (
                      <img
                        src={profileData?.data?.photo}
                        alt={currentUser?.name || "User"}
                        className="w-full h-full object-cover"
                      />
                    ) : currentUser?.name ? (
                      currentUser.name.charAt(0).toUpperCase()
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div> */}

                  <div className="w-9 h-9 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold group-hover:bg-primary/20 transition-all">

                    {profileData?.data?.photo ? (

                      <img
                        src={profileData?.data?.photo}
                        alt={profileData?.data?.name || "User"}
                        className="w-full h-full object-cover"
                      />

                    ) : profileData?.data?.name ? (

                      <span>
                        {profileData.data.name.charAt(0).toUpperCase()}
                      </span>

                    ) : (

                      <User className="w-4 h-4" />

                    )}

                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-0 overflow-hidden">
                  <div className="px-3 py-3 border-b border-border mb-1 bg-muted/20">
                    {/* <p className="text-sm font-black text-foreground leading-none mb-1">{currentUser.name}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{currentUser.role.name}</p> */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-border/50">
                      <Clock size={12} className="text-primary" />
                      <div>
                        <p className="text-[12px] font-medium font-black text-muted-foreground tracking-tighter leading-none">{t('translate.lastAccess')}</p>
                        <p className="text-[12px] font-medium text-foreground">{currentUser.lastLogin}</p>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuItem className="cursor-pointer"
                    onClick={() => router.push('/root/profile')}
                  >
                    <User size={16} className="mr-2" />
                    <span>{t('translate.viewProfile')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => router.push('/root/change-password')}
                  >
                    <KeyRound size={16} className="mr-2" />
                    <span>{t('translate.changePassword')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <LogOut size={16} className="mr-2" />
                    <span>{t('translate.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-muted/20 p-4 md:p-6">{children}</main>

        {/* <Footer /> */}
        <footer className="py-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} MK Projects. {t('translate.footer')}
        </footer>

      </div>

      <AppMessage
        visible={visible}
        message={message}
        type={type}
        onClose={clearMessage}
      />
    </div>
  );
}
