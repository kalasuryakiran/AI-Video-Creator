# Deploy AI Video Creator to Netlify

This guide will help you deploy your AI Video Creator application to Netlify.

## Prerequisites

1. A Netlify account (free at https://netlify.com)
2. Your Gemini API key
3. Git repository (GitHub, GitLab, or Bitbucket)

## Step-by-Step Deployment

### Step 1: Push Code to Git Repository

1. Create a new repository on GitHub/GitLab/Bitbucket
2. Push your code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_REPOSITORY_URL
   git push -u origin main
   ```

### Step 2: Connect Repository to Netlify

1. Go to https://netlify.com and log in
2. Click "New site from Git"
3. Choose your Git provider (GitHub/GitLab/Bitbucket)
4. Select your repository
5. Configure build settings:
   - **Branch to deploy**: `main`
   - **Build command**: Leave empty (Netlify will use the command from netlify.toml)
   - **Publish directory**: `dist`

### Step 3: Set Environment Variables

1. In your Netlify site dashboard, go to "Site settings"
2. Click "Environment variables" in the sidebar
3. Add the following environment variable:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your Gemini API key

### Step 4: Deploy

1. Click "Deploy site"
2. Wait for the build to complete (usually 2-3 minutes)
3. Your site will be available at a random Netlify URL (e.g., `https://amazing-app-123456.netlify.app`)

### Step 5: Custom Domain (Optional)

1. In site settings, go to "Domain management"
2. Click "Add custom domain"
3. Enter your domain name
4. Follow DNS configuration instructions

## Build Configuration Files

The following files are already configured for Netlify deployment:

- `netlify.toml` - Netlify configuration
- `build-netlify.sh` - Build script
- `netlify/functions/generate-script.ts` - Serverless function for AI generation

## Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Ensure all dependencies are listed in package.json
- Verify environment variables are set correctly

### API Errors
- Verify GEMINI_API_KEY is set in Netlify environment variables
- Check Gemini API quota and billing status
- Test API key in Google AI Studio

### Function Timeout
- Netlify functions have a 10-second timeout on free plan
- Consider upgrading to Pro plan for 26-second timeout
- Optimize AI prompts for faster responses

## Features After Deployment

✅ Full-stack AI video script generator
✅ Serverless backend with Netlify Functions
✅ Professional UI with scene breakdowns
✅ Gemini AI integration
✅ Production-ready with CORS support
✅ Automatic builds on git push

## Cost Information

- **Netlify**: Free tier includes 300 build minutes/month, 100GB bandwidth
- **Gemini API**: Pay-per-use pricing, very affordable for most usage
- **Custom domain**: Free with Netlify (you just need to own the domain)

Your AI Video Creator will be live and ready to generate professional video scripts!