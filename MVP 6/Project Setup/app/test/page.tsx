export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎉 Vercel Deployment Success!
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Your Procuredx application is running on Vercel
        </p>
        <div className="space-y-4">
          <a 
            href="/landing" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Landing Page
          </a>
          <div className="text-sm text-gray-500">
            Environment: {process.env.NODE_ENV || 'development'}
          </div>
        </div>
      </div>
    </div>
  )
}
