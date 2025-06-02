# Allied Lead Gen Landing - Automated Landing Page System

## Overview

The Allied Lead Gen Landing system automates the creation and deployment of customized landing pages for real estate wholesaling businesses. When a client completes the onboarding form, the system automatically:

1. **Generates a GitHub Repository** - Creates a new repository from a template with customized content
2. **Deploys to Vercel** - Automatically deploys the site with proper environment variables and configurations
3. **Configures Custom Domains** - Sets up custom domains if specified (optional)

## System Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Onboarding    │────▶│ Firebase Function │────▶│     GitHub      │
│      Form       │     │  (Generates Code) │     │   Repository    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                │                           │
                                │                           │
                                ▼                           ▼
                        ┌──────────────────┐     ┌─────────────────┐
                        │    Firestore     │     │     Vercel      │
                        │   (Status DB)    │     │  (Auto Deploy)  │
                        └──────────────────┘     └─────────────────┘
```

## Features

### Automated Repository Generation
- Uses Mustache templating for dynamic content
- Processes template repository with business-specific data
- Creates branded landing pages with custom colors and content

### Automatic Vercel Deployment
- GitHub integration for continuous deployment
- Environment variable management
- Custom domain support
- SSL certificates automatically provisioned

### Lead Delivery Options
- CRM Integration (via API)
- Zapier Webhook Integration
- Email notifications

### Customization Options
- Business branding (name, logo, colors)
- Contact information
- Service descriptions
- Lead capture forms with reCAPTCHA

## Technical Stack

- **Backend**: Firebase Functions (Node.js)
- **Frontend**: Next.js 14 with TailwindCSS
- **Database**: Firestore
- **Deployment**: Vercel
- **Version Control**: GitHub
- **Secret Management**: Google Cloud Secret Manager
- **APIs**: OpenAI (logo generation), Google Places, reCAPTCHA

## Setup Instructions

### Prerequisites

1. Firebase project with Functions enabled
2. GitHub account with personal access token
3. Vercel account with API token
4. Google Cloud project with Secret Manager enabled

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd allied-lead-gen-landing
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd functions && npm install
   ```

3. **Configure secrets in Google Cloud Secret Manager**
   ```bash
   # GitHub configuration
   echo -n "YOUR_GITHUB_USERNAME" | gcloud secrets create GITHUB_OWNER_V2 --data-file=-
   echo -n "YOUR_TEMPLATE_REPO" | gcloud secrets create GITHUB_TEMPLATEREPO_V2 --data-file=-
   echo -n "YOUR_GITHUB_TOKEN" | gcloud secrets create OCTOKIT_TOKEN_V2 --data-file=-
   
   # Vercel configuration
   echo -n "YOUR_VERCEL_TOKEN" | gcloud secrets create VERCEL_API_TOKEN --data-file=-
   echo -n "YOUR_TEAM_ID" | gcloud secrets create VERCEL_TEAM_ID --data-file=- # Optional
   
   # API keys
   echo -n "YOUR_OPENAI_KEY" | gcloud secrets create OPENAI_APIKEY_V2 --data-file=-
   echo -n "YOUR_PLACES_KEY" | gcloud secrets create GOOGLE_PLACES_API_KEY --data-file=-
   echo -n "YOUR_GA_ID" | gcloud secrets create GOOGLE_ANALYTICS_ID --data-file=-
   ```

4. **Grant service account access to secrets**
   ```bash
   # Get service account
   export SA=$(gcloud functions describe handleOnboardingSubmission --format='value(serviceAccountEmail)')
   
   # Grant access to each secret
   for secret in GITHUB_OWNER_V2 GITHUB_TEMPLATEREPO_V2 OCTOKIT_TOKEN_V2 VERCEL_API_TOKEN VERCEL_TEAM_ID OPENAI_APIKEY_V2 GOOGLE_PLACES_API_KEY GOOGLE_ANALYTICS_ID; do
     gcloud secrets add-iam-policy-binding $secret \
       --member="serviceAccount:${SA}" \
       --role="roles/secretmanager.secretAccessor"
   done
   ```

5. **Deploy Firebase Functions**
   ```bash
   cd functions
   npm run deploy
   ```

## Usage

### Onboarding Form Fields

- **Business Information**: Name, phone, email
- **Branding**: Primary/secondary colors, logo upload
- **Lead Delivery**: CRM integration or Zapier webhook
- **Custom Domain**: Optional custom domain configuration

### API Endpoints

#### Handle Onboarding Submission
```
POST /handleOnboardingSubmission
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "businessName": "ABC Wholesaling",
  "publicPhone": "555-1234",
  "publicEmail": "contact@abc.com",
  "primaryColor": "#1D4ED8",
  "secondaryColor": "#FBBF24",
  "hasCrm": "yes",
  "crmName": "GoHighLevel",
  "crmApiKey": "xxx",
  "customDomain": "abc.example.com"
}
```

### Firestore Document Structure

```javascript
{
  // Input data
  firstName: "John",
  lastName: "Doe",
  businessName: "ABC Wholesaling",
  // ... other form fields
  
  // System fields
  status: "pending" | "completed" | "failed",
  submittedAt: Timestamp,
  generatedAt: Timestamp,
  
  // Output data
  repoName: "landing-abc-wholesaling",
  repoUrl: "https://github.com/owner/landing-abc-wholesaling",
  vercelProjectUrl: "https://vercel.com/team/landing-abc-wholesaling",
  vercelDeploymentUrl: "https://landing-abc-wholesaling.vercel.app",
  error: null | "error message"
}
```

## Development

### Local Testing

1. **Run the frontend locally**
   ```bash
   npm run dev
   ```

2. **Test Firebase Functions locally**
   ```bash
   cd functions
   npm run serve
   ```

### Adding New Features

1. Update the onboarding form schema
2. Modify the template repository
3. Update environment variable configuration
4. Deploy changes

## Monitoring & Debugging

### Check Firebase Function Logs
```bash
firebase functions:log --only generateLanding
```

### Monitor Firestore
- Collection: `landingPages`
- Filter by status: `pending`, `completed`, `failed`

### Vercel Dashboard
- View deployment status
- Check build logs
- Monitor environment variables

## Troubleshooting

See [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for detailed troubleshooting steps.

## Future Enhancements

- [ ] Multi-language support
- [ ] A/B testing capabilities
- [ ] Advanced analytics integration
- [ ] White-label options
- [ ] Template marketplace

## License

Proprietary - Allied Advantage Ads

## Support

For support, contact: support@alliedadvantageads.com 