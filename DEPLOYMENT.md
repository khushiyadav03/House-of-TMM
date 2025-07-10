# TMM India Homepage - Deployment Guide

## Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **Vercel Account**: Create a free account at [vercel.com](https://vercel.com)
3. **GitHub Account**: For code repository hosting

## Step 1: Set Up Supabase Database

1. **Create a new Supabase project**:
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization
   - Enter project name: "tmm-india-homepage"
   - Set a strong database password
   - Choose a region close to your users

2. **Run the database setup script**:
   - Go to your Supabase dashboard
   - Navigate to "SQL Editor"
   - Copy the entire content from `scripts/final-deployment-setup.sql`
   - Paste it in the SQL Editor
   - Click "Run" to execute the script

3. **Get your Supabase credentials**:
   - Go to Settings > API
   - Copy the following values:
     - Project URL
     - Anon (public) key
     - Service role key (keep this secret)

## Step 2: Prepare Your Code Repository

1. **Push your code to GitHub**:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit - TMM India Homepage"
   git branch -M main
   git remote add origin https://github.com/yourusername/tmm-india-homepage.git
   git push -u origin main
   \`\`\`

2. **Create environment variables file**:
   - Copy `.env.example` to `.env.local`
   - Fill in your Supabase credentials

## Step 3: Deploy to Vercel

1. **Connect your GitHub repository**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select "tmm-india-homepage"

2. **Configure environment variables**:
   - In the Vercel deployment settings, add these environment variables:
   \`\`\`
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   SUPABASE_JWT_SECRET=your_supabase_jwt_secret
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
   POSTGRES_URL=your_postgres_connection_string
   POSTGRES_PRISMA_URL=your_postgres_prisma_connection_string
   POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_connection_string
   POSTGRES_USER=your_postgres_user
   POSTGRES_PASSWORD=your_postgres_password
   POSTGRES_DATABASE=your_postgres_database
   POSTGRES_HOST=your_postgres_host
   \`\`\`

3. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete
   - Your site will be live at `https://your-project-name.vercel.app`

## Step 4: Configure Custom Domain (Optional)

1. **Add your domain in Vercel**:
   - Go to your project settings
   - Navigate to "Domains"
   - Add your custom domain
   - Follow the DNS configuration instructions

2. **Update environment variables**:
   - Update `NEXT_PUBLIC_BASE_URL` to your custom domain

## Step 5: Set Up Admin Access

1. **Access the admin panel**:
   - Go to `https://your-domain.com/admin/login`
   - Use the default credentials or set up authentication

2. **Manage content**:
   - Articles: `/admin/articles`
   - YouTube Videos: `/admin/youtube-videos`
   - Brand Images: `/admin/brand-images`
   - Magazines: `/admin/magazines`
   - Homepage Content: `/admin/homepage`

## Step 6: Optional Stripe Setup (For Magazine Purchases)

1. **Create Stripe account**:
   - Go to [stripe.com](https://stripe.com)
   - Create an account
   - Get your API keys from the dashboard

2. **Add Stripe environment variables**:
   \`\`\`
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   \`\`\`

## Troubleshooting

### Common Issues:

1. **Database connection errors**:
   - Verify your Supabase credentials
   - Check if the database setup script ran successfully
   - Ensure RLS policies are properly configured

2. **Build failures**:
   - Check the Vercel build logs
   - Ensure all environment variables are set
   - Verify that all dependencies are listed in package.json

3. **Images not loading**:
   - Check if image URLs are accessible
   - Verify CORS settings in Supabase
   - Ensure proper image optimization settings

### Performance Optimization:

1. **Enable caching**:
   - Configure Vercel edge caching
   - Set up proper cache headers for static assets

2. **Image optimization**:
   - Use Next.js Image component (already implemented)
   - Consider using a CDN for images

3. **Database optimization**:
   - Monitor query performance in Supabase
   - Add indexes for frequently queried columns (already included)

## Monitoring and Maintenance

1. **Set up monitoring**:
   - Use Vercel Analytics
   - Monitor Supabase usage and performance
   - Set up error tracking (Sentry recommended)

2. **Regular backups**:
   - Supabase provides automatic backups
   - Consider setting up additional backup strategies for critical data

3. **Updates and security**:
   - Regularly update dependencies
   - Monitor for security vulnerabilities
   - Keep Supabase and Vercel platforms updated

## Support

For issues with deployment:
1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Check Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
3. Review the project's GitHub issues
4. Contact support through the respective platforms

Your TMM India homepage should now be live and fully functional!
