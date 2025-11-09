const {google} = require("googleapis");
const axios = require("axios");
const crypto = require("crypto");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const {SecretManagerServiceClient} = require("@google-cloud/secret-manager");

const keywordMarkets = require("./keywordMarketConfig.json");
const researchScoringConfig = require("../config/midprintResearchScoring.json");

const db = admin.firestore();

const secretManagerClient = new SecretManagerServiceClient({
  projectId: process.env.GCLOUD_PROJECT,
});

const marketConfigByCode = new Map(keywordMarkets.map((market) => [market.marketCode, market]));
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function getStatusRef(queryRef) {
  return queryRef.collection("status").doc("current");
}

/**
 * Splits an array into chunks of a specific size.
 * @param {Array} items Items to chunk.
 * @param {number} size Desired chunk size.
 * @return {Array<Array<*>>} Chunked array.
 */
function chunkArray(items, size) {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

/**
 * Retrieves a secret payload from Secret Manager.
 * @param {string} secretName Secret identifier.
 * @return {Promise<string>} Secret value.
 */
async function accessSecretVersion(secretName) {
  const name = `projects/${process.env.GCLOUD_PROJECT}/secrets/${secretName}/versions/latest`;
  const [version] = await secretManagerClient.accessSecretVersion({name});
  return version.payload.data.toString("utf8");
}

/**
 * Loads Google Ads related credentials from Secret Manager.
 * @return {Promise<Object>} Google Ads credential set.
 */
async function getGoogleAdsCredentials() {
  const [developerToken, clientId, clientSecret, managerCustomerId] = await Promise.all([
    accessSecretVersion("google-ads-developer-token"),
    accessSecretVersion("google-oauth-client-id"),
    accessSecretVersion("google-oauth-client-secret"),
    accessSecretVersion("google-ads-manager-customer-id"),
  ]);

  return {
    developerToken,
    clientId,
    clientSecret,
    managerCustomerId,
  };
}

/**
 * Builds an OAuth2 client using the stored refresh token for the user.
 * @param {string} userId Firestore user identifier.
 * @return {Promise<Object>} Auth context including OAuth client and credentials.
 */
async function getUserAuthContext(userId) {
  const credentials = await getGoogleAdsCredentials();
  const userDoc = await db.collection("midprintUsers").doc(userId).get();

  if (!userDoc.exists) {
    throw new Error("User not found or not connected to Google Ads");
  }

  const userData = userDoc.data();

  if (!userData.refreshToken) {
    throw new Error("User does not have a stored Google Ads refresh token");
  }

  if (!userData.googleAdsCustomerId) {
    throw new Error("User is missing a linked Google Ads customer ID");
  }

  const oauth2Client = new google.auth.OAuth2(
      credentials.clientId,
      credentials.clientSecret,
      "https://your-domain.com/api/midprint/auth/callback",
  );

  oauth2Client.setCredentials({
    refresh_token: userData.refreshToken,
  });

  return {oauth2Client, userData, credentials};
}

/**
 * Normalizes a market entry, using the configuration file when possible.
 * @param {string|object} entry Market identifier or configuration snippet.
 * @return {object|null} Normalized market definition.
 */
function normalizeMarketEntry(entry) {
  if (!entry) {
    return null;
  }

  if (typeof entry === "string") {
    return marketConfigByCode.get(entry) || null;
  }

  if (entry.marketCode && marketConfigByCode.has(entry.marketCode)) {
    return {
      ...marketConfigByCode.get(entry.marketCode),
      ...entry,
    };
  }

  if (entry.locationId && entry.languageCode && entry.currencyCode) {
    const marketCode = entry.marketCode || `${entry.locationId}-${entry.languageCode}`;
    return {
      marketCode,
      geoTargetConstant: entry.geoTargetConstant || `geoTargetConstants/${entry.locationId}`,
      languageConstant: entry.languageConstant,
      ...entry,
    };
  }

  return null;
}

/**
 * Converts a micro-value to currency units.
 * @param {number|null|undefined} value Micro amount.
 * @return {number|null} Currency value rounded to four decimals.
 */
function convertMicrosToCurrency(value) {
  if (value === null || value === undefined) {
    return null;
  }
  return Math.round((Number(value) / 1000000) * 10000) / 10000;
}

/**
 * Derives an average CPC from keyword metrics.
 * @param {object|null} metrics Keyword metrics object.
 * @return {number|null} Average CPC.
 */
function calculateAverageCpc(metrics) {
  if (!metrics) {
    return null;
  }

  if (metrics.avgCpcMicros !== undefined && metrics.avgCpcMicros !== null) {
    return convertMicrosToCurrency(metrics.avgCpcMicros);
  }

  if (metrics.lowTopOfPageBidMicros !== undefined && metrics.highTopOfPageBidMicros !== undefined) {
    const low = convertMicrosToCurrency(metrics.lowTopOfPageBidMicros);
    const high = convertMicrosToCurrency(metrics.highTopOfPageBidMicros);
    if (low !== null && high !== null) {
      return Math.round(((low + high) / 2) * 10000) / 10000;
    }
  }

  return null;
}

/**
 * Fetches keyword metrics for an individual market.
 * @param {object} options Options for the request.
 * @param {string} options.keyword Keyword to evaluate.
 * @param {string} options.matchType Match type string.
 * @param {string} options.device Device filter.
 * @param {object} options.market Market configuration entry.
 * @param {object} options.userData Firestore user data.
 * @param {object} options.credentials Google Ads credentials.
 * @param {string} options.accessToken OAuth access token.
 * @return {Promise<object>} Keyword metrics summary for the market.
 */
async function fetchMetricsForMarket({
  keyword,
  matchType,
  device,
  market,
  userData,
  credentials,
  accessToken,
}) {
  const url = `https://googleads.googleapis.com/v15/customers/${userData.googleAdsCustomerId}:generateKeywordHistoricalMetrics`;
  const payload = {
    customerId: userData.googleAdsCustomerId,
    keywordPlanNetwork: "GOOGLE_SEARCH",
    keywords: [keyword],
    geoTargetConstants: [market.geoTargetConstant || `geoTargetConstants/${market.locationId}`],
    includeAverageCpc: true,
  };

  if (market.languageConstant) {
    payload.language = market.languageConstant;
  }

  try {
    const {data} = await axios.post(url, payload, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "developer-token": credentials.developerToken,
        "login-customer-id": credentials.managerCustomerId,
        "Content-Type": "application/json",
      },
    });

    const result = Array.isArray(data.results) && data.results.length > 0 ? data.results[0] : data;
    const metrics = result.keywordMetrics || result.metrics || null;

    const avgMonthlySearches = metrics && metrics.avgMonthlySearches !== undefined ?
      metrics.avgMonthlySearches :
      (metrics && metrics.monthlySearchVolumes ?
        metrics.monthlySearchVolumes.reduce((sum, item) => sum + (item.monthlySearches || 0), 0) /
          Math.max(metrics.monthlySearchVolumes.length, 1) :
        null);

    const competitionIndex = metrics && (metrics.competitionIndex !== undefined ?
      metrics.competitionIndex :
      metrics.competition !== undefined ? metrics.competition : null);

    const lowTopOfPageBid = convertMicrosToCurrency(metrics && metrics.lowTopOfPageBidMicros);
    const highTopOfPageBid = convertMicrosToCurrency(metrics && metrics.highTopOfPageBidMicros);
    const averageCpc = calculateAverageCpc(metrics);

    return {
      marketCode: market.marketCode,
      locationId: market.locationId,
      geoTargetConstant: market.geoTargetConstant,
      languageCode: market.languageCode,
      currencyCode: market.currencyCode,
      keyword,
      matchType,
      device,
      avgMonthlySearches: avgMonthlySearches !== undefined ? avgMonthlySearches : null,
      competitionIndex: competitionIndex !== undefined ? competitionIndex : null,
      competitionValue: metrics && metrics.competition !== undefined ? metrics.competition : null,
      averageCpc,
      lowTopOfPageBid,
      highTopOfPageBid,
      status: "success",
      metadata: {
        keywordAnnotations: result.keywordAnnotations || [],
      },
    };
  } catch (error) {
    logger.error("Error fetching keyword metrics", {
      keyword,
      market: market.marketCode,
      error: error.response?.data || error.message,
    });

    return {
      marketCode: market.marketCode,
      locationId: market.locationId,
      geoTargetConstant: market.geoTargetConstant,
      languageCode: market.languageCode,
      currencyCode: market.currencyCode,
      keyword,
      matchType,
      device,
      status: "error",
      error: error.response?.data || error.message,
    };
  }
}

/**
 * Collects keyword metrics for a set of markets and persists them in Firestore.
 * @param {object} params Function parameters.
 * @param {string} params.userId User identifier.
 * @param {string} params.keyword Keyword to analyze.
 * @param {string} [params.matchType] Match type preference.
 * @param {string} [params.device] Device filter.
 * @param {Array<string|object>} params.markets Markets to evaluate.
 * @return {Promise<{queryId: string, summary: object, markets: Array<object>}>}
 */
async function collectKeywordMarketMetrics({userId, keyword, matchType = "BROAD", device = "DESKTOP", markets}) {
  if (!userId) {
    throw new Error("userId is required");
  }
  if (!keyword || typeof keyword !== "string") {
    throw new Error("keyword must be a non-empty string");
  }
  if (!Array.isArray(markets) || markets.length === 0) {
    throw new Error("At least one market must be provided");
  }

  const normalizedMarkets = markets
      .map((entry) => normalizeMarketEntry(entry))
      .filter((entry) => entry);

  if (normalizedMarkets.length === 0) {
    throw new Error("No valid markets were provided");
  }

  const uniqueMarkets = Array.from(new Map(normalizedMarkets.map((item) => [item.marketCode, item])).values());

  const queryHash = crypto
      .createHash("sha256")
      .update([keyword.trim().toLowerCase(), matchType.toUpperCase(), device.toUpperCase(),
        ...uniqueMarkets.map((m) => m.marketCode)].join("|"))
      .digest("hex");

  const queryRef = db.collection("midprintResearch").doc(userId).collection("queries").doc(queryHash);
  const statusRef = getStatusRef(queryRef);

  const runStart = admin.firestore.FieldValue.serverTimestamp();

  await Promise.all([
    queryRef.set({
      keyword,
      matchType: matchType.toUpperCase(),
      device: device.toUpperCase(),
      markets: uniqueMarkets.map(({marketCode, locationId, languageCode, currencyCode}) => ({
        marketCode,
        locationId,
        languageCode,
        currencyCode,
      })),
      lastRequestedAt: runStart,
    }, {merge: true}),
    statusRef.set({
      state: "running",
      startedAt: runStart,
      completedAt: null,
      error: null,
      lastUpdatedAt: runStart,
    }, {merge: true}),
  ]);

  logger.info("Starting keyword market research run", {
    userId,
    queryHash,
    keyword,
    marketCount: uniqueMarkets.length,
  });

  try {
    const {oauth2Client, userData, credentials} = await getUserAuthContext(userId);

    const accessTokenResponse = await oauth2Client.getAccessToken();
    const accessToken = typeof accessTokenResponse === "string" ? accessTokenResponse : accessTokenResponse?.token;

    if (!accessToken) {
      throw new Error("Unable to generate an access token for Google Ads");
    }

    const CHUNK_SIZE = 5;
    const marketChunks = chunkArray(uniqueMarkets, CHUNK_SIZE);
    const allResults = [];

    for (const chunk of marketChunks) {
      const chunkResults = await Promise.all(
          chunk.map((market) => fetchMetricsForMarket({
            keyword,
            matchType: matchType.toUpperCase(),
            device: device.toUpperCase(),
            market,
            userData,
            credentials,
            accessToken,
          })),
      );

      for (const result of chunkResults) {
        const marketDocRef = queryRef.collection("markets").doc(result.marketCode);
        await marketDocRef.set({
          ...result,
          computedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, {merge: true});
        allResults.push(result);
      }

      if (marketChunks.length > 1) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    const successfulResults = allResults.filter((item) => item.status === "success");
  const numericSearchVolumes = successfulResults
      .map((item) => (item.avgMonthlySearches === null || item.avgMonthlySearches === undefined ? null : Number(item.avgMonthlySearches)))
      .filter((value) => value !== null && !Number.isNaN(value));
  const numericCompetition = successfulResults
      .map((item) => (item.competitionIndex === null || item.competitionIndex === undefined ? null : Number(item.competitionIndex)))
      .filter((value) => value !== null && !Number.isNaN(value));
  const numericCpcs = successfulResults
      .map((item) => (item.averageCpc === null || item.averageCpc === undefined ? null : Number(item.averageCpc)))
      .filter((value) => value !== null && !Number.isNaN(value));

  const summaryMetrics = {
    totalMarkets: allResults.length,
    successfulMarkets: successfulResults.length,
    averageMonthlySearches: numericSearchVolumes.length ?
      numericSearchVolumes.reduce((sum, value) => sum + value, 0) / numericSearchVolumes.length :
      null,
    averageCompetitionIndex: numericCompetition.length ?
      numericCompetition.reduce((sum, value) => sum + value, 0) / numericCompetition.length :
      null,
    averageCpc: numericCpcs.length ?
      numericCpcs.reduce((sum, value) => sum + value, 0) / numericCpcs.length :
      null,
    lowestCpc: numericCpcs.length ? Math.min(...numericCpcs) : null,
    highestCpc: numericCpcs.length ? Math.max(...numericCpcs) : null,
  };

  const scoringSummary = {
    scoringModel: researchScoringConfig?.scoring?.model || "weighted_normalized",
    scoringWeights: researchScoringConfig?.scoring?.defaultWeights ?
      {
        searchVolume: Number(researchScoringConfig.scoring.defaultWeights.searchVolume || 0),
        averageCpc: Number(researchScoringConfig.scoring.defaultWeights.averageCpc || 0),
        competitionIndex: Number(researchScoringConfig.scoring.defaultWeights.competitionIndex || 0),
      } : null,
    scoringConfigVersion: researchScoringConfig?.version || null,
  };

    const computedAt = admin.firestore.FieldValue.serverTimestamp();
    const expiresAtDate = new Date(Date.now() + CACHE_TTL_MS);

    await Promise.all([
      queryRef.set({
        summary: {
          ...summaryMetrics,
          computedAt,
          ...scoringSummary,
        },
        lastComputedAt: computedAt,
        expiresAt: admin.firestore.Timestamp.fromDate(expiresAtDate),
      }, {merge: true}),
      statusRef.set({
        state: "success",
        completedAt: computedAt,
        lastUpdatedAt: computedAt,
        error: null,
      }, {merge: true}),
    ]);

    logger.info("Keyword market research run completed", {
      userId,
      queryHash,
      keyword,
      marketCount: uniqueMarkets.length,
      successfulMarkets: successfulResults.length,
      totalMarkets: allResults.length,
    });

    return {
      queryId: queryHash,
      summary: {
        ...summaryMetrics,
        computedAt: new Date().toISOString(),
        ...scoringSummary,
        expiresAt: expiresAtDate.toISOString(),
      },
      markets: allResults,
      scoring: scoringSummary,
    };
  } catch (error) {
    const failureTimestamp = admin.firestore.FieldValue.serverTimestamp();

    await statusRef.set({
      state: "error",
      error: error?.message || error,
      completedAt: failureTimestamp,
      lastUpdatedAt: failureTimestamp,
    }, {merge: true});

    logger.error("Keyword market research run failed", {
      userId,
      queryHash,
      keyword,
      marketCount: uniqueMarkets.length,
      error: error?.message || error,
    });

    throw error;
  }
}

module.exports = {
  collectKeywordMarketMetrics,
  getGoogleAdsCredentials,
  getUserAuthContext,
  chunkArray,
};
