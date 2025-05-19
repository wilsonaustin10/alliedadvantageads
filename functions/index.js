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
      // Generate a URL-friendly slug from the business name
        const slug = cfg.businessName.toLowerCase().replace(/\W+/g, "-");
        const newRepoName = `landing-${slug}`; // This will be the name of the new repository

        // 1. Create a new repository
        logger.info(`Creating new repository: ${newRepoName}`);
        try {
          await octokit.repos.createForAuthenticatedUser({
            name: newRepoName,
            description: `Landing page for ${cfg.businessName}`,
            private: false, // or true if you want private repos
            auto_init: false, // We don't want a README since we're templating
          });
          logger.info(`Successfully created repository: ${newRepoName}`);
        } catch (error) {
          logger.error("Error creating repository:", error);
          await event.data.ref.update({
            status: "failed",
            error: "Failed to create repository",
          });
          return;
        }

        // 2. Get template repository contents
        logger.info(`Fetching template from ${GITHUB_OWNER}/${TEMPLATE_REPO}`);
        try {
          const {data: templateContents} = await octokit.repos.getContent({
            owner: GITHUB_OWNER,
            repo: TEMPLATE_REPO,
            path: "", // Get root directory contents
          });

          // Process each file from the template
          for (const file of templateContents) {
            logger.info(`Inspecting template item: ${file.path}, type: ${file.type}`); // Added logging

            if (file.type !== "file") { // UNCOMMENTED THIS BLOCK
              logger.info(`Skipping non-file item in template: ${file.path} (type: ${file.type})`);
              continue;
            }

            logger.info(`Fetching content for file: ${file.path}`);
            const {data: fileData} = await octokit.repos.getContent({
              owner: GITHUB_OWNER,
              repo: TEMPLATE_REPO,
              path: file.path,
            });

            // Robust check for fileData and fileData.content
            if (!fileData || typeof fileData.content !== "string") {
              logger.error(`Error or missing content for template file: ${file.path}. Expected object with string 'content', got:`, fileData);
              // Optionally, update Firestore status to indicate a partial failure or specific file error
              // await event.data.ref.update({ status: "failed", error: `Failed to get content for ${file.path}` });
              continue; // Skip this file
            }

            let content = Buffer.from(fileData.content, "base64").toString("utf8");

            // If this is an HTML file, process it with Mustache
            if (file.path.endsWith(".html")) {
            // Prepare view data
              const viewData = {
                ...cfg,
                companyName: cfg.businessName,
                generatedAt: new Date().toISOString(),
              };

              // Generate logo if requested
              if (cfg.createLogo === "yes" && openai) {
                try {
                  logger.info(`Generating logo for ${cfg.businessName} with OpenAI DALL-E 3...`);
                  const imageResponse = await openai.images.generate({
                    model: "dall-e-3",
                    prompt: `A modern, professional, and clean logo for a real estate wholesaling business named "${cfg.businessName}". The logo should evoke trust and reliability. Color hints: primary ${cfg.primaryColor || "blue"}, secondary ${cfg.secondaryColor || "grey"}. Ensure the logo is suitable for web and branding, avoiding overly complex details. Focus on a strong, memorable mark or logotype. Format: Digital art. Style: Minimalist but impactful.`,
                    n: 1,
                    size: "1024x1024", // DALL-E 3 supports 1024x1024, 1792x1024, or 1024x1792
                    response_format: "url",
                  });

                  const logoUrl = imageResponse.data[0]?.url;
                  if (logoUrl) {
                    viewData.logoUrl = logoUrl;
                    logger.info(`Successfully generated logo for ${cfg.businessName}. URL: ${logoUrl}`);
                  } else {
                    logger.warn(`OpenAI DALL-E 3 did not return a logo URL for ${cfg.businessName}.`);
                  }
                } catch (error) {
                  logger.error(`Error generating logo for ${cfg.businessName} with OpenAI DALL-E 3:`, error);
                }
              } else {
                logger.info(`Skipping logo generation for ${cfg.businessName} - OpenAI not initialized or createLogo not set to 'yes'.`);
              }

              content = Mustache.render(content, viewData);
            }

            // Create file in new repository
            await octokit.repos.createOrUpdateFileContents({
              owner: GITHUB_OWNER,
              repo: newRepoName,
              path: file.path,
              message: `Add ${file.path} from template`,
              content: Buffer.from(content).toString("base64"),
            });
          }
        } catch (error) {
          logger.error("Error processing template:", error);
          await event.data.ref.update({
            status: "failed",
            error: "Failed to process template",
          });
          return;
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
