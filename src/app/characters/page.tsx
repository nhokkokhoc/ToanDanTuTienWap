'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { supabase, auth, characters, players } from '@/lib/supabase'
import { calculateInitialStats, calculateInitialResources, validateCharacterName } from '@/lib/gameData'
import CharacterList from '@/components/CharacterList'
import GameIntro from '@/components/GameIntro'
import StoryIntro from '@/components/StoryIntro'
import type { User } from '@supabase/supabase-js'
import type { SectType } from '@/types/game'

type ViewMode = 'loading' | 'story' | 'list' | 'intro'

export default function CharactersPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('loading')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>()
  const [hasExistingCharacters, setHasExistingCharacters] = useState(false)

  useEffect(() => {
    checkAuthAndCharacters()
  }, [])

  const checkAuthAndCharacters = async () => {
    try {
      const { user, error } = await auth.getCurrentUser()

      if (error || !user) {
        router.push('/auth/login')
        return
      }

      setUser(user)

      // Ensure player profile exists
      await ensurePlayerProfile(user)

      // Check if user has existing characters
      await checkExistingCharacters(user.id)

    } catch (err) {
      console.error('Auth check error:', err)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const checkExistingCharacters = async (playerId: string) => {
    try {
      const { data, error } = await characters.getByPlayerId(playerId)

      if (error) {
        console.error('Error checking characters:', error)
        setViewMode('list') // Default to list view on error
        return
      }

      const hasCharacters = data && data.length > 0
      setHasExistingCharacters(hasCharacters? hasCharacters: false )

      if (hasCharacters) {
        // User has characters, show character list
        setViewMode('list')
      } else {
        // First time user, show story first
        setViewMode('story')
      }

    } catch (err) {
      console.error('Error checking characters:', err)
      setViewMode('list') // Default to list view on error
    }
  }

  const ensurePlayerProfile = async (user: User) => {
    try {
      const { data, error } = await players.upsert(user.id, {
        email: user.email || '',
        username: user.user_metadata?.username || user.email?.split('@')[0] || 'Player',
        avatar: user.user_metadata?.avatar_url
      })

      if (error) {
        console.error('Error creating player profile:', error)
      }
    } catch (err) {
      console.error('Error ensuring player profile:', err)
    }
  }

  const handleCreateCharacter = async (characterData: { name: string; sect: SectType }) => {
    if (!user) return

    setCreating(true)
    setError('')

    try {
      // Ensure player profile exists first
      console.log('Ensuring player profile exists for user:', user.id)
      const { data: playerData, error: playerError } = await players.upsert(user.id, {
        email: user.email || '',
        username: user.user_metadata?.username || user.email?.split('@')[0] || 'Player',
        avatar: user.user_metadata?.avatar_url
      })

      if (playerError) {
        console.error('Error creating player profile:', playerError)
        setError('Không thể tạo hồ sơ người chơi')
        return
      }

      console.log('Player profile created/updated:', playerData)

      // Validate character name
      const nameValidation = validateCharacterName(characterData.name)
      if (!nameValidation.valid) {
        setError(nameValidation.error || 'Tên nhân vật không hợp lệ')
        return
      }

      // Check if name already exists
      const { exists, error: checkError } = await characters.checkNameExists(characterData.name)
      if (checkError) {
        setError('Không thể kiểm tra tên nhân vật')
        return
      }

      if (exists) {
        setError('Tên nhân vật đã tồn tại, vui lòng chọn tên khác')
        return
      }

      // Calculate initial stats and resources
      const initialStats = calculateInitialStats(characterData.sect)
      const initialResources = calculateInitialResources(characterData.sect)

      console.log('Creating character with data:', {
        name: characterData.name,
        sect: characterData.sect,
        playerId: user.id,
        stats: initialStats,
        resources: initialResources
      })

      // Create character
      const { data, error } = await characters.create({
        name: characterData.name,
        sect: characterData.sect,
        playerId: user.id,
        stats: initialStats,
        resources: initialResources
      })

      if (error) {
        console.error('Character creation error:', error)
        console.error('Character data being sent:', {
          name: characterData.name,
          sect: characterData.sect,
          playerId: user.id,
          stats: initialStats,
          resources: initialResources
        })

        // More detailed error message
        const errorMessage = error.message || error.details || 'Không thể tạo nhân vật. Vui lòng thử lại.'
        setError(`Lỗi tạo nhân vật: ${errorMessage}`)
        return
      }

      // Success - go back to character list
      setHasExistingCharacters(true)
      setViewMode('list')
      setSelectedCharacterId(data.id)
      
    } catch (err) {
      setError('Lỗi không xác định. Vui lòng thử lại.')
      console.error('Character creation error:', err)
    } finally {
      setCreating(false)
    }
  }

  const handleSelectCharacter = (character: any) => {
    // Store selected character in localStorage for game state
    localStorage.setItem('selectedCharacter', JSON.stringify({
      id: character.id,
      name: character.name,
      sect: character.sect
    }))
    
    // Navigate to game
    router.push('/game')
  }

  const handleDeleteCharacter = (characterId: string) => {
    if (selectedCharacterId === characterId) {
      setSelectedCharacterId(undefined)
    }
  }

  const handleBackToHome = () => {
    router.push('/')
  }

  const handleStoryComplete = () => {
    // Story completed, now show character creation
    setViewMode('intro')
  }

  const handleStorySkip = () => {
    // Story skipped, go directly to character creation
    setViewMode('intro')
  }

  if (loading || viewMode === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  // First time user - show story
  if (viewMode === 'story') {
    return (
      <div className="min-h-screen">
        <StoryIntro
          onComplete={handleStoryComplete}
          onSkip={handleStorySkip}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header - Only show for list and intro modes */}
        {(viewMode === 'list' || viewMode === 'intro') && (
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBackToHome}
              className="btn-secondary flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Trang chủ
            </button>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-gradient">
                {viewMode === 'list' ? 'Quản Lý Nhân Vật' : 'Tạo Nhân Vật Mới'}
              </h1>
              <p className="text-gray-300 text-sm">
                Chào mừng, {user.user_metadata?.username || user.email}
              </p>
            </div>

            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-red-900/30 border border-red-500/50 mb-6"
          >
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
              <p className="text-red-400">{error}</p>
              <button
                onClick={() => setError('')}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'list' && (
            <div>
              <CharacterList
                playerId={user.id}
                onCreateNew={() => setViewMode('intro')}
                onSelectCharacter={handleSelectCharacter}
                onDeleteCharacter={handleDeleteCharacter}
                selectedCharacterId={selectedCharacterId}
              />

              {/* Story Replay Option for existing users */}
              {hasExistingCharacters && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setViewMode('story')}
                    className="text-blue-400 hover:text-blue-300 text-sm underline"
                  >
                    📖 Xem lại câu chuyện tu tiên
                  </button>
                </div>
              )}
            </div>
          )}

          {viewMode === 'intro' && (
            <GameIntro
              onCharacterCreated={handleCreateCharacter}
              onCancel={() => {
                setViewMode('list')
                setError('')
              }}
              loading={creating}
            />
          )}
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400 text-sm">
          <p>Toàn Dân Tu Tiên - Hành trình tu tiên bất tận</p>
        </div>
      </div>
    </div>
  )
}
