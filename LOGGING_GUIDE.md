# Logging Guide for Allied Lead Gen Landing

## Overview
This guide explains where to find logs for monitoring the onboarding to deployment workflow.

## Log Locations

### 1. Client-Side Logs (Browser Console)
- **Location**: Browser Developer Tools > Console
- **What to look for**: Logs prefixed with `[ONBOARDING]`
- **Key events logged**:
  - Form submission start
  - Logo upload process
  - Firebase Storage upload status
  - API response data
  - Errors during submission

### 2. Firebase Functions Logs
- **Location**: Firebase Console > Functions > Logs
- **Direct URL**: https://console.firebase.google.com/project/allied-advantage-automation/functions/logs
- **What to look for**:
  - `handleOnboardingSubmission` function logs
  - `generateLanding` function logs
  - Logs prefixed with `[LOGO PROCESSING]`
  - Logs prefixed with `[VERCEL DEPLOYMENT]`
  - Logs prefixed with `[VERCEL API]`

### 3. Google Cloud Console Logs
- **Location**: Google Cloud Console > Logging
- **Direct URL**: https://console.cloud.google.com/logs/query?project=allied-advantage-automation
- **Advanced queries**:
  ```
  resource.type="cloud_function"
  resource.labels.function_name="handleOnboardingSubmission" OR resource.labels.function_name="generateLanding"
  ```

### 4. Vercel Deployment Logs
- **Location**: Vercel Dashboard > Project > Functions Tab
- **What to look for**:
  - Build logs
  - Deployment status
  - Runtime errors

## Key Log Patterns to Monitor

### Successful Flow
1. `[ONBOARDING] Starting form submission`
2. `[ONBOARDING] Uploading logo to Firebase Storage` (if applicable)
3. `[ONBOARDING] Logo uploaded successfully`
4. `[ONBOARDING] Submission successful`
5. `New landing page request received, generation triggered`
6. `[LOGO PROCESSING] Starting logo determination`
7. `Processing template item` (multiple entries)
8. `[VERCEL DEPLOYMENT] Creating Vercel project`
9. `[VERCEL DEPLOYMENT] Deployment initiated successfully`
10. `Successfully created landing page repository`

### Error Patterns
- `[ONBOARDING] Error uploading logo`
- `[ONBOARDING] Error submitting form`
- `[VERCEL API] Error creating project`
- `[VERCEL DEPLOYMENT] Error deploying to Vercel`
- `Error processing template item`

## Debugging Tips

### 1. Logo Upload Issues
Look for these logs:
- Check if `uploadedLogoUrl` is present and has proper length
- Verify Firebase Storage path in logs
- Confirm logo URL is being passed to Firebase Functions

### 2. Vercel Deployment Issues
Look for:
- `VERCEL_API_TOKEN` initialization status
- GitHub repository creation success
- Environment variables setup logs
- API response errors with status codes

### 3. Template Processing Issues
Monitor:
- File processing logs for each template item
- Mustache template rendering errors
- GitHub API rate limit errors

## Real-time Monitoring

### Firebase Functions Real-time Logs
```bash
firebase functions:log --only handleOnboardingSubmission,generateLanding
```

### Filter by Request ID
Use the request ID logged in browser console to track the entire flow:
```
jsonPayload.requestId="[REQUEST_ID]"
```

## Common Issues and Solutions

### Issue: Logo not appearing in deployed site
**Check logs for**:
- `uploadedLogoUrl` value in submission data
- `[LOGO PROCESSING] Using user-uploaded logo URL`
- Verify the URL is accessible

### Issue: Vercel deployment fails
**Check logs for**:
- `[VERCEL API] Error` messages
- Response status codes (401 = auth issue, 422 = project exists)
- GitHub repository creation status

### Issue: Environment variables not set
**Check logs for**:
- `[VERCEL DEPLOYMENT] Prepared X environment variables`
- Individual env var setting confirmations

## Log Retention

- **Browser Console**: Session-based (lost on refresh)
- **Firebase Functions**: 30 days
- **Google Cloud Logging**: Configurable (default 30 days)
- **Vercel**: Based on your plan (7-30 days)

## Alerts Setup (Optional)

You can set up alerts in Google Cloud Monitoring for:
- Function execution errors
- Deployment failures
- High latency operations

Navigate to: Cloud Console > Monitoring > Alerting