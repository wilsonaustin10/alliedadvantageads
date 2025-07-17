const logger = require("firebase-functions/logger");
const {SecretManagerServiceClient} = require("@google-cloud/secret-manager");

/**
 * Manages environment variables for deployments
 */
class EnvironmentManager {
  /**
   * Initialize environment manager
   */
  constructor() {
    this.secretManagerClient = new SecretManagerServiceClient({
      projectId: "allied-advantage-automation",
    });
  }

  /**
   * Get global environment variables that are shared across all deployments
   * @return {Promise<Array>} Array of environment variable objects
   */
  async getGlobalVariables() {
    try {
      // These are the global variables that all landing pages will need
      const globalVars = [
        {
          key: "NEXT_PUBLIC_GOOGLE_PLACES_API_KEY",
          secretName: "GOOGLE_PLACES_API_KEY",
          type: ["production", "preview", "development"],
        },
        {
          key: "NEXT_PUBLIC_GOOGLE_ANALYTICS_ID",
          secretName: "GOOGLE_ANALYTICS_ID",
          type: ["production"],
        },
        // Add more global variables as needed
      ];

      // Fetch values from Secret Manager
      const variables = [];
      for (const varConfig of globalVars) {
        try {
          const value = await this.getSecretValue(varConfig.secretName);
          variables.push({
            key: varConfig.key,
            value,
            type: varConfig.type,
          });
        } catch (error) {
          logger.warn(`Failed to get global variable ${varConfig.key}: ${error.message}`);
          // Continue with other variables even if one fails
        }
      }

      return variables;
    } catch (error) {
      logger.error("Error getting global variables:", error);
      return [];
    }
  }

  /**
   * Generate unique environment variables for a specific deployment
   * @param {Object} businessData - Business data from the onboarding form
   * @return {Promise<Array>} Array of unique environment variable objects
   */
  async generateUniqueVariables(businessData) {
    const variables = [];

    // Generate unique reCAPTCHA keys for this site
    // In production, you would integrate with Google reCAPTCHA API to create new site keys
    // For now, we'll use placeholder logic
    variables.push({
      key: "NEXT_PUBLIC_RECAPTCHA_SITE_KEY",
      value: await this.generateRecaptchaSiteKey(businessData.businessName),
      type: ["production", "preview"],
    });

    // Business-specific variables
    variables.push({
      key: "NEXT_PUBLIC_BUSINESS_NAME",
      value: businessData.businessName,
      type: ["production", "preview", "development"],
    });

    variables.push({
      key: "NEXT_PUBLIC_BUSINESS_PHONE",
      value: businessData.publicPhone || "",
      type: ["production", "preview", "development"],
    });

    variables.push({
      key: "NEXT_PUBLIC_BUSINESS_EMAIL",
      value: businessData.publicEmail || "",
      type: ["production", "preview", "development"],
    });

    // Lead delivery configuration
    if (businessData.hasCrm === "yes" && businessData.crmApiKey) {
      variables.push({
        key: "CRM_API_KEY",
        value: businessData.crmApiKey,
        type: ["production"], // Only in production for security
      });
      variables.push({
        key: "CRM_NAME",
        value: businessData.crmName,
        type: ["production", "preview", "development"],
      });
    } else if (businessData.zapierWebhookUrl) {
      variables.push({
        key: "ZAPIER_WEBHOOK_URL",
        value: businessData.zapierWebhookUrl,
        type: ["production"], // Only in production for security
      });
    }

    // Color scheme
    variables.push({
      key: "NEXT_PUBLIC_PRIMARY_COLOR",
      value: businessData.primaryColor || "#1D4ED8",
      type: ["production", "preview", "development"],
    });

    variables.push({
      key: "NEXT_PUBLIC_SECONDARY_COLOR",
      value: businessData.secondaryColor || "#FBBF24",
      type: ["production", "preview", "development"],
    });

    return variables;
  }

  /**
   * Generate a unique reCAPTCHA site key for the business
   * In production, this would integrate with Google reCAPTCHA API
   * @param {string} businessName - Name of the business
   * @return {Promise<string>} Generated site key
   */
  async generateRecaptchaSiteKey(businessName) {
    // TODO: Implement actual reCAPTCHA API integration
    // For now, return a placeholder that indicates it needs to be configured
    logger.info(`Generating reCAPTCHA site key for ${businessName}`);

    // In production, you would:
    // 1. Call Google reCAPTCHA Enterprise API to create a new key
    // 2. Associate it with the domain
    // 3. Store the secret key in Secret Manager
    // 4. Return the site key

    return `PLACEHOLDER_RECAPTCHA_KEY_${businessName.replace(/\W+/g, "_").toUpperCase()}`;
  }

  /**
   * Get secret value from Secret Manager
   * @param {string} secretName - Name of the secret
   * @return {Promise<string>} Secret value
   */
  async getSecretValue(secretName) {
    try {
      const name = `projects/allied-advantage-automation/secrets/${secretName}/versions/latest`;
      const [version] = await this.secretManagerClient.accessSecretVersion({name});
      return version.payload.data.toString("utf8");
    } catch (error) {
      logger.error(`Failed to access secret ${secretName}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Combine global and unique variables
   * @param {Object} businessData - Business data from the onboarding form
   * @return {Promise<Array>} Combined array of environment variables
   */
  async getAllVariablesForDeployment(businessData) {
    const [globalVars, uniqueVars] = await Promise.all([
      this.getGlobalVariables(),
      this.generateUniqueVariables(businessData),
    ]);

    return [...globalVars, ...uniqueVars];
  }
}

module.exports = EnvironmentManager;
