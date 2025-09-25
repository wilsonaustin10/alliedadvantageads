export const metadata = {
  title: 'Allied Advantage: AI Advertising - Superior Leads at Lower Costs',
  description: 'Revolutionary AI-powered advertising agency delivering higher-quality leads at lower costs for real estate wholesalers and home services. Meta, Google Ads, custom websites, and landing pages.',
}

import HeroHome from '@/components/hero-home'
import ValueProposition from '@/components/value-proposition'
import Services from '@/components/services'
import AIAdvantage from '@/components/ai-advantage'
import FutureInnovations from '@/components/future-innovations'
import EducationalCourses from '@/components/educational-courses'
import Testimonials from '@/components/testimonials'
import ConsultationForm from '@/components/consultation-form'
import FAQ from '@/components/faq'

export default function Home() {
  return (
    <>
      <HeroHome />
      <ValueProposition />
      <Services />
      <AIAdvantage />
      <FutureInnovations />
      <EducationalCourses />
      <Testimonials />
      <ConsultationForm />
      <FAQ />
    </>
  )
}
