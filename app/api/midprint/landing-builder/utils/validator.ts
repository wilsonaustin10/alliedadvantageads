import { LandingPageConfig } from '../types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  score: number;
}

export class LandingPageValidator {
  private config: LandingPageConfig;
  private html: string;

  constructor(config: LandingPageConfig, html?: string) {
    this.config = config;
    this.html = html || '';
  }

  validate(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    this.validateCompanyInfo(errors, warnings);
    this.validateDesign(errors, warnings);
    this.validateComponents(errors, warnings);
    this.validateSEO(warnings);
    
    if (this.html) {
      this.validateHTML(errors, warnings);
      this.validatePerformance(errors, warnings);
      this.validateAccessibility(errors, warnings);
    }

    score = this.calculateScore(errors, warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      score
    };
  }

  private validateCompanyInfo(errors: string[], warnings: string[]): void {
    if (!this.config.company.name?.trim()) {
      errors.push('Company name is required');
    }

    if (!this.config.company.email?.trim()) {
      errors.push('Company email is required');
    } else if (!this.isValidEmail(this.config.company.email)) {
      errors.push('Invalid email format');
    }

    if (!this.config.company.phone?.trim()) {
      errors.push('Company phone is required');
    } else if (!this.isValidPhone(this.config.company.phone)) {
      warnings.push('Phone number format may be invalid');
    }

    if (!this.config.company.description?.trim()) {
      errors.push('Company description is required');
    } else if (this.config.company.description.length < 50) {
      warnings.push('Company description is too short (min 50 characters for better context)');
    }

    if (this.config.company.logo && !this.isValidURL(this.config.company.logo)) {
      warnings.push('Logo URL may be invalid');
    }
  }

  private validateDesign(errors: string[], warnings: string[]): void {
    if (!this.isValidColor(this.config.design.primaryColor)) {
      errors.push('Invalid primary color format');
    }

    if (!this.isValidColor(this.config.design.secondaryColor)) {
      errors.push('Invalid secondary color format');
    }

    const contrast = this.calculateColorContrast(
      this.config.design.primaryColor,
      '#ffffff'
    );
    
    if (contrast < 4.5) {
      warnings.push('Primary color may have insufficient contrast with white text');
    }
  }

  private validateComponents(errors: string[], warnings: string[]): void {
    const activeComponents = Object.entries(this.config.components)
      .filter(([_, enabled]) => enabled);

    if (activeComponents.length === 0) {
      errors.push('At least one component must be selected');
    }

    if (!this.config.components.leadForm && !this.config.components.footer) {
      warnings.push('No contact method selected (consider adding lead form or footer)');
    }

    if (this.config.components.testimonials && !this.config.company.description.length) {
      warnings.push('Testimonials work better with detailed business description');
    }
  }

  private validateSEO(warnings: string[]): void {
    if (!this.config.seo?.title) {
      warnings.push('SEO title is recommended for better search visibility');
    } else if (this.config.seo.title.length > 60) {
      warnings.push('SEO title is too long (max 60 characters)');
    }

    if (!this.config.seo?.description) {
      warnings.push('Meta description is recommended for better search results');
    } else if (this.config.seo.description.length > 160) {
      warnings.push('Meta description is too long (max 160 characters)');
    }
  }

  private validateHTML(errors: string[], warnings: string[]): void {
    if (!this.html.includes('<!DOCTYPE html>')) {
      errors.push('Missing DOCTYPE declaration');
    }

    if (!this.html.includes('<meta name="viewport"')) {
      errors.push('Missing viewport meta tag (required for mobile)');
    }

    if (!this.html.includes('<title>')) {
      errors.push('Missing title tag');
    }

    const htmlSize = new Blob([this.html]).size;
    if (htmlSize > 200000) {
      warnings.push(`HTML size (${(htmlSize / 1000).toFixed(1)}KB) exceeds recommended 200KB`);
    }

    if (!this.html.includes('lang=')) {
      warnings.push('Missing language attribute on HTML tag');
    }

    const scriptTags = (this.html.match(/<script/g) || []).length;
    if (scriptTags > 5) {
      warnings.push(`Too many script tags (${scriptTags}) may impact performance`);
    }
  }

  private validatePerformance(errors: string[], warnings: string[]): void {
    if (!this.html.includes('loading="lazy"') && this.html.includes('<img')) {
      warnings.push('Images should use lazy loading for better performance');
    }

    if (!this.html.includes('defer') && this.html.includes('<script')) {
      warnings.push('Scripts should be deferred for better performance');
    }

    if (!this.html.includes('preconnect') && !this.html.includes('dns-prefetch')) {
      warnings.push('Consider adding resource hints for external domains');
    }

    const inlineStyles = (this.html.match(/<style>/g) || []).length;
    if (inlineStyles === 0) {
      warnings.push('No inline critical CSS found');
    }

    if (!this.html.includes('font-display')) {
      warnings.push('Web fonts should use font-display for better text rendering');
    }
  }

  private validateAccessibility(errors: string[], warnings: string[]): void {
    const images = this.html.match(/<img[^>]*>/g) || [];
    for (const img of images) {
      if (!img.includes('alt=')) {
        errors.push('Images must have alt attributes for accessibility');
        break;
      }
    }

    const inputs = this.html.match(/<input[^>]*>/g) || [];
    const labels = this.html.match(/<label[^>]*>/g) || [];
    if (inputs.length > labels.length) {
      warnings.push('Form inputs should have associated labels');
    }

    if (!this.html.includes('aria-')) {
      warnings.push('Consider adding ARIA attributes for better screen reader support');
    }

    const headings = this.html.match(/<h[1-6][^>]*>/g) || [];
    if (headings.length > 0 && !this.html.includes('<h1')) {
      warnings.push('Page should have an H1 heading');
    }
  }

  private calculateScore(errors: string[], warnings: string[]): number {
    let score = 100;
    score -= errors.length * 10;
    score -= warnings.length * 3;
    return Math.max(0, score);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  private isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private isValidColor(color: string): boolean {
    const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
    const rgbRegex = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
    return hexRegex.test(color) || rgbRegex.test(color);
  }

  private calculateColorContrast(color1: string, color2: string): number {
    const getLuminance = (color: string): number => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16) / 255;
      const g = parseInt(hex.substr(2, 2), 16) / 255;
      const b = parseInt(hex.substr(4, 2), 16) / 255;

      const sRGB = [r, g, b].map(c => {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });

      return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
    };

    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
  }
}

export function runPerformanceTests(html: string): {
  tests: Array<{ name: string; passed: boolean; message: string }>;
  score: number;
} {
  const tests = [
    {
      name: 'HTML Size',
      test: () => new Blob([html]).size < 150000,
      message: 'HTML should be under 150KB'
    },
    {
      name: 'Critical CSS',
      test: () => html.includes('<style>'),
      message: 'Critical CSS should be inlined'
    },
    {
      name: 'Viewport Meta',
      test: () => html.includes('viewport'),
      message: 'Viewport meta tag is required'
    },
    {
      name: 'Image Optimization',
      test: () => !html.includes('<img') || html.includes('loading='),
      message: 'Images should specify loading attribute'
    },
    {
      name: 'Script Defer',
      test: () => !html.includes('<script') || html.includes('defer'),
      message: 'Scripts should be deferred'
    },
    {
      name: 'Semantic HTML',
      test: () => html.includes('<header') || html.includes('<main') || html.includes('<footer'),
      message: 'Use semantic HTML5 elements'
    },
    {
      name: 'Mobile Friendly',
      test: () => html.includes('viewport') && html.includes('initial-scale=1'),
      message: 'Page should be mobile-friendly'
    },
    {
      name: 'Compression Ready',
      test: () => !html.includes('  ') && !html.includes('\n\n'),
      message: 'HTML should be minified'
    }
  ];

  const results = tests.map(({ name, test, message }) => ({
    name,
    passed: test(),
    message
  }));

  const passed = results.filter(r => r.passed).length;
  const score = Math.round((passed / tests.length) * 100);

  return { tests: results, score };
}