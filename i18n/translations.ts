/**
 * Multi-language Translation System
 * Supports: English, Hindi, Arabic
 */

export type Language = 'en' | 'hi' | 'ar';

export interface MultiLangContent {
  [key: string]: string;
}

// Language metadata
export const LANGUAGE_CONFIG: Record<Language, { name: string; dir: 'ltr' | 'rtl'; flag: string }> = {
  en: { name: 'English', dir: 'ltr', flag: '🇺🇸' },
  hi: { name: 'हिंदी', dir: 'ltr', flag: '🇮🇳' },
  ar: { name: 'العربية', dir: 'rtl', flag: '🇸🇦' },
};

// UI Language Translations
export const UI_TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.users': 'Users',
    'nav.roles': 'Roles & Permissions',
    'nav.modules': 'Modules & Actions',
    'nav.permissions': 'Permission Packages',
    'nav.plans': 'Subscription Plans',
    'nav.affiliates': 'Affiliates',
    'nav.countries': 'Countries',
    'nav.cms': 'CMS',
    'nav.ads': 'Advertisements',
    'nav.tickets': 'Support Tickets',
    'nav.policies': 'Policies & FAQ',
    'nav.settings': 'Settings',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',

    // Common UI
    'ui.language': 'Language',
    'ui.country': 'Country',
    'ui.plan': 'Plan',
    'ui.role': 'Role',
    'ui.save': 'Save',
    'ui.cancel': 'Cancel',
    'ui.delete': 'Delete',
    'ui.edit': 'Edit',
    'ui.view': 'View',
    'ui.create': 'Create',
    'ui.add': 'Add',
    'ui.close': 'Close',
    'ui.search': 'Search',
    'ui.filter': 'Filter',
    'ui.export': 'Export',
    'ui.import': 'Import',
    'ui.loading': 'Loading...',
    'ui.error': 'Error',
    'ui.success': 'Success',
    'ui.warning': 'Warning',
    'ui.info': 'Info',
    'ui.confirm': 'Confirm',
    'ui.required': 'Required',
    'ui.optional': 'Optional',
    'ui.noResults': 'No results found',
    'ui.back': 'Back',
    'ui.next': 'Next',
    'ui.previous': 'Previous',

    // Forms
    'form.name': 'Name',
    'form.description': 'Description',
    'form.email': 'Email',
    'form.phone': 'Phone',
    'form.address': 'Address',
    'form.status': 'Status',
    'form.active': 'Active',
    'form.inactive': 'Inactive',

    // Permissions
    'perm.view': 'View',
    'perm.create': 'Create',
    'perm.edit': 'Edit',
    'perm.delete': 'Delete',
    'perm.export': 'Export',

    // Multi-language form
    'multilang.selectLanguage': 'Select Language',
    'multilang.translation': 'Translation',
    'multilang.missingTranslations': 'Missing translations',
    'multilang.requiredLanguages': 'Required languages',
    'multilang.copyFrom': 'Copy from',
    'multilang.defaultLanguage': 'Default (English)',

    // Messages
    'msg.unauthorized': 'You do not have permission to access this page.',
    'msg.upgradePlan': 'Upgrade your plan to access this feature.',
    'msg.loading': 'Loading...',
    'msg.saved': 'Changes saved successfully',
    'msg.deleted': 'Item deleted successfully',
    'msg.error': 'An error occurred',
  },
  hi: {
    // Navigation
    'nav.dashboard': 'डैशबोर्ड',
    'nav.users': 'उपयोगकर्ता',
    'nav.roles': 'भूमिकाएं और अनुमतियां',
    'nav.modules': 'मॉड्यूल और कार्य',
    'nav.permissions': 'अनुमति पैकेज',
    'nav.plans': 'सदस्यता योजनाएं',
    'nav.affiliates': 'संबद्ध',
    'nav.countries': 'देश',
    'nav.cms': 'सीएमएस',
    'nav.ads': 'विज्ञापन',
    'nav.tickets': 'समर्थन टिकट',
    'nav.policies': 'नीतियां और सामान्य प्रश्न',
    'nav.settings': 'सेटिंग्स',
    'nav.profile': 'प्रोफ़ाइल',
    'nav.logout': 'लॉगआउट',

    // Common UI
    'ui.language': 'भाषा',
    'ui.country': 'देश',
    'ui.plan': 'योजना',
    'ui.role': 'भूमिका',
    'ui.save': 'सहेजें',
    'ui.cancel': 'रद्द करें',
    'ui.delete': 'हटाएं',
    'ui.edit': 'संपादित करें',
    'ui.view': 'देखें',
    'ui.create': 'बनाएं',
    'ui.add': 'जोड़ें',
    'ui.close': 'बंद करें',
    'ui.search': 'खोज',
    'ui.filter': 'फ़िल्टर',
    'ui.export': 'निर्यात',
    'ui.import': 'आयात',
    'ui.loading': 'लोड हो रहा है...',
    'ui.error': 'त्रुटि',
    'ui.success': 'सफल',
    'ui.warning': 'चेतावनी',
    'ui.info': 'जानकारी',
    'ui.confirm': 'पुष्टि करें',
    'ui.required': 'आवश्यक',
    'ui.optional': 'वैकल्पिक',
    'ui.noResults': 'कोई परिणाम नहीं मिला',
    'ui.back': 'पीछे',
    'ui.next': 'अगला',
    'ui.previous': 'पिछला',

    // Forms
    'form.name': 'नाम',
    'form.description': 'विवरण',
    'form.email': 'ईमेल',
    'form.phone': 'फोन',
    'form.address': 'पता',
    'form.status': 'स्थिति',
    'form.active': 'सक्रिय',
    'form.inactive': 'निष्क्रिय',

    // Permissions
    'perm.view': 'देखें',
    'perm.create': 'बनाएं',
    'perm.edit': 'संपादित करें',
    'perm.delete': 'हटाएं',
    'perm.export': 'निर्यात',

    // Multi-language form
    'multilang.selectLanguage': 'भाषा चुनें',
    'multilang.translation': 'अनुवाद',
    'multilang.missingTranslations': 'अनुवाद नहीं मिले',
    'multilang.requiredLanguages': 'आवश्यक भाषाएं',
    'multilang.copyFrom': 'से कॉपी करें',
    'multilang.defaultLanguage': 'डिफ़ॉल्ट (अंग्रेजी)',

    // Messages
    'msg.unauthorized': 'आपके पास इस पृष्ठ को एक्सेस करने की अनुमति नहीं है।',
    'msg.upgradePlan': 'इस सुविधा को एक्सेस करने के लिए अपनी योजना को अपग्रेड करें।',
    'msg.loading': 'लोड हो रहा है...',
    'msg.saved': 'परिवर्तन सफलतापूर्वक सहेजे गए',
    'msg.deleted': 'आइटम सफलतापूर्वक हटा दिया गया',
    'msg.error': 'एक त्रुटि हुई',
  },
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.users': 'المستخدمون',
    'nav.roles': 'الأدوار والأذونات',
    'nav.modules': 'الوحدات والإجراءات',
    'nav.permissions': 'حزم الأذونات',
    'nav.plans': 'خطط الاشتراك',
    'nav.affiliates': 'الشركات التابعة',
    'nav.countries': 'الدول',
    'nav.cms': 'إدارة المحتوى',
    'nav.ads': 'الإعلانات',
    'nav.tickets': 'تذاكر الدعم',
    'nav.policies': 'السياسات والأسئلة الشائعة',
    'nav.settings': 'الإعدادات',
    'nav.profile': 'الملف الشخصي',
    'nav.logout': 'تسجيل الخروج',

    // Common UI
    'ui.language': 'اللغة',
    'ui.country': 'الدولة',
    'ui.plan': 'الخطة',
    'ui.role': 'الدور',
    'ui.save': 'حفظ',
    'ui.cancel': 'إلغاء',
    'ui.delete': 'حذف',
    'ui.edit': 'تحرير',
    'ui.view': 'عرض',
    'ui.create': 'إنشاء',
    'ui.add': 'إضافة',
    'ui.close': 'إغلاق',
    'ui.search': 'البحث',
    'ui.filter': 'تصفية',
    'ui.export': 'تصدير',
    'ui.import': 'استيراد',
    'ui.loading': 'جاري التحميل...',
    'ui.error': 'خطأ',
    'ui.success': 'نجح',
    'ui.warning': 'تحذير',
    'ui.info': 'معلومة',
    'ui.confirm': 'تأكيد',
    'ui.required': 'مطلوب',
    'ui.optional': 'اختياري',
    'ui.noResults': 'لم يتم العثور على نتائج',
    'ui.back': 'رجوع',
    'ui.next': 'التالي',
    'ui.previous': 'السابق',

    // Forms
    'form.name': 'الاسم',
    'form.description': 'الوصف',
    'form.email': 'البريد الإلكتروني',
    'form.phone': 'الهاتف',
    'form.address': 'العنوان',
    'form.status': 'الحالة',
    'form.active': 'نشط',
    'form.inactive': 'غير نشط',

    // Permissions
    'perm.view': 'عرض',
    'perm.create': 'إنشاء',
    'perm.edit': 'تحرير',
    'perm.delete': 'حذف',
    'perm.export': 'تصدير',

    // Multi-language form
    'multilang.selectLanguage': 'اختر اللغة',
    'multilang.translation': 'الترجمة',
    'multilang.missingTranslations': 'الترجمات المفقودة',
    'multilang.requiredLanguages': 'اللغات المطلوبة',
    'multilang.copyFrom': 'نسخ من',
    'multilang.defaultLanguage': 'الافتراضي (الإنجليزية)',

    // Messages
    'msg.unauthorized': 'ليس لديك إذن للوصول إلى هذه الصفحة.',
    'msg.upgradePlan': 'قم بترقية خطتك للوصول إلى هذه الميزة.',
    'msg.loading': 'جاري التحميل...',
    'msg.saved': 'تم حفظ التغييرات بنجاح',
    'msg.deleted': 'تم حذف العنصر بنجاح',
    'msg.error': 'حدث خطأ',
  },
};
