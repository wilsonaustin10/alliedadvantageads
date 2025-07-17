const axios = require("axios");
const logger = require("firebase-functions/logger");

/**
 * Service for managing Vercel deployments via API
 */
class VercelDeploymentService {
  /**
   * Initialize Vercel deployment service
   * @param {string} apiToken - Vercel API token
   * @param {string|null} teamId - Optional Vercel team ID
   */
  constructor(apiToken, teamId = null) {
    this.apiToken = apiToken;
    this.teamId = teamId;
    this.baseUrl = "https://api.vercel.com";
    this.headers = {
      "Authorization": `Bearer ${apiToken}`,
      "Content-Type": "application/json",
    };
  }

  /**
   * Create a new Vercel project
   * @param {Object} projectData - Project configuration
   * @return {Promise<Object>} Created project data
   */
  async createProject(projectData) {
    const {name, gitRepository, environmentVariables, framework = "nextjs"} = projectData;

    const payload = {
      name,
      framework,
      gitRepository: {
        type: "github",
        repo: gitRepository,
      },
      // Vercel will auto-detect build settings for Next.js
      buildCommand: null,
      devCommand: null,
      installCommand: null,
      outputDirectory: null,
    };

    // Add team ID if provided
    const url = this.teamId ?
      `${this.baseUrl}/v9/projects?teamId=${this.teamId}` :
      `${this.baseUrl}/v9/projects`;

    try {
      logger.info("[VERCEL API] Creating project", {
        url,
        projectName: name,
        framework,
        gitRepo: gitRepository,
        hasTeamId: !!this.teamId,
      });

      const response = await axios.post(url, payload, {headers: this.headers});
      logger.info(`[VERCEL API] Project created successfully: ${name}`, {
        projectId: response.data.id,
        projectName: response.data.name,
        framework: response.data.framework,
        gitRepo: response.data.link?.repo,
      });

      // Set environment variables if provided
      if (environmentVariables && environmentVariables.length > 0) {
        try {
          // Wait a moment for the project to be fully created
          logger.info("[VERCEL API] Waiting 2 seconds before setting environment variables...");
          await new Promise((resolve) => setTimeout(resolve, 2000));

          await this.setEnvironmentVariables(response.data.name || response.data.id, environmentVariables);
        } catch (envError) {
          logger.warn("[VERCEL API] Failed to set environment variables, but project was created:", {
            error: envError.message,
            projectName: response.data.name,
            projectId: response.data.id,
            instruction: "Set environment variables manually in Vercel dashboard",
          });
          // Don't throw - project was created successfully
        }
      }

      return response.data;
    } catch (error) {
      logger.error("[VERCEL API] Error creating project:", {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        projectName: name,
        gitRepo: gitRepository,
      });
      throw error;
    }
  }

  /**
   * Set environment variables for a project
   * @param {string} projectIdOrName - Vercel project ID or name
   * @param {Array} variables - Array of environment variable objects
   */
  async setEnvironmentVariables(projectIdOrName, variables) {
    // Try different API endpoints and formats
    const baseUrls = [
      `${this.baseUrl}/v10/projects/${projectIdOrName}/env`, // Current API version
      `${this.baseUrl}/v9/projects/${projectIdOrName}/env`,
      `${this.baseUrl}/v8/projects/${projectIdOrName}/env`,
    ];

    const urls = [];
    for (const baseUrl of baseUrls) {
      if (this.teamId) {
        urls.push(`${baseUrl}?teamId=${this.teamId}`);
      }
      urls.push(baseUrl); // Also try without team ID
    }

    try {
      for (const variable of variables) {
        // Try different payload formats
        const payloads = [
          // Format 1: Correct v10 API format with type field
          {
            key: variable.key,
            value: variable.value,
            type: "encrypted", // Required field for v10 API
            target: variable.target || variable.type || ["production", "preview", "development"],
          },
          // Format 2: Try with plain type
          {
            key: variable.key,
            value: variable.value,
            type: "plain",
            target: variable.target || variable.type || ["production", "preview", "development"],
          },
          // Format 3: Legacy format (might work for older API versions)
          {
            key: variable.key,
            value: variable.value,
            target: variable.target || variable.type || ["production", "preview", "development"],
          },
        ];

        logger.info(`[VERCEL API] Setting env variable: ${variable.key}`, {
          projectIdOrName,
          hasValue: !!variable.value,
          type: variable.type,
          target: variable.target,
        });

        let success = false;
        let lastError = null;

        // Try different API endpoints and payload formats
        for (const url of urls) {
          for (const payload of payloads) {
            try {
              await axios.post(url, payload, {headers: this.headers});
              logger.info(`[VERCEL API] Environment variable set successfully: ${variable.key} for project ${projectIdOrName}`);
              success = true;
              break;
            } catch (envError) {
              lastError = envError;
              logger.warn(`[VERCEL API] Failed with ${url}, trying next...`, {
                status: envError.response?.status,
                error: envError.response?.data?.error?.message || envError.message,
              });

              // If it's a 404 or 403, try the next URL
              if (envError.response?.status === 404 || envError.response?.status === 403) {
                continue;
              }

              // For other errors, continue to next URL but log the error
              logger.warn(`[VERCEL API] Error with ${url}:`, {
                error: envError.message,
                response: envError.response?.data,
                status: envError.response?.status,
                payload: {key: variable.key, hasValue: !!variable.value},
              });
            }
            if (success) break;
          }
          if (success) break;
        }

        if (!success && lastError) {
          throw lastError;
        }
      }
    } catch (error) {
      logger.error("[VERCEL API] Error setting environment variables:", {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        projectIdOrName,
      });
      throw error;
    }
  }

  /**
   * Trigger a deployment for a project
   * @param {string} projectName - Name of the Vercel project
   * @param {string} gitBranch - Git branch to deploy (default: main)
   */
  async triggerDeployment(projectName, gitBranch = "main") {
    const url = this.teamId ?
      `${this.baseUrl}/v13/deployments?teamId=${this.teamId}` :
      `${this.baseUrl}/v13/deployments`;

    const payload = {
      name: projectName,
      project: projectName,
      target: "production",
      gitSource: {
        ref: gitBranch,
        type: "github",
      },
    };

    try {
      logger.info("[VERCEL API] Triggering deployment", {
        projectName,
        branch: gitBranch,
        target: "production",
      });

      const response = await axios.post(url, payload, {headers: this.headers});
      logger.info(`[VERCEL API] Deployment triggered successfully for project: ${projectName}`, {
        deploymentId: response.data.id,
        deploymentUrl: response.data.url,
        readyState: response.data.readyState,
        target: response.data.target,
      });
      return response.data;
    } catch (error) {
      logger.error("[VERCEL API] Error triggering deployment:", {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        projectName,
        branch: gitBranch,
      });
      throw error;
    }
  }

  /**
   * Add a custom domain to a project
   * @param {string} projectName - Name of the Vercel project
   * @param {string} domain - Domain to add (e.g., "client.alliedleadgen.com")
   */
  async addDomain(projectName, domain) {
    const url = this.teamId ?
      `${this.baseUrl}/v9/projects/${projectName}/domains?teamId=${this.teamId}` :
      `${this.baseUrl}/v9/projects/${projectName}/domains`;

    const payload = {
      name: domain,
    };

    try {
      logger.info("[VERCEL API] Adding domain", {
        projectName,
        domain,
        hasTeamId: !!this.teamId,
      });

      const response = await axios.post(url, payload, {headers: this.headers});
      logger.info(`[VERCEL API] Domain added successfully to project ${projectName}: ${domain}`, {
        domain: response.data.name,
        verified: response.data.verified,
        configuredBy: response.data.configuredBy,
      });
      return response.data;
    } catch (error) {
      logger.error("[VERCEL API] Error adding domain:", {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        projectName,
        domain,
      });
      throw error;
    }
  }

  /**
   * Get deployment status
   * @param {string} deploymentId - Vercel deployment ID
   */
  async getDeploymentStatus(deploymentId) {
    const url = this.teamId ?
      `${this.baseUrl}/v13/deployments/${deploymentId}?teamId=${this.teamId}` :
      `${this.baseUrl}/v13/deployments/${deploymentId}`;

    try {
      const response = await axios.get(url, {headers: this.headers});
      return {
        id: response.data.id,
        url: response.data.url,
        state: response.data.readyState, // QUEUED, BUILDING, ERROR, READY
        createdAt: response.data.createdAt,
      };
    } catch (error) {
      logger.error("Error getting deployment status:", error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = VercelDeploymentService;
