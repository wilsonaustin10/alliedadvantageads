export default function MidPrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold">Allied Advantage Ads</h2>
              <span className="text-sm text-gray-500">MidPrint Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/home-portal" className="text-sm text-gray-600 hover:text-gray-900">
                Back to Portal
              </a>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}