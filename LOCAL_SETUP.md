# MK Project - Local Development Setup Guide

Complete step-by-step instructions to set up the MK Project admin panel on your local machine using VS Code.

---

## Prerequisites

Before you begin, ensure you have the following installed:

### 1. Node.js & npm
- **Node.js v18 or higher** (includes npm)
- Download from: https://nodejs.org/ (LTS version recommended)

**Verify installation:**
```bash
node --version
npm --version
```

### 2. Git
- Download from: https://git-scm.com/
- **Verify installation:**
```bash
git --version
```

### 3. VS Code (Visual Studio Code)
- Download from: https://code.visualstudio.com/
- Install Git Extension (built-in)
- Install ES7+ React/Redux/React-Native snippets extension (optional but helpful)

---

## Step 1: Clone or Download the Project

### Option A: Using Git (Recommended)
```bash
# Navigate to your desired directory
cd Documents
# or
cd Desktop

# Clone the repository
git clone <repository-url>
cd mk-project
```

### Option B: Download as ZIP
1. Download the project as ZIP from your repository
2. Extract it to your desired location
3. Open terminal/command prompt in that folder

---

## Step 2: Open Project in VS Code

### Method 1: Command Line
```bash
# From the project directory
code .
```

### Method 2: VS Code GUI
1. Open VS Code
2. Click **File** → **Open Folder**
3. Navigate to your project folder and select it
4. Click **Open**

---

## Step 3: Install Dependencies

### Open Terminal in VS Code
- Press **Ctrl + `** (backtick) or **Cmd + `** on Mac
- Or go to **Terminal** → **New Terminal**

### Install npm packages
```bash
npm install
```

This will:
- Create a `node_modules` folder (may take 2-3 minutes)
- Install all dependencies listed in `package.json`

**Expected output:** Shows version numbers and "added X packages"

---

## Step 4: Start Development Server

### Run the development server
```bash
npm run dev
```

### Expected output:
```
> my-v0-project@0.1.0 dev
> next dev

  ▲ Next.js 16.0.10
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

---

## Step 5: Access the Application

### Open your browser
1. Go to: **http://localhost:3000**
2. You should see the MK Project admin dashboard

### Dashboard Features to Try:
- Use the **Role Selector** (top-right) to switch between admin types
- Use **Language Selector** to change languages
- Use **Country Selector** to change countries
- Click sidebar menu items to navigate different sections

---

## Project Structure

```
mk-project/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles with theme colors
│   └── admin/                   # Admin panel pages
│       ├── dashboard/           # Dashboard page
│       ├── users/               # User management
│       │   ├── page.tsx         # List users
│       │   ├── new/             # Create new user
│       │   └── edit/[id]/       # Edit user
│       ├── plans/               # Subscription plans
│       ├── roles/               # Roles management
│       ├── modules/             # Modules & features
│       ├── affiliates/          # Affiliate management
│       ├── cms/                 # Content management
│       ├── settings/            # System settings
│       └── ...                  # Other admin pages
│
├── components/                   # React components
│   ├── AdminLayout.tsx          # Main layout wrapper
│   ├── ui/                      # shadcn/ui components
│   └── pages/                   # Page content components
│
├── contexts/                     # React contexts
│   └── AdminContext.tsx         # Admin state management
│
├── hooks/                        # Custom React hooks
│   └── useAuth.ts              # Authentication hook
│
├── lib/                          # Utility files
│   ├── mock-data.ts            # Mock data for demo
│   ├── rbac-engine.ts          # Permission logic
│   ├── auth.ts                 # Auth utilities
│   └── utils.ts                # Helper functions
│
├── public/                       # Static assets
├── package.json                 # Dependencies
├── tsconfig.json               # TypeScript config
└── next.config.mjs             # Next.js config
```

---

## Common Commands

### Development
```bash
# Start development server (default: localhost:3000)
npm run dev

# With custom port
npm run dev -- -p 3001
```

### Build & Production
```bash
# Build for production
npm run build

# Run production build
npm start

# Check for linting errors
npm run lint
```

---

## VS Code Extensions Recommended

Install these extensions for better development experience:

1. **ES7+ React/Redux/React-Native snippets**
   - Quick shortcuts for React code

2. **Tailwind CSS IntelliSense**
   - Autocomplete for Tailwind classes

3. **Prettier - Code formatter**
   - Auto-format code on save

4. **Thunder Client** or **REST Client**
   - Test API endpoints (when backend is ready)

### To Install Extensions:
1. Click **Extensions** icon (left sidebar)
2. Search extension name
3. Click **Install**

---

## Troubleshooting

### Issue: "npm: command not found"
**Solution:** Node.js is not installed or not in system PATH
- Reinstall Node.js from https://nodejs.org/
- Restart terminal/VS Code

### Issue: "Port 3000 already in use"
**Solution:** Run on different port
```bash
npm run dev -- -p 3001
```
Then visit: http://localhost:3001

### Issue: "node_modules folder is huge"
**Solution:** This is normal - Next.js has many dependencies
- To save space: Add `node_modules` to `.gitignore` (already done)
- Never commit `node_modules` folder

### Issue: Changes not reflecting in browser
**Solution:**
1. Check terminal for errors
2. Hard refresh browser: **Ctrl + Shift + R** (Windows) or **Cmd + Shift + R** (Mac)
3. Clear browser cache

### Issue: Import errors in VS Code
**Solution:**
1. Restart VS Code
2. Run: `npm install`
3. Check `tsconfig.json` path configuration

---

## Project Features

### Authentication & Admin Types
- Root Admin (full access)
- Root Sub-Admin (limited access)
- Affiliate Admin (affiliate features)
- Affiliate Sub-Admin (minimal features)

### Main Modules
- Dashboard with statistics
- Admin Users management
- Roles & Permissions
- Subscription Plans
- Features & Modules assignment
- Affiliate management
- Content Management (CMS)
- Support Tickets
- Settings

### Design System
- Responsive layout (mobile, tablet, desktop)
- Dark/Light theme support
- Islamic color scheme (Emerald Green, Navy Blue, Gold)
- Multi-language support (English, Hindi, Arabic)
- Multi-country support (India, UAE, USA)

---

## Next Steps After Setup

### 1. Explore the Dashboard
- Navigate through different admin types
- Click menu items to explore pages

### 2. Understand the Code Structure
- Start with `/app/page.tsx` (home page)
- Check `/components/AdminLayout.tsx` (main layout)
- Review `/contexts/AdminContext.tsx` (state management)

### 3. Modify Styling
- Edit `/app/globals.css` for theme colors
- Tailwind CSS classes used throughout

### 4. Create New Pages
- Add new files in `/app/admin/[feature]/page.tsx`
- Use existing pages as templates

### 5. Connect to Backend (Future)
- Update API calls in components
- Replace mock data in `/lib/mock-data.ts`
- Implement real authentication

---

## Environment Variables (Optional)

Create a `.env.local` file in project root for environment-specific settings:

```env
# .env.local
NEXT_PUBLIC_APP_NAME=MK Project
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## Getting Help

### Documentation Files in Project:
- `README.md` - Project overview
- `UPDATE_SUMMARY.md` - Recent changes
- `QUICK_REFERENCE.md` - Developer reference
- `START_HERE.md` - Getting started guide

### Resources:
- Next.js Docs: https://nextjs.org/docs
- React Docs: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- shadcn/ui: https://ui.shadcn.com

---

## Tips for Development

### Hot Reload
- Next.js has built-in hot reload
- Save file with Ctrl+S or Cmd+S
- Changes appear instantly in browser

### VS Code Tips
- **Ctrl+P** - Quick file search
- **Ctrl+Shift+P** - Command palette
- **Alt+Up/Down** - Move line up/down
- **Ctrl+D** - Select word
- **Ctrl+/** - Toggle comment

### Debugging
- Open Chrome DevTools: **F12** or **Ctrl+Shift+I**
- Use browser console to check errors
- Check VS Code terminal for server-side errors

---

## Performance Notes

- First load may take a few seconds (Next.js compilation)
- Subsequent loads are instant due to hot reload
- Build process creates optimized production files
- Production build is significantly smaller than development

---

**Setup Complete!** 🎉

You're now ready to develop the MK Project admin panel locally. Start with the dashboard and explore different admin types to see the role-based access control in action.
