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

// Initialize Firebase Admin
admin.initializeApp();

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
      const submissionData = {
        ...formData,
        submittedAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "pending", // You can use this for tracking onboarding status
        // monthlyAdSpendBudget will be included via ...formData if present
      };

      // Store in Firestore
      const submissionRef = await admin.firestore()
          .collection("onboardingSubmissions")
          .add(submissionData);

      // Log the submission
      logger.info("New onboarding submission received", {
        submissionId: submissionRef.id,
        businessName: formData.businessName,
        requestId: formData.requestId,
        monthlyAdSpendBudget: formData.monthlyAdSpendBudget,
      });

      // Return success response
      return response.status(200).json({
        success: true,
        message: "Onboarding submission received successfully",
        submissionId: submissionRef.id,
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
