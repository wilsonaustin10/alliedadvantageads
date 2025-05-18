/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

// Add these require statements
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {Octokit} = require("@octokit/rest");
const Mustache = require("mustache");
const OpenAI = require("openai");

// Initialize Firebase Admin
admin.initializeApp();

// Initialize Octokit (ensure GITHUB_TOKEN is set in Firebase config)
// You'll need to set this via: firebase functions:config:set octokit.token="YOUR_TOKEN"
// Force redeploy + rebuild 2025-05-18
const octokit = new Octokit({
  auth: process.env.FUNCTIONS_CONFIG_OCTOKIT_TOKEN,
});

// Initialize OpenAI (ensure OPENAI_API_KEY is set in Firebase config)
// You'll need to set this via: firebase functions:config:set openai.apikey="YOUR_KEY"
let openai = null;
try {
  if (process.env.FUNCTIONS_CONFIG_OPENAI_APIKEY) {
    openai = new OpenAI({
      apiKey: process.env.FUNCTIONS_CONFIG_OPENAI_APIKEY,
      dangerouslyAllowBrowser: true,
    });
  }
} catch (error) {
  logger.warn("OpenAI initialization failed:", error);
}

// GitHub configuration (set these in Firebase config)
// firebase functions:config:set github.owner="OWNER" github.templaterepo="REPO"
const GITHUB_OWNER = process.env.FUNCTIONS_CONFIG_GITHUB_OWNER;
const TEMPLATE_REPO = process.env.FUNCTIONS_CONFIG_GITHUB_TEMPLATEREPO;

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
exports.test = onRequest((request, response) => {
  // Enable CORS for the test function as well
  cors(request, response, () => {
    logger.info("Test function invoked", {
      headers: request.headers,
      method: request.method,
    });
    response.send("Hello from Firebase Test Function!");
  });
});

exports.generateLanding = onDocumentCreated(
    "/landingPages/{id}",
    async (event) => {
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
            path: "",
          });

          // Process each file from the template
          for (const file of templateContents) {
            const {data: fileData} = await octokit.repos.getContent({
              owner: GITHUB_OWNER,
              repo: TEMPLATE_REPO,
              path: file.path,
            });

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
