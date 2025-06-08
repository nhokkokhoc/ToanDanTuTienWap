'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Settings, LogOut } from 'lucide-react'
import { supabase, auth, characters } from '@/lib/supabase'
import CultivationDashboard from '@/components/CultivationDashboard'
import type { User } from '@supabase/supabase-js'

export default function GamePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [character, setCharacter] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    checkAuthAndLoadCharacter()
  }, [])

  const checkAuthAndLoadCharacter = async () => {
    try {
      // Check authentication
      const { user, error: authError } = await auth.getCurrentUser()
      
      if (authError || !user) {
        router.push('/auth/login')
        return
      }

      setUser(user)

      // Get selected character from localStorage
      const selectedCharacterData = localStorage.getItem('selectedCharacter')
      if (!selectedCharacterData) {
        router.push('/characters')
        return
      }

      const selectedChar = JSON.parse(selectedCharacterData)
      
      // Load full character data from database
      const { data: characterData, error: charError } = await characters.getById(selectedChar.id)
      
      if (charError || !characterData) {
        setError('Không thể tải dữ liệu nhân vật')
        return
      }

      setCharacter(characterData)
    } catch (err) {
      console.error('Error loading game:', err)
      setError('Lỗi khi tải game')
    } finally {
      setLoading(false)
    }
  }

  const handleCharacterUpdate = (updatedCharacter: any) => {
    setCharacter(updatedCharacter)
  }

  const handleBackToCharacters = () => {
    router.push('/characters')
  }

  const handleLogout = async () => {
    try {
      await auth.signOut()
      localStorage.removeItem('selectedCharacter')
      router.push('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Đang tải game...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-white mb-4">Lỗi</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 btn-primary"
            >
              Thử lại
            </button>
            <button
              onClick={handleBackToCharacters}
              className="flex-1 btn-secondary"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!character) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          <div className="text-gray-400 text-6xl mb-4">👤</div>
          <h2 className="text-xl font-bold text-white mb-4">Không tìm thấy nhân vật</h2>
          <p className="text-gray-300 mb-6">
            Vui lòng chọn nhân vật để bắt đầu chơi
          </p>
          <button
            onClick={handleBackToCharacters}
            className="btn-primary w-full"
          >
            Chọn nhân vật
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Back button */}
            <button
              onClick={handleBackToCharacters}
              className="btn-secondary flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Nhân vật
            </button>

            {/* Center: Character info */}
            <div className="text-center">
              <h1 className="text-lg font-bold text-white">{character.name}</h1>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                <span>Lv.{character.level}</span>
                <span>•</span>
                <span>{character.realm}</span>
                <span>•</span>
                <span className="capitalize">{character.sect} Tông</span>
              </div>
            </div>

            {/* Right: Menu */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {/* TODO: Open settings */}}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Cài đặt"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                title="Đăng xuất"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Content */}
      <div className="max-w-6xl mx-auto p-4">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gradient mb-2">
            Chào mừng trở lại, {character.name}!
          </h2>
          <p className="text-gray-300">
            Tiếp tục hành trình tu tiên của bạn trong thế giới huyền bí
          </p>
        </motion.div>

        {/* Game Tabs/Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-800 rounded-lg p-1">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium">
              Tu Luyện
            </button>
            <button className="px-6 py-2 text-gray-300 hover:text-white transition-colors">
              Chiến Đấu
            </button>
            <button className="px-6 py-2 text-gray-300 hover:text-white transition-colors">
              Kho Đồ
            </button>
            <button className="px-6 py-2 text-gray-300 hover:text-white transition-colors">
              Kỹ Năng
            </button>
          </div>
        </div>

        {/* Cultivation Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CultivationDashboard
            character={character}
            onCharacterUpdate={handleCharacterUpdate}
          />
        </motion.div>

        {/* Coming Soon Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="card text-center opacity-50">
            <div className="text-4xl mb-4">⚔️</div>
            <h3 className="text-lg font-semibold text-white mb-2">Chiến Đấu</h3>
            <p className="text-gray-400 text-sm">Sắp ra mắt trong Phase 1.4</p>
          </div>

          <div className="card text-center opacity-50">
            <div className="text-4xl mb-4">🎒</div>
            <h3 className="text-lg font-semibold text-white mb-2">Kho Đồ</h3>
            <p className="text-gray-400 text-sm">Sắp ra mắt trong Phase 1.5</p>
          </div>

          <div className="card text-center opacity-50">
            <div className="text-4xl mb-4">🌳</div>
            <h3 className="text-lg font-semibold text-white mb-2">Kỹ Năng</h3>
            <p className="text-gray-400 text-sm">Sắp ra mắt trong Phase 1.3</p>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400 text-sm">
          <p>Toàn Dân Tu Tiên - Phase 1.3: Hệ Thống Tu Luyện</p>
          <p className="mt-1">Phiên bản: 0.1.3 | Build: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}
