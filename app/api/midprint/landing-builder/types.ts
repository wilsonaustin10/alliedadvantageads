export interface LandingPageConfig {
  company: {
    name: string;
    email: string;
    phone: string;
    logo?: string;
    description: string;
  };
  design: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily?: string;
  };
  components: {
    header: boolean;
    hero: boolean;
    benefits: boolean;
    testimonials: boolean;
    leadForm: boolean;
    footer: boolean;
    privacyPage: boolean;
    termsPage: boolean;
    aboutPage: boolean;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
}

export interface ComponentTemplate {
  name: string;
  html: string;
  css: string;
  js?: string;
  dependencies?: string[];
}

export interface GeneratedPage {
  html: string;
  css: string;
  js: string;
  performanceScore?: number;
  metadata: {
    generatedAt: string;
    optimizations: string[];
  };
}

export interface SystemPromptConfig {
  instructions: string;
  componentExamples: ComponentTemplate[];
  performanceGuidelines: string[];
  constraints: {
    maxFileSize: number;
    targetLoadTime: number;
    pagespeedTarget: number;
  };
}