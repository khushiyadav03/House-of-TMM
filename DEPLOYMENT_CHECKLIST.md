# TMM India - Deployment Checklist

## ✅ Database Setup (Run in Supabase SQL Editor)

### 1. Create Pep-Talk Table
```sql
-- Create pep_talks table for dynamic pep-talk content
CREATE TABLE public.pep_talks (
    id integer NOT NULL DEFAULT nextval('pep_talks_id_seq'::regclass),
    title character varying NOT NULL,
    content text NOT NULL,
    author character varying,
    status character varying DEFAULT 'draft'::character varying CHECK (status::text = ANY (ARRAY['draft'::character varying, 'published'::character varying]::text[])),
    seo_title character varying,
    seo_description text,
    seo_keywords character varying[],
    image_url text,
    excerpt text,
    display_order integer DEFAULT 0,
    is_featured boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pep_talks_pkey PRIMARY KEY (id)
);

-- Create sequence for pep_talks
CREATE SEQUENCE public.pep_talks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Set sequence ownership
ALTER SEQUENCE public.pep_talks_id_seq OWNED BY public.pep_talks.id;

-- Enable RLS
ALTER TABLE public.pep_talks ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published pep talks
CREATE POLICY "Allow public read access to published pep talks" ON public.pep_talks
    FOR SELECT USING (status = 'published');

-- Allow authenticated users to manage pep talks (for admin)
CREATE POLICY "Allow authenticated users to manage pep talks" ON public.pep_talks
    FOR ALL USING (auth.role() = 'authenticated');
```

## ✅ Frontend Fixes Completed

### 1. Next.js 15 Compatibility
- ✅ Fixed `generateMetadata` export issues
- ✅ Separated server and client components
- ✅ Resolved TypeScript interface mismatches

### 2. YouTube Video Section
- ✅ Fixed "Refused to connect" errors with proper embed URLs
- ✅ Added fallback for missing videos
- ✅ Made recommended videos clickable

### 3. Magazine Page Buttons
- ✅ "Read Magazine for Free" → Direct access
- ✅ "Buy Magazine" → Payment gateway flow
- ✅ Clear separation between free and paid content

### 4. Pep-Talk System
- ✅ Created complete CRUD API (`/api/pep-talk/`)
- ✅ Admin management page (`/admin/pep-talks/`)
- ✅ Database table schema

### 5. Admin Panel Enhancements
- ✅ Added SEO fields to article creation/editing
- ✅ Added SEO fields to magazine management
- ✅ Improved "Is Paid" toggle with conditional price field
- ✅ Fixed cover photo CREATE/UPDATE operations

### 6. Data Fetching Fixes
- ✅ Updated categories API to use service role key
- ✅ Fixed supabase client configuration
- ✅ Optimized homepage performance with Promise.allSettled

## 🔧 Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_BASE_URL=your_domain_url
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## 🚀 Deployment Steps

### 1. Pre-deployment
- [ ] Run the pep-talk table SQL in Supabase
- [ ] Verify all environment variables are set
- [ ] Test payment flow in development
- [ ] Verify YouTube videos display correctly

### 2. Build & Deploy
```bash
# Install dependencies
npm install

# Build the project
npm run build

# Deploy to your platform (Vercel/Netlify/etc.)
npm run deploy
```

### 3. Post-deployment Testing
- [ ] Test article creation with SEO fields
- [ ] Test magazine management with is_paid toggle
- [ ] Test pep-talk CRUD operations
- [ ] Test YouTube video section
- [ ] Test payment flow end-to-end
- [ ] Test free vs paid magazine access

## 📋 Admin Panel Access

### Available Admin Routes:
- `/admin` - Main dashboard
- `/admin/articles/new` - Create new article (with SEO fields)
- `/admin/articles/[id]/edit` - Edit article (with SEO fields)
- `/admin/magazines` - Magazine management (with SEO & is_paid toggle)
- `/admin/pep-talks` - Pep-talk management (full CRUD)
- `/admin/categories` - Category management
- `/admin/brand-images` - Brand image management

## 🎯 Key Features Ready

### Frontend Features:
- ✅ Responsive design
- ✅ SEO optimized with metadata
- ✅ Payment integration (Razorpay)
- ✅ Magazine flipbook viewer
- ✅ Article management system
- ✅ YouTube video integration
- ✅ Brand showcase
- ✅ Category-based content

### Backend Features:
- ✅ Supabase database with RLS
- ✅ RESTful API endpoints
- ✅ File upload handling
- ✅ Payment processing
- ✅ User authentication
- ✅ Admin role management

## 🔍 Performance Optimizations

- ✅ Reduced API call limits for better loading
- ✅ Promise.allSettled for parallel data fetching
- ✅ Image optimization with Next.js Image component
- ✅ Lazy loading for heavy components
- ✅ Error boundaries for graceful failures

## 🛡️ Security Features

- ✅ Row Level Security (RLS) policies
- ✅ Service role key for admin operations
- ✅ Input validation and sanitization
- ✅ Secure payment processing
- ✅ Protected admin routes

Your TMM India website is now ready for production deployment! 🚀