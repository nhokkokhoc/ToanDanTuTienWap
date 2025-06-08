'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Sword, Zap, Heart, Shield, Crown, Trash2 } from 'lucide-react'
import { SectType } from '@/types/game'
import { SECTS, CULTIVATION_REALMS } from '@/lib/gameData'
import { characters } from '@/lib/supabase'

interface Character {
  id: string
  name: string
  sect: SectType
  level: number
  realm: string
  attack: number
  defense: number
  speed: number
  max_health: number
  max_mana: number
  gold: number
  spirit_stones: number
  created_at: string
}

interface CharacterListProps {
  playerId: string
  onCreateNew: () => void
  onSelectCharacter: (character: Character) => void
  onDeleteCharacter?: (characterId: string) => void
  selectedCharacterId?: string
}

const SECT_ICONS = {
  sword: Sword,
  lightning: Zap,
  medical: Heart,
  defense: Shield
}

export default function CharacterList({ 
  playerId, 
  onCreateNew, 
  onSelectCharacter, 
  onDeleteCharacter,
  selectedCharacterId 
}: CharacterListProps) {
  const [characterList, setCharacterList] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    loadCharacters()
  }, [playerId])

  const loadCharacters = async () => {
    try {
      setLoading(true)
      const { data, error } = await characters.getByPlayerId(playerId)
      
      if (error) {
        setError('Không thể tải danh sách nhân vật')
        console.error('Error loading characters:', error)
        return
      }

      setCharacterList(data || [])
    } catch (err) {
      setError('Lỗi kết nối')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCharacter = async (characterId: string) => {
    if (deleteConfirm !== characterId) {
      setDeleteConfirm(characterId)
      return
    }

    try {
      const { error } = await characters.delete(characterId)
      
      if (error) {
        setError('Không thể xóa nhân vật')
        console.error('Error deleting character:', error)
        return
      }

      setCharacterList(prev => prev.filter(char => char.id !== characterId))
      setDeleteConfirm(null)
      
      if (onDeleteCharacter) {
        onDeleteCharacter(characterId)
      }
    } catch (err) {
      setError('Lỗi khi xóa nhân vật')
      console.error('Error:', err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="card max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Đang tải danh sách nhân vật...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card max-w-4xl mx-auto">
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={loadCharacters}
            className="btn-primary"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gradient mb-2">Chọn Nhân Vật</h1>
        <p className="text-gray-300">Chọn nhân vật để bắt đầu hành trình tu tiên</p>
      </div>

      {/* Character Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Character Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="card cursor-pointer border-2 border-dashed border-gray-600 hover:border-blue-500 transition-colors"
          onClick={onCreateNew}
        >
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Tạo Nhân Vật Mới</h3>
            <p className="text-sm text-gray-400">Bắt đầu hành trình tu tiên mới</p>
          </div>
        </motion.div>

        {/* Existing Characters */}
        {characterList.map((character, index) => {
          const sect = SECTS[character.sect]
          const IconComponent = SECT_ICONS[character.sect]
          const realm = CULTIVATION_REALMS[character.realm as keyof typeof CULTIVATION_REALMS]
          const isSelected = selectedCharacterId === character.id
          const isDeleteMode = deleteConfirm === character.id

          return (
            <motion.div
              key={character.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card cursor-pointer transition-all duration-300 relative ${
                isSelected 
                  ? 'ring-2 ring-blue-400 cultivation-glow' 
                  : 'hover:bg-white/5'
              } ${isDeleteMode ? 'ring-2 ring-red-400' : ''}`}
              onClick={() => !isDeleteMode && onSelectCharacter(character)}
            >
              {/* Delete Button */}
              {onDeleteCharacter && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteCharacter(character.id)
                  }}
                  className={`absolute top-3 right-3 p-1 rounded-full transition-colors ${
                    isDeleteMode 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-700 text-gray-400 hover:bg-red-500 hover:text-white'
                  }`}
                  title={isDeleteMode ? 'Xác nhận xóa' : 'Xóa nhân vật'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              {/* Character Info */}
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${sect.color}`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white truncate">{character.name}</h3>
                    <p className="text-sm text-gray-300">{sect.name}</p>
                  </div>
                  {isSelected && (
                    <Crown className="w-5 h-5 text-yellow-400" />
                  )}
                </div>

                {/* Level & Realm */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-white">Lv.{character.level}</div>
                    <div className={`text-sm ${realm?.color || 'text-gray-400'}`}>
                      {realm?.name || character.realm}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Tạo lúc</div>
                    <div className="text-sm text-gray-300">{formatDate(character.created_at)}</div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-red-400 font-semibold">{character.attack}</div>
                    <div className="text-gray-400">ATK</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-400 font-semibold">{character.defense}</div>
                    <div className="text-gray-400">DEF</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 font-semibold">{character.speed}</div>
                    <div className="text-gray-400">SPD</div>
                  </div>
                </div>

                {/* Resources */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">HP:</span>
                    <span className="text-pink-400 font-semibold">{character.max_health}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">MP:</span>
                    <span className="text-cyan-400 font-semibold">{character.max_mana}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Vàng:</span>
                    <span className="text-yellow-400 font-semibold">{character.gold.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Linh Thạch:</span>
                    <span className="text-purple-400 font-semibold">{character.spirit_stones}</span>
                  </div>
                </div>

                {/* Delete Confirmation */}
                {isDeleteMode && (
                  <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
                    <p className="text-red-400 text-sm text-center">
                      Nhấn lại để xác nhận xóa nhân vật này
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Empty State */}
      {characterList.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sword className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Chưa có nhân vật nào</h3>
          <p className="text-gray-400 mb-6">Tạo nhân vật đầu tiên để bắt đầu hành trình tu tiên</p>
          <button onClick={onCreateNew} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Tạo nhân vật đầu tiên
          </button>
        </div>
      )}
    </div>
  )
}
