# Vercel Auto-Deployment Setup Guide

## Current Status
✅ GitHub repository creation works
✅ Vercel project creation works
⚠️ GitHub-Vercel connection requires manual setup
⚠️ Environment variable setting may fail due to missing secrets

## Manual Steps Required After Each Deployment

### 1. Connect GitHub Repository to Vercel
1. Go to your Vercel project (URL shown in logs)
2. Navigate to **Settings** → **Git**
3. Click **Connect Git Repository**
4. Select the repository (e.g., `wilsonaustin10/landing-jurasic-park`)
5. Click **Connect**

### 2. Set Environment Variables (if automated setup failed)
1. Go to **Settings** → **Environment Variables**
2. Add these variables:
   - `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` - Your Google Places API key
   - `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` - Your GA tracking ID (optional)
   - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - Your reCAPTCHA site key
   - `NEXT_PUBLIC_BUSINESS_NAME` - (Should be auto-populated)
   - `NEXT_PUBLIC_BUSINESS_PHONE` - (Should be auto-populated)
   - `NEXT_PUBLIC_BUSINESS_EMAIL` - (Should be auto-populated)

## To Fix Environment Variable Automation

### Create Missing Secrets in Google Secret Manager
```bash
# Create Google Places API Key secret
echo -n "YOUR_GOOGLE_PLACES_API_KEY" | gcloud secrets create GOOGLE_PLACES_API_KEY \
  --data-file=- \
  --project=allied-advantage-automation

# Grant access
gcloud secrets add-iam-policy-binding GOOGLE_PLACES_API_KEY \
  --member='serviceAccount:allied-advantage-automation@appspot.gserviceaccount.com' \
  --role='roles/secretmanager.secretAccessor' \
  --project=allied-advantage-automation

# Create Google Analytics ID secret (optional)
echo -n "YOUR_GA_ID" | gcloud secrets create GOOGLE_ANALYTICS_ID \
  --data-file=- \
  --project=allied-advantage-automation

# Grant access
gcloud secrets add-iam-policy-binding GOOGLE_ANALYTICS_ID \
  --member='serviceAccount:allied-advantage-automation@appspot.gserviceaccount.com' \
  --role='roles/secretmanager.secretAccessor' \
  --project=allied-advantage-automation
```

## To Enable Full Automation

### Install Vercel GitHub App
1. Visit https://github.com/apps/vercel
2. Click **Install** or **Configure**
3. Select your GitHub account (`wilsonaustin10`)
4. Grant access to:
   - All repositories, OR
   - Select specific repositories where landing pages will be created

### Benefits After GitHub App Installation
- Automatic repository connection
- Instant deployments on git push
- Preview deployments for pull requests
- No manual connection step required

## Debugging Environment Variable Errors

If you see "Error setting environment variables" in logs:

1. **Check the detailed logs** for the specific error response
2. **Common issues**:
   - Missing secrets in Google Secret Manager
   - Incorrect Vercel API token permissions
   - API endpoint changes (we're using v10)

3. **To test environment variable API**:
```bash
# List your Vercel projects
curl -H "Authorization: Bearer YOUR_VERCEL_TOKEN" \
  https://api.vercel.com/v9/projects

# Test setting an env var
curl -X POST \
  -H "Authorization: Bearer YOUR_VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"key":"TEST_VAR","value":"test","type":["production","preview","development"]}' \
  https://api.vercel.com/v10/projects/YOUR_PROJECT_NAME/env
```

## Current Workaround Summary

Until the GitHub App is installed:
1. Let the Firebase Function create the GitHub repo ✅
2. Let it create the Vercel project ✅
3. Manually connect Git in Vercel dashboard
4. Manually set env vars if needed
5. Trigger deployment in Vercel

The site will then auto-deploy on future git pushes!