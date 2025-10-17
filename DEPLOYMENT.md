# Deployment Guide

## Environment Variables Required

### DATABASE_URL
Your Neon PostgreSQL connection string is required for the application to connect to the database.

**Value:** `postgresql://neondb_owner:npg_K2cGuyQ4oTlL@ep-plain-wildflower-adypvpvx-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require`

## Platform-Specific Setup

### Netlify
1. Go to your Netlify dashboard
2. Navigate to **Site configuration** → **Environment variables**
3. Add: `DATABASE_URL` = `[your connection string]`
4. Redeploy your site

### Vercel
1. Go to your Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add: `DATABASE_URL` = `[your connection string]`
4. Redeploy your project

### Other Platforms
Most hosting platforms have an environment variables section in their dashboard. Add the `DATABASE_URL` variable there.

## Troubleshooting

### Database Connection Issues
- ✅ Verify `DATABASE_URL` is set in your deployment platform
- ✅ Ensure the connection string includes `sslmode=require`
- ✅ Check that your Neon database is active and accessible
- ✅ Verify the database URL is exactly copied from your `.env.local`

### Build Issues
- ✅ Run `npm run build` locally to test
- ✅ Check build logs for specific error messages
- ✅ Ensure all dependencies are in `package.json`

## Local Development
- Copy `.env.example` to `.env.local`
- Fill in your actual database credentials
- Run `npm run dev` to start development server

## Database Schema
The application will automatically create tables when needed through the API setup endpoints.