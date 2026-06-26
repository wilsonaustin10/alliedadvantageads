import BookingForm from '@/components/booking-form';

export const metadata = {
  title: 'Book a Consultation',
  description: 'Book a consultation with the Allied Advantage Ads team.',
  keywords: ['consultation', 'contact'],
  robots: { index: false, follow: false },
  // Override the site-wide OpenGraph/Twitter metadata so this standalone
  // opt-in page carries no marketing language in its <head> source either.
  openGraph: {
    title: 'Book a Consultation | Allied Advantage Ads',
    description: 'Book a consultation with the Allied Advantage Ads team.',
    url: 'https://alliedadvantage.co/book-consultation',
    siteName: 'Allied Advantage Ads',
    type: 'website',
    images: [],
  },
  twitter: {
    card: 'summary',
    title: 'Book a Consultation | Allied Advantage Ads',
    description: 'Book a consultation with the Allied Advantage Ads team.',
    images: [],
  },
};

export default function BookConsultationPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <p className="mb-2 text-sm font-semibold text-gray-500">Allied Advantage Ads</p>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Book a consultation with our team
          </h1>
          <p className="mb-6 text-gray-600">
            Enter your details and a member of our team will reach out to schedule a time.
          </p>
          <BookingForm />
        </div>
        <p className="mt-6 text-center text-xs text-gray-500">
          <a href="/terms" className="hover:underline">Terms</a>
          {' · '}
          <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
        </p>
      </div>
    </main>
  );
}
