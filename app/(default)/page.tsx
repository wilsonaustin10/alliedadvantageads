export const metadata = {
  title: 'Allied Advantage Ads - Get 50+ Motivated Seller Leads Monthly',
  description: 'Stop wasting time on cold calling. Get high-quality, exclusive motivated seller leads for as low as $18 per lead. Start in 48 hours.',
}

import HeroHome from '@/components/hero-home'
import Benefits from '@/components/benefits'
import Testimonials from '@/components/testimonials'
import ConsultationForm from '@/components/consultation-form'
import FAQ from '@/components/faq'

export default function Home() {
  return (
    <>
      <HeroHome />
      <Benefits />
      <Testimonials />
      <ConsultationForm />
      <FAQ />
    </>
  )
}
