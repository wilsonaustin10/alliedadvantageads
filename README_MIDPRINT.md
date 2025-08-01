# MidPrint Google Ads Performance Dashboard

## Overview
MidPrint is a Google Ads performance dashboard integrated into the Allied Advantage Ads platform. It provides clients with real-time access to their advertising metrics after linking their Google Ads accounts to the Allied Advantage Ads Manager Account (MCC).

## Architecture

### Frontend Components
- **Dashboard Page**: `/app/(authenticated)/midprint/page.tsx`
  - Protected route requiring authentication
  - Displays performance metrics cards
  - Campaign selector and date range picker
  - Responsive design with Tailwind CSS

### API Routes
- `/api/midprint/campaigns` - Fetches user's campaigns
- `/api/midprint/metrics` - Retrieves performance metrics
- `/api/midprint/auth/google` - Initiates OAuth flow
- `/api/midprint/auth/callback` - Handles OAuth callback

### Firebase Functions
- **Data Sync**: `functions/midprint.js`
  - Fetches data from Google Ads API
  - Stores metrics in Firestore
  - Handles OAuth token refresh
- **Scheduled Sync**: Daily at 7 AM ET via Cloud Scheduler

### Data Storage (Firestore)
```
midprintUsers/
  {userId}/
    - refreshToken
    - googleAdsCustomerId
    - lastSyncedAt
    
midprintCampaigns/
  {userId}/
    campaigns/
      {campaignId}/
        - name
        - status
        - budget
        
midprintMetrics/
  {userId}/
    daily/
      {campaignId}_{date}/
        - impressions
        - clicks
        - cost
        - conversions
```

## Setup Instructions

### 1. Prerequisites
- Firebase project on Blaze plan (for scheduled functions)
- Google Ads Manager Account (MCC)
- Google Cloud project with APIs enabled

### 2. Google Ads API Setup
1. Apply for Google Ads API access
2. Create OAuth 2.0 credentials in Google Cloud Console
3. Add redirect URI: `https://your-domain.com/api/midprint/auth/callback`
4. Store credentials in Secret Manager:
   - `google-ads-developer-token`
   - `google-oauth-client-id`
   - `google-oauth-client-secret`
   - `google-ads-manager-customer-id`

### 3. Environment Configuration
Update `.env.local`:
```bash
# Firebase Admin
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."

# Google Ads
GOOGLE_CLIENT_ID=your-oauth-client-id
GOOGLE_CLIENT_SECRET=your-oauth-client-secret
GOOGLE_ADS_DEVELOPER_TOKEN=your-developer-token
GOOGLE_ADS_MANAGER_CUSTOMER_ID=your-mcc-id

# Application
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### 4. Deploy Functions
```bash
cd functions
npm install
firebase deploy --only functions:scheduledMidPrintSync
```

### 5. Enable APIs
In Google Cloud Console, enable:
- Google Ads API
- Cloud Scheduler API
- Secret Manager API

## User Flow

1. **Authentication**
   - User logs in via Firebase Auth
   - Accesses MidPrint from home portal

2. **Google Ads Connection**
   - User clicks "Connect Google Ads Account"
   - OAuth flow redirects to Google
   - User grants permissions
   - Callback stores refresh token

3. **Data Access**
   - Dashboard fetches cached data from Firestore
   - Shows real-time metrics and trends
   - Updates daily via scheduled function

## Security Considerations

1. **Authentication**
   - All routes protected by middleware
   - Firebase Auth tokens validated
   - User can only access their own data

2. **API Security**
   - Secrets stored in Secret Manager
   - OAuth tokens encrypted at rest
   - Rate limiting on API endpoints

3. **Data Privacy**
   - User data isolated by userId
   - No cross-account data access
   - Audit logs for data access

## Performance Optimization

1. **Caching Strategy**
   - Campaign metadata cached locally
   - Metrics updated incrementally
   - Client-side caching with React Query

2. **API Efficiency**
   - Batch queries for multiple campaigns
   - Use ChangeStatus for incremental updates
   - Respect Google Ads API rate limits

3. **Scalability**
   - Process users in batches
   - Implement exponential backoff
   - Monitor resource consumption

## Monitoring

1. **Cloud Functions Logs**
   ```bash
   firebase functions:log --only scheduledMidPrintSync
   ```

2. **Error Tracking**
   - Errors stored in user documents
   - Cloud Logging for function errors
   - Client-side error boundaries

3. **Metrics to Monitor**
   - Sync success rate
   - API quota usage
   - Response times

## Troubleshooting

### Common Issues

1. **OAuth Flow Fails**
   - Check redirect URI configuration
   - Verify OAuth scopes
   - Check Secret Manager permissions

2. **No Data Showing**
   - Verify user has Google Ads access
   - Check sync function logs
   - Ensure Firestore rules allow access

3. **Sync Function Fails**
   - Check API quotas
   - Verify credentials in Secret Manager
   - Review function logs for errors

## Future Enhancements

1. **Advanced Features**
   - Campaign creation/management
   - Budget recommendations
   - Performance alerts

2. **Integrations**
   - BigQuery for advanced analytics
   - Export to Google Sheets
   - Slack notifications

3. **UI Improvements**
   - Interactive charts
   - Custom date ranges
   - Multi-account support

## Support
For issues or questions:
- Check function logs
- Review error messages in Firestore
- Contact technical support