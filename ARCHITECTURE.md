# Islamic Admin Panel - System Architecture

## Overview

Enterprise-grade multi-tenant RBAC admin system for Islamic content platforms with subscription plans, modular permissions, and dynamic menu generation.

## System Design

```
┌─────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                     │
│  (Next.js Components, Pages, Dynamic Menu Rendering)    │
└────────────────────────┬────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────────────┐
│               APPLICATION LOGIC LAYER                    │
│  (RBAC Engine, Permission Checks, Auth Context)         │
└────────────────────────┬────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────────────┐
│                    API LAYER                             │
│  (Next.js Route Handlers, Middleware, Auth Routes)      │
└────────────────────────┬────────────────────────────────┘
                         │
┌─────────────────────────────────────────────────────────┐
│                   DATABASE LAYER                         │
│  (Relational DB - PostgreSQL/MySQL recommended)         │
└─────────────────────────────────────────────────────────┘
```

## Multi-Tenancy Model

### Admin Hierarchy

```
ROOT ADMIN (System Owner)
├── ROOT SUB-ADMINS (created by Root Admin)
│   └── Uses Root Permission Packages
│
└── AFFILIATE ADMINS (White-label accounts)
    └── AFFILIATE SUB-ADMINS
        └── Uses Affiliate Permission Packages (from Subscription Plans)
```

### Tenant Isolation

- **Root Tenant**: System administrator workspace
- **Affiliate Tenants**: Independent white-label environments
- All data is isolated by `tenantId` in database queries
- Row Level Security (RLS) enforced on all database access

## Permission System

### Modules & Actions

Each module has multiple actions:

```
Modules:
├── admin-users
│   ├── view
│   ├── create
│   ├── edit
│   ├── delete
│   └── manage-profile
│
├── cms
│   ├── view-news
│   ├── create-news
│   ├── publish-news
│   ├── view-videos
│   ├── view-challenges
│   └── manage-participants
│
└── support
    ├── view-tickets
    ├── create-tickets
    ├── assign-tickets
    └── close-tickets
```

### Permission Package Types

**Root Permission Packages**
- Assigned to Root Admin and Root Sub-Admins
- Define all available system modules and actions
- Created and managed by Root Admin

**Affiliate Permission Packages**
- Assigned through Subscription Plans
- Limited to specific modules/actions
- Restrict what affiliate admins can access

### Permission Flow

```
User Role
  ↓
Role.permissions (Modules + Actions)
  ↓
RBAC Engine Permission Check
  ↓
Allowed/Denied Response
```

## Database Schema

### Core Tables

```sql
-- Users & Tenants
users (id, email, name, passwordHash, adminType, userRole, tenantId, isActive)
tenants (id, name, slug, adminType, rootAdminId, subscriptionPlanId, isVerified)

-- Permissions
modules (id, name, slug, icon, order)
actions (id, moduleId, name, slug)
permission_packages (id, name, packageType, permissions[])

-- Roles
roles (id, name, tenantId, permissions[])
user_roles (id, userId, roleId, tenantId)

-- Subscriptions
subscription_plans (id, name, price, permissionPackages[])
subscriptions (id, tenantId, planId, status, startDate)

-- CMS
news (id, tenantId, title, content, status, authorId)
videos (id, tenantId, title, url, status)
challenges (id, tenantId, title, startDate, endDate)
challenge_participants (id, challengeId, userId, status)

-- Support
support_tickets (id, tenantId, subject, priority, status, assignedTo)
ticket_messages (id, ticketId, userId, message)

-- Audit
audit_logs (id, userId, tenantId, action, resourceType, resourceId, changes)
```

## Authentication Flow

```
User Login
    ↓
POST /api/auth/login
    ↓
Verify credentials
    ↓
Generate JWT token
    ↓
Set HTTP-only secure cookie
    ↓
Return user data + token
    ↓
Client authenticated
    ↓
Include cookie in all requests
```

### Token Structure

```json
{
  "id": "user-123",
  "email": "admin@example.com",
  "name": "Admin Name",
  "tenantId": "tenant-456",
  "adminType": "root",
  "userRole": "root-admin",
  "iat": 1234567890
}
```

## API Design

### Authentication Endpoints

```
POST /api/auth/login
  Request: { email, password }
  Response: { success, user, token }

GET /api/auth/session
  Response: { user } or null

POST /api/auth/logout
  Response: { success }
```

### Protected Endpoints Pattern

```
GET /api/admin/users
  Middleware: withAuth + withAuthorization
  Permissions: 'admin-users:view'
  Returns: List of users (filtered by tenant)

POST /api/admin/users
  Middleware: withAuth + withAuthorization
  Permissions: 'admin-users:create'
  Body: { email, name, role }
  Returns: Created user

PATCH /api/admin/users/:id
  Middleware: withAuth + withAuthorization
  Permissions: 'admin-users:edit'
  Tenant Check: User can only edit own tenant
  Body: { name, role, isActive }
  Returns: Updated user

DELETE /api/admin/users/:id
  Middleware: withAuth + withAuthorization
  Permissions: 'admin-users:delete'
  Tenant Check: User can only delete own tenant
  Returns: { success }
```

## Dynamic Menu Generation

### Process

1. Get current user context
2. Fetch user's roles from database
3. Extract all permissions from roles
4. Filter modules where user has at least one action
5. Map available actions for each module
6. Sort by module order
7. Return menu structure

### Menu Structure

```javascript
[
  {
    id: "module-1",
    name: "Admin Users",
    slug: "admin-users",
    icon: "Users",
    order: 1,
    actions: ["view", "create", "edit"],
    hasAccess: true
  },
  {
    id: "module-2",
    name: "CMS",
    slug: "cms",
    icon: "FileText",
    order: 2,
    actions: ["view-news", "create-news", "publish-news"],
    hasAccess: true
  }
]
```

## Permission Checking Examples

### In Components

```typescript
const { user } = useAuth();
const context: PermissionContext = {
  userId: user.id,
  tenantId: user.tenantId,
  userRole: user.userRole,
  adminType: user.adminType,
};

// Single permission
if (await rbacEngine.hasPermission(context, { 
  module: 'admin-users', 
  action: 'create' 
})) {
  // Show create button
}

// Multiple permissions (AND logic)
if (await rbacEngine.hasAllPermissions(context, [
  { module: 'cms', action: 'view-news' },
  { module: 'cms', action: 'publish-news' }
])) {
  // Show publish option
}

// Multiple permissions (OR logic)
if (await rbacEngine.hasAnyPermission(context, [
  { module: 'admin-users', action: 'edit' },
  { module: 'admin-users', action: 'manage-profile' }
])) {
  // Show edit option
}
```

### In API Routes

```typescript
export async function POST(request: NextRequest) {
  const user = await withAuthorization(request, {
    requiredPermissions: [
      { module: 'admin-users', action: 'create' }
    ],
    allowedAdminTypes: ['root']
  });

  if (user instanceof NextResponse) {
    return user; // Error response
  }

  // Process request with authorization
}
```

## Folder Structure

```
/app
  /api
    /auth
      route.ts                 # Login, logout, session
    /admin
      /users
        route.ts              # User management endpoints
      /roles
        route.ts              # Role management endpoints
    /affiliates
      route.ts               # Affiliate management
    /cms
      route.ts               # CMS endpoints
  /admin
    page.tsx                 # Admin dashboard
    /users
      page.tsx              # Users list page
    /roles
      page.tsx              # Roles management page
  /affiliate
    page.tsx                # Affiliate dashboard
  layout.tsx
  page.tsx                  # Home/dashboard

/components
  /ui                       # Shadcn components
  /admin
    UserList.tsx            # Reusable admin components
    RoleForm.tsx
    PermissionPicker.tsx
  /affiliate
    AffiliateForm.tsx
    PlanSelector.tsx
  SidebarMenu.tsx           # Dynamic menu

/lib
  db-schema.ts              # TypeScript interfaces
  rbac-engine.ts            # Permission engine
  auth.ts                   # Auth utilities
  middleware.ts             # Auth middleware
  utils.ts                  # Helper functions
```

## Security Considerations

1. **HTTP-Only Cookies**: Auth tokens stored in secure HTTP-only cookies
2. **CSRF Protection**: Include CSRF tokens in state-modifying requests
3. **SQL Injection**: Use parameterized queries
4. **Tenant Isolation**: All queries filtered by tenantId
5. **Rate Limiting**: Implement on auth endpoints
6. **Password Hashing**: Use bcrypt with salt rounds ≥ 10
7. **Audit Logging**: Log all sensitive actions
8. **Input Validation**: Validate and sanitize all inputs
9. **CORS**: Restrict to specific origins
10. **Role Hierarchy**: Enforce parent-child relationships

## Deployment Checklist

- [ ] Database migrations run
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] Audit logging active
- [ ] Backup strategy in place
- [ ] Monitoring alerts configured
- [ ] Load testing completed
- [ ] Security audit completed

## Future Enhancements

- [ ] Two-factor authentication
- [ ] OAuth2 integration
- [ ] API key management
- [ ] Advanced analytics
- [ ] Webhook support
- [ ] Bulk operations
- [ ] Advanced audit trails
- [ ] Custom branding for affiliates
- [ ] Multi-language support
- [ ] Mobile app support
