import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Future AI Marketing Tools - Allied Advantage',
  description: 'Discover our upcoming suite of AI-powered marketing tools designed to revolutionize your advertising campaigns.',
};

export default function FutureToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}