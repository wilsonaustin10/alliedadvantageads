# Allied Advantage Ads Landing - Agents Context

## Project Overview
Allied Advantage Ads Landing is an automated landing page system for real estate wholesaling businesses. The system has two main user flows:

1. **Lead Capture Flow**: Visitors fill out contact form → Lead goes to Go High Level CRM
2. **Client Onboarding Flow**: New clients complete comprehensive onboarding → Firebase Functions generate custom landing pages

## Architecture

### Frontend (Next.js 14)
- **Landing Page**: Public-facing lead capture with contact form
- **Onboarding Portal**: Client intake form for business setup
- **TailwindCSS**: Styling framework
- **TypeScript**: Type safety

### Backend Services
- **Contact API** (`/api/contact`): Handles lead submissions to Go High Level CRM
- **Firebase Functions**: Processes onboarding submissions and generates landing pages
- **Vercel**: Deployment and hosting platform

### Data Flow
```
Contact Form → /api/contact → Go High Level CRM
Onboarding Form → Firebase Functions → GitHub Repo Creation → Vercel Deployment
```

## Key Components

### Contact Form (`components/contact-form.tsx`)
- **Purpose**: Lead capture from website visitors
- **Fields**: Name, email, phone, company, message, package selection
- **Integration**: Go High Level CRM via API
- **Validation**: Built-in form validation with error handling
- **UX**: Real-time status updates (idle, submitting, success, error)

### Onboarding Form (`app/(default)/onboarding/page.tsx`)
- **Purpose**: Client intake for landing page generation
- **Fields**: Business info, branding, CRM integration, website details
- **Integration**: Firebase Functions for automated page generation
- **File Upload**: Logo upload to Firebase Storage
- **Complexity**: Multi-section form with conditional fields

## Technical Details

### Contact Form Features
- Form state management with React hooks
- Package selection (Landing Page $250, Google PPC $1,500/month, etc.)
- Error handling and user feedback
- Mobile-responsive design
- Accessibility considerations

### Go High Level Integration
- API endpoint: `/api/contact`
- Contact creation with custom fields
- Tag assignment for lead tracking
- Error handling and fallbacks

### Security & Performance
- Environment variables for sensitive data
- Input validation and sanitization
- Optimized form submission handling
- Rate limiting considerations

## Business Context

### Target Audience
- Real estate wholesaling businesses
- Lead generation service clients
- Small to medium-sized real estate companies

### Service Offerings
- Custom landing page creation ($250)
- Google PPC management ($1,500/month)
- Combined Google + Facebook PPC ($2,200/month)

### Success Metrics
- Lead conversion rates
- Form completion rates
- Client onboarding efficiency
- Landing page performance

## Development Considerations

### Code Quality
- TypeScript for type safety
- React best practices
- Responsive design principles
- Performance optimization

### Integration Points
- Go High Level CRM API
- Firebase Functions
- Vercel deployment
- Custom domain management

### Future Enhancements
- Multi-language support
- A/B testing capabilities
- Advanced analytics
- Template marketplace