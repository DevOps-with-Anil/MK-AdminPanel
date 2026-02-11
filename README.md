<<<<<<< HEAD
=======
<<<<<<< HEAD
# MK-AdminPanel
=======
>>>>>>> f758c2c (.)
# Islamic Admin Panel - Frontend Prototype

A fully navigable, **frontend-only** clickable prototype of an enterprise multi-tenant admin panel with role-based access control (RBAC), multi-language support, multi-country configurations, and subscription plan feature gating.

## Features

### 1. **Multi-Admin Role Simulation**
Switch between different admin types to see how the interface adapts:
- **Root Admin** - Full system access with access to all modules
- **Root Sub-Admin** - Limited management capabilities  
- **Affiliate Admin** - Affiliate-specific features and management
- **Affiliate Sub-Admin** - Restricted affiliate sub-admin access

Use the **Role Switcher** in the top header to switch between roles in real-time.

### 2. **Role-Based Access Control (RBAC)**
- Dynamic sidebar menu based on user role and permissions
- Permission-gated buttons and actions
- Module + Action based permission system
- Features:
  - Dashboard
  - Admin Users Management
  - Roles & Permissions
  - Modules & Actions
  - Permission Packages
  - Subscription Plans
  - Affiliates Management
  - Countries & Regions
  - CMS (Content Management)
  - Ads Management
  - Support Tickets
  - Policies & FAQ
  - Settings

### 3. **Multi-Language Support**
- **English** (Default)
- **Hindi** (हिंदी)
- **Arabic** (العربية - RTL Support)

Select language from the **Language Switcher** in the header. Arabic automatically enables RTL layout.

### 4. **Multi-Country Support**
- **India** (IN)
- **United Arab Emirates** (AE)
- **United States** (US)

Switch countries using the **Country Switcher** to see localized content. Different regions can have different features and content availability.

### 5. **Subscription Plan Feature Gating**
Three subscription tiers with feature-level control:
- **Free** - Basic dashboard, CMS basics, support tickets
- **Pro** - Full CMS, challenges, basic ads, analytics
- **Enterprise** - All features including API access, custom roles, bulk export

View your current plan in the header and see which features are available on your plan.

### 6. **Dynamic Dashboard**
- Role-specific welcome message
- Permission overview
- Feature access matrix  
- System status indicators
- Recent activity feed
- Quick tips based on your role

### 7. **Admin Layout**
- **Collapsible Sidebar** - Click the menu icon to expand/collapse
- **Top Navigation Bar** with real-time switchers:
  - Admin Type Selector
  - Language Selector
  - Country Selector
  - Plan Badge
  - Logout Button
- **Breadcrumbs** (Coming soon in nested pages)
- **Fully Responsive** design

## Architecture

### Context System (`AdminContext`)
Centralized state management using React Context:
```tsx
const { 
  currentAdminType,
  currentLanguage,
  currentCountry,
  currentUser,
  hasPermission,
  hasFeature,
  t // Translation helper
} = useAdmin();
```

### Mock Data (`mock-data.ts`)
Complete frontend mock system including:
- Admin types and roles
- Permissions matrix
- Subscription plans
- Translations for 3 languages

### Components
- **AdminLayout** - Main layout wrapper with sidebar and header
- **AdminPageTemplate** - Reusable page template
- **Dashboard** - Main dashboard component
- **Stub Pages** - All admin panel pages for full navigation

## How to Use

### 1. **Start the App**
```bash
npm install
npm run dev
```

Open http://localhost:3000

### 2. **Switch Admin Types**
Use the **Role** dropdown in the top header to switch between:
- Root Admin
- Root Sub-Admin
- Affiliate Admin
- Affiliate Sub-Admin

Watch the sidebar menu update and permissions change in real-time.

### 3. **Try Multi-Language**
Use the **Language** dropdown to switch between English, Hindi, and Arabic. All UI labels update instantly.

### 4. **Select Country**
Use the **Country** dropdown to switch between India, UAE, and USA. Country badge appears on pages.

### 5. **Navigate Full Admin Panel**
Click sidebar menu items to navigate to different sections:
- Dashboard
- Admin Users
- Roles & Permissions
- Modules & Actions
- Permission Packages
- Subscription Plans
- Affiliates
- Countries & Regions
- CMS
- Ads
- Support Tickets
- Policies & FAQ
- Settings

### 6. **Explore Affiliate-Specific Pages**
When logged in as Affiliate Admin or Sub-Admin, see different menu items:
- Sub Admins
- Challenges
- Profile
- Verification Status

## File Structure

```
/
├── app/
│   ├── page.tsx                  # Entry point
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Islamic theme colors
│   └── admin/
│       ├── dashboard/page.tsx
│       ├── users/page.tsx
│       ├── roles/page.tsx
│       ├── modules/page.tsx
│       ├── permissions/page.tsx
│       ├── plans/page.tsx
│       ├── affiliates/page.tsx
│       ├── countries/page.tsx
│       ├── cms/page.tsx
│       ├── ads/page.tsx
│       ├── tickets/page.tsx
│       ├── policies/page.tsx
│       ├── settings/page.tsx
│       ├── sub-admins/page.tsx
│       ├── challenges/page.tsx
│       ├── profile/page.tsx
│       └── verification/page.tsx
├── components/
│   ├── AdminLayout.tsx           # Main layout
│   ├── PermissionGate.tsx        # Permission guard
│   └── pages/
│       ├── Dashboard.tsx
│       └── AdminPageTemplate.tsx
├── contexts/
│   └── AdminContext.tsx          # Global state
├── lib/
│   ├── mock-data.ts              # Mock data system
│   ├── db-schema.ts              # Backend schema reference
│   ├── rbac-engine.ts            # RBAC logic
│   └── ...
└── hooks/
    └── useAuth.ts                # Auth hook (reference)
```

## Islamic Design Theme

Color palette designed for Islamic content platforms:
- **Primary**: Emerald Green (`oklch(0.5 0.12 142)`) - Growth & harmony
- **Secondary**: Navy Blue (`oklch(0.35 0.08 264)`) - Stability
- **Accent**: Gold (`oklch(0.63 0.14 67)`) - Value & refinement
- **Neutrals**: Off-white and charcoal

Supports both light and dark modes automatically.

## Mock Data Structure

### Admin Users
```tsx
{
  id: string,
  name: string,
  email: string,
  type: AdminType,
  role: Role,
  country: Country,
  subscriptionPlan: SubscriptionPlan
}
```

### Roles & Permissions
```tsx
{
  id: string,
  name: string,
  permissions: [
    { module: string, action: string }
  ]
}
```

### Subscription Plans
```tsx
{
  free: ['dashboard', 'cms_basic', 'support_tickets'],
  pro: ['dashboard', 'cms_full', 'challenges', 'ads_basic', ...],
  enterprise: [all features]
}
```

## Key Features Demo

### 1. Permission-Based Menu
Root Admin sees all menu items, Affiliate Admin sees only relevant items.

### 2. Feature Gating
Try upgrading to Enterprise plan and see more features unlock in the Feature Access section.

### 3. Dynamic Dashboard
Each role gets role-specific tips and information.

### 4. Translation
All UI labels are translated to 3 languages with full RTL support for Arabic.

### 5. Country Detection
Pages show the active country badge and can display country-specific content.

## Next Steps for Backend Integration

When ready to build the backend:

1. **Database Schema** - See `/lib/db-schema.ts` for the data structure
2. **API Routes** - See `/lib/middleware.ts` and `/app/api/auth/route.ts` for reference
3. **Authentication** - Implement real auth with JWT or Sessions
4. **RBAC Engine** - See `/lib/rbac-engine.ts` for permission logic
5. **Permissions Middleware** - Protect routes based on roles

## Notes

- **This is a frontend-only prototype** - All data is mocked in the frontend using React Context
- **No backend required** - All navigation and role switching works client-side
- **Ready to extend** - Easily add real API calls by replacing mock data with API responses
- **Fully accessible** - Semantic HTML, ARIA labels, keyboard navigation

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Technologies Used

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first CSS
- **Shadcn/UI** - Component library
- **Lucide Icons** - Icon library

---

**Created for Islamic content platform administration** with a complete multi-tenant, role-based, multi-language interface design.
<<<<<<< HEAD
=======
>>>>>>> 02bec2f (Admin Panel Updated)
>>>>>>> f758c2c (.)
