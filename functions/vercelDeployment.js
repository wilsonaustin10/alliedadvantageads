const axios = require("axios");
const logger = require("firebase-functions/logger");

class VercelDeploymentService {
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
        hasTeamId: !!this.teamId
      });
      
      const response = await axios.post(url, payload, {headers: this.headers});
      logger.info(`[VERCEL API] Project created successfully: ${name}`, {
        projectId: response.data.id,
        projectName: response.data.name,
        framework: response.data.framework,
        gitRepo: response.data.link?.repo
      });

      // Set environment variables if provided
      if (environmentVariables && environmentVariables.length > 0) {
        await this.setEnvironmentVariables(response.data.id, environmentVariables);
      }

      return response.data;
    } catch (error) {
      logger.error("[VERCEL API] Error creating project:", {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        projectName: name,
        gitRepo: gitRepository
      });
      throw error;
    }
  }

  /**
   * Set environment variables for a project
   * @param {string} projectId - Vercel project ID
   * @param {Array} variables - Array of environment variable objects
   */
  async setEnvironmentVariables(projectId, variables) {
    const url = this.teamId ?
      `${this.baseUrl}/v10/projects/${projectId}/env?teamId=${this.teamId}` :
      `${this.baseUrl}/v10/projects/${projectId}/env`;

    try {
      for (const variable of variables) {
        const payload = {
          key: variable.key,
          value: variable.value,
          type: variable.type || ["production", "preview", "development"],
          target: variable.target || ["production", "preview", "development"],
        };

        logger.info(`[VERCEL API] Setting env variable: ${variable.key}`, {
          projectId,
          hasValue: !!variable.value,
          type: variable.type,
          target: variable.target
        });
        
        await axios.post(url, payload, {headers: this.headers});
        logger.info(`[VERCEL API] Environment variable set successfully: ${variable.key} for project ${projectId}`);
      }
    } catch (error) {
      logger.error("[VERCEL API] Error setting environment variables:", {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        projectId
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
        target: "production"
      });
      
      const response = await axios.post(url, payload, {headers: this.headers});
      logger.info(`[VERCEL API] Deployment triggered successfully for project: ${projectName}`, {
        deploymentId: response.data.id,
        deploymentUrl: response.data.url,
        readyState: response.data.readyState,
        target: response.data.target
      });
      return response.data;
    } catch (error) {
      logger.error("[VERCEL API] Error triggering deployment:", {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        projectName,
        branch: gitBranch
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
        hasTeamId: !!this.teamId
      });
      
      const response = await axios.post(url, payload, {headers: this.headers});
      logger.info(`[VERCEL API] Domain added successfully to project ${projectName}: ${domain}`, {
        domain: response.data.name,
        verified: response.data.verified,
        configuredBy: response.data.configuredBy
      });
      return response.data;
    } catch (error) {
      logger.error("[VERCEL API] Error adding domain:", {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        projectName,
        domain
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
