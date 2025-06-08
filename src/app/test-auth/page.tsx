import AuthTest from '@/components/AuthTest'

export default function TestAuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Authentication Test
          </h1>
          <p className="text-gray-300">
            Test Supabase authentication setup
          </p>
        </div>
        
        <AuthTest />
        
        <div className="mt-6 text-center">
          <a 
            href="/"
            className="text-blue-400 hover:text-blue-300 text-sm underline"
          >
            ← Quay về trang chủ
          </a>
        </div>
      </div>
    </div>
  )
}
