# Landing Page Builder

A production-grade, AI-powered landing page builder that generates optimized, high-performance landing pages scoring 95+ on PageSpeed Insights.

## Features

- **AI-Powered Generation**: Integrates with OpenAI Codex for intelligent page creation
- **Performance Optimized**: Automatic optimizations for 95+ PageSpeed score
- **Modular Components**: Reusable, customizable page components
- **Real-time Validation**: Comprehensive validation and performance testing
- **Mobile-First Design**: Responsive layouts optimized for all devices
- **SEO Ready**: Built-in SEO optimizations and structured data

## Architecture

```
/app/api/midprint/landing-builder/
├── route.ts                 # Main API endpoint
├── submit/
│   └── route.ts            # Lead form submission handler
├── types.ts                # TypeScript interfaces
├── templates/
│   └── index.ts           # Component templates library
├── prompts/
│   └── system-prompt.ts   # AI prompt generation
├── utils/
│   ├── optimizer.ts       # Performance optimization
│   └── validator.ts       # Validation utilities
└── test.ts                # Test suite
```

## API Endpoints

### POST /api/midprint/landing-builder
Generate a new landing page.

**Request Body:**
```json
{
  "company": {
    "name": "Company Name",
    "email": "email@example.com",
    "phone": "123-456-7890",
    "logo": "https://example.com/logo.png",
    "description": "Business description..."
  },
  "design": {
    "primaryColor": "#3B82F6",
    "secondaryColor": "#10B981",
    "fontFamily": "Inter, sans-serif"
  },
  "components": {
    "header": true,
    "hero": true,
    "benefits": true,
    "testimonials": true,
    "leadForm": true,
    "footer": true
  },
  "seo": {
    "title": "Page Title",
    "description": "Meta description",
    "keywords": ["keyword1", "keyword2"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "page": {
    "html": "<!DOCTYPE html>...",
    "performanceScore": 95,
    "metadata": {
      "generatedAt": "2025-01-17T...",
      "optimizations": ["Inlined critical CSS", ...]
    }
  },
  "validation": {
    "isValid": true,
    "issues": [],
    "suggestions": []
  },
  "preview": "/api/midprint/landing-builder?id=xxx"
}
```

### POST /api/midprint/landing-builder/submit
Handle lead form submissions.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "123-456-7890",
  "company": "ABC Corp",
  "message": "Interested in your services"
}
```

## Frontend Usage

Navigate to `/midprint/landing-builder` to access the visual form interface.

## Component Templates

### Available Components:
- **Header**: Sticky navigation with logo and menu
- **Hero**: Eye-catching hero section with CTAs
- **Benefits**: Feature grid showcasing value propositions
- **Testimonials**: Social proof section
- **Lead Form**: Conversion-optimized contact form
- **Footer**: Complete footer with contact info and links

## Performance Optimizations

The builder automatically applies:
- Critical CSS inlining
- JavaScript deferring
- Image lazy loading
- HTML minification
- Resource hints (preconnect, dns-prefetch)
- Structured data for SEO
- Caching headers
- Mobile viewport optimization

## Environment Variables

```env
OPENAI_API_KEY=your_openai_api_key
SENDGRID_API_KEY=your_sendgrid_key
NOTIFICATION_EMAIL=leads@company.com
```

## Testing

Run the test suite:
```bash
npx ts-node app/api/midprint/landing-builder/test.ts
```

## Performance Targets

- First Contentful Paint (FCP) < 1.8s
- Largest Contentful Paint (LCP) < 2.5s
- Cumulative Layout Shift (CLS) < 0.1
- First Input Delay (FID) < 100ms
- Time to Interactive (TTI) < 3.8s
- PageSpeed Score: 95+

## Customization

### Adding New Components

1. Add template to `/templates/index.ts`
2. Update component types in `types.ts`
3. Include in system prompt generation
4. Add to frontend form options

### Modifying Optimization Rules

Edit `/utils/optimizer.ts` to adjust:
- Critical CSS extraction
- Minification rules
- Performance thresholds
- Resource hints

## Best Practices

1. **Always validate input** before generation
2. **Monitor API usage** to control costs
3. **Cache generated pages** for reuse
4. **Test on real devices** for performance
5. **Keep templates lean** and optimized

## Troubleshooting

### Low Performance Scores
- Check HTML size (should be < 150KB)
- Verify critical CSS is inlined
- Ensure images have dimensions
- Validate defer attributes on scripts

### Generation Failures
- Verify API keys are set
- Check input validation errors
- Review OpenAI API limits
- Use fallback generation if AI fails

## Security Considerations

- Input sanitization for all user data
- Rate limiting on API endpoints
- Secure storage of generated pages
- Email validation for submissions
- XSS protection in generated HTML

## Future Enhancements

- A/B testing capabilities
- Analytics integration
- Template marketplace
- Visual drag-and-drop editor
- Multi-language support
- Advanced AI customization