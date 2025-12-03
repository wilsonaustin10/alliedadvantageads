export const metadata = {
  title: 'Allied Advantage: Google Ads for Serious Real Estate Wholesalers',
  description: 'High-converting Google Ads management for established wholesalers who want predictable deal flow. AI-powered campaigns, market exclusivity, and contract-to-click tracking.',
}

import HeroHome from '@/components/hero-home'
import ValueProposition from '@/components/value-proposition'
import QualifierSection from '@/components/qualifier-section'
import Services from '@/components/services'
import LeadMagnetSection from '@/components/lead-magnet-section'
import Testimonials from '@/components/testimonials'
import ConsultationForm from '@/components/consultation-form'
import FAQ from '@/components/faq'

export default function Home() {
  const SHOW_TESTIMONIALS = false // Toggle to true when testimonials should reappear

  return (
    <>
      <HeroHome />
      <ValueProposition />
      <QualifierSection />
      <Services />
      <LeadMagnetSection />
      {SHOW_TESTIMONIALS && <Testimonials />}
      <ConsultationForm />
      <FAQ />
    </>
  )
}
