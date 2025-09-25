High‑level architecture for adding a login feature to Allied Lead Gen Landing
Current system overview
The project currently automates the creation of customised landing pages for real‑estate wholesaling businesses. Users fill in an onboarding form and the system performs several steps:

Generates a GitHub repository from a template – uses Octokit to create a new repository with custom content.

Deploys the generated code to Vercel – automatically provisions the site and configures custom domains.

Stores status in Firestore – tracks submission and deployment state.

The tech stack is documented in the repository README:

Backend – Firebase Functions (Node.js) hosted under functions/
GitHub
.

Frontend – Next.js 14 with TailwindCSS
GitHub
.

Database – Firestore
GitHub
; storage uses Firebase Storage.

Deployment – Vercel
GitHub
.

Secret management – Google Cloud Secret Manager
GitHub
.

A small lib/firebase.ts module already initialises a Firebase app and exposes getAuth, getFirestore and getStorage so these services can be used in the Next.js application
GitHub
. However, there is no authentication logic yet; all pages are currently public.

Goals for the login feature
The immediate goal is to add a simple login page that allows the owner (Austin) to access a protected section of the application. Long‑term goals include supporting multiple user accounts and role‑based access control. The solution should integrate cleanly with the existing Firebase/Next.js setup, avoid over‑engineering and lay the groundwork for future capabilities.

Requirements
Single‑user authentication (email/password) using existing Firebase services.

Front‑end login page that fits into the Next.js app router structure.

Persistent session so the user remains logged in across page loads.

Protected routes for any pages that should only be accessible after login.

Backend protection for API routes/functions that modify or expose sensitive data.

Scalable design so new users and roles can be added without redesigning the whole system.

Proposed architecture
Authentication service
Use Firebase Authentication for managing users. Firebase provides secure email/password authentication, token management and integration with Firestore/Storage. It avoids the need to maintain a custom identity service and fits naturally into the current Firebase stack.

Admin account provisioning – create the initial admin user (Austin) via the Firebase console or by running an admin script. Store the email/password in a secure password manager. In the future, additional users can be created via the console or programmatically.

User store – create a users collection in Firestore keyed by each user’s UID. Store metadata such as role: "admin" | "user" and any preferences. When a new user signs up, add an entry to this collection so roles can be enforced server‑side.

Session tokens – Firebase Auth automatically issues ID tokens and refresh tokens. These tokens can be used in server environments (Firebase Functions or Next.js app route handlers) to verify the caller’s identity.

Front‑end integration (Next.js 14)
Firebase client setup – Continue using lib/firebase.ts to initialise the Firebase app. Import getAuth, signInWithEmailAndPassword, onAuthStateChanged and signOut from firebase/auth in the React components.

Auth context/provider – Create an AuthProvider React context that:

Listens to auth state changes via onAuthStateChanged.

Stores the current user and exposes login/logout functions.

Wraps the application so children can access user state.

Login page – Add a route group such as app/(auth)/login/page.tsx (similar to the existing onboarding form). The page should:

Contain a simple email/password form.

Call signInWithEmailAndPassword(auth, email, password) on submit.

Display errors when authentication fails.

Protected routes – Use Next.js middleware or React components to restrict access. For example:

Place secure pages in a (protected) route group.

In a client component wrapper, check if user exists; if not, redirect to the login page.

Alternatively, implement a Next.js middleware that intercepts requests to protected routes and performs an auth check.

Navigation and logout – Provide a logout button that calls signOut(auth). When user becomes null, redirect to the login page.

Backend integration (Firebase Functions)
The existing cloud functions (e.g., handleOnboardingSubmission) are currently unauthenticated. To protect internal APIs:

Token verification middleware – Create a helper in functions/ that:

Reads the Authorization header (Bearer <token>) from incoming requests.

Uses firebase-admin’s auth().verifyIdToken() to verify the token and retrieve the user’s UID.

Looks up the user’s role in the users collection and ensures they have the required permissions.

Returns 401 Unauthorized if the token is missing, invalid or the user’s role is insufficient.

Secure endpoints – Wrap any sensitive function (e.g., endpoints that read or modify onboarding submissions) with the above middleware. Onboarding submissions themselves may remain public, but administrative APIs (dashboard, editing, management) should require authentication.

Environment configuration – No additional secrets are needed because Firebase Admin uses the existing service account (already initialised in index.js
GitHub
). Make sure the functions have the auth claim and Firestore read permissions for the user metadata.

Future‑proofing for multiple users
The architecture above easily extends to additional users and roles:

User registration – enable Firebase’s built‑in user creation or integrate social providers (Google, GitHub). Add a registration form or invite flow.

Role management – store roles in Firestore (users collection) and check them in both the client and server. Define roles such as admin, editor, etc.

Fine‑grained access control – implement Firestore security rules to restrict document access based on auth UID and role, preventing unauthorised reads/writes.

Audit trails – record user actions in Firestore or BigQuery for traceability.

Summary of tasks
Add Firebase Auth configuration – Ensure .env.local contains the NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN and related variables (the project already exposes these variables via firebaseConfig
GitHub
).

Create an AuthProvider – implement a React context to provide user, login, logout and handle auth state changes.

Build the login page – simple email/password form in app/(auth)/login/page.tsx that calls Firebase Auth.

Protect routes – wrap sensitive pages/components with an auth check and redirect unauthenticated users to /login.

Implement backend token verification – add a middleware in Firebase Functions to verify ID tokens for protected endpoints. Use Firestore to store user roles.

Seed the admin user – create the initial admin account in Firebase and add a users/<uid> document with role: "admin".

By following this plan, the Allied Lead Gen Landing system will gain a robust authentication layer that is immediately useful for a single admin and scalable to support multiple users and roles in the future.