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
   * @returns {Promise<Object>} Created project data
   */
  async createProject(projectData) {
    const { name, gitRepository, environmentVariables, framework = "nextjs" } = projectData;
    
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
    const url = this.teamId 
      ? `${this.baseUrl}/v9/projects?teamId=${this.teamId}`
      : `${this.baseUrl}/v9/projects`;

    try {
      const response = await axios.post(url, payload, { headers: this.headers });
      logger.info(`Vercel project created: ${name}`, { projectId: response.data.id });
      
      // Set environment variables if provided
      if (environmentVariables && environmentVariables.length > 0) {
        await this.setEnvironmentVariables(response.data.id, environmentVariables);
      }
      
      return response.data;
    } catch (error) {
      logger.error("Error creating Vercel project:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Set environment variables for a project
   * @param {string} projectId - Vercel project ID
   * @param {Array} variables - Array of environment variable objects
   */
  async setEnvironmentVariables(projectId, variables) {
    const url = this.teamId
      ? `${this.baseUrl}/v10/projects/${projectId}/env?teamId=${this.teamId}`
      : `${this.baseUrl}/v10/projects/${projectId}/env`;

    try {
      for (const variable of variables) {
        const payload = {
          key: variable.key,
          value: variable.value,
          type: variable.type || ["production", "preview", "development"],
          target: variable.target || ["production", "preview", "development"],
        };
        
        await axios.post(url, payload, { headers: this.headers });
        logger.info(`Environment variable set: ${variable.key} for project ${projectId}`);
      }
    } catch (error) {
      logger.error("Error setting environment variables:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Trigger a deployment for a project
   * @param {string} projectName - Name of the Vercel project
   * @param {string} gitBranch - Git branch to deploy (default: main)
   */
  async triggerDeployment(projectName, gitBranch = "main") {
    const url = this.teamId
      ? `${this.baseUrl}/v13/deployments?teamId=${this.teamId}`
      : `${this.baseUrl}/v13/deployments`;

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
      const response = await axios.post(url, payload, { headers: this.headers });
      logger.info(`Deployment triggered for project: ${projectName}`, { 
        deploymentId: response.data.id,
        url: response.data.url 
      });
      return response.data;
    } catch (error) {
      logger.error("Error triggering deployment:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Add a custom domain to a project
   * @param {string} projectName - Name of the Vercel project
   * @param {string} domain - Domain to add (e.g., "client.alliedleadgen.com")
   */
  async addDomain(projectName, domain) {
    const url = this.teamId
      ? `${this.baseUrl}/v9/projects/${projectName}/domains?teamId=${this.teamId}`
      : `${this.baseUrl}/v9/projects/${projectName}/domains`;

    const payload = {
      name: domain,
    };

    try {
      const response = await axios.post(url, payload, { headers: this.headers });
      logger.info(`Domain added to project ${projectName}: ${domain}`);
      return response.data;
    } catch (error) {
      logger.error("Error adding domain:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get deployment status
   * @param {string} deploymentId - Vercel deployment ID
   */
  async getDeploymentStatus(deploymentId) {
    const url = this.teamId
      ? `${this.baseUrl}/v13/deployments/${deploymentId}?teamId=${this.teamId}`
      : `${this.baseUrl}/v13/deployments/${deploymentId}`;

    try {
      const response = await axios.get(url, { headers: this.headers });
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