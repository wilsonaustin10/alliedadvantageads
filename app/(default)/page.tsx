export const metadata = {
  title: 'Allied Advantage: AI Advertising - Superior Leads at Lower Costs',
  description: 'Revolutionary AI-powered advertising agency delivering higher-quality leads at lower costs for real estate wholesalers and home services through Google Ads management.',
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
  const SHOW_TESTIMONIALS = false // Toggle to true when testimonials should reappear

  return (
    <>
      <HeroHome />
      <ValueProposition />
      <Services />
      <AIAdvantage />
      <FutureInnovations />
      <EducationalCourses />
      {SHOW_TESTIMONIALS && <Testimonials />}
      <ConsultationForm />
      <FAQ />
    </>
  )
}
