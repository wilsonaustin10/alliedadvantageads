export const metadata = {
  title: 'Allied Advantage Ads - Real Estate Lead Generation',
  description: 'Generate motivated seller leads for your real estate wholesaling business with Allied Advantage Ads. Cost-effective, nationwide lead generation services.',
}

import HeroHome from '@/components/hero-home'
import ValueProposition from '@/components/value-proposition'
import Services from '@/components/services'
import FAQ from '@/components/faq'
import ContactForm from '@/components/contact-form'

export default function Home() {
  return (
    <>
      <HeroHome />
      <ValueProposition />
      <Services />
      <FAQ />
      <ContactForm />
    </>
  )
}
