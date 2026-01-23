# Admin Dashboard Setup Guide

This guide explains how to set up and use the admin dashboard for Health & Nutrition Hacks blog.

## Prerequisites

- Node.js 18+
- PostgreSQL database (local or cloud like Neon, Supabase, etc.)

## Quick Start

### 1. Configure Environment Variables

Edit the `.env` file with your database connection:

```env
# Database URL - Replace with your PostgreSQL connection string
# For Neon: postgres://user:password@host/database?sslmode=require
# For local: postgresql://postgres:postgres@localhost:5432/hnh_blog
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hnh_blog"

# NextAuth.js Configuration (CHANGE IN PRODUCTION!)
AUTH_SECRET="your-super-secret-key-change-this-in-production"
AUTH_URL="http://localhost:3000"

# Admin User Seed
ADMIN_EMAIL="admin@healthnutritionhacks.com"
ADMIN_PASSWORD="admin123456"
ADMIN_NAME="Admin"
```

### 2. Set Up Database

Run the following commands to set up your database:

```bash
# Push schema to database
npm run db:push

# Seed admin user
npm run db:seed
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Access Admin Dashboard

Navigate to `http://localhost:3000/admin/login` and log in with:

- **Email:** admin@healthnutritionhacks.com
- **Password:** admin123456

⚠️ **Important:** Change the default password after first login!

## Features

### Dashboard (`/admin`)
- Overview of total posts, published posts, and drafts
- Recent posts list
- Quick action buttons

### Posts Management (`/admin/posts`)
- View all posts with search and filter
- Filter by status (All, Published, Drafts)
- Edit or delete existing posts

### Create/Edit Posts (`/admin/posts/new` and `/admin/posts/[slug]/edit`)
- Rich text editor with formatting toolbar
- Support for headings, bold, italic, lists, quotes, code blocks
- Add links and images
- Category and tag management
- Save as draft or publish immediately

### Settings (`/admin/settings`)
- Change password

## Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema changes to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run db:seed` | Seed admin user |

## Tech Stack

- **Authentication:** Auth.js v5 (NextAuth.js)
- **Database ORM:** Prisma
- **Database:** PostgreSQL
- **Rich Text Editor:** TipTap
- **Icons:** Lucide React

## Security Notes

1. **Change AUTH_SECRET** in production to a secure random string
2. **Change default admin password** after first login
3. **Use HTTPS** in production
4. Admin routes are protected by middleware - unauthenticated users are redirected to login

## File Structure

```
app/
├── admin/
│   ├── layout.tsx          # Admin layout with sidebar
│   ├── page.tsx            # Dashboard
│   ├── login/page.tsx      # Login page
│   ├── posts/
│   │   ├── page.tsx        # Posts list
│   │   ├── new/page.tsx    # Create post
│   │   └── [slug]/edit/page.tsx  # Edit post
│   └── settings/page.tsx   # Settings
├── api/
│   ├── auth/[...nextauth]/ # Auth API routes
│   └── admin/
│       ├── posts/          # Posts CRUD API
│       └── settings/       # Settings API

components/admin/
├── AdminHeader.tsx         # Header with user info
├── AdminSidebar.tsx        # Navigation sidebar
├── PostEditor.tsx          # Rich text post editor
└── PostsTable.tsx          # Posts table component

lib/
├── auth.ts                 # Auth.js configuration
├── prisma.ts               # Prisma client singleton
└── db-posts.ts             # Database post functions

prisma/
└── schema.prisma           # Database schema

scripts/
└── seed-admin.ts           # Admin user seed script
```

## Troubleshooting

### "Module '@prisma/client' has no exported member 'PrismaClient'"
Run `npm run db:generate` to generate the Prisma client.

### Database connection errors
- Verify your `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check firewall/network settings for cloud databases

### Authentication not working
- Verify `AUTH_SECRET` is set
- Clear browser cookies and try again
- Check that the user exists in the database
