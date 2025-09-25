import { SystemPromptConfig, ComponentTemplate, LandingPageConfig } from '../types';
import { allTemplates } from '../templates';

export function generateSystemPrompt(config: LandingPageConfig): string {
  const systemPromptConfig: SystemPromptConfig = {
    instructions: `You are an expert landing page developer specializing in creating high-performance, conversion-optimized pages that score 95+ on PageSpeed Insights.

EXPERTISE: You have deep knowledge of:
- Industry-specific pain points and solutions across all major sectors
- Proven conversion optimization strategies for different industries
- Effective messaging and positioning for various target audiences
- Current market trends and best practices (as of 2025)
- Local and national market dynamics

CRITICAL LAYOUT REQUIREMENTS:
1. LEAD FORM PLACEMENT: The lead capture form MUST be placed above the fold on both desktop and mobile
2. For mobile (max-width: 768px): Form should appear immediately after hero section
3. For desktop: Form can be in hero section or immediately below, but MUST be visible without scrolling
4. Hero section height should not exceed 60vh to ensure form visibility

CONTENT GENERATION REQUIREMENTS:
You MUST generate specific, relevant content based on the business description provided. DO NOT use generic placeholders.
- Analyze the business description: ${config.company.description}
- Generate benefits that directly relate to the specific services/products offered
- Create testimonials that mention actual services, pain points, and results relevant to this business
- Write headlines that incorporate the actual business offering, not generic welcomes
- Use industry-specific terminology and value propositions

SPECIAL HANDLING FOR REAL ESTATE WHOLESALING/CASH BUYERS:
If the business description mentions "wholesaling", "cash buyers", "we buy houses", "sell fast", or similar terms:
- Focus on SPEED (7-14 day closings), CASH offers, NO repairs needed, NO fees/commissions
- Headlines should emphasize urgency: "Sell Your House Fast for Cash", "Get Your Cash Offer Today"
- Benefits must include: Fast closing, No repairs needed, No fees, Cash payment, Any condition
- Avoid generic real estate agent language about "finding dream homes" or "maximizing ROI"
- Use emotional triggers: foreclosure avoidance, inherited property, divorce, relocation
- Include trust signals: "Local", "Family-owned", "BBB Accredited", years in business

COMPANY CONTEXT:
- Name: ${config.company.name}
- Email: ${config.company.email}
- Phone: ${config.company.phone}
- Business Description: ${config.company.description}

CRITICAL PERFORMANCE REQUIREMENTS:
1. Inline critical CSS in <head>
2. Defer non-critical JavaScript
3. Use lazy loading for images below the fold
4. Implement efficient caching headers
5. Minimize DOM size and complexity
6. Use modern image formats (WebP with fallbacks)
7. Implement resource hints (preconnect, prefetch)
8. Ensure text remains visible during webfont load

DESIGN REQUIREMENTS:
- Primary Color: ${config.design.primaryColor}
- Secondary Color: ${config.design.secondaryColor}
- Font Family: ${config.design.fontFamily || 'system-ui, -apple-system, sans-serif'}

Generate a complete, production-ready landing page with the following components:
${Object.entries(config.components).filter(([_, enabled]) => enabled).map(([name]) => `- ${name}`).join('\n')}

IMPORTANT: 
- All CSS should be minified and inlined for critical styles
- JavaScript should be minimal and deferred when possible
- Images should include width/height attributes to prevent CLS
- Use semantic HTML5 elements
- Ensure WCAG 2.1 AA accessibility compliance
- Mobile-first responsive design
- Form MUST be above the fold on all devices`,
    componentExamples: Object.values(allTemplates),
    performanceGuidelines: [
      'First Contentful Paint (FCP) < 1.8s',
      'Largest Contentful Paint (LCP) < 2.5s',
      'Cumulative Layout Shift (CLS) < 0.1',
      'First Input Delay (FID) < 100ms',
      'Time to Interactive (TTI) < 3.8s',
      'Total Blocking Time (TBT) < 200ms'
    ],
    constraints: {
      maxFileSize: 150000,
      targetLoadTime: 2000,
      pagespeedTarget: 95
    }
  };

  return createPromptWithExamples(systemPromptConfig);
}

function createPromptWithExamples(config: SystemPromptConfig): string {
  // Only include essential component structure, not full examples to save tokens
  const componentSummary = config.componentExamples
    .slice(0, 3) // Only include first 3 components as examples
    .map(template => `- ${template.name}: ${template.html.substring(0, 100)}...`)
    .join('\n');

  return `${config.instructions}

## KEY COMPONENTS STRUCTURE:
${componentSummary}

## CRITICAL LAYOUT RULES:
1. HERO SECTION: Keep concise with max-height: 60vh to ensure form visibility
2. LEAD FORM: Must appear immediately after hero on mobile, beside or below hero on desktop
3. Component order for optimal conversion:
   - Header (sticky navigation)
   - Hero (with CTA pointing to form)  
   - Lead Form (MUST BE VISIBLE WITHOUT SCROLLING)
   - Benefits (specific to the business)
   - Testimonials (relevant to services offered)
   - Footer

## CONTENT GENERATION GUIDELINES:
- DO NOT use generic text like "Outstanding service" or "Exceptional results"
- ANALYZE the business description and extract specific services, target audience, and value props
- Benefits must address specific pain points related to the business
- Testimonials should reference actual services and measurable outcomes
- Headlines should incorporate the core business offering

VARY YOUR OUTPUT:
- Use different benefit structures each time (icons, numbers, checkmarks)
- Rotate between different testimonial formats and personas
- Vary headline formulas: benefit-driven, problem-solution, urgency-based
- Mix formal and conversational tones based on the industry
- Use different color schemes and layouts within the brand colors
- Include varying calls-to-action: "Get Your Offer", "Start Now", "Claim Your Quote"

## CRITICAL REQUIREMENTS:
- Inline critical CSS in <head>
- Defer JavaScript
- Add loading="lazy" to images below fold only
- Include viewport meta tag
- Minimize HTML size
- Mobile-first responsive design
- Form MUST be above the fold

Generate a complete HTML page with all requested components. Prioritize form visibility and business-specific content.`;
}

export function generatePageContent(
  config: LandingPageConfig,
  aiResponse?: string
): string {
  const benefits = generateBenefitsFromDescription(config.company.description);
  const testimonials = generateTestimonials(config.company.description);
  
  const replacements = {
    '{{companyName}}': config.company.name,
    '{{email}}': config.company.email,
    '{{phone}}': config.company.phone,
    '{{logo}}': config.company.logo || '',
    '{{primaryColor}}': config.design.primaryColor,
    '{{secondaryColor}}': config.design.secondaryColor,
    '{{year}}': new Date().getFullYear().toString(),
    '{{companyDescription}}': config.company.description.substring(0, 150) + '...',
    '{{headline}}': generateHeadline(config.company.name, config.company.description),
    '{{subheadline}}': generateSubheadline(config.company.description)
  };

  if (aiResponse) {
    return processAIResponse(aiResponse, replacements);
  }

  return generateFallbackPage(config, replacements, benefits, testimonials);
}

function generateBenefitsFromDescription(description: string): any[] {
  const keywords = description.toLowerCase();
  const benefits = [];

  // Extract key business areas from description
  const isWholesaling = keywords.includes('wholesale') || keywords.includes('cash') || keywords.includes('we buy') || 
                        keywords.includes('sell fast') || keywords.includes('quick sale') || keywords.includes('as-is') ||
                        keywords.includes('no repairs') || keywords.includes('investor');
  const isRealEstate = (keywords.includes('real estate') || keywords.includes('property') || keywords.includes('homes')) && !isWholesaling;
  const isLegal = keywords.includes('law') || keywords.includes('legal') || keywords.includes('attorney');
  const isFinancial = keywords.includes('financial') || keywords.includes('investment') || keywords.includes('accounting');
  const isHealth = keywords.includes('health') || keywords.includes('medical') || keywords.includes('dental');
  const isConstruction = keywords.includes('construction') || keywords.includes('contractor') || keywords.includes('renovation');
  const isMarketing = keywords.includes('marketing') || keywords.includes('advertising') || keywords.includes('seo');
  
  // Generate industry-specific benefits
  if (isWholesaling) {
    const wholesaleBenefits = [
      [
        { icon: '💵', title: 'Cash Offer in 24 Hours', description: 'Get a fair, no-obligation cash offer for your property within one business day.' },
        { icon: '⚡', title: 'Close in 7 Days', description: 'Skip the traditional selling process and close in as little as 7 days or on your timeline.' },
        { icon: '🔧', title: 'No Repairs Needed', description: 'We buy houses as-is. No need to fix anything or even clean.' },
        { icon: '❌', title: 'Zero Fees or Commissions', description: 'Keep more money in your pocket - no agent fees, no closing costs.' },
        { icon: '🏠', title: 'Any Condition Accepted', description: 'Fire damage, foundation issues, or perfect condition - we buy it all.' },
        { icon: '🤝', title: 'Guaranteed Sale', description: 'No showings, no waiting, no uncertainty - guaranteed closing.' }
      ],
      [
        { icon: '📞', title: 'Simple 3-Step Process', description: 'Call us, get your offer, choose your closing date - it\'s that easy.' },
        { icon: '🏡', title: 'We Buy ANY House', description: 'Inherited property, facing foreclosure, divorce - we handle all situations.' },
        { icon: '✅', title: 'No Obligation Offer', description: 'Get your free cash offer with absolutely no pressure to accept.' },
        { icon: '🔐', title: '100% Confidential', description: 'Your situation stays private - no signs, no listings, no nosy neighbors.' },
        { icon: '📅', title: 'You Pick Closing Date', description: 'Need time to move? We work on YOUR schedule, not ours.' },
        { icon: '💳', title: 'We Cover Closing Costs', description: 'We pay all closing costs and fees - you pay nothing out of pocket.' }
      ]
    ];
    
    // Randomly select a set of benefits for variety
    const selectedSet = wholesaleBenefits[Math.floor(Math.random() * wholesaleBenefits.length)];
    // Randomly select 3-4 benefits
    const numBenefits = Math.random() > 0.5 ? 4 : 3;
    const shuffled = selectedSet.sort(() => 0.5 - Math.random());
    benefits.push(...shuffled.slice(0, numBenefits));
  } else if (isRealEstate) {
    benefits.push({
      icon: '🏠',
      title: 'Expert Market Analysis',
      description: 'Get accurate property valuations and market insights to make informed decisions.'
    });
    benefits.push({
      icon: '📈',
      title: 'Maximum ROI',
      description: 'Strategic pricing and marketing to ensure the best return on your property investment.'
    });
    benefits.push({
      icon: '🔑',
      title: 'Seamless Transactions',
      description: 'Navigate complex paperwork and negotiations with our experienced team.'
    });
  } else if (isLegal) {
    benefits.push({
      icon: '⚖️',
      title: 'Proven Legal Expertise',
      description: 'Years of experience in successful case resolutions and legal representation.'
    });
    benefits.push({
      icon: '🛡️',
      title: 'Protected Interests',
      description: 'Aggressive advocacy to safeguard your rights and achieve favorable outcomes.'
    });
    benefits.push({
      icon: '📋',
      title: 'Clear Communication',
      description: 'Complex legal matters explained in terms you understand, every step of the way.'
    });
  } else if (isFinancial) {
    benefits.push({
      icon: '💼',
      title: 'Strategic Financial Planning',
      description: 'Customized strategies to grow wealth and minimize tax liabilities.'
    });
    benefits.push({
      icon: '📊',
      title: 'Data-Driven Insights',
      description: 'Advanced analytics to optimize your portfolio and financial decisions.'
    });
    benefits.push({
      icon: '🔒',
      title: 'Secure & Compliant',
      description: 'Full regulatory compliance with bank-level security for your financial data.'
    });
  } else if (isHealth) {
    benefits.push({
      icon: '👨‍⚕️',
      title: 'Board-Certified Specialists',
      description: 'Treatment from highly qualified medical professionals with proven track records.'
    });
    benefits.push({
      icon: '🏥',
      title: 'State-of-the-Art Facilities',
      description: 'Latest medical technology and equipment for accurate diagnosis and treatment.'
    });
    benefits.push({
      icon: '❤️',
      title: 'Patient-Centered Care',
      description: 'Personalized treatment plans focused on your comfort and recovery.'
    });
  } else if (isConstruction) {
    benefits.push({
      icon: '🏗️',
      title: 'Licensed & Insured',
      description: 'Fully licensed contractors with comprehensive insurance for your peace of mind.'
    });
    benefits.push({
      icon: '📐',
      title: 'Precision Craftsmanship',
      description: 'Attention to detail and quality materials that ensure lasting results.'
    });
    benefits.push({
      icon: '⏰',
      title: 'On-Time Completion',
      description: 'Projects delivered on schedule with transparent milestone tracking.'
    });
  } else if (isMarketing) {
    benefits.push({
      icon: '🚀',
      title: 'Proven Growth Strategies',
      description: 'Data-backed campaigns that drive measurable increases in leads and revenue.'
    });
    benefits.push({
      icon: '🎯',
      title: 'Targeted Audience Reach',
      description: 'Precision targeting to connect with your ideal customers at the right time.'
    });
    benefits.push({
      icon: '📈',
      title: 'ROI-Focused Campaigns',
      description: 'Every dollar optimized for maximum return with detailed performance tracking.'
    });
  } else {
    // More intelligent generic benefits based on common keywords
    if (keywords.includes('fast') || keywords.includes('quick') || keywords.includes('rapid')) {
      benefits.push({
        icon: '⚡',
        title: 'Rapid Implementation',
        description: `Industry-leading turnaround times without compromising quality standards.`
      });
    }
    if (keywords.includes('custom') || keywords.includes('personalized') || keywords.includes('tailored')) {
      benefits.push({
        icon: '🎨',
        title: 'Customized Solutions',
        description: 'Tailored specifically to your unique requirements and business goals.'
      });
    }
    if (keywords.includes('expert') || keywords.includes('professional') || keywords.includes('experienced')) {
      benefits.push({
        icon: '🏆',
        title: 'Industry Expertise',
        description: 'Decades of combined experience delivering exceptional results.'
      });
    }
    if (keywords.includes('support') || keywords.includes('service')) {
      benefits.push({
        icon: '🤝',
        title: 'Dedicated Support Team',
        description: 'Responsive assistance whenever you need it, with real people who care.'
      });
    }
    if (keywords.includes('affordable') || keywords.includes('price') || keywords.includes('cost')) {
      benefits.push({
        icon: '💎',
        title: 'Transparent Value Pricing',
        description: 'Competitive rates with no hidden fees - know exactly what you\'re paying for.'
      });
    }
  }

  // Fill remaining slots with relevant benefits
  while (benefits.length < 3) {
    const remainingBenefits = [
      { icon: '✅', title: 'Guaranteed Satisfaction', description: 'We stand behind our work with comprehensive guarantees.' },
      { icon: '🏅', title: 'Award-Winning Service', description: 'Recognized for excellence in our industry.' },
      { icon: '📞', title: 'Free Consultation', description: 'No-obligation assessment to understand your needs.' }
    ];
    benefits.push(remainingBenefits[benefits.length]);
  }

  return benefits.slice(0, 3);
}

function generateTestimonials(description?: string): any[] {
  const keywords = description?.toLowerCase() || '';
  
  // Check for wholesaling/cash buyer keywords
  const isWholesaling = keywords.includes('wholesale') || keywords.includes('cash') || keywords.includes('we buy') || 
                        keywords.includes('sell fast') || keywords.includes('quick sale') || keywords.includes('as-is') ||
                        keywords.includes('no repairs') || keywords.includes('investor');
  
  // Industry-specific testimonials
  if (isWholesaling) {
    const wholesaleTestimonials = [
      [
        { quote: 'Facing foreclosure and they closed in just 5 days. Saved my credit and gave me a fresh start!', name: 'Maria Thompson', title: 'Homeowner' },
        { quote: 'Inherited a house in terrible condition. They bought it as-is and handled everything. So relieved!', name: 'Robert Williams', title: 'Executor' },
        { quote: 'Divorce was hard enough. They made selling the house simple - cash offer in 24 hours, closed in a week.', name: 'Jennifer Davis', title: 'Seller' },
        { quote: 'Relocated for work with no time to sell traditionally. They bought my house and I didn\'t pay any fees!', name: 'David Chen', title: 'Professional' },
        { quote: 'House needed $50k in repairs I couldn\'t afford. They bought it anyway and paid cash!', name: 'Sandra Miller', title: 'Retired' }
      ],
      [
        { quote: 'Was 3 months behind on mortgage. They paid off my loan and gave me cash to start over.', name: 'James Martinez', title: 'Homeowner' },
        { quote: 'Tried selling with a realtor for 6 months. These guys bought it in 10 days - wish I called sooner!', name: 'Patricia Wilson', title: 'Seller' },
        { quote: 'Foundation issues scared away other buyers. They didn\'t even blink - full cash offer as promised.', name: 'Michael Brown', title: 'Homeowner' },
        { quote: 'Needed to sell mom\'s house quickly for medical bills. Fair offer and they handled all the paperwork.', name: 'Lisa Anderson', title: 'Daughter' },
        { quote: 'Bad tenants destroyed my rental. They bought it with all the damage and closed super fast.', name: 'Thomas Garcia', title: 'Landlord' }
      ]
    ];
    
    const selectedSet = wholesaleTestimonials[Math.floor(Math.random() * wholesaleTestimonials.length)];
    const shuffled = selectedSet.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  } else if (keywords.includes('real estate') || keywords.includes('property')) {
    return [
      {
        quote: 'Sold our home in just 14 days above asking price. Their market knowledge is unmatched!',
        name: 'Sarah Johnson',
        title: 'Homeowner'
      },
      {
        quote: 'Found us the perfect investment property with 12% annual ROI. Exceptional guidance throughout.',
        name: 'Michael Chen',
        title: 'Real Estate Investor'
      },
      {
        quote: 'Smooth transaction from start to finish. They handled all negotiations expertly.',
        name: 'Emily Rodriguez',
        title: 'First-Time Buyer'
      }
    ];
  } else if (keywords.includes('law') || keywords.includes('legal') || keywords.includes('attorney')) {
    return [
      {
        quote: 'Won our case with a settlement 3x what we expected. Incredible legal strategy and execution.',
        name: 'David Thompson',
        title: 'Business Owner'
      },
      {
        quote: 'They saved our company from a costly lawsuit. Worth every penny for the peace of mind.',
        name: 'Jennifer Martinez',
        title: 'CEO, Tech Startup'
      },
      {
        quote: 'Complex contract negotiations made simple. They protected our interests perfectly.',
        name: 'Robert Williams',
        title: 'CFO'
      }
    ];
  } else if (keywords.includes('marketing') || keywords.includes('advertising') || keywords.includes('seo')) {
    return [
      {
        quote: 'Increased our leads by 250% in 3 months. The ROI tracking dashboard is game-changing.',
        name: 'Lisa Anderson',
        title: 'E-commerce Director'
      },
      {
        quote: 'Our Google rankings went from page 5 to #1. Sales have doubled since we started.',
        name: 'James Wilson',
        title: 'Small Business Owner'
      },
      {
        quote: 'Cut our customer acquisition cost by 60% while scaling revenue. Brilliant strategy!',
        name: 'Amanda Foster',
        title: 'CMO, SaaS Company'
      }
    ];
  } else if (keywords.includes('construction') || keywords.includes('contractor') || keywords.includes('renovation')) {
    return [
      {
        quote: 'Completed our kitchen remodel 2 weeks early and under budget. Stunning results!',
        name: 'Patricia Davis',
        title: 'Homeowner'
      },
      {
        quote: 'Built our custom home exactly to specifications. Quality craftsmanship throughout.',
        name: 'Steven Miller',
        title: 'Property Developer'
      },
      {
        quote: 'Office renovation transformed our workspace. Employees love the new environment!',
        name: 'Michelle Brown',
        title: 'Operations Manager'
      }
    ];
  } else if (keywords.includes('financial') || keywords.includes('investment') || keywords.includes('accounting')) {
    return [
      {
        quote: 'Saved us $45,000 in taxes last year alone. Their strategies are incredibly effective.',
        name: 'Richard Hayes',
        title: 'Business Owner'
      },
      {
        quote: 'Portfolio grew 35% in 18 months. They truly understand risk management.',
        name: 'Carol Thompson',
        title: 'Retired Executive'
      },
      {
        quote: 'Streamlined our accounting processes and improved cash flow by 40%.',
        name: 'Daniel Kim',
        title: 'CFO, Manufacturing'
      }
    ];
  } else if (keywords.includes('health') || keywords.includes('medical') || keywords.includes('dental')) {
    return [
      {
        quote: 'Life-changing treatment with compassionate care. Feeling better than I have in years!',
        name: 'Margaret White',
        title: 'Patient'
      },
      {
        quote: 'Accurate diagnosis when others couldn\'t help. The expertise here is exceptional.',
        name: 'John Davidson',
        title: 'Patient'
      },
      {
        quote: 'Pain-free procedure and rapid recovery. The staff made me feel completely at ease.',
        name: 'Susan Clark',
        title: 'Patient'
      }
    ];
  }
  
  // Improved generic testimonials
  return [
    {
      quote: 'Exceeded every expectation we had. The results speak for themselves - 40% improvement in efficiency.',
      name: 'Alexandra Chen',
      title: 'Operations Director'
    },
    {
      quote: 'Professional team that delivered on time and on budget. Would absolutely work with them again.',
      name: 'Marcus Johnson',
      title: 'Project Manager'
    },
    {
      quote: 'Transformed our business operations. The cost savings alone paid for the investment in 6 months.',
      name: 'Rachel Martinez',
      title: 'Business Owner'
    }
  ];
}

function generateHeadline(companyName: string, description: string): string {
  const keywords = description.toLowerCase();
  
  // Check for wholesaling/cash buyer keywords
  const isWholesaling = keywords.includes('wholesale') || keywords.includes('cash') || keywords.includes('we buy') || 
                        keywords.includes('sell fast') || keywords.includes('quick sale') || keywords.includes('as-is') ||
                        keywords.includes('no repairs') || keywords.includes('investor');
  
  // Extract the main value proposition from the description
  if (isWholesaling) {
    const headlines = [
      'Sell Your House Fast for Cash - Get Your Offer Today',
      'We Buy Houses As-Is for Cash in 7 Days',
      'Need to Sell Your House Fast? Cash Offer in 24 Hours',
      'Get a Fair Cash Offer for Your House Today',
      'Sell Your House Without Repairs, Fees, or Hassles',
      'Fast Cash for Your House - Any Condition',
      'Stop Foreclosure - We Buy Houses Fast for Cash',
      'Inherited a House? We Buy for Cash, As-Is'
    ];
    return headlines[Math.floor(Math.random() * headlines.length)];
  } else if (keywords.includes('real estate')) {
    return `Your Trusted ${companyName} Real Estate Partner`;
  } else if (keywords.includes('law') || keywords.includes('attorney')) {
    return `Expert Legal Representation from ${companyName}`;
  } else if (keywords.includes('marketing') || keywords.includes('seo')) {
    return `Grow Your Business with ${companyName}`;
  } else if (keywords.includes('construction') || keywords.includes('contractor')) {
    return `Quality Construction by ${companyName}`;
  } else if (keywords.includes('financial') || keywords.includes('accounting')) {
    return `Financial Excellence with ${companyName}`;
  } else if (keywords.includes('health') || keywords.includes('medical')) {
    return `Your Health is Our Priority at ${companyName}`;
  }
  
  // Extract the first meaningful phrase from description
  const sentences = description.split(/[.!?]/);
  const firstSentence = sentences[0]?.trim() || description;
  
  // If description starts with company name, use it as is
  if (firstSentence.toLowerCase().includes(companyName.toLowerCase())) {
    return firstSentence.substring(0, 80);
  }
  
  // Otherwise create a headline from the core offering
  const coreOffering = firstSentence.substring(0, 50);
  return `${companyName} - ${coreOffering}${coreOffering.length === 50 ? '...' : ''}`;
}

function generateSubheadline(description: string): string {
  const keywords = description.toLowerCase();
  
  // Check for wholesaling/cash buyer keywords
  const isWholesaling = keywords.includes('wholesale') || keywords.includes('cash') || keywords.includes('we buy') || 
                        keywords.includes('sell fast') || keywords.includes('quick sale') || keywords.includes('as-is') ||
                        keywords.includes('no repairs') || keywords.includes('investor');
  
  // Generate action-oriented subheadlines based on industry
  if (isWholesaling) {
    const subheadlines = [
      'We buy houses in any condition Nationwide. Get a fair cash offer in as little as 7 days - no repairs, no fees, and we cover closing costs.',
      'Skip the hassle of listing. No repairs, no showings, no months of waiting. Get your cash offer today and close on your timeline.',
      'Facing foreclosure? Inherited property? Divorce? We buy houses fast for cash in any situation. Call now for your free, no-obligation offer.',
      'No agents, no fees, no repairs needed. We buy your house as-is and pay all closing costs. Get your cash offer in 24 hours.',
      'Behind on payments? Need to relocate? We can help. Fast cash offers for houses in any condition. Close in as little as 7 days.',
      'Sell your house the easy way. We pay cash, handle all the paperwork, and close on your schedule. No obligations, no pressure.'
    ];
    return subheadlines[Math.floor(Math.random() * subheadlines.length)];
  } else if (keywords.includes('real estate')) {
    return 'Find your dream property or maximize your investment returns with our expert guidance.';
  } else if (keywords.includes('law') || keywords.includes('attorney')) {
    return 'Protecting your rights and interests with experienced legal counsel you can trust.';
  } else if (keywords.includes('marketing') || keywords.includes('seo')) {
    return 'Data-driven strategies that deliver measurable growth for your business.';
  } else if (keywords.includes('construction') || keywords.includes('contractor')) {
    return 'From concept to completion, we build with quality and precision.';
  } else if (keywords.includes('financial') || keywords.includes('accounting')) {
    return 'Strategic financial solutions to secure and grow your wealth.';
  } else if (keywords.includes('health') || keywords.includes('medical')) {
    return 'Comprehensive healthcare services with a personal touch.';
  }
  
  // Extract key value propositions from description
  const sentences = description.split(/[.!?]/);
  
  // Look for sentences that describe benefits or value
  for (const sentence of sentences) {
    const s = sentence.trim();
    if (s.length > 40 && s.length < 120) {
      // Good length for a subheadline
      if (s.match(/\b(help|provide|deliver|offer|specialize|expert|professional|quality|trusted)\b/i)) {
        return s;
      }
    }
  }
  
  // If no good match, use a refined version of the description
  const refined = description
    .replace(/^(We are|We're|Our company is|Our business is)/i, '')
    .trim();
  
  return refined.length > 120 
    ? refined.substring(0, 117) + '...'
    : refined;
}

function processAIResponse(response: string, replacements: Record<string, string>): string {
  let processed = response;
  for (const [key, value] of Object.entries(replacements)) {
    processed = processed.replace(new RegExp(key, 'g'), value);
  }
  return processed;
}

function generateFallbackPage(
  config: LandingPageConfig,
  replacements: Record<string, string>,
  benefits: any[],
  testimonials: any[]
): string {
  // Process each template and replace placeholders
  const processTemplate = (template: string): string => {
    let processed = template;
    
    // Replace all placeholders with actual values
    for (const [key, value] of Object.entries(replacements)) {
      processed = processed.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), value);
    }
    
    // Handle benefits section
    if (processed.includes('{{#each benefits}}')) {
      const benefitsHtml = benefits.map(b => `
        <div class="lp-benefit-card">
          <div class="lp-benefit-icon">${b.icon}</div>
          <h3>${b.title}</h3>
          <p>${b.description}</p>
        </div>
      `).join('');
      processed = processed.replace(/\{\{#each benefits\}\}[\s\S]*?\{\{\/each\}\}/g, benefitsHtml);
    }
    
    // Handle testimonials section
    if (processed.includes('{{#each testimonials}}')) {
      const testimonialsHtml = testimonials.map(t => `
        <div class="lp-testimonial">
          <div class="lp-stars">★★★★★</div>
          <blockquote>"${t.quote}"</blockquote>
          <cite>
            <strong>${t.name}</strong>
            <span>${t.title}</span>
          </cite>
        </div>
      `).join('');
      processed = processed.replace(/\{\{#each testimonials\}\}[\s\S]*?\{\{\/each\}\}/g, testimonialsHtml);
    }
    
    // Handle conditional logo
    if (processed.includes('{{#if logo}}')) {
      if (config.company.logo) {
        processed = processed.replace(
          /\{\{#if logo\}\}[\s\S]*?\{\{else\}\}[\s\S]*?\{\{\/if\}\}/g,
          `<img src="${config.company.logo}" alt="${config.company.name}" width="150" height="50" loading="eager">`
        );
      } else {
        processed = processed.replace(
          /\{\{#if logo\}\}[\s\S]*?\{\{else\}\}([\s\S]*?)\{\{\/if\}\}/g,
          `<span class="lp-logo-text">${config.company.name}</span>`
        );
      }
    }
    
    return processed;
  };

  // Process CSS to replace color variables
  const processCSS = (css: string): string => {
    return css
      .replace(/\{\{primaryColor\}\}/g, config.design.primaryColor)
      .replace(/\{\{secondaryColor\}\}/g, config.design.secondaryColor);
  };

  // Build the complete HTML
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.company.name} - ${config.seo?.title || 'Welcome'}</title>
    <meta name="description" content="${config.seo?.description || config.company.description}">
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: ${config.design.fontFamily || 'system-ui, -apple-system, sans-serif'}; }
      .lp-container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
      ${Object.values(allTemplates).map(t => processCSS(t.css)).join('\n')}
    </style>
</head>
<body>
    ${config.components.header ? processTemplate(allTemplates.header.html) : ''}
    ${config.components.hero ? processTemplate(allTemplates.hero.html) : ''}
    ${config.components.benefits ? processTemplate(allTemplates.benefits.html) : ''}
    ${config.components.testimonials ? processTemplate(allTemplates.testimonials.html) : ''}
    ${config.components.leadForm ? processTemplate(allTemplates.leadForm.html) : ''}
    ${config.components.footer ? processTemplate(allTemplates.footer.html) : ''}
    
    <script defer>
      ${Object.values(allTemplates).map(t => t.js || '').filter(js => js).join('\n')}
    </script>
</body>
</html>`;

  return html;
}