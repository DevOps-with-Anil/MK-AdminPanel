// Mock Data for Frontend-Only Admin Panel

export type AdminType = 'root-admin' | 'root-sub-admin' | 'affiliate-admin' | 'affiliate-sub-admin';
export type Language = 'en' | 'hi' | 'ar';
export type Country = 'IN' | 'AE' | 'US';
export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';

// Permissions Structure
export interface Permission {
  id: string;
  module: string;
  action: string;
}

// Role Definition
export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

// Admin User
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  type: AdminType;
  role: Role;
  country: Country;
  subscriptionPlan: SubscriptionPlan;
}

// Mock Modules & Actions
export const MODULES = {
  DASHBOARD: 'dashboard',
  ADMIN_USERS: 'admin_users',
  ROLES_PERMISSIONS: 'roles_permissions',
  MODULES_ACTIONS: 'modules_actions',
  PERMISSION_PACKAGES: 'permission_packages',
  SUBSCRIPTION_PLANS: 'subscription_plans',
  AFFILIATES: 'affiliates',
  COUNTRIES: 'countries',
  CMS: 'cms',
  ADS: 'ads',
  SUPPORT_TICKETS: 'support_tickets',
  POLICIES_FAQ: 'policies_faq',
  SETTINGS: 'settings',
  SUB_ADMINS: 'sub_admins',
  CHALLENGES: 'challenges',
  VERIFICATION: 'verification',
  PROFILE: 'profile',
};

export const ACTIONS = {
  VIEW: 'view',
  CREATE: 'create',
  EDIT: 'edit',
  DELETE: 'delete',
  EXPORT: 'export',
};

// Mock Roles
export const MOCK_ROLES: Record<AdminType, Role> = {
  'root-admin': {
    id: 'root-admin-role',
    name: 'Root Admin',
    permissions: [
      { id: '1', module: MODULES.DASHBOARD, action: ACTIONS.VIEW },
      { id: '2', module: MODULES.ADMIN_USERS, action: ACTIONS.VIEW },
      { id: '3', module: MODULES.ADMIN_USERS, action: ACTIONS.CREATE },
      { id: '4', module: MODULES.ADMIN_USERS, action: ACTIONS.EDIT },
      { id: '5', module: MODULES.ADMIN_USERS, action: ACTIONS.DELETE },
      { id: '6', module: MODULES.ROLES_PERMISSIONS, action: ACTIONS.VIEW },
      { id: '7', module: MODULES.ROLES_PERMISSIONS, action: ACTIONS.EDIT },
      { id: '8', module: MODULES.MODULES_ACTIONS, action: ACTIONS.VIEW },
      { id: '9', module: MODULES.PERMISSION_PACKAGES, action: ACTIONS.VIEW },
      { id: '10', module: MODULES.SUBSCRIPTION_PLANS, action: ACTIONS.VIEW },
      { id: '11', module: MODULES.SUBSCRIPTION_PLANS, action: ACTIONS.EDIT },
      { id: '12', module: MODULES.AFFILIATES, action: ACTIONS.VIEW },
      { id: '13', module: MODULES.AFFILIATES, action: ACTIONS.CREATE },
      { id: '14', module: MODULES.COUNTRIES, action: ACTIONS.VIEW },
      { id: '15', module: MODULES.COUNTRIES, action: ACTIONS.EDIT },
      { id: '16', module: MODULES.CMS, action: ACTIONS.VIEW },
      { id: '17', module: MODULES.CMS, action: ACTIONS.CREATE },
      { id: '18', module: MODULES.CMS, action: ACTIONS.EDIT },
      { id: '19', module: MODULES.ADS, action: ACTIONS.VIEW },
      { id: '20', module: MODULES.SUPPORT_TICKETS, action: ACTIONS.VIEW },
      { id: '21', module: MODULES.POLICIES_FAQ, action: ACTIONS.VIEW },
      { id: '22', module: MODULES.SETTINGS, action: ACTIONS.VIEW },
      { id: '23', module: MODULES.SETTINGS, action: ACTIONS.EDIT },
    ],
  },
  'root-sub-admin': {
    id: 'root-sub-admin-role',
    name: 'Root Sub-Admin',
    permissions: [
      { id: '1', module: MODULES.DASHBOARD, action: ACTIONS.VIEW },
      { id: '6', module: MODULES.ROLES_PERMISSIONS, action: ACTIONS.VIEW },
      { id: '9', module: MODULES.PERMISSION_PACKAGES, action: ACTIONS.VIEW },
      { id: '12', module: MODULES.AFFILIATES, action: ACTIONS.VIEW },
      { id: '16', module: MODULES.CMS, action: ACTIONS.VIEW },
      { id: '16b', module: MODULES.CMS, action: ACTIONS.CREATE },
      { id: '19', module: MODULES.ADS, action: ACTIONS.VIEW },
      { id: '20', module: MODULES.SUPPORT_TICKETS, action: ACTIONS.VIEW },
      { id: '21', module: MODULES.POLICIES_FAQ, action: ACTIONS.VIEW },
    ],
  },
  'affiliate-admin': {
    id: 'affiliate-admin-role',
    name: 'Affiliate Admin',
    permissions: [
      { id: '1', module: MODULES.DASHBOARD, action: ACTIONS.VIEW },
      { id: '24', module: MODULES.SUB_ADMINS, action: ACTIONS.VIEW },
      { id: '25', module: MODULES.SUB_ADMINS, action: ACTIONS.CREATE },
      { id: '26', module: MODULES.SUB_ADMINS, action: ACTIONS.EDIT },
      { id: '27', module: MODULES.ROLES, action: ACTIONS.VIEW },
      { id: '28', module: MODULES.ROLES, action: ACTIONS.EDIT },
      { id: '16', module: MODULES.CMS, action: ACTIONS.VIEW },
      { id: '16b', module: MODULES.CMS, action: ACTIONS.CREATE },
      { id: '16c', module: MODULES.CMS, action: ACTIONS.EDIT },
      { id: '29', module: MODULES.CHALLENGES, action: ACTIONS.VIEW },
      { id: '30', module: MODULES.CHALLENGES, action: ACTIONS.CREATE },
      { id: '31', module: MODULES.CHALLENGES, action: ACTIONS.EDIT },
      { id: '19', module: MODULES.ADS, action: ACTIONS.VIEW },
      { id: '19b', module: MODULES.ADS, action: ACTIONS.CREATE },
      { id: '20', module: MODULES.SUPPORT_TICKETS, action: ACTIONS.VIEW },
      { id: '21', module: MODULES.POLICIES_FAQ, action: ACTIONS.VIEW },
      { id: '32', module: MODULES.PROFILE, action: ACTIONS.VIEW },
      { id: '32b', module: MODULES.PROFILE, action: ACTIONS.EDIT },
      { id: '33', module: MODULES.VERIFICATION, action: ACTIONS.VIEW },
    ],
  },
  'affiliate-sub-admin': {
    id: 'affiliate-sub-admin-role',
    name: 'Affiliate Sub-Admin',
    permissions: [
      { id: '1', module: MODULES.DASHBOARD, action: ACTIONS.VIEW },
      { id: '16', module: MODULES.CMS, action: ACTIONS.VIEW },
      { id: '16b', module: MODULES.CMS, action: ACTIONS.CREATE },
      { id: '29', module: MODULES.CHALLENGES, action: ACTIONS.VIEW },
      { id: '30', module: MODULES.CHALLENGES, action: ACTIONS.CREATE },
      { id: '19', module: MODULES.ADS, action: ACTIONS.VIEW },
      { id: '20', module: MODULES.SUPPORT_TICKETS, action: ACTIONS.VIEW },
      { id: '21', module: MODULES.POLICIES_FAQ, action: ACTIONS.VIEW },
      { id: '33', module: MODULES.VERIFICATION, action: ACTIONS.VIEW },
    ],
  },
};

// Mock Admin Users
export const MOCK_USERS: Record<AdminType, AdminUser> = {
  'root-admin': {
    id: 'user-1',
    name: 'Mamady Troare',
    email: 'mamady.traore@mkproject.com',
    type: 'root-admin',
    role: MOCK_ROLES['root-admin'],
    country: 'AE',
    subscriptionPlan: 'enterprise',
  },
  'root-sub-admin': {
    id: 'user-2',
    name: 'Fatima Ali',
    email: 'fatima@admin.com',
    type: 'root-sub-admin',
    role: MOCK_ROLES['root-sub-admin'],
    country: 'IN',
    subscriptionPlan: 'pro',
  },
  'affiliate-admin': {
    id: 'user-3',
    name: 'Hassan Malik',
    email: 'hassan@affiliate.com',
    type: 'affiliate-admin',
    role: MOCK_ROLES['affiliate-admin'],
    country: 'IN',
    subscriptionPlan: 'pro',
  },
  'affiliate-sub-admin': {
    id: 'user-4',
    name: 'Aisha Ahmed',
    email: 'aisha@affiliate.com',
    type: 'affiliate-sub-admin',
    role: MOCK_ROLES['affiliate-sub-admin'],
    country: 'US',
    subscriptionPlan: 'free',
  },
};

// Subscription Plans Feature Matrix
export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    features: ['dashboard', 'cms_basic', 'support_tickets'],
  },
  pro: {
    name: 'Pro',
    features: ['dashboard', 'cms_full', 'challenges', 'ads_basic', 'support_tickets', 'analytics'],
  },
  enterprise: {
    name: 'Enterprise',
    features: [
      'dashboard',
      'cms_full',
      'challenges',
      'ads_full',
      'support_tickets',
      'analytics',
      'api_access',
      'custom_roles',
      'bulk_export',
    ],
  },
};

// Translations
export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    'sidebar.dashboard': 'Dashboard',
    'sidebar.admin_users': 'Admin Users',
    'sidebar.roles_permissions': 'Roles & Permissions',
    'sidebar.modules_actions': 'Modules & Actions',
    'sidebar.permission_packages': 'Permission Packages',
    'sidebar.subscription_plans': 'Subscription Plans',
    'sidebar.affiliates': 'Affiliates',
    'sidebar.countries': 'Countries & Regions',
    'sidebar.cms': 'CMS',
    'sidebar.ads': 'Ads',
    'sidebar.support_tickets': 'Support Tickets',
    'sidebar.policies_faq': 'Policies & FAQ',
    'sidebar.settings': 'Settings',
    'sidebar.sub_admins': 'Sub Admins',
    'sidebar.challenges': 'Challenges',
    'sidebar.verification': 'Verification Status',
    'sidebar.profile': 'Profile',
    'header.language': 'Language',
    'header.country': 'Country',
    'header.plan': 'Plan',
    'header.role': 'Role',
    'header.logout': 'Logout',
    'unauthorized': 'You do not have permission to access this page.',
    'upgrade_plan': 'Upgrade your plan to access this feature.',
  },
  hi: {
    'sidebar.dashboard': 'डैशबोर्ड',
    'sidebar.admin_users': 'प्रशासक उपयोगकर्ता',
    'sidebar.roles_permissions': 'भूमिकाएं और अनुमतियां',
    'sidebar.modules_actions': 'मॉड्यूल और कार्य',
    'sidebar.permission_packages': 'अनुमति पैकेज',
    'sidebar.subscription_plans': 'सदस्यता योजनाएं',
    'sidebar.affiliates': 'सहयोगी',
    'sidebar.countries': 'देश और क्षेत्र',
    'sidebar.cms': 'सीएमएस',
    'sidebar.ads': 'विज्ञापन',
    'sidebar.support_tickets': 'समर्थन टिकट',
    'sidebar.policies_faq': 'नीतियां और सामान्य प्रश्न',
    'sidebar.settings': 'सेटिंग्स',
    'sidebar.sub_admins': 'सहायक प्रशासक',
    'sidebar.challenges': 'चुनौतियां',
    'sidebar.verification': 'सत्यापन स्थिति',
    'sidebar.profile': 'प्रोफ़ाइल',
    'header.language': 'भाषा',
    'header.country': 'देश',
    'header.plan': 'योजना',
    'header.role': 'भूमिका',
    'header.logout': 'लॉगआउट',
    'unauthorized': 'आपके पास इस पृष्ठ को एक्सेस करने की अनुमति नहीं है।',
    'upgrade_plan': 'इस सुविधा को एक्सेस करने के लिए अपनी योजना को अपग्रेड करें।',
  },
  ar: {
    'sidebar.dashboard': 'لوحة التحكم',
    'sidebar.admin_users': 'مستخدمو المسؤول',
    'sidebar.roles_permissions': 'الأدوار والأذونات',
    'sidebar.modules_actions': 'الوحدات والإجراءات',
    'sidebar.permission_packages': 'حزم الأذونات',
    'sidebar.subscription_plans': 'خطط الاشتراك',
    'sidebar.affiliates': 'الشركات التابعة',
    'sidebar.countries': 'الدول والمناطق',
    'sidebar.cms': 'إدارة المحتوى',
    'sidebar.ads': 'الإعلانات',
    'sidebar.support_tickets': 'تذاكر الدعم',
    'sidebar.policies_faq': 'السياسات والأسئلة الشائعة',
    'sidebar.settings': 'الإعدادات',
    'sidebar.sub_admins': 'مسؤولو فرعيون',
    'sidebar.challenges': 'التحديات',
    'sidebar.verification': 'حالة التحقق',
    'sidebar.profile': 'الملف الشخصي',
    'header.language': 'اللغة',
    'header.country': 'الدولة',
    'header.plan': 'الخطة',
    'header.role': 'الدور',
    'header.logout': 'تسجيل الخروج',
    'unauthorized': 'ليس لديك إذن للوصول إلى هذه الصفحة.',
    'upgrade_plan': 'قم بترقية خطتك للوصول إلى هذه الميزة.',
  },
};
