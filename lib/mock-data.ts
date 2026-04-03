// Mock Data for Frontend-Only Admin Panel

export type AdminType = 'root-admin' | 'tenant-admin'
export type Language = 'en' | 'fr';
export type Country = 'IN' | 'FR';

export const COUNTRIES: Record<Country, { label: string; flag: string }> = {
  IN: { label: 'India', flag: '🇮🇳' },
  FR: { label: 'France', flag: '🇫🇷' }
};

export const LANGUAGES: Record<Language, { label: string; flag: string }> = {
  en: { label: 'English', flag: '🇺🇸' },
  // ar: { label: 'Arabic', flag: '🇦🇪' },
  fr: { label: 'French', flag: '🇫🇷' }
};

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
  lastLogin: string;
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
  TENANTS: 'tenants',
  KYB_REQUESTS: 'kyb_requests',
  BUSINESS_KYB: 'business_kyb',
  CUSTOMERS: 'customers',
  ANALYTICS_REPORT: 'analytics_report',
  SECURITY_COMPLIANCE: 'security_compliance',
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
      { id: '2b', module: MODULES.TENANTS, action: ACTIONS.VIEW },
      { id: '2c', module: MODULES.KYB_REQUESTS, action: ACTIONS.VIEW },
      { id: '2d', module: MODULES.ANALYTICS_REPORT, action: ACTIONS.VIEW },
      { id: '2e', module: MODULES.SECURITY_COMPLIANCE, action: ACTIONS.VIEW },
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
  'tenant-admin': {
    id: 'affiliate-admin-role',
    name: 'Affiliate Admin',
    permissions: [
      { id: '1', module: MODULES.DASHBOARD, action: ACTIONS.VIEW },
      { id: '24', module: MODULES.SUB_ADMINS, action: ACTIONS.VIEW },
      { id: '25', module: MODULES.SUB_ADMINS, action: ACTIONS.CREATE },
      { id: '26', module: MODULES.SUB_ADMINS, action: ACTIONS.EDIT },
      { id: '27', module: MODULES.ROLES_PERMISSIONS, action: ACTIONS.VIEW },
      { id: '28', module: MODULES.ROLES_PERMISSIONS, action: ACTIONS.EDIT },
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
      { id: '34', module: MODULES.BUSINESS_KYB, action: ACTIONS.VIEW },
      { id: '35', module: MODULES.CUSTOMERS, action: ACTIONS.VIEW },
      { id: '36', module: MODULES.ANALYTICS_REPORT, action: ACTIONS.VIEW },
      { id: '37', module: MODULES.SECURITY_COMPLIANCE, action: ACTIONS.VIEW },
      { id: '38', module: MODULES.SETTINGS, action: ACTIONS.VIEW },
      { id: '39', module: MODULES.SUBSCRIPTION_PLANS, action: ACTIONS.VIEW },
      { id: '40', module: MODULES.ADMIN_USERS, action: ACTIONS.VIEW },
    ],
  },
};

// Mock Notifications
export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'New Tenant Registered',
    description: 'EduSmart Pvt Ltd has successfully registered and is awaiting KYB verification.',
    time: '1 min ago',
    type: 'success',
    isRead: false
  },
  {
    id: '2',
    title: 'Failed Login Attempt',
    description: 'Multiple failed login attempts detected for admin@alphacorp.com from IP 185.23.44.12.',
    time: '8 mins ago',
    type: 'error',
    isRead: false
  },
  {
    id: '3',
    title: 'New KYB Verification Request',
    description: 'Bright Future Academy submitted documents for business verification.',
    time: '25 mins ago',
    type: 'info',
    isRead: false
  },
  {
    id: '4',
    title: 'Subscription Payment Received',
    description: '₹24,999 payment received from Alpha Corp for Enterprise plan renewal.',
    time: '45 mins ago',
    type: 'success',
    isRead: false
  },
  {
    id: '5',
    title: 'Server CPU Usage High',
    description: 'Application server CPU usage exceeded 85% for the last 5 minutes.',
    time: '1 hour ago',
    type: 'warning',
    isRead: false
  },
  {
    id: '6',
    title: 'New Support Ticket',
    description: 'User reported a payment gateway issue while purchasing a course.',
    time: '2 hours ago',
    type: 'info',
    isRead: true
  },
  {
    id: '7',
    title: 'New Course Published',
    description: 'Tenant "TechLearn Hub" published a new course: Advanced React Development.',
    time: '3 hours ago',
    type: 'success',
    isRead: true
  },
  {
    id: '8',
    title: 'Subscription Expiring Soon',
    description: 'Tenant Bright Future Academy subscription will expire in 3 days.',
    time: '5 hours ago',
    type: 'warning',
    isRead: true
  },
  {
    id: '9',
    title: 'Database Backup Completed',
    description: 'Nightly backup for production database completed successfully.',
    time: '7 hours ago',
    type: 'success',
    isRead: true
  },
  {
    id: '10',
    title: 'User Role Updated',
    description: 'Admin Anil Singh changed role of user Rahul Sharma to Tenant Manager.',
    time: '9 hours ago',
    type: 'info',
    isRead: true
  },
  {
    id: '11',
    title: 'Security Patch Applied',
    description: 'Latest security patch v2.4.1 applied to authentication service.',
    time: '12 hours ago',
    type: 'success',
    isRead: true
  },
  {
    id: '12',
    title: 'Storage Limit Warning',
    description: 'Tenant "Digital Academy" has used 92% of allocated storage.',
    time: '18 hours ago',
    type: 'warning',
    isRead: true
  },
  {
    id: '13',
    title: 'New Student Enrollment',
    description: '152 students enrolled in the course "Full Stack Web Development".',
    time: '1 day ago',
    type: 'success',
    isRead: true
  },
  {
    id: '14',
    title: 'Payment Gateway Error',
    description: 'Razorpay API returned timeout error for transaction TXN948273.',
    time: '1 day ago',
    type: 'error',
    isRead: true
  },
  {
    id: '15',
    title: 'Monthly Analytics Report Ready',
    description: 'Your SaaS platform performance report for March is now available.',
    time: '2 days ago',
    type: 'info',
    isRead: true
  },
  {
    id: '16',
    title: 'Tenant Domain Updated',
    description: 'Alpha Corp changed their custom domain to learn.alphacorp.com.',
    time: '2 days ago',
    type: 'info',
    isRead: true
  },
  {
    id: '17',
    title: 'System Maintenance Scheduled',
    description: 'Platform maintenance scheduled on Sunday 2:00 AM – 4:00 AM UTC.',
    time: '3 days ago',
    type: 'warning',
    isRead: true
  },
  {
    id: '18',
    title: 'Audit Log Generated',
    description: 'Monthly security and activity audit logs have been generated.',
    time: '4 days ago',
    type: 'success',
    isRead: true
  }
];

// Mock Admin Users
export const MOCK_USERS: Record<AdminType, AdminUser> = {
  'root-admin': {
    id: 'user-1',
    name: 'Ahmed Khan',
    email: 'ahmed@admin.com',
    type: 'root-admin',
    role: MOCK_ROLES['root-admin'],
    country: 'FR',
    subscriptionPlan: 'enterprise',
    lastLogin: 'Mar 12, 2026, 02:45 PM',
  },
  'tenant-admin': {
    id: 'user-3',
    name: 'Hassan Malik',
    email: 'hassan@affiliate.com',
    type: 'tenant-admin',
    role: MOCK_ROLES['tenant-admin'],
    country: 'IN',
    subscriptionPlan: 'pro',
    lastLogin: 'Mar 12, 2026, 09:15 AM',
  },
};

// Subscription Plans Feature Matrix
// export const SUBSCRIPTION_PLANS = {
//   free: {
//     name: 'Free',
//     features: ['dashboard', 'cms_basic', 'support_tickets'],
//   },
//   pro: {
//     name: 'Pro',
//     features: ['dashboard', 'cms_full', 'challenges', 'ads_basic', 'support_tickets', 'analytics'],
//   },
//   enterprise: {
//     name: 'Enterprise',
//     features: [
//       'dashboard',
//       'cms_full',
//       'challenges',
//       'ads_full',
//       'support_tickets',
//       'analytics',
//       'api_access',
//       'custom_roles',
//       'bulk_export',
//     ],
//   },
// };

// Translations
export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    'sidebar.dashboard': 'Dashboard',
    'sidebar.admin_users': 'Access Management',
    'sidebar.roles_permissions': 'Roles & Permissions',
    'sidebar.modules_actions': 'Modules & Actions',
    'sidebar.permission_packages': 'Modules Packages',
    'sidebar.subscription_plans': 'Subscriptions',
    'sidebar.affiliates': 'Affiliates',
    'sidebar.tenants': 'Tenants',
    'sidebar.kyb_requests': 'KYB Requests',
    'sidebar.business_kyb': 'Business KYB',
    'sidebar.customers': 'Customers',
    'sidebar.analytics_report': 'Analytics Report',
    'sidebar.security_compliance': 'Security and Compliance',
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
    // Plans Page
    'plans.title': 'Subscription Plans',
    'plans.subtitle': 'Manage subscription tiers and features',
    'plans.newPlan': 'New Plan',
    'plans.totalPlans': 'Total Plans',
    'plans.totalRevenue': 'Total Revenue',
    'plans.totalSubscribers': 'Total Subscribers',
    'plans.modulesFeatures': 'Modules / Features',
    'plans.interval_monthly': '/ monthly',
    'plans.interval_yearly': '/ yearly',
    'plans.viewModules': 'View Modules & Permissions',
    'plans.edit': 'Edit',
    'plans.delete': 'Delete',
    'plans.deleteConfirm': 'Are you sure you want to delete this plan?',
    'plans.active': 'Active',
    'plans.inactive': 'Inactive',
    // New Plan Page
    'plans.createTitle': 'Create New Plan',
    'plans.createSubtitle': 'Define plan details, pricing and features',
    'plans.nameLabel': 'Plan Name',
    'plans.descLabel': 'Description',
    'plans.priceLabel': 'Price',
    'plans.currencyLabel': 'Currency',
    'plans.durationLabel': 'Duration',
    'plans.statusLabel': 'Status',
    'plans.createBtn': 'Create Plan',
    'plans.cancel': 'Cancel',
    'plans.selectDuration': 'Select Duration',
    'plans.selectStatus': 'Select Status',
    // Users Page
    'users.title': 'System Users',
    'users.subtitle': 'Manage system administrators and sub-admins',
    'users.searchPlaceholder': 'Search by name or email...',
    'users.newUser': 'New User',
    'users.directory': 'Users Directory',
    'users.name': 'Name',
    'users.email': 'Email',
    'users.role': 'Role',
    'users.status': 'Status',
    'users.created': 'Created',
    'users.actions': 'Actions',
    'users.active': 'Active',
    'users.inactive': 'Inactive',
    'users.edit': 'Edit',
    'users.delete': 'Delete',
    'users.deleteConfirm': 'Delete admin "{name}"?',
    'users.show': 'Show',
    // Roles Page & New Role
    'roles.createTitle': 'Create Role',
    'roles.createSubtitle': 'Add a new role with multilingual support',
    'roles.details': 'Role Details',
    'roles.detailsSubtitle': 'Fill role information in multiple languages',
    'roles.roleName': 'Role Name',
    'roles.description': 'Description',
    'roles.status': 'Status',
    'roles.selectStatus': 'Select status',
    'roles.createBtn': 'Create Role',
    'roles.creating': 'Creating...',
    'roles.cancel': 'Cancel',
    'roles.success': 'Role created successfully!',
    'roles.title': 'Roles & Permissions',
    'roles.subtitle': 'Manage system roles and access privileges',
    'roles.newRole': 'New Role',
    'roles.usersCount': 'Users Assigned',
    // Users New
    'users.createTitle': 'Create New User',
    'users.createSubtitle': 'Add a new administrator to the system',
    'users.password': 'Password',
    'users.selectRole': 'Select Role',
    'users.createBtn': 'Create User',
    // Edit Pages
    'users.editTitle': 'Edit User',
    'users.editSubtitle': 'Update user details and permissions',
    'users.updateBtn': 'Update User',
    'users.detailsTitle': 'User Information',
    'users.detailsDesc': 'Update admin details',
    'users.phoneCode': 'Phone Code',
    'users.phoneNumber': 'Phone Number',
    'users.allowedCountries': 'Allowed Countries',
    'users.selectCountries': 'Select countries',
    'users.adminImage': 'Admin Image',
    'users.uploadImage': 'Upload Image',
    'users.saveChanges': 'Save Changes',
    'roles.editTitle': 'Edit Role',
    'roles.editSubtitle': 'Modify role permissions and access',
    'roles.updateBtn': 'Update Role',
    'plans.editTitle': 'Edit Plan',
    'plans.editSubtitle': 'Update subscription plan configuration',
    'plans.updateBtn': 'Update Plan',
    'plans.detailsTitle': 'Plan Details',
    'plans.backToPlans': 'Back to Plans',
    // Modules & Permissions Page
    'plans.modulesPermissionsTitle': 'Modules & Permissions',
    'plans.loadingData': 'Loading plan data...',
    'plans.assignedModules': 'Assigned Modules',
    'plans.assignedModulesDesc': 'Modules for this plan.',
    'plans.noModulesAssigned': 'No modules assigned yet.',
    'plans.assignedPermissions': 'Assigned Permissions',
    'plans.assignedPermissionsDesc': 'Permissions derived from plan role model.',
    'plans.viewingMapping': 'Viewing modules and permission mapping for plan:',
    'plans.planNotFound': 'Plan not found.',
    'plans.syncBackend': 'Sync with backend (coming soon)',
    // Modules Page
    'modules.title': 'Modules & Features',
    'modules.subtitle': 'Manage platform modules and permissions',
    'modules.searchPlaceholder': 'Search Modules...',
    'modules.newModule': 'New Module',
    'modules.available': 'Available Modules',
    'modules.actions': 'Module Actions',
    'modules.totalModules': 'Total Modules',
    'modules.totalPermissions': 'Total Permissions',
    'modules.activeModules': 'Active Modules',
    'modules.emptyActions': 'Please select a module to view its actions',
    'modules.createTitle': 'Create Module & Actions',
    'modules.createSubtitle': 'Add a new Module with multilingual support',
    'modules.detailsTitle': 'Module Details',
    'modules.detailsDesc': 'Fill module information in multiple languages',
    'modules.keyLabel': 'Module Key',
    'modules.nameLabel': 'Module Name',
    'modules.actionsTitle': 'Actions Details',
    'modules.actionsDesc': 'Fill actions information in multiple languages',
    'modules.addActionBtn': 'Add Action',
    'modules.actionKeyLabel': 'Action Key',
    'modules.actionNameLabel': 'Action Name',
    'modules.createBtn': 'Create Module',
    'modules.success': 'Module created successfully!',
  },
  fr: {
    'sidebar.dashboard': 'Tableau de bord',
    'sidebar.admin_users': 'Gestion des accès',
    'sidebar.roles_permissions': 'Rôles & Permissions',
    'sidebar.modules_actions': 'Modules & Actions',
    'sidebar.permission_packages': 'Packages de modules',
    'sidebar.subscription_plans': 'Abonnements',
    'sidebar.affiliates': 'Affiliés',
    'sidebar.tenants': 'Locataires',
    'sidebar.kyb_requests': 'Demandes KYB',
    'sidebar.business_kyb': 'KYB Business',
    'sidebar.customers': 'Clients',
    'sidebar.analytics_report': 'Rapport analytique',
    'sidebar.security_compliance': 'Sécurité et conformité',
    'sidebar.countries': 'Pays et régions',
    'sidebar.cms': 'CMS',
    'sidebar.ads': 'Publicités',
    'sidebar.support_tickets': 'Tickets de support',
    'sidebar.policies_faq': 'Politiques & FAQ',
    'sidebar.settings': 'Paramètres',
    'sidebar.sub_admins': 'Sous-admins',
    'sidebar.challenges': 'Défis',
    'sidebar.verification': 'Statut de vérification',
    'sidebar.profile': 'Profil',
    'header.language': 'Langue',
    'header.country': 'Pays',
    'header.plan': 'Forfait',
    'header.role': 'Rôle',
    'header.logout': 'Se déconnecter',
    'unauthorized': "Vous n'avez pas la permission d'accéder à cette page.",
    'upgrade_plan': "Mettez à jour votre forfait pour accéder à cette fonctionnalité.",
    // Plans Page
    'plans.title': 'Forfaits d\'abonnement',
    'plans.subtitle': 'Gérer les niveaux d\'abonnement et les fonctionnalités',
    'plans.newPlan': 'Nouveau forfait',
    'plans.totalPlans': 'Total des forfaits',
    'plans.totalRevenue': 'Revenu total',
    'plans.totalSubscribers': 'Total des abonnés',
    'plans.modulesFeatures': 'Modules / Fonctionnalités',
    'plans.interval_monthly': '/ mois',
    'plans.interval_yearly': '/ an',
    'plans.viewModules': 'Voir Modules & Permissions',
    'plans.edit': 'Modifier',
    'plans.delete': 'Supprimer',
    'plans.deleteConfirm': 'Êtes-vous sûr de vouloir supprimer ce forfait ?',
    'plans.active': 'Actif',
    'plans.inactive': 'Inactif',
    // New Plan Page
    'plans.createTitle': 'Créer un nouveau forfait',
    'plans.createSubtitle': 'Définir les détails, prix et fonctionnalités',
    'plans.nameLabel': 'Nom du forfait',
    'plans.descLabel': 'Description',
    'plans.priceLabel': 'Prix',
    'plans.currencyLabel': 'Devise',
    'plans.durationLabel': 'Durée',
    'plans.statusLabel': 'Statut',
    'plans.createBtn': 'Créer le forfait',
    'plans.cancel': 'Annuler',
    'plans.selectDuration': 'Choisir la durée',
    'plans.selectStatus': 'Choisir le statut',
    // Users Page
    'users.title': 'Utilisateurs du système',
    'users.subtitle': 'Gérer les administrateurs et sous-admins',
    'users.searchPlaceholder': 'Rechercher par nom ou email...',
    'users.newUser': 'Nouvel utilisateur',
    'users.directory': 'Répertoire utilisateurs',
    'users.name': 'Nom',
    'users.email': 'Email',
    'users.role': 'Rôle',
    'users.status': 'Statut',
    'users.created': 'Créé le',
    'users.actions': 'Actions',
    'users.active': 'Actif',
    'users.inactive': 'Inactif',
    'users.edit': 'Modifier',
    'users.delete': 'Supprimer',
    'users.deleteConfirm': 'Supprimer l\'admin "{name}" ?',
    'users.show': 'Afficher',
    // Roles Page & New Role
    'roles.createTitle': 'Créer un rôle',
    'roles.createSubtitle': 'Ajouter un nouveau rôle multilingue',
    'roles.details': 'Détails du rôle',
    'roles.detailsSubtitle': 'Remplir les informations dans plusieurs langues',
    'roles.roleName': 'Nom du rôle',
    'roles.description': 'Description',
    'roles.status': 'Statut',
    'roles.selectStatus': 'Choisir le statut',
    'roles.createBtn': 'Créer le rôle',
    'roles.creating': 'Création...',
    'roles.cancel': 'Annuler',
    'roles.success': 'Rôle créé avec succès !',
    'roles.title': 'Rôles et autorisations',
    'roles.subtitle': 'Gérer les rôles et privilèges d\'accès',
    'roles.newRole': 'Nouveau rôle',
    'roles.usersCount': 'Utilisateurs assignés',
    // Users New
    'users.createTitle': 'Créer un utilisateur',
    'users.createSubtitle': 'Ajouter un nouvel administrateur au système',
    'users.password': 'Mot de passe',
    'users.selectRole': 'Choisir un rôle',
    'users.createBtn': 'Créer l\'utilisateur',
    // Edit Pages
    'users.editTitle': 'Modifier l\'utilisateur',
    'users.editSubtitle': 'Mettre à jour les détails et permissions',
    'users.updateBtn': 'Mettre à jour',
    'users.detailsTitle': 'Informations de l\'utilisateur',
    'users.detailsDesc': 'Mettre à jour les détails de l\'admin',
    'users.phoneCode': 'Indicatif',
    'users.phoneNumber': 'Numéro de téléphone',
    'users.allowedCountries': 'Pays autorisés',
    'users.selectCountries': 'Sélectionner des pays',
    'users.adminImage': 'Image de l\'admin',
    'users.uploadImage': 'Télécharger une image',
    'users.saveChanges': 'Enregistrer',
    'roles.editTitle': 'Modifier le rôle',
    'roles.editSubtitle': 'Modifier les permissions et l\'accès',
    'roles.updateBtn': 'Mettre à jour',
    'plans.editTitle': 'Modifier le forfait',
    'plans.editSubtitle': 'Mettre à jour la configuration du plan',
    'plans.updateBtn': 'Mettre à jour',
    'plans.detailsTitle': 'Détails du forfait',
    'plans.backToPlans': 'Retour aux forfaits',
    // Modules & Permissions Page
    'plans.modulesPermissionsTitle': 'Modules et autorisations',
    'plans.loadingData': 'Chargement des données du forfait...',
    'plans.assignedModules': 'Modules assignés',
    'plans.assignedModulesDesc': 'Modules pour ce forfait.',
    'plans.noModulesAssigned': 'Aucun module assigné pour le moment.',
    'plans.assignedPermissions': 'Autorisations assignées',
    'plans.assignedPermissionsDesc': 'Autorisations dérivées du modèle de rôle du forfait.',
    'plans.viewingMapping': 'Affichage des modules et de la correspondance des autorisations pour le forfait :',
    'plans.planNotFound': 'Forfait non trouvé.',
    'plans.syncBackend': 'Synchroniser avec le backend (bientôt disponible)',
    // Modules Page
    'modules.title': 'Modules et fonctionnalités',
    'modules.subtitle': 'Gérer les modules et les permissions de la plateforme',
    'modules.searchPlaceholder': 'Rechercher des modules...',
    'modules.newModule': 'Nouveau module',
    'modules.available': 'Modules disponibles',
    'modules.actions': 'Actions du module',
    'modules.totalModules': 'Total des modules',
    'modules.totalPermissions': 'Total des permissions',
    'modules.activeModules': 'Modules actifs',
    'modules.emptyActions': 'Veuillez sélectionner un module pour voir ses actions',
    'modules.createTitle': 'Créer un module et des actions',
    'modules.createSubtitle': 'Ajouter un nouveau module avec support multilingue',
    'modules.detailsTitle': 'Détails du module',
    'modules.detailsDesc': 'Remplir les informations du module en plusieurs langues',
    'modules.keyLabel': 'Clé du module',
    'modules.nameLabel': 'Nom du module',
    'modules.actionsTitle': 'Détails des actions',
    'modules.actionsDesc': 'Remplir les informations des actions en plusieurs langues',
    'modules.addActionBtn': 'Ajouter une action',
    'modules.actionKeyLabel': 'Clé de l\'action',
    'modules.actionNameLabel': 'Nom de l\'action',
    'modules.createBtn': 'Créer le module',
    'modules.success': 'Module créé avec succès !',
  },
};
