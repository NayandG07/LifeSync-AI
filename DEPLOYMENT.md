# Deployment Guide for LifeSync Website

## Environment Variables Setup

### Required Environment Variables

1. **GEMINI_API_KEY**: Your Google Gemini AI API key for chatbot functionality
   - Get from: [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Required for: AI chatbot features

### Setting Up Environment Variables

#### Local Development
1. Copy `.env.example` to `.env.local`
2. Fill in your actual API keys
3. Never commit `.env.local` to Git

#### Netlify Deployment
1. Go to your Netlify site dashboard
2. Navigate to Site settings > Environment variables
3. Add each environment variable from `.env.example`
4. Set `NODE_ENV=production`

## Netlify Deployment Steps

### Option 1: Git-based Deployment (Recommended)

1. **Push to Git Repository:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your Git repository
   - Netlify will auto-detect Next.js settings

3. **Configure Build Settings:**
   - Build command: `npm run build` (auto-detected)
   - Publish directory: `.next` (configured in netlify.toml)
   - Node version: 18 (configured in netlify.toml)

4. **Set Environment Variables:**
   - In Netlify dashboard: Site settings > Environment variables
   - Add your `GEMINI_API_KEY`

### Option 2: Manual Deploy

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Zip the `.next` folder
   - Upload via Netlify's manual deploy

## Build Configuration

The project includes:
- `netlify.toml` for deployment configuration
- Proper caching headers for performance
- Security headers
- APK file serving configuration

## Important Notes

1. **API Keys Security:** Never commit API keys to Git
2. **File Size:** Large APK files may affect build times
3. **Node Version:** Project requires Node.js 18+
4. **Build Errors:** Check that all dependencies are installed

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18+)
- Verify all environment variables are set
- Run `npm install` to ensure dependencies

### API Features Not Working
- Verify `GEMINI_API_KEY` is set correctly
- Check API key permissions and quotas

### Download Links Not Working
- Ensure APK file is in `public/downloads/`
- Check file permissions and size limits