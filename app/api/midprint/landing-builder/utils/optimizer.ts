export class PerformanceOptimizer {
  private html: string;
  private css: string;
  private js: string;

  constructor(html: string, css?: string, js?: string) {
    this.html = html;
    this.css = css || '';
    this.js = js || '';
  }

  optimize(): { html: string; optimizations: string[] } {
    const optimizations: string[] = [];

    this.html = this.inlineCriticalCSS(optimizations);
    this.html = this.minifyHTML(optimizations);
    this.html = this.addResourceHints(optimizations);
    this.html = this.optimizeImages(optimizations);
    this.html = this.addLazyLoading(optimizations);
    this.html = this.deferJavaScript(optimizations);
    this.html = this.addCaching(optimizations);
    this.html = this.addStructuredData(optimizations);

    return { html: this.html, optimizations };
  }

  private inlineCriticalCSS(optimizations: string[]): string {
    const criticalCSS = this.extractCriticalCSS();
    
    if (criticalCSS && !this.html.includes('<style>')) {
      const styleTag = `<style>${this.minifyCSS(criticalCSS)}</style>`;
      this.html = this.html.replace('</head>', `${styleTag}\n</head>`);
      optimizations.push('Inlined critical CSS');
    }

    return this.html;
  }

  private extractCriticalCSS(): string {
    const criticalSelectors = [
      '.lp-header', '.lp-hero', '.lp-nav', '.lp-container',
      '.lp-btn-primary', '.lp-hero-title', '.lp-hero-subtitle'
    ];

    let critical = '';
    for (const selector of criticalSelectors) {
      const regex = new RegExp(`${selector.replace('.', '\\.')}[^}]*}`, 'g');
      const matches = this.css.match(regex);
      if (matches) {
        critical += matches.join('\n');
      }
    }

    return critical;
  }

  private minifyCSS(css: string): string {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .replace(/:\s+/g, ':')
      .replace(/;\s+/g, ';')
      .replace(/\s*{\s*/g, '{')
      .replace(/\s*}\s*/g, '}')
      .replace(/\s*,\s*/g, ',')
      .trim();
  }

  private minifyHTML(optimizations: string[]): string {
    this.html = this.html
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\s+/g, ' ')
      .replace(/> </g, '><')
      .trim();
    
    optimizations.push('Minified HTML');
    return this.html;
  }

  private addResourceHints(optimizations: string[]): string {
    const hints = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">`;

    if (!this.html.includes('preconnect')) {
      this.html = this.html.replace('<head>', `<head>${hints}`);
      optimizations.push('Added resource hints');
    }

    return this.html;
  }

  private optimizeImages(optimizations: string[]): string {
    this.html = this.html.replace(
      /<img([^>]*)>/g,
      (match, attributes) => {
        if (!attributes.includes('loading=')) {
          attributes += ' loading="lazy"';
        }
        if (!attributes.includes('decoding=')) {
          attributes += ' decoding="async"';
        }
        if (!attributes.includes('width=') && !attributes.includes('height=')) {
          attributes += ' width="auto" height="auto"';
        }
        return `<img${attributes}>`;
      }
    );

    optimizations.push('Optimized image loading');
    return this.html;
  }

  private addLazyLoading(optimizations: string[]): string {
    const lazyLoadScript = `
    <script>
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach(img => { img.src = img.dataset.src || img.src; });
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/lazysizes@5/lazysizes.min.js';
      document.body.appendChild(script);
    }
    </script>`;

    if (!this.html.includes('lazysizes') && !this.html.includes('loading="lazy"')) {
      this.html = this.html.replace('</body>', `${lazyLoadScript}\n</body>`);
      optimizations.push('Added lazy loading support');
    }

    return this.html;
  }

  private deferJavaScript(optimizations: string[]): string {
    this.html = this.html.replace(
      /<script([^>]*)>/g,
      (match, attributes) => {
        if (!attributes.includes('defer') && !attributes.includes('async')) {
          return `<script${attributes} defer>`;
        }
        return match;
      }
    );

    optimizations.push('Deferred JavaScript execution');
    return this.html;
  }

  private addCaching(optimizations: string[]): string {
    const cacheHeaders = `
    <meta http-equiv="Cache-Control" content="public, max-age=31536000">
    <meta http-equiv="Pragma" content="cache">`;

    if (!this.html.includes('Cache-Control')) {
      this.html = this.html.replace('<head>', `<head>${cacheHeaders}`);
      optimizations.push('Added caching headers');
    }

    return this.html;
  }

  private addStructuredData(optimizations: string[]): string {
    const structuredData = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Company Name",
      "url": window.location.origin,
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service"
      }
    }
    </script>`;

    if (!this.html.includes('application/ld+json')) {
      this.html = this.html.replace('</head>', `${structuredData}\n</head>`);
      optimizations.push('Added structured data');
    }

    return this.html;
  }
}

export function validatePerformance(html: string): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];

  const htmlSize = new Blob([html]).size;
  if (htmlSize > 150000) {
    issues.push(`HTML size (${htmlSize} bytes) exceeds 150KB limit`);
  }

  if (!html.includes('<style>')) {
    issues.push('No inline critical CSS found');
    suggestions.push('Inline critical CSS for faster initial render');
  }

  if (!html.includes('loading="lazy"') && !html.includes('loading="eager"')) {
    suggestions.push('Add lazy loading to images below the fold');
  }

  if (!html.includes('defer') && html.includes('<script')) {
    suggestions.push('Defer non-critical JavaScript');
  }

  if (!html.includes('preconnect') && !html.includes('dns-prefetch')) {
    suggestions.push('Add resource hints for external domains');
  }

  const imgTags = html.match(/<img[^>]*>/g) || [];
  for (const img of imgTags) {
    if (!img.includes('width=') || !img.includes('height=')) {
      issues.push('Images missing width/height attributes (causes CLS)');
      break;
    }
  }

  if (!html.includes('viewport')) {
    issues.push('Missing viewport meta tag');
  }

  return {
    isValid: issues.length === 0,
    issues,
    suggestions
  };
}