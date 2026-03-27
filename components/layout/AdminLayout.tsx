'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAdmin } from '@/contexts/AdminContext';
import { ACTIONS, MOCK_NOTIFICATIONS } from '@/lib/mock-data';
import { ADMIN_SIDEBAR_CONFIG, inferAdminType, type SidebarItem } from '@/lib/rbac';
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronDown,
  Clock,
  Home,
  Info,
  KeyRound,
  LogOut,
  Menu,
  User,
  X,
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { tokenStorage } from '@/utils/token';
import { profile } from '@/services/auth.service';
import { I18nContext } from '@/i18n/provider';
import { useTranslation } from '@/hooks/useTranslation';

type Language = 'en' | 'fr';

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const { changeLanguage } = useContext(I18nContext);
  const {
    currentAdminType,
    currentLanguage,
    currentUser,
    setAdminType,
    setLanguage,
    setCurrentUser,
    hasPermission,
  } = useAdmin();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const hasInitializedRef = useRef(false);

  const LANGUAGES: Record<Language, { label: string; flag: string }> = {
    en: { label: 'English', flag: 'EN' },
    fr: { label: 'French', flag: 'FR' },
  };

  const currentLanguageData = LANGUAGES[currentLanguage as Language] || LANGUAGES.en;
  const categoryMenus = { main: ADMIN_SIDEBAR_CONFIG[currentAdminType] };

  useEffect(() => {
    if (hasInitializedRef.current) {
      return;
    }

    hasInitializedRef.current = true;

    const savedLang = localStorage.getItem('lang') || 'en';
    setLanguage(savedLang as Language);
    changeLanguage(savedLang);

    const fetchProfile = async () => {
      const token = tokenStorage.get();
      if (!token) {
        return;
      }

      try {
        const res = await profile();
        const profileUser = res?.data;

        if (!profileUser || typeof profileUser !== 'object') {
          return;
        }

        setAdminType(
          inferAdminType({
            token,
            roleType: profileUser.roleType,
            roleName: profileUser.role?.name,
          })
        );
        setCurrentUser(profileUser);
      } catch {
        // Keep the stored/login user state if profile sync fails on mount.
      }
    };

    fetchProfile();
  }, [changeLanguage, setAdminType, setCurrentUser, setLanguage]);

  const handleLogout = () => {
    tokenStorage.clear();
    localStorage.removeItem('mk_admin_user');

    if (currentAdminType === 'root-admin') {
      router.push('/auth/root-login');
      return;
    }

    router.push('/auth/admin-login');
  };

  const toggleItem = (label: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const filteredPaths = paths.filter((path) => path !== 'admin' && path !== 'dashboard');

    return filteredPaths
      .map((path, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`;
        let label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');

        if (path === 'notifications') label = 'Notifications';
        if (path === 'sub-admins') label = 'Sub Administrators';
        if (path === 'verification') label = 'KYB Verifications';
        if (path === 'modules') return { label: '', href: '', isLast: false };

        return {
          label,
          href,
          isLast: index === filteredPaths.length - 1,
        };
      })
      .filter((crumb) => crumb.label);
  };

  const breadcrumbs = generateBreadcrumbs();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'error':
        return <AlertCircle size={16} className="text-rose-500" />;
      case 'warning':
        return <AlertTriangle size={16} className="text-amber-500" />;
      default:
        return <Info size={16} className="text-blue-500" />;
    }
  };

  const renderMenuCategory = (categoryKey: string, items: SidebarItem[]) => {
    const visibleItems = items.filter((item) => hasPermission(item.module, ACTIONS.VIEW));

    if (visibleItems.length === 0) return null;

    return (
      <div key={categoryKey} className="space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.children && item.children.some((child) => pathname === child.href));
          const itemLabel = t(item.labelKey);

          return (
            <div key={item.href}>
              {item.children ? (
                <div>
                  <div
                    className={`flex items-center rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                    }`}
                  >
                    <Link
                      href={item.href}
                      className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-[15px] font-medium"
                    >
                      <Icon
                        size={18}
                        className={`${
                          isActive ? 'text-primary' : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground'
                        } transition-colors`}
                      />
                      {sidebarOpen && <span>{itemLabel}</span>}
                    </Link>
                    {sidebarOpen && (
                      <button
                        type="button"
                        onClick={() => toggleItem(itemLabel)}
                        className="px-3 py-2.5"
                        aria-label={`Toggle ${itemLabel}`}
                      >
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-200 ${
                            expandedItems[itemLabel] ? 'rotate-0' : '-rotate-90'
                          }`}
                        />
                      </button>
                    )}
                  </div>
                  {sidebarOpen && expandedItems[itemLabel] && (
                    <div className="ml-9 mt-1 space-y-1 border-l border-sidebar-border/50 pl-2">
                      {item.children.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block px-3 py-2 text-[14px] rounded-md transition-colors ${
                              isChildActive
                                ? 'text-primary font-medium bg-primary/5'
                                : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/30'
                            }`}
                          >
                            {t(child.labelKey)}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-[15px] font-medium rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  }`}
                >
                  <Icon
                    size={18}
                    className={`${
                      isActive ? 'text-primary' : 'text-sidebar-foreground/50 group-hover:text-sidebar-foreground'
                    } transition-colors`}
                  />
                  {sidebarOpen && <span className="truncate">{itemLabel}</span>}
                  {!sidebarOpen && (
                    <div className="fixed left-20 bg-popover text-popover-foreground px-2 py-1 rounded md shadow-lg text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap border border-border">
                      {itemLabel}
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
    <div className="flex h-screen bg-background ltr">
      <div
        className={`fixed top-0 left-0 h-full z-50 ${mobileSidebarOpen ? 'w-64' : 'w-0'} bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col overflow-hidden md:hidden`}
      >
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

        <nav className="flex-1 overflow-y-auto p-3 space-y-3">{renderMenuCategory('main', categoryMenus.main)}</nav>
      </div>

      {mobileSidebarOpen && (
        <div onClick={() => setMobileSidebarOpen(false)} className="fixed inset-0 bg-black/50 z-40 md:hidden"></div>
      )}

      <div
        className={`hidden md:flex md:flex-col ${sidebarOpen ? 'md:w-64' : 'md:w-20'} bg-sidebar border-r border-sidebar-border transition-all duration-300`}
      >
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground text-sm">MK</div>
              <h1 className="font-semibold text-xl text-sidebar-primary truncate">MK Project</h1>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-3">{renderMenuCategory('main', categoryMenus.main)}</nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="p-2 hover:bg-sidebar-accent rounded-md transition-colors md:hidden"
            >
              <Menu size={20} className="text-sidebar-foreground" />
            </button>

            <div className="flex items-center gap-2 mr-2 md:mr-4 md:border-r md:border-border md:pr-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground text-xl">MK</div>
              <span className="font-medium text-xl text-foreground hidden sm:inline-block">MK Project Admin</span>
            </div>

            <Breadcrumb className="hidden md:flex">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/dashboard" className="flex items-center gap-1 hover:text-primary transition-colors">
                    <Home size={18} />
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {breadcrumbs.length > 0 && <BreadcrumbSeparator />}
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.href}>
                    <BreadcrumbItem>
                      {crumb.isLast ? (
                        <BreadcrumbPage className="font-regular text-sm">{crumb.label}</BreadcrumbPage>
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
                        setLanguage(code as Language);
                        changeLanguage(code as Language);
                      }}
                      className={`flex items-center gap-3 cursor-pointer ${
                        currentLanguage === code ? 'bg-accent/50 text-accent-foreground' : ''
                      }`}
                    >
                      <span className="text-lg leading-none">{data.flag}</span>
                      <span className="text-sm">{data.label}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-2 hover:bg-accent/50 rounded-full transition-all border border-transparent hover:border-border group">
                  <Bell size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  {MOCK_NOTIFICATIONS.some((notification) => !notification.isRead) && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0 shadow-2xl border-border overflow-hidden rounded-xl">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/20">
                  <div>
                    <h3 className="text-md font-medium font-black text-foreground tracking-wider">Notifications</h3>
                    <p className="text-[13px] text-muted-foreground font-medium">
                      You have {MOCK_NOTIFICATIONS.filter((notification) => !notification.isRead).length} unread alerts
                    </p>
                  </div>
                  <button className="text-[14px] font-medium font-black text-primary hover:underline tracking-tighter">Mark all read</button>
                </div>

                <div className="max-h-[400px] overflow-y-auto custom-scrollbar divide-y divide-border/50">
                  {MOCK_NOTIFICATIONS.slice(0, 10).map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`flex flex-col items-start gap-1 p-4 cursor-pointer focus:bg-muted/50 transition-colors ${
                        !notification.isRead ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between w-full gap-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-background border border-border shadow-sm">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <span
                            className={`text-md font-black font-medium tracking-tight ${
                              !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                            }`}
                          >
                            {notification.title}
                          </span>
                        </div>
                        <span className="text-[9px] font-medium text-muted-foreground/60 uppercase whitespace-nowrap pt-1">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-[12px] text-muted-foreground font-medium leading-relaxed pl-8">{notification.description}</p>
                    </DropdownMenuItem>
                  ))}
                </div>

                <div className="p-2 border-t border-border bg-muted/50">
                  <button
                    onClick={() => router.push('/admin/notifications')}
                    className="w-full py-2 text-[12px] font-black text-center text-primary hover:bg-primary/50 rounded-lg transition-colors uppercase tracking-widest border border-dashed border-primary/20"
                  >
                    View All Activity Log
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-3 md:pl-4 md:border-l md:border-border">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-3 focus:outline-none group">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{currentUser.name}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.role.name}</p>
                  </div>
                  <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold group-hover:bg-primary/20 transition-all border border-primary/20">
                    <User className="w-4 h-4" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-0 overflow-hidden">
                  <div className="px-3 py-3 border-b border-border mb-1 bg-muted/20">
                    <div className="flex items-center gap-1.5 pt-2 border-t border-border/50">
                      <Clock size={12} className="text-primary" />
                      <div>
                        <p className="text-[12px] font-medium font-black text-muted-foreground tracking-tighter leading-none">
                          {t('translate.lastAccess')}
                        </p>
                        <p className="text-[12px] font-medium text-foreground">{currentUser.lastLogin}</p>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/admin/profile')}>
                    <User size={16} className="mr-2" />
                    <span>{t('translate.viewProfile')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/admin/change-password')}>
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

        <main className="flex-1 overflow-auto bg-muted/20 p-4 md:p-6">{children}</main>

        <footer className="py-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} MK Projects. {t('translate.footer')}
        </footer>
      </div>
    </div>
  );
}
