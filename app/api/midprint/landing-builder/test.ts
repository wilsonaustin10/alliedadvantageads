import { LandingPageConfig } from './types';
import { generateSystemPrompt, generatePageContent } from './prompts/system-prompt';
import { PerformanceOptimizer, validatePerformance } from './utils/optimizer';
import { LandingPageValidator, runPerformanceTests } from './utils/validator';

async function testLandingPageBuilder() {
  console.log('🚀 Testing Landing Page Builder\n');

  const testConfig: LandingPageConfig = {
    company: {
      name: 'Allied Advantage',
      email: 'info@alliedadvantage.com',
      phone: '1-800-555-0100',
      logo: 'https://example.com/logo.png',
      description: 'Allied Advantage provides professional digital marketing services to help businesses grow their online presence. We specialize in SEO, PPC, social media marketing, and conversion optimization.'
    },
    design: {
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    components: {
      header: true,
      hero: true,
      benefits: true,
      testimonials: true,
      leadForm: true,
      footer: true,
      privacyPage: false,
      termsPage: false,
      aboutPage: false
    },
    seo: {
      title: 'Allied Advantage - Digital Marketing Excellence',
      description: 'Transform your business with Allied Advantage professional digital marketing services.',
      keywords: ['digital marketing', 'SEO', 'PPC', 'social media']
    }
  };

  console.log('1️⃣ Testing Configuration Validation');
  const validator = new LandingPageValidator(testConfig);
  const validationResult = validator.validate();
  console.log('Validation Result:', {
    valid: validationResult.valid,
    score: validationResult.score,
    errors: validationResult.errors.length,
    warnings: validationResult.warnings.length
  });

  if (validationResult.errors.length > 0) {
    console.log('❌ Errors:', validationResult.errors);
  }
  if (validationResult.warnings.length > 0) {
    console.log('⚠️ Warnings:', validationResult.warnings);
  }

  console.log('\n2️⃣ Testing System Prompt Generation');
  const systemPrompt = generateSystemPrompt(testConfig);
  console.log('System Prompt Length:', systemPrompt.length, 'characters');
  console.log('Includes component examples:', systemPrompt.includes('COMPONENT TEMPLATES'));
  console.log('Includes performance guidelines:', systemPrompt.includes('PERFORMANCE GUIDELINES'));

  console.log('\n3️⃣ Testing Page Content Generation');
  const pageContent = generatePageContent(testConfig);
  console.log('Generated HTML Length:', pageContent.length, 'characters');
  console.log('Includes company name:', pageContent.includes(testConfig.company.name));
  console.log('Includes primary color:', pageContent.includes(testConfig.design.primaryColor));

  console.log('\n4️⃣ Testing Performance Optimization');
  const optimizer = new PerformanceOptimizer(pageContent);
  const { html: optimizedHTML, optimizations } = optimizer.optimize();
  console.log('Optimizations Applied:', optimizations.length);
  optimizations.forEach(opt => console.log('  ✓', opt));

  console.log('\n5️⃣ Testing Performance Validation');
  const perfValidation = validatePerformance(optimizedHTML);
  console.log('Performance Valid:', perfValidation.isValid);
  if (perfValidation.issues.length > 0) {
    console.log('Issues:', perfValidation.issues);
  }
  if (perfValidation.suggestions.length > 0) {
    console.log('Suggestions:', perfValidation.suggestions);
  }

  console.log('\n6️⃣ Running Performance Tests');
  const perfTests = runPerformanceTests(optimizedHTML);
  console.log('Performance Score:', perfTests.score + '%');
  perfTests.tests.forEach(test => {
    console.log(`  ${test.passed ? '✅' : '❌'} ${test.name}: ${test.message}`);
  });

  console.log('\n✨ Test Summary:');
  const allTestsPassed = 
    validationResult.valid && 
    perfValidation.isValid && 
    perfTests.score >= 75;

  if (allTestsPassed) {
    console.log('🎉 All tests passed! Landing Page Builder is ready for production.');
  } else {
    console.log('⚠️ Some tests failed. Review the issues above.');
  }

  return {
    configValid: validationResult.valid,
    performanceScore: perfTests.score,
    optimizationsApplied: optimizations.length,
    ready: allTestsPassed
  };
}

if (require.main === module) {
  testLandingPageBuilder()
    .then(result => {
      console.log('\nFinal Result:', result);
      process.exit(result.ready ? 0 : 1);
    })
    .catch(error => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}

export { testLandingPageBuilder };