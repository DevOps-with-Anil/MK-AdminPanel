'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAdmin } from '@/contexts/AdminContext';
import { MODULES, LANGUAGES, COUNTRIES, Language, Country, MOCK_NOTIFICATIONS } from '@/lib/mock-data';
import { getAuthToken, logout } from '@/lib/client-auth';
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
  Clock
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
import Footer from './Footer';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const {
    currentAdminType,
    currentLanguage,
    currentCountry,
    currentUser,
    isProfileLoading,
    setLanguage,
    setCountry,
    t,
    hasPermission,
  } = useAdmin();

  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      router.replace('/systemlogin');
      return;
    }

    setIsAuthChecked(true);
  }, [router]);

  // Use a media query to determine if the screen is mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const currentLanguageData = LANGUAGES[currentLanguage as Language] || LANGUAGES.en;
  const currentCountryData = COUNTRIES[currentCountry as Country] || COUNTRIES.IN;

  const handleLogout = () => {
    logout();

    // Determine where to redirect based on current admin type
    if (currentAdminType.startsWith('root')) {
      router.replace('/systemlogin');
    } else {
      router.replace('/affiliatelogin');
    }
  };

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (label: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // Generate breadcrumbs from pathname
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    // Filter out 'admin' and 'dashboard' segments
    const filteredPaths = paths.filter(path => path !== 'admin' && path !== 'dashboard');
    
    return filteredPaths.map((path, index) => {
      const href = `/${paths.slice(0, paths.indexOf(path) + 1).join('/')}`;
      
      // Map common paths to professional labels
      let label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
      if (path === 'notifications') label = 'Notifications';
      if (path === 'sub-admins') label = 'Sub Administrators';
      if (path === 'verification') label = 'KYB Verifications';
      
      return { 
        label, 
        href, 
        isLast: index === filteredPaths.length - 1
      };
    });
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

    if (currentAdminType.startsWith('root')) {
      categoryMenus.main = [
        {
          label: t('sidebar.dashboard'),
          href: '/admin/dashboard',
          module: MODULES.DASHBOARD,
          icon: LayoutDashboard,
        },
        {
          label: t('sidebar.tenants'),
          href: '/admin/tenants',
          module: MODULES.TENANTS,
          icon: Building2,
          children: [
            { label: 'List', href: '/admin/tenants' },
            { label: 'Profile Page', href: '/admin/tenants/profile' },
          ],
        },
        {
          label: t('sidebar.subscription_plans'),
          href: '/admin/plans',
          module: MODULES.SUBSCRIPTION_PLANS,
          icon: CreditCard,
          children: [
            { label: 'List', href: '/admin/plans' },
            { label: 'Add', href: '/admin/plans/new' },
            { label: 'Details', href: '/admin/plans/details' },
            { label: 'Subscribers', href: '/admin/plans/subscribers' },
          ],
        },
        {
          label: t('sidebar.kyb_requests'),
          href: '/admin/verification',
          module: MODULES.KYB_REQUESTS,
          icon: ShieldCheck,
          children: [
            { label: 'List of pending request', href: '/admin/verification?status=pending' },
            { label: 'Detail page', href: '/admin/verification/details' },
          ],
        },
        {
          label: t('sidebar.analytics_report'),
          href: '/admin/analytics',
          module: MODULES.ANALYTICS_REPORT,
          icon: BarChart3,
        },
        {
          label: t('sidebar.support_tickets'),
          href: '/admin/tickets',
          module: MODULES.SUPPORT_TICKETS,
          icon: Ticket,
        },
        {
          label: t('sidebar.permission_packages'),
          href: '/admin/modules',
          module: MODULES.PERMISSION_PACKAGES,
          icon: Package,
        },
        {
          label: t('sidebar.admin_users'),
          href: '/admin/users',
          module: MODULES.ADMIN_USERS,
          icon: Users,
        },
        {
          label: t('sidebar.security_compliance'),
          href: '/admin/security',
          module: MODULES.SECURITY_COMPLIANCE,
          icon: Lock,
        },
        {
          label: t('sidebar.settings'),
          href: '/admin/settings',
          module: MODULES.SETTINGS,
          icon: Settings,
        },
      ];
    } else {
      categoryMenus.main = [
        {
          label: t('sidebar.dashboard'),
          href: '/admin/dashboard',
          module: MODULES.DASHBOARD,
          icon: LayoutDashboard,
        },
        {
          label: t('sidebar.business_kyb'),
          href: '/admin/verification',
          module: MODULES.BUSINESS_KYB,
          icon: FileCheck,
        },
        {
          label: t('sidebar.subscription_plans'),
          href: '/admin/plans',
          module: MODULES.SUBSCRIPTION_PLANS,
          icon: CreditCard,
        },
        {
          label: t('sidebar.customers'),
          href: '/admin/users',
          module: MODULES.CUSTOMERS,
          icon: UserCircle,
        },
        {
          label: t('sidebar.cms'),
          href: '/admin/cms',
          module: MODULES.CMS,
          icon: FileText,
          children: [
            { label: 'Contact', href: '/admin/cms/contact' },
            { label: 'Video', href: '/admin/videos' },
            { label: 'News Articles', href: '/admin/articles' },
            { label: 'Challenges', href: '/admin/challenges' },
            { label: 'About Us', href: '/admin/about-us' },
            { label: 'Home Page', href: '/admin/cms/home' },
          ],
        },
        {
          label: t('sidebar.analytics_report'),
          href: '/admin/analytics',
          module: MODULES.ANALYTICS_REPORT,
          icon: BarChart3,
        },
        {
          label: t('sidebar.admin_users'),
          href: '/admin/sub-admins',
          module: MODULES.ADMIN_USERS,
          icon: Users,
        },
        {
          label: t('sidebar.support_tickets'),
          href: '/admin/tickets',
          module: MODULES.SUPPORT_TICKETS,
          icon: Ticket,
        },
        {
          label: t('sidebar.security_compliance'),
          href: '/admin/security',
          module: MODULES.SECURITY_COMPLIANCE,
          icon: Lock,
        },
        {
          label: t('sidebar.settings'),
          href: '/admin/settings',
          module: MODULES.SETTINGS,
          icon: Settings,
        },
      ];
    }

    return categoryMenus;
  };

  const categoryMenus = getMenuByCategory();

  const isRTL = currentLanguage === 'ar';

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
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                      isActive 
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
                            className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                              isChildActive
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
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    isActive 
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

  if (!isAuthChecked || isProfileLoading) {
    return null;
  }

  return (
    <div className={`flex h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-50 ${
          mobileSidebarOpen ? 'w-64' : 'w-0'
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
        className={`hidden md:flex md:flex-col ${
          sidebarOpen ? 'md:w-64' : 'md:w-20'
        } bg-sidebar border-r border-sidebar-border transition-all duration-300`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground text-sm">MK</div>
              <h1 className="font-bold text-lg text-sidebar-primary truncate">MK Project</h1>
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

            {/* Logo and Title */}
            <div className="flex items-center gap-2 mr-2 md:mr-4 md:border-r md:border-border md:pr-4">
               <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground text-xs">MK</div>
               <span className="font-bold text-foreground hidden sm:inline-block">MK Project Admin</span>
            </div>

            {/* Breadcrumbs */}
            <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/dashboard" className="flex items-center gap-1 hover:text-primary transition-colors">
                    <Home size={16} />
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs.length > 0 && <BreadcrumbSeparator />}
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.href}>
                    <BreadcrumbItem>
                      {crumb.isLast ? (
                        <BreadcrumbPage className="font-semibold text-foreground">
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
            {currentAdminType.startsWith('root') && (
              <div className="flex items-center gap-2 md:border-r md:border-border md:pr-4">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent transition-colors focus:outline-none">
                    <span className="text-lg leading-none">{currentCountryData.flag}</span>
                    <span className="text-sm font-medium text-foreground hidden md:inline-block">{currentCountryData.label}</span>
                    <ChevronDown size={14} className="text-muted-foreground hidden md:inline-block" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuLabel>Select Country</DropdownMenuLabel>
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
            )}

            {/* Language Selection */}
            <div className="flex items-center gap-2 md:border-r md:border-border md:pr-4">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent transition-colors focus:outline-none">
                  <span className="text-lg leading-none">{currentLanguageData.flag}</span>
                  <span className="text-sm font-medium text-foreground hidden md:inline-block">{currentLanguageData.label}</span>
                  <ChevronDown size={14} className="text-muted-foreground hidden md:inline-block" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuLabel>Select Language</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {Object.entries(LANGUAGES).map(([code, data]) => (
                    <DropdownMenuItem 
                      key={code} 
                      onClick={() => setLanguage(code as Language)}
                      className={`flex items-center gap-3 cursor-pointer ${currentLanguage === code ? 'bg-accent text-accent-foreground' : ''}`}
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
                <button className="relative p-2 hover:bg-accent rounded-full transition-all border border-transparent hover:border-border group">
                  <Bell size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  {MOCK_NOTIFICATIONS.some(n => !n.isRead) && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0 shadow-2xl border-border overflow-hidden rounded-xl">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20">
                  <div>
                    <h3 className="text-sm font-black text-foreground uppercase tracking-wider">Notifications</h3>
                    <p className="text-[10px] text-muted-foreground font-bold">You have {MOCK_NOTIFICATIONS.filter(n => !n.isRead).length} unread alerts</p>
                  </div>
                  <button className="text-[10px] font-black text-primary hover:underline uppercase tracking-tighter">Mark all read</button>
                </div>
                
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar divide-y divide-border/50">
                  {MOCK_NOTIFICATIONS.slice(0, 10).map((notification) => (
                    <DropdownMenuItem 
                      key={notification.id} 
                      className={`flex flex-col items-start gap-1 p-4 cursor-pointer focus:bg-muted/50 transition-colors ${!notification.isRead ? 'bg-primary/5' : ''}`}
                    >
                      <div className="flex items-start justify-between w-full gap-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg bg-background border border-border shadow-sm`}>
                            {getNotificationIcon(notification.type)}
                          </div>
                          <span className={`text-[12px] font-black tracking-tight ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold text-muted-foreground/60 uppercase whitespace-nowrap pt-1">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground font-medium leading-relaxed pl-8">
                        {notification.description}
                      </p>
                    </DropdownMenuItem>
                  ))}
                </div>

                <div className="p-2 border-t border-border bg-muted/10">
                  <button 
                    onClick={() => router.push('/admin/notifications')}
                    className="w-full py-2 text-[11px] font-black text-center text-primary hover:bg-primary/5 rounded-lg transition-colors uppercase tracking-widest border border-dashed border-primary/20"
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
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.role.name}</p>
                  </div>
                  <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold group-hover:bg-primary/20 transition-all border border-primary/20">
                    {currentUser.name.charAt(0)}
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-0 overflow-hidden">
                  <div className="px-3 py-3 border-b border-border mb-1 bg-muted/20">
                     <p className="text-sm font-black text-foreground leading-none mb-1">{currentUser.name}</p>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">{currentUser.role.name}</p>
                     <div className="flex items-center gap-1.5 pt-2 border-t border-border/50">
                       <Clock size={12} className="text-primary" />
                       <div>
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter leading-none">Last Access</p>
                          <p className="text-[10px] font-bold text-foreground">{currentUser.lastLogin}</p>
                       </div>
                     </div>
                  </div>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => router.push('/admin/profile')}
                  >
                    <User size={16} className="mr-2" />
                    <span>View Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer"
                    onClick={() => router.push('/admin/change-password')}
                  >
                    <KeyRound size={16} className="mr-2" />
                    <span>Change Password</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <LogOut size={16} className="mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-muted/20 p-4 md:p-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
