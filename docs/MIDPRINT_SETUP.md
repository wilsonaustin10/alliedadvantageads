# MidPrint Dashboard Setup Guide

## Overview
The MidPrint dashboard is a Google Ads performance monitoring tool integrated into the Allied Advantage Ads platform. It allows clients to view their campaign performance metrics after linking their Google Ads accounts to the Allied Advantage Ads Manager Account (MCC).

## Implementation Status

### ✅ Completed Components
1. **Dashboard UI** - Located at `/app/(authenticated)/midprint/`
   - Performance metrics cards (Impressions, Clicks, CTR, Cost, CPC, Conversions)
   - Campaign selector dropdown
   - Date range picker with presets
   - Responsive design matching the existing application style

2. **API Routes** - Mock implementations ready for production integration
   - `/api/midprint/campaigns` - Fetches user's campaigns
   - `/api/midprint/metrics` - Fetches performance metrics
   - `/api/midprint/auth/google` - Initiates Google OAuth flow
   - `/api/midprint/auth/callback` - Handles OAuth callback

3. **UI Components** - Custom components matching the design system
   - Card components for metrics display
   - Select dropdown for campaign selection
   - Date range picker with quick presets
   - Button components

4. **Navigation** - Added MidPrint link to home portal

### 🔧 Setup Required

#### 1. Google Ads API Credentials
You need to obtain the following credentials:
- **Google OAuth Client ID & Secret**: Create OAuth 2.0 credentials in Google Cloud Console
- **Google Ads Developer Token**: Apply at https://developers.google.com/google-ads/api/docs/get-started/dev-token
- **Manager Customer ID**: Your MCC account ID

#### 2. Firebase Admin SDK
Generate a service account key from Firebase Console:
1. Go to Project Settings > Service Accounts
2. Generate new private key
3. Add the credentials to your `.env.local` file

#### 3. Environment Variables
Copy `.env.local.example` to `.env.local` and fill in:
```bash
# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."

# Google Ads API
GOOGLE_CLIENT_ID=your-oauth-client-id
GOOGLE_CLIENT_SECRET=your-oauth-client-secret
GOOGLE_ADS_DEVELOPER_TOKEN=your-developer-token
GOOGLE_ADS_MANAGER_CUSTOMER_ID=your-mcc-id

# Application
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### 📋 Next Steps for Production

#### 1. Implement Firebase Functions for Data Ingestion
Create functions in `/functions/` to:
- Fetch Google Ads data using the API
- Store metrics in Firestore collections
- Handle OAuth token refresh
- Schedule regular data updates

#### 2. Set up Firestore Collections
Create the following collections:
- `midprintUsers` - Store user OAuth tokens and settings
- `midprintCampaigns/{userId}/campaigns` - Cache campaign metadata
- `midprintMetrics/{userId}/daily` - Store daily performance metrics

#### 3. Implement Production API Routes
Replace mock data in API routes with:
- Firebase Admin SDK authentication
- Firestore data queries
- Proper error handling

#### 4. Add to Onboarding Flow
Update `/app/(authenticated)/onboarding/page.tsx` to:
- Collect Google Ads Customer ID
- Explain MCC account linking process
- Store customer ID in user profile

#### 5. Schedule Cloud Functions
Use Firebase scheduled functions to:
- Run daily at optimal times (e.g., 7 AM)
- Fetch metrics for all connected accounts
- Implement rate limiting and error handling
- Follow Google's best practices for efficient queries

### 🔒 Security Considerations
1. Store all sensitive tokens in Secret Manager
2. Validate user permissions before data access
3. Implement rate limiting for API endpoints
4. Log all data access for auditing

### 📊 Performance Optimization
1. Cache campaign metadata to reduce API calls
2. Use batch queries for multiple campaigns
3. Implement incremental updates using ChangeStatus
4. Consider BigQuery for large-scale data analysis

### 🧪 Testing
1. Test OAuth flow with test Google Ads account
2. Verify data accuracy against Google Ads UI
3. Test error scenarios (expired tokens, API limits)
4. Validate responsive design on mobile devices

## Resources
- [Google Ads API Documentation](https://developers.google.com/google-ads/api/docs/start)
- [Firebase Functions Scheduling](https://firebase.google.com/docs/functions/schedule-functions)
- [Google Cloud Secret Manager](https://cloud.google.com/secret-manager/docs)