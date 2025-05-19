/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const functions = require("firebase-functions"); // REMOVE THIS LINE
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

// Add these require statements
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {Octokit} = require("@octokit/rest");
const Mustache = require("mustache");
const OpenAI = require("openai");
const {SecretManagerServiceClient} = require("@google-cloud/secret-manager");

// Initialize Firebase Admin
admin.initializeApp();

// Clients for dependent services, initialized by ensureClientsInitialized
let GITHUB_OWNER;
let TEMPLATE_REPO;

// Initialize the Secret Manager client with explicit project ID
const secretManagerClient = new SecretManagerServiceClient({
  projectId: "allied-advantage-automation",
});

/**
 * Accesses the latest version of a secret from Google Cloud Secret Manager.
 * @param {string} secretName The name of the secret to access.
 * @return {Promise<string>} A promise that resolves with the secret payload as a string.
 * @throws {Error} If accessing the secret fails.
 */
async function accessSecretVersion(secretName) {
  try {
    const name = `projects/${process.env.GCLOUD_PROJECT}/secrets/${secretName}/versions/latest`;
    const [version] = await secretManagerClient.accessSecretVersion({name});
    const payload = version.payload.data.toString("utf8");
    logger.info(`Successfully accessed secret: ${secretName}`);
    return payload;
  } catch (error) {
    logger.error(`Failed to access secret ${secretName}. Ensure it exists and the function service account has the 'Secret Manager Secret Accessor' role. Error: ${error.message}`);
    throw error;
  }
}

// Global client variables - will be initialized by ensureClientsInitialized
let octokit;
let openai;
let clientsInitialized = false;

/**
 * Ensures that the Octokit and OpenAI clients are initialized using secrets
 * from Google Cloud Secret Manager. This function is idempotent and will
 * populate global variables for the clients and related configuration.
 * It also handles partial initialization if some secrets (like OpenAI API key)
 * are not available.
 * @async
 * @function ensureClientsInitialized
 * @throws {Error} If initialization of critical clients (e.g., Octokit) fails due to missing secrets or access issues.
 */
async function ensureClientsInitialized() {
  if (clientsInitialized) return;

  try {
    GITHUB_OWNER = await accessSecretVersion("GITHUB_OWNER_V2");
    TEMPLATE_REPO = await accessSecretVersion("GITHUB_TEMPLATEREPO_V2");
    const octokitToken = await accessSecretVersion("OCTOKIT_TOKEN_V2");

    let openaiApiKey = null;
    try {
      openaiApiKey = await accessSecretVersion("OPENAI_APIKEY_V2");
    } catch (error) {
      logger.warn("OpenAI API Key secret (OPENAI_APIKEY_V2) not found or access failed. OpenAI features will be disabled.");
    }

    logger.info("DEBUG SM: GITHUB_OWNER: ", GITHUB_OWNER);
    logger.info("DEBUG SM: GITHUB_TEMPLATEREPO: ", TEMPLATE_REPO);
    logger.info("DEBUG SM: OCTOKIT_TOKEN: ", octokitToken ? "Present" : "UNDEFINED");
    logger.info("DEBUG SM: OPENAI_APIKEY: ", openaiApiKey ? "Present" : "UNDEFINED");

    octokit = new Octokit({auth: octokitToken});

    if (openaiApiKey) {
      openai = new OpenAI({
        apiKey: openaiApiKey,
        dangerouslyAllowBrowser: true,
      });
    } else {
      openai = null;
      logger.info("OpenAI client not initialized as API key is missing.");
    }
    clientsInitialized = true;
    logger.info("Clients initialized successfully using Secret Manager values.");
  } catch (error) {
    logger.error("FATAL: Failed to initialize clients with secrets from Secret Manager:", error);
    clientsInitialized = false; // Explicitly set to false on error
    // Re-throw the error so the function execution fails clearly if critical secrets are missing
    throw error;
  }
}

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// Cloud Function to handle form submissions
exports.handleOnboardingSubmission = onRequest(async (request, response) => {
  // Enable CORS
  // Force redeploy comment
  logger.info("--- handleOnboardingSubmission invoked ---");
  return cors(request, response, async () => {
    try {
      // Check if the request method is POST
      if (request.method !== "POST") {
        return response.status(405).json({
          error: "Method not allowed. Please use POST.",
        });
      }

      const formData = request.body;

      // Basic validation
      if (!formData.firstName || !formData.lastName || !formData.businessName) {
        return response.status(400).json({
          error: "Required fields missing: firstName, lastName, businessName",
        });
      }

      // Add submission timestamp and format data
      const landingPageData = {
        ...formData,
        submittedAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "pending", // This status will trigger generateLanding function
        // monthlyAdSpendBudget will be included via ...formData if present
      };

      // Store in Firestore to trigger the landing page generation
      const landingPageRef = await admin.firestore()
          .collection("landingPages") // Ensure this is "landingPages"
          .add(landingPageData);

      // Log the submission
      logger.info("New landing page request received, generation triggered.", {
        landingPageId: landingPageRef.id,
        businessName: formData.businessName,
        requestId: formData.requestId,
      });

      // Return success response
      return response.status(200).json({
        success: true,
        message: "Onboarding submission received. Landing page generation has started.",
        landingPageId: landingPageRef.id,
      });
    } catch (error) {
      logger.error("SUBMISSION ERROR");
      if (error instanceof Error) {
        logger.error("Err msg: " + error.message);
        logger.error("Err stack: " + error.stack);
      } else {
        logger.error("Caught non-Error object: " + String(error));
      }

      return response.status(500).json({
        error: "Error processing the submission. Please try again later.",
      });
    }
  });
});

// Test function
exports.test = onRequest(async (request, response) => {
  cors(request, response, async () => {
    try {
      await ensureClientsInitialized(); // Test client initialization
      logger.info("Test function: Clients initialized. Octokit is ", octokit ? "defined" : "undefined");
      response.send("Test function executed. Check logs for client initialization status.");
    } catch (error) {
      logger.error("Test function failed during client initialization:", error);
      response.status(500).send("Test function failed. Check logs.");
    }
  });
});

/**
 * Recursively processes template items (files and directories) from a source
 * repository and populates them into a new repository, applying Mustache
 * templating to text-based files.
 * @param {string} owner The owner of the template repository.
 * @param {string} templateRepo The name of the template repository.
 * @param {string} newRepoName The name of the new repository to create files in.
 * @param {string} path The current path within the template repository to process.
 * @param {object} cfgForTemplating The configuration object for Mustache templating.
 * @return {Promise<void>} A promise that resolves when processing is complete.
 * @throws {Error} If processing any part of the template fails.
 */
async function processTemplateItem(owner, templateRepo, newRepoName, path, cfgForTemplating) {
  logger.info(`Processing template item: ${path} in ${owner}/${templateRepo} for ${newRepoName}`);
  try {
    const {data: items} = await octokit.repos.getContent({
      owner: owner,
      repo: templateRepo,
      path: path,
    });
    // Enhanced logging for the items received from getContent
    logger.info(`[processTemplateItem DEBUG] getContent for path: "${path}" returned items: ${JSON.stringify(items, (key, value) => (key === "content" || key === "_links") ? undefined : value, 2)}`);

    const itemList = Array.isArray(items) ? items : [items];
    if (path === "" && !Array.isArray(items)) {
      logger.warn(`[processTemplateItem DEBUG] Root path ("") getContent response was not an array as expected. Type: ${typeof items}. This might indicate an issue with fetching root directory contents.`);
    }

    for (const item of itemList) {
      // Enhanced logging for each item being processed
      logger.info(`[processTemplateItem DEBUG] Inspecting item - Name: '${item.name}', Path: '${item.path}', Type: '${item.type}', Size: ${item.size}`);

      if (item.type === "file") {
        logger.info(`Fetching content for file: ${item.path}`);
        const {data: fileData} = await octokit.repos.getContent({
          owner: owner,
          repo: templateRepo,
          path: item.path, // Use item.path as it's the full path from the repo root
        });

        if (!fileData || typeof fileData.content !== "string") {
          logger.error(`Error or missing content for template file: ${item.path}. Got:`, fileData);
          // Decide if this should be a fatal error for the whole process or just skip this file
          // For now, we'll log and skip.
          continue;
        }

        let content = Buffer.from(fileData.content, "base64").toString("utf8");

        // Apply Mustache templating to common text-based files
        // Add other extensions as needed (e.g., .css, .js, .json, .md)
        const templatableExtensions = [".html", ".js", ".json", ".md", ".txt", ".css", ".jsx", ".tsx", ".vue", ".scss", ".yaml", ".yml", ".xml", "Dockerfile", ".sh"];
        if (templatableExtensions.some((ext) => item.path.endsWith(ext)) || !item.path.includes(".")) { // Also template files with no extension
          try {
            content = Mustache.render(content, cfgForTemplating);
            logger.info(`Successfully templated: ${item.path}`);
          } catch (renderError) {
            logger.error(`Error rendering Mustache template for ${item.path}:`, renderError);
            // Potentially skip this file or use original content, depending on desired behavior
          }
        } else {
          logger.info(`Skipping templating for binary or non-text file: ${item.path}`);
        }

        // Create file in new repository, preserving path
        logger.info(`Creating file in new repo: ${item.path}`);
        await octokit.repos.createOrUpdateFileContents({
          owner: GITHUB_OWNER, // Assuming GITHUB_OWNER is the owner of the new repo
          repo: newRepoName,
          path: item.path, // This should be the relative path within the repo
          message: `Add ${item.path} from template`,
          content: Buffer.from(content).toString("base64"),
        });
        logger.info(`Successfully created/updated file: ${item.path} in ${newRepoName}`);
      } else if (item.type === "dir") {
        logger.info(`Recursively processing directory: ${item.path}`);
        // For directories, GitHub API createOrUpdateFileContents cannot create an empty directory.
        // Directories are implicitly created when files are added to them.
        // So, we just recurse.
        await processTemplateItem(owner, templateRepo, newRepoName, item.path, cfgForTemplating);
      } else {
        logger.warn(`Skipping item ${item.path} of unknown type: ${item.type}`);
      }
    }
  } catch (error) {
    logger.error(`Error processing template item ${path} for ${newRepoName}:`, error);
    // Re-throw the error to be caught by the caller, potentially failing the specific landing page generation.
    throw new Error(`Failed to process template item ${path}: ${error.message}`);
  }
}

exports.generateLanding = onDocumentCreated(
    "/landingPages/{id}",
    async (event) => {
      try {
        await ensureClientsInitialized(); // Ensure clients are ready
      } catch (initError) {
        logger.error("Client initialization failed in generateLanding. Aborting execution.", initError);
        // Optionally update Firestore status to failed here if it makes sense
        // await event.data.ref.update({ status: "failed", error: "Client initialization error" });
        return; // Stop execution if clients can't be initialized
      }

      // Check if critical clients like Octokit were actually initialized
      if (!octokit) {
        logger.error("Octokit client is not initialized. Aborting landing page generation.");
        // Optionally update Firestore status
        // await event.data.ref.update({ status: "failed", error: "Octokit client not initialized" });
        return;
      }

      // Retrieve the configuration object from the Firestore document
      const cfg = event.data.data();

      // Idempotency: Only process if status is 'pending'
      if (cfg.status !== "pending") {
        logger.info(`Skipping document ${event.params.id} as status is '${cfg.status}'.`);
        return;
      }

      logger.info(`Processing landing page generation for document: ${event.params.id}`, {cfg});

      try {
        const slug = cfg.businessName.toLowerCase().replace(/\W+/g, "-");
        const newRepoName = `landing-${slug}`;

        // Prepare view data for templating early, including generatedAt
        // It will be augmented with logoUrl if generated
        const viewData = {
          ...cfg,
          companyName: cfg.businessName, // Explicitly map for clarity if template uses "companyName"
          generatedAt: new Date().toISOString(),
          // logoUrl will be added here if generated successfully
        };

        // Generate logo if requested and OpenAI client is available
        if (cfg.createLogo === "yes" && openai) {
          try {
            logger.info(`Generating logo for ${cfg.businessName} with OpenAI DALL-E 3...`);
            const imageResponse = await openai.images.generate({
              model: "dall-e-3",
              prompt: `A modern, professional, and clean logo for a real estate wholesaling business named "${cfg.businessName}". The logo should evoke trust and reliability. Color hints: primary ${cfg.primaryColor || "blue"}, secondary ${cfg.secondaryColor || "grey"}. Ensure the logo is suitable for web and branding, avoiding overly complex details. Focus on a strong, memorable mark or logotype. Format: Digital art. Style: Minimalist but impactful.`,
              n: 1,
              size: "1024x1024",
              response_format: "url",
            });

            const logoUrl = imageResponse.data[0]?.url;
            if (logoUrl) {
              viewData.logoUrl = logoUrl; // Add to viewData for templating
              logger.info(`Successfully generated logo. URL: ${logoUrl}`);
              // Optionally, update Firestore with the logo URL immediately or as part of 'completed' status
              // await event.data.ref.update({ logoUrl: logoUrl });
            } else {
              logger.warn(`OpenAI DALL-E 3 did not return a logo URL for ${cfg.businessName}.`);
            }
          } catch (error) {
            logger.error(`Error generating logo for ${cfg.businessName} with OpenAI DALL-E 3:`, error);
            // Decide if logo generation failure is critical. For now, we continue without it.
          }
        } else {
          logger.info("Skipping logo generation: OpenAI not initialized or createLogo not 'yes'.");
        }

        // 1. Create a new repository
        logger.info(`Creating new repository: ${newRepoName}`);
        try {
          await octokit.repos.createForAuthenticatedUser({
            name: newRepoName,
            description: `Landing page for ${cfg.businessName}`,
            private: false,
            auto_init: false, // Important: do not auto-initialize
          });
          logger.info(`Successfully created repository: ${newRepoName}`);
        } catch (error) {
          logger.error("Error creating repository:", error);
          if (error.status === 422) { // Repository already exists
            logger.warn(`Repository ${newRepoName} already exists. Proceeding to populate/update.`);
          } else {
            await event.data.ref.update({
              status: "failed",
              error: `Failed to create repository: ${error.message || "Unknown error"}`,
            });
            return; // Stop if repository creation fails for other reasons
          }
        }

        // 2. Process template repository contents recursively
        logger.info(`Starting to process template from ${GITHUB_OWNER}/${TEMPLATE_REPO} for ${newRepoName}`);
        try {
          // Call the recursive helper function starting from the root of the template repo
          await processTemplateItem(GITHUB_OWNER, TEMPLATE_REPO, newRepoName, "", viewData);
          logger.info(`Successfully processed all template items for ${newRepoName}.`);
        } catch (templateError) {
          logger.error(`Error processing template for ${newRepoName}:`, templateError);
          await event.data.ref.update({
            status: "failed",
            error: `Failed to process template: ${templateError.message || "Unknown error"}`,
          });
          return; // Stop if template processing fails
        }

        // Update Firestore document status to 'completed'
        await event.data.ref.update({
          status: "completed",
          generatedAt: admin.firestore.FieldValue.serverTimestamp(),
          repoName: newRepoName,
          repoUrl: `https://github.com/${GITHUB_OWNER}/${newRepoName}`,
          error: null,
        });
        logger.info(`Successfully created landing page repository: ${newRepoName}`);
      } catch (error) {
        logger.error(`Error processing landing page for ${event.params.id}:`, error);
        try {
          await event.data.ref.update({
            status: "failed",
            error: error.message || "An unknown error occurred during generation.",
            failedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        } catch (dbError) {
          logger.error(`Failed to update Firestore status to 'failed' for ${event.params.id}:`, dbError);
        }
      }
    },
);
