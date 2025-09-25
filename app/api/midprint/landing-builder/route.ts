import { NextRequest, NextResponse } from 'next/server';
import { LandingPageConfig, GeneratedPage } from './types';
import { generateSystemPrompt, generatePageContent } from './prompts/system-prompt';
import { PerformanceOptimizer, validatePerformance } from './utils/optimizer';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const config: LandingPageConfig = await request.json();

    if (!config.company?.name || !config.company?.email) {
      return NextResponse.json(
        { error: 'Company name and email are required' },
        { status: 400 }
      );
    }

    // Generate system prompt with instructions for web search
    const systemPrompt = generateSystemPrompt(config);
    
    let aiGeneratedContent: string | undefined;
    
    if (OPENAI_API_KEY) {
      try {
        const openAIResponse = await callOpenAI(systemPrompt, config);
        console.log('OpenAI response received, length:', openAIResponse.length);
        aiGeneratedContent = openAIResponse;
      } catch (aiError) {
        console.error('OpenAI generation failed, using fallback:', aiError);
      }
    } else {
      console.log('No OpenAI API key found, using fallback generation');
    }

    const pageContent = generatePageContent(config, aiGeneratedContent);
    
    const optimizer = new PerformanceOptimizer(pageContent);
    const { html: optimizedHTML, optimizations } = optimizer.optimize();
    
    const validation = validatePerformance(optimizedHTML);
    
    const generatedPage: GeneratedPage = {
      html: optimizedHTML,
      css: '',
      js: '',
      performanceScore: validation.isValid ? 95 : 85,
      metadata: {
        generatedAt: new Date().toISOString(),
        optimizations
      }
    };

    return NextResponse.json({
      success: true,
      page: generatedPage,
      validation,
      preview: `/api/midprint/landing-builder/preview?id=${generatePreviewId(config)}`
    });

  } catch (error) {
    console.error('Landing page generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate landing page' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const previewId = searchParams.get('id');
  
  if (previewId) {
    const cachedPage = await getCachedPage(previewId);
    if (cachedPage) {
      return new NextResponse(cachedPage, {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }
  }

  return NextResponse.json({ 
    message: 'Landing Page Builder API',
    endpoints: {
      POST: '/api/midprint/landing-builder - Generate landing page',
      GET: '/api/midprint/landing-builder?id=xxx - Preview generated page'
    }
  });
}

async function callOpenAI(systemPrompt: string, config: LandingPageConfig): Promise<string> {
  const industry = detectIndustry(config.company.description);
  const location = extractLocation(config.company.description);
  
  // Create an industry-specific prompt that leverages the model's knowledge
  const industryEnhancedPrompt = `
You are creating a landing page for ${config.company.name}, a ${industry} business.

Business Context:
- Industry: ${industry}
- Description: ${config.company.description}
- Location: ${location || 'nationwide'}
- Target Market: ${location ? `Local customers in ${location}` : 'National audience'}

Based on your knowledge of the ${industry} industry, generate a complete, optimized landing page HTML that includes:

1. INDUSTRY-SPECIFIC CONTENT:
   - Address the top 3-5 pain points common in ${industry}
   - Highlight value propositions that resonate with ${industry} customers
   - Use terminology and messaging proven effective in ${industry}
   - Include social proof relevant to ${industry} buyers

2. COMPETITIVE POSITIONING:
   - Differentiate from typical ${industry} competitors
   - Emphasize unique strengths based on the business description
   - Use compelling headlines that stand out in the ${industry} market

3. TARGET AUDIENCE OPTIMIZATION:
   - Write for the typical ${industry} customer demographic
   - Address their specific needs, concerns, and decision factors
   - Use appropriate tone and language for ${industry} buyers

4. CONVERSION ELEMENTS:
   - Strong calls-to-action specific to ${industry} services
   - Trust signals important to ${industry} customers
   - Urgency/scarcity tactics appropriate for ${industry}

Required components to include: ${Object.keys(config.components).filter(k => config.components[k as keyof typeof config.components]).join(', ')}

Generate the complete HTML with all content specific to this ${industry} business. Do NOT use generic placeholder text - create real, compelling content based on the business description provided.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      // GPT-5 models available: 'gpt-5', 'gpt-5-mini', 'gpt-5-nano', 'gpt-5-chat-latest'
      model: 'gpt-5',  // Using highest quality GPT-5 model for best results
      messages: [
        { role: 'system', content: systemPrompt },
        { 
          role: 'user', 
          content: industryEnhancedPrompt
        }
      ],
      // GPT-5 only supports temperature: 1 (default)
      max_completion_tokens: 8000  // Increased for comprehensive content generation
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('OpenAI API Error Details:', errorData);
    throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

function detectIndustry(description: string): string {
  const desc = description.toLowerCase();
  
  const industries = {
    'real estate': ['real estate', 'property', 'homes', 'realty'],
    'legal services': ['law', 'legal', 'attorney', 'lawyer'],
    'healthcare': ['health', 'medical', 'dental', 'clinic'],
    'construction': ['construction', 'contractor', 'renovation'],
    'digital marketing': ['marketing', 'advertising', 'seo', 'digital'],
    'financial services': ['financial', 'investment', 'accounting', 'tax'],
    'technology': ['software', 'app', 'technology', 'saas'],
    'education': ['education', 'training', 'course', 'teaching']
  };

  for (const [industry, keywords] of Object.entries(industries)) {
    if (keywords.some(keyword => desc.includes(keyword))) {
      return industry;
    }
  }

  return 'professional services';
}

function extractLocation(description: string): string | null {
  // Extract location from description if mentioned
  const locationPatterns = [
    /in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
    /serving\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
    /based\s+in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/
  ];

  for (const pattern of locationPatterns) {
    const match = description.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}

function generatePreviewId(config: LandingPageConfig): string {
  const timestamp = Date.now();
  const companyHash = config.company.name.replace(/\s+/g, '-').toLowerCase();
  return `${companyHash}-${timestamp}`;
}

const pageCache = new Map<string, string>();

async function getCachedPage(id: string): Promise<string | null> {
  return pageCache.get(id) || null;
}

async function savePage(id: string, html: string): Promise<void> {
  pageCache.set(id, html);
  
  setTimeout(() => {
    pageCache.delete(id);
  }, 3600000);
}