const { google } = require('googleapis');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');

// Initialize Firestore
const db = admin.firestore();

// Initialize Secret Manager client
const secretManagerClient = new SecretManagerServiceClient({
  projectId: process.env.GCLOUD_PROJECT,
});

/**
 * Access a secret from Google Cloud Secret Manager
 */
async function accessSecretVersion(secretName) {
  try {
    const name = `projects/${process.env.GCLOUD_PROJECT}/secrets/${secretName}/versions/latest`;
    const [version] = await secretManagerClient.accessSecretVersion({ name });
    const payload = version.payload.data.toString('utf8');
    return payload;
  } catch (error) {
    logger.error(`Error accessing secret ${secretName}:`, error);
    throw error;
  }
}

/**
 * Get Google Ads API credentials from Secret Manager
 */
async function getGoogleAdsCredentials() {
  const [developerToken, clientId, clientSecret, managerCustomerId] = await Promise.all([
    accessSecretVersion('google-ads-developer-token'),
    accessSecretVersion('google-oauth-client-id'),
    accessSecretVersion('google-oauth-client-secret'),
    accessSecretVersion('google-ads-manager-customer-id'),
  ]);

  return {
    developerToken,
    clientId,
    clientSecret,
    managerCustomerId,
  };
}

/**
 * Get OAuth2 client with user's refresh token
 */
async function getOAuth2Client(userId) {
  const credentials = await getGoogleAdsCredentials();
  
  // Get user's refresh token from Firestore
  const userDoc = await db.collection('midprintUsers').doc(userId).get();
  if (!userDoc.exists) {
    throw new Error('User not found or not connected to Google Ads');
  }

  const userData = userDoc.data();
  const oauth2Client = new google.auth.OAuth2(
    credentials.clientId,
    credentials.clientSecret,
    'https://your-domain.com/api/midprint/auth/callback'
  );

  oauth2Client.setCredentials({
    refresh_token: userData.refreshToken,
  });

  return oauth2Client;
}

/**
 * Fetch campaigns for a user using Google Ads API
 */
async function fetchUserCampaigns(userId, customerId) {
  try {
    const oauth2Client = await getOAuth2Client(userId);
    const credentials = await getGoogleAdsCredentials();

    // For now, return sample data structure
    // In production, use Google Ads API client library
    const campaigns = [
      {
        id: '123456789',
        name: 'Sample Campaign',
        status: 'ENABLED',
        budget: 5000,
        budgetType: 'DAILY',
      },
    ];

    // Cache campaigns in Firestore
    const batch = db.batch();
    campaigns.forEach((campaign) => {
      const docRef = db
        .collection('midprintCampaigns')
        .doc(userId)
        .collection('campaigns')
        .doc(campaign.id);
      batch.set(docRef, {
        ...campaign,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
    await batch.commit();

    logger.info(`Cached ${campaigns.length} campaigns for user ${userId}`);
    return campaigns;
  } catch (error) {
    logger.error('Error fetching campaigns:', error);
    throw error;
  }
}

/**
 * Fetch metrics for a user's campaigns
 */
async function fetchUserMetrics(userId, customerId, startDate, endDate) {
  try {
    const oauth2Client = await getOAuth2Client(userId);
    const credentials = await getGoogleAdsCredentials();

    // Sample GAQL query structure
    const query = `
      SELECT
        campaign.id,
        campaign.name,
        segments.date,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.ctr,
        metrics.average_cpc
      FROM campaign
      WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
        AND campaign.status != 'REMOVED'
    `;

    // For now, generate sample metrics
    // In production, execute the query using Google Ads API
    const metricsData = [];
    const campaigns = ['123456789', '987654321'];
    
    // Generate sample data for each day in the range
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      campaigns.forEach((campaignId) => {
        metricsData.push({
          campaignId,
          date: new Date(d),
          impressions: Math.floor(Math.random() * 10000) + 1000,
          clicks: Math.floor(Math.random() * 500) + 50,
          cost: Math.random() * 1000 + 100,
          conversions: Math.floor(Math.random() * 50) + 5,
        });
      });
    }

    // Store metrics in Firestore
    const batch = db.batch();
    metricsData.forEach((metric) => {
      const dateStr = metric.date.toISOString().split('T')[0];
      const docRef = db
        .collection('midprintMetrics')
        .doc(userId)
        .collection('daily')
        .doc(`${metric.campaignId}_${dateStr}`);
      
      batch.set(docRef, {
        ...metric,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      });
    });
    await batch.commit();

    logger.info(`Stored ${metricsData.length} metric records for user ${userId}`);
    return metricsData;
  } catch (error) {
    logger.error('Error fetching metrics:', error);
    throw error;
  }
}

/**
 * Main function to sync Google Ads data for all users
 */
async function syncAllUsersData() {
  try {
    // Get all users with Google Ads connections
    const usersSnapshot = await db.collection('midprintUsers').get();
    
    logger.info(`Starting sync for ${usersSnapshot.size} users`);

    // Process users in batches to avoid rate limits
    const batchSize = 5;
    const users = usersSnapshot.docs;
    
    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (userDoc) => {
          const userId = userDoc.id;
          const userData = userDoc.data();
          
          try {
            // Skip if no customer ID
            if (!userData.googleAdsCustomerId) {
              logger.warn(`User ${userId} has no Google Ads customer ID`);
              return;
            }

            // Fetch last 7 days of data by default
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);

            // Fetch campaigns and metrics
            await fetchUserCampaigns(userId, userData.googleAdsCustomerId);
            await fetchUserMetrics(
              userId,
              userData.googleAdsCustomerId,
              startDate.toISOString().split('T')[0],
              endDate.toISOString().split('T')[0]
            );

            // Update last sync time
            await db.collection('midprintUsers').doc(userId).update({
              lastSyncedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            logger.info(`Successfully synced data for user ${userId}`);
          } catch (error) {
            logger.error(`Error syncing data for user ${userId}:`, error);
            
            // Store error in user document for debugging
            await db.collection('midprintUsers').doc(userId).update({
              lastSyncError: error.message,
              lastSyncErrorAt: admin.firestore.FieldValue.serverTimestamp(),
            });
          }
        })
      );

      // Add delay between batches to respect rate limits
      if (i + batchSize < users.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    logger.info('Completed sync for all users');
  } catch (error) {
    logger.error('Error in syncAllUsersData:', error);
    throw error;
  }
}

module.exports = {
  syncAllUsersData,
  fetchUserCampaigns,
  fetchUserMetrics,
};