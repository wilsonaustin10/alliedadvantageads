import { ComponentTemplate } from '../types';

export const headerTemplate: ComponentTemplate = {
  name: 'header',
  html: `
<header class="lp-header">
  <div class="lp-container">
    <nav class="lp-nav">
      <div class="lp-logo">
        {{#if logo}}
          <img src="{{logo}}" alt="{{companyName}}" width="150" height="50" loading="eager">
        {{else}}
          <span class="lp-logo-text">{{companyName}}</span>
        {{/if}}
      </div>
      <div class="lp-nav-links">
        <a href="#benefits">Benefits</a>
        <a href="#testimonials">Testimonials</a>
        <a href="#contact">Contact</a>
      </div>
      <button class="lp-mobile-menu" aria-label="Menu">☰</button>
    </nav>
  </div>
</header>`,
  css: `
.lp-header {
  position: sticky;
  top: 0;
  background: rgba(255,255,255,0.98);
  backdrop-filter: blur(10px);
  z-index: 1000;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.lp-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}
.lp-logo img {
  height: 50px;
  width: auto;
}
.lp-logo-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: {{primaryColor}};
}
.lp-nav-links {
  display: flex;
  gap: 2rem;
}
.lp-nav-links a {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}
.lp-nav-links a:hover {
  color: {{primaryColor}};
}
.lp-mobile-menu {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
@media (max-width: 768px) {
  .lp-nav-links { display: none; }
  .lp-mobile-menu { display: block; }
}`,
  js: `
document.querySelector('.lp-mobile-menu')?.addEventListener('click', function() {
  const nav = document.querySelector('.lp-nav-links');
  nav?.classList.toggle('mobile-active');
});`
};

export const heroTemplate: ComponentTemplate = {
  name: 'hero',
  html: `
<section class="lp-hero">
  <div class="lp-container">
    <div class="lp-hero-content">
      <h1 class="lp-hero-title">{{headline}}</h1>
      <p class="lp-hero-subtitle">{{subheadline}}</p>
      <div class="lp-hero-cta">
        <button class="lp-btn-primary" data-action="scroll-to-form">Get Your Free Quote</button>
        <a href="tel:{{phone}}" class="lp-btn-secondary">Call {{phone}}</a>
      </div>
    </div>
  </div>
</section>`,
  css: `
.lp-hero {
  padding: 3rem 0;
  background: linear-gradient(135deg, {{primaryColor}}15 0%, {{secondaryColor}}10 100%);
  max-height: 60vh;
  min-height: 350px;
}
.lp-hero-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}
.lp-hero-title {
  font-size: clamp(1.75rem, 4.5vw, 3rem);
  font-weight: bold;
  margin-bottom: 0.75rem;
  color: #111;
  line-height: 1.2;
}
.lp-hero-subtitle {
  font-size: clamp(0.95rem, 2.5vw, 1.2rem);
  color: #555;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}
.lp-hero-cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
.lp-btn-primary {
  background: {{primaryColor}};
  color: white;
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.lp-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}
.lp-btn-secondary {
  background: white;
  color: {{primaryColor}};
  padding: 0.875rem 2rem;
  border: 2px solid {{primaryColor}};
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}
.lp-btn-secondary:hover {
  background: {{primaryColor}}10;
}
@media (max-width: 768px) {
  .lp-hero {
    padding: 2rem 0;
    max-height: 45vh;
    min-height: 300px;
  }
  .lp-hero-title {
    font-size: 1.75rem;
  }
  .lp-hero-subtitle {
    font-size: 1rem;
    margin-bottom: 1rem;
  }
}`
};

export const leadFormTemplate: ComponentTemplate = {
  name: 'leadForm',
  html: `
<section id="contact" class="lp-form-section">
  <div class="lp-container">
    <div class="lp-form-wrapper">
      <div class="lp-form-badge">LIMITED TIME OFFER</div>
      <h2 class="lp-form-title">Get Your Free Consultation Today</h2>
      <p class="lp-form-subtitle">Fill out the form below and we'll contact you within 24 hours</p>
      <form class="lp-lead-form" data-netlify="true" method="POST">
        <div class="lp-form-grid">
          <div class="lp-form-group">
            <label for="name">Full Name *</label>
            <input type="text" id="name" name="name" required placeholder="John Smith">
          </div>
          <div class="lp-form-group">
            <label for="email">Email Address *</label>
            <input type="email" id="email" name="email" required placeholder="john@example.com">
          </div>
          <div class="lp-form-group">
            <label for="phone">Phone Number *</label>
            <input type="tel" id="phone" name="phone" required placeholder="(555) 123-4567">
          </div>
          <div class="lp-form-group">
            <label for="company">Company Name</label>
            <input type="text" id="company" name="company" placeholder="Optional">
          </div>
        </div>
        <div class="lp-form-group">
          <label for="message">How can we help you?</label>
          <textarea id="message" name="message" rows="3" placeholder="Tell us about your project or needs..."></textarea>
        </div>
        <button type="submit" class="lp-submit-btn">Get My Free Consultation</button>
        <p class="lp-form-disclaimer">✓ No obligation ✓ Free consultation ✓ Quick response</p>
      </form>
    </div>
  </div>
</section>`,
  css: `
.lp-form-section {
  padding: 2rem 0 3rem;
  background: linear-gradient(to bottom, #ffffff, #f8f9fa);
}
.lp-form-wrapper {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  border: 2px solid {{primaryColor}}20;
  position: relative;
}
.lp-form-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: {{primaryColor}};
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: bold;
  letter-spacing: 1px;
}
.lp-form-title {
  font-size: 1.875rem;
  text-align: center;
  margin-bottom: 0.5rem;
  color: #111;
  margin-top: 0.5rem;
}
.lp-form-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}
.lp-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}
.lp-form-group {
  display: flex;
  flex-direction: column;
}
.lp-form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}
.lp-form-group input,
.lp-form-group textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.375rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}
.lp-form-group input:focus,
.lp-form-group textarea:focus {
  outline: none;
  border-color: {{primaryColor}};
}
.lp-submit-btn {
  width: 100%;
  padding: 1.125rem;
  background: {{primaryColor}};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 15px {{primaryColor}}40;
}
.lp-submit-btn:hover {
  background: {{primaryColor}}dd;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px {{primaryColor}}50;
}
.lp-form-disclaimer {
  text-align: center;
  margin-top: 1rem;
  color: #666;
  font-size: 0.875rem;
}
@media (max-width: 768px) {
  .lp-form-section {
    padding: 1.5rem 0 2rem;
  }
  .lp-form-wrapper {
    padding: 1.5rem;
  }
}`,
  js: `
// Scroll to form functionality
document.querySelectorAll('[data-action="scroll-to-form"]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  });
});

// Form submission
document.querySelector('.lp-lead-form')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  const submitBtn = e.target.querySelector('.lp-submit-btn');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  try {
    const response = await fetch('/api/midprint/landing-builder/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      e.target.innerHTML = '<div class="lp-success"><h3>Thank You!</h3><p>We have received your request and will contact you within 24 hours.</p></div>';
    } else {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      alert('There was an error submitting the form. Please try again.');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    alert('There was an error submitting the form. Please try again.');
  }
});`
};

export const benefitsTemplate: ComponentTemplate = {
  name: 'benefits',
  html: `
<section id="benefits" class="lp-benefits">
  <div class="lp-container">
    <h2 class="lp-section-title">Why Choose {{companyName}}?</h2>
    <div class="lp-benefits-grid">
      {{#each benefits}}
      <div class="lp-benefit-card">
        <div class="lp-benefit-icon">{{icon}}</div>
        <h3>{{title}}</h3>
        <p>{{description}}</p>
      </div>
      {{/each}}
    </div>
  </div>
</section>`,
  css: `
.lp-benefits {
  padding: 4rem 0;
}
.lp-section-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #111;
}
.lp-benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
.lp-benefit-card {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}
.lp-benefit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}
.lp-benefit-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  background: {{primaryColor}}15;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: {{primaryColor}};
}
.lp-benefit-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: #111;
}
.lp-benefit-card p {
  color: #666;
  line-height: 1.6;
}`
};

export const testimonialsTemplate: ComponentTemplate = {
  name: 'testimonials',
  html: `
<section id="testimonials" class="lp-testimonials">
  <div class="lp-container">
    <h2 class="lp-section-title">What Our Clients Say</h2>
    <div class="lp-testimonials-grid">
      {{#each testimonials}}
      <div class="lp-testimonial">
        <div class="lp-stars">★★★★★</div>
        <blockquote>"{{quote}}"</blockquote>
        <cite>
          <strong>{{name}}</strong>
          <span>{{title}}</span>
        </cite>
      </div>
      {{/each}}
    </div>
  </div>
</section>`,
  css: `
.lp-testimonials {
  padding: 4rem 0;
  background: #f8f9fa;
}
.lp-testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}
.lp-testimonial {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
}
.lp-stars {
  color: #ffc107;
  font-size: 1.25rem;
  margin-bottom: 1rem;
}
.lp-testimonial blockquote {
  font-size: 1.125rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 1rem;
}
.lp-testimonial cite {
  display: block;
  font-style: normal;
}
.lp-testimonial cite strong {
  display: block;
  color: #111;
  margin-bottom: 0.25rem;
}
.lp-testimonial cite span {
  color: #666;
  font-size: 0.875rem;
}`
};

export const footerTemplate: ComponentTemplate = {
  name: 'footer',
  html: `
<footer class="lp-footer">
  <div class="lp-container">
    <div class="lp-footer-content">
      <div class="lp-footer-info">
        <h3>{{companyName}}</h3>
        <p>{{companyDescription}}</p>
      </div>
      <div class="lp-footer-contact">
        <h4>Contact Us</h4>
        <p>📧 <a href="mailto:{{email}}">{{email}}</a></p>
        <p>📞 <a href="tel:{{phone}}">{{phone}}</a></p>
      </div>
      <div class="lp-footer-links">
        <h4>Quick Links</h4>
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms & Conditions</a>
        <a href="/about">About Us</a>
      </div>
    </div>
    <div class="lp-footer-bottom">
      <p>&copy; {{year}} {{companyName}}. All rights reserved.</p>
    </div>
  </div>
</footer>`,
  css: `
.lp-footer {
  background: #1a1a1a;
  color: white;
  padding: 3rem 0 1rem;
  margin-top: 4rem;
}
.lp-footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}
.lp-footer h3 {
  color: {{primaryColor}};
  margin-bottom: 1rem;
}
.lp-footer h4 {
  margin-bottom: 1rem;
  font-size: 1.125rem;
}
.lp-footer a {
  color: #ccc;
  text-decoration: none;
  transition: color 0.2s;
  display: block;
  margin-bottom: 0.5rem;
}
.lp-footer a:hover {
  color: {{primaryColor}};
}
.lp-footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid #333;
  text-align: center;
  color: #888;
}`
};

export const allTemplates = {
  header: headerTemplate,
  hero: heroTemplate,
  leadForm: leadFormTemplate,
  benefits: benefitsTemplate,
  testimonials: testimonialsTemplate,
  footer: footerTemplate
};