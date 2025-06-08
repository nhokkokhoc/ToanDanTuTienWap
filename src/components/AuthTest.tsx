'use client'

import { useState, useEffect } from 'react'
import { supabase, auth, testSupabaseConnection } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

export default function AuthTest() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<boolean | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Test connection
    testSupabaseConnection().then(setConnectionStatus)

    // Get initial session
    auth.getCurrentUser().then(({ user }) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        
        if (event === 'SIGNED_IN') {
          setMessage('✅ Đăng nhập thành công!')
        } else if (event === 'SIGNED_OUT') {
          setMessage('👋 Đã đăng xuất!')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isSignUp) {
        const { data, error } = await auth.signUp(email, password, username)
        if (error) {
          setMessage(`❌ Lỗi đăng ký: ${error.message}`)
        } else {
          setMessage('✅ Đăng ký thành công! Kiểm tra email để xác nhận.')
        }
      } else {
        const { data, error } = await auth.signIn(email, password)
        if (error) {
          setMessage(`❌ Lỗi đăng nhập: ${error.message}`)
        }
      }
    } catch (error) {
      setMessage(`❌ Lỗi: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    const { error } = await auth.signOut()
    if (error) {
      setMessage(`❌ Lỗi đăng xuất: ${error.message}`)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="card max-w-md mx-auto">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-300">Đang kiểm tra kết nối...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        🔐 Authentication Test
      </h2>

      {/* Connection Status */}
      <div className="mb-4 p-3 rounded-lg bg-gray-800">
        <p className="text-sm">
          <span className="font-semibold">Supabase Connection: </span>
          {connectionStatus === null ? (
            <span className="text-yellow-400">Testing...</span>
          ) : connectionStatus ? (
            <span className="text-green-400">✅ Connected</span>
          ) : (
            <span className="text-red-400">❌ Failed</span>
          )}
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className="mb-4 p-3 rounded-lg bg-gray-800">
          <p className="text-sm text-center">{message}</p>
        </div>
      )}

      {user ? (
        /* Logged In State */
        <div className="text-center">
          <div className="mb-4 p-4 bg-green-900/30 rounded-lg border border-green-500/30">
            <h3 className="text-lg font-semibold text-green-400 mb-2">
              Đã đăng nhập!
            </h3>
            <p className="text-sm text-gray-300">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-sm text-gray-300">
              <strong>ID:</strong> {user.id}
            </p>
            <p className="text-sm text-gray-300">
              <strong>Created:</strong> {new Date(user.created_at).toLocaleString()}
            </p>
          </div>
          
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="btn-secondary w-full"
          >
            {loading ? 'Đang đăng xuất...' : 'Đăng xuất'}
          </button>
        </div>
      ) : (
        /* Login/Register Form */
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="flex bg-gray-800 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  !isSignUp 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isSignUp 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Đăng ký
              </button>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tên người dùng
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={isSignUp}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="Nhập tên người dùng"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Nhập email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading 
              ? (isSignUp ? 'Đang đăng ký...' : 'Đang đăng nhập...') 
              : (isSignUp ? 'Đăng ký' : 'Đăng nhập')
            }
          </button>
        </form>
      )}
    </div>
  )
}
