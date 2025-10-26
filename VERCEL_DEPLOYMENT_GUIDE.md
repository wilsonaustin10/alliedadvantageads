# Vercel Auto-Deployment Guide

This guide explains how to set up and use the automatic Vercel deployment feature for Allied Advantage Ads Landing pages.

## Overview

The system now automatically deploys generated landing pages to Vercel with proper environment variables and GitHub integration. When a user completes the onboarding form, the system:

1. Creates a GitHub repository from the template
2. Populates it with customized content
3. Creates a Vercel project with GitHub integration
4. Sets up environment variables
5. Triggers automatic deployment
6. (Optional) Configures custom domains

## Setup Requirements

### 1. Vercel API Token

1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Create a new token with full access
3. Add it to Google Cloud Secret Manager:
   ```bash
   echo -n "YOUR_VERCEL_TOKEN" | gcloud secrets create VERCEL_API_TOKEN --data-file=-
   ```

### 2. Vercel Team ID (Optional)

If using a Vercel team account:
1. Get your team ID from Vercel dashboard settings
2. Add it to Secret Manager:
   ```bash
   echo -n "YOUR_TEAM_ID" | gcloud secrets create VERCEL_TEAM_ID --data-file=-
   ```

### 3. Global Environment Variables

Add these to Google Cloud Secret Manager:

```bash
# Google Places API Key (for location services)
echo -n "YOUR_GOOGLE_PLACES_KEY" | gcloud secrets create GOOGLE_PLACES_API_KEY --data-file=-

# Google Analytics ID
echo -n "YOUR_GA_ID" | gcloud secrets create GOOGLE_ANALYTICS_ID --data-file=-
```

### 4. Grant Secret Manager Access

Ensure your Firebase Functions service account has access to the secrets:

```bash
# Get your service account email
export SERVICE_ACCOUNT=$(gcloud functions describe handleOnboardingSubmission --region=YOUR_REGION --format='value(serviceAccountEmail)')

# Grant access to each secret
gcloud secrets add-iam-policy-binding VERCEL_API_TOKEN \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding VERCEL_TEAM_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding GOOGLE_PLACES_API_KEY \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor"

gcloud secrets add-iam-policy-binding GOOGLE_ANALYTICS_ID \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor"
```

## Environment Variables

### Global Variables (Shared across all deployments)

- `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` - Google Places API for location services
- `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` - Google Analytics tracking

### Unique Variables (Per deployment)

- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - Unique reCAPTCHA key for each site
- `NEXT_PUBLIC_BUSINESS_NAME` - Business name from onboarding
- `NEXT_PUBLIC_BUSINESS_PHONE` - Public phone number
- `NEXT_PUBLIC_BUSINESS_EMAIL` - Public email address
- `NEXT_PUBLIC_PRIMARY_COLOR` - Primary brand color
- `NEXT_PUBLIC_SECONDARY_COLOR` - Secondary brand color
- `CRM_API_KEY` - CRM integration key (production only)
- `CRM_NAME` - CRM platform name
- `ZAPIER_WEBHOOK_URL` - Zapier webhook for lead delivery

## Deployment Flow

1. **Onboarding Form Submission**
   - User fills out the onboarding form
   - Data is stored in Firestore with `status: "pending"`

2. **GitHub Repository Creation**
   - Template repository is cloned
   - Mustache templating is applied
   - Files are committed to new repository

3. **Vercel Project Creation**
   - Project is created with GitHub integration
   - Environment variables are configured
   - Initial deployment is triggered automatically

4. **Domain Configuration** (Optional)
   - Custom domain is added if specified
   - SSL is automatically provisioned by Vercel

## Firestore Document Updates

The system updates the Firestore document with:

```javascript
{
  status: "completed",
  generatedAt: timestamp,
  repoName: "landing-businessname",
  repoUrl: "https://github.com/owner/landing-businessname",
  vercelProjectUrl: "https://vercel.com/team/landing-businessname",
  vercelDeploymentUrl: "https://landing-businessname.vercel.app"
}
```

## Monitoring Deployments

### Firebase Functions Logs

```bash
firebase functions:log
```

### Vercel Dashboard

Check deployment status at:
- Personal: https://vercel.com/dashboard
- Team: https://vercel.com/[team-slug]/dashboard

### Firestore Console

Monitor document status in the `landingPages` collection.

## Troubleshooting

### Deployment Fails

1. Check Firebase Functions logs for errors
2. Verify all secrets are properly configured
3. Ensure GitHub repository was created successfully
4. Check Vercel API token permissions

### Environment Variables Not Working

1. Verify variable names match exactly
2. Check variable scopes (production/preview/development)
3. Ensure secrets exist in Secret Manager

### Custom Domain Issues

1. Verify domain DNS settings
2. Check domain isn't already in use on Vercel
3. Allow time for DNS propagation

## Testing

Deploy functions with:
```bash
cd functions
npm run deploy
```

Test with a sample submission:
```bash
curl -X POST https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/handleOnboardingSubmission \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe", 
    "businessName": "Test Business",
    "publicPhone": "555-1234",
    "publicEmail": "test@example.com",
    "primaryColor": "#1D4ED8",
    "secondaryColor": "#FBBF24"
  }'
```

## Security Considerations

1. All API keys are stored in Google Cloud Secret Manager
2. Sensitive environment variables are only exposed to production
3. Vercel API token has full access - keep it secure
4. Consider IP allowlisting for production deployments

## Future Enhancements

1. **reCAPTCHA Integration**: Implement actual reCAPTCHA Enterprise API
2. **Domain Management**: Automated subdomain creation
3. **Deployment Webhooks**: Notify users when deployment is complete
4. **Rollback Support**: Enable one-click rollbacks
5. **Multi-Region Deployment**: Deploy to edge locations 