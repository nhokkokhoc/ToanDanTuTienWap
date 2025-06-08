'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sword, Zap, Heart, Shield, ArrowLeft, ArrowRight, User, Sparkles } from 'lucide-react'
import { SectType } from '@/types/game'
import { SECTS, validateCharacterName, calculateInitialStats, calculateInitialResources } from '@/lib/gameData'

interface CharacterCreationProps {
  onComplete: (characterData: { name: string; sect: SectType }) => void
  onCancel: () => void
  loading?: boolean
}

const SECT_ICONS = {
  sword: Sword,
  lightning: Zap,
  medical: Heart,
  defense: Shield
}

export default function CharacterCreation({ onComplete, onCancel, loading = false }: CharacterCreationProps) {
  const [step, setStep] = useState(1)
  const [characterName, setCharacterName] = useState('')
  const [selectedSect, setSelectedSect] = useState<SectType | null>(null)
  const [nameError, setNameError] = useState('')

  const handleNameChange = (name: string) => {
    setCharacterName(name)
    setNameError('')
  }

  const validateAndProceed = () => {
    const validation = validateCharacterName(characterName)
    if (!validation.valid) {
      setNameError(validation.error || 'Tên không hợp lệ')
      return
    }
    setStep(2)
  }

  const handleSectSelect = (sectId: SectType) => {
    setSelectedSect(sectId)
  }

  const handleComplete = () => {
    if (!selectedSect) return
    
    const validation = validateCharacterName(characterName)
    if (!validation.valid) {
      setNameError(validation.error || 'Tên không hợp lệ')
      setStep(1)
      return
    }

    onComplete({
      name: characterName.trim(),
      sect: selectedSect
    })
  }

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Đặt Tên Nhân Vật</h2>
        <p className="text-gray-300">Chọn một cái tên độc đáo cho hành trình tu tiên của bạn</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tên nhân vật
          </label>
          <input
            type="text"
            value={characterName}
            onChange={(e) => handleNameChange(e.target.value)}
            className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white text-center text-lg focus:outline-none transition-colors ${
              nameError 
                ? 'border-red-500 focus:border-red-400' 
                : 'border-gray-600 focus:border-blue-500'
            }`}
            placeholder="Nhập tên nhân vật..."
            maxLength={20}
            autoFocus
          />
          {nameError && (
            <p className="mt-2 text-sm text-red-400 text-center">{nameError}</p>
          )}
          <p className="mt-2 text-xs text-gray-400 text-center">
            2-20 ký tự, chỉ chứa chữ cái, số và khoảng trắng
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 btn-secondary py-3"
            disabled={loading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Hủy
          </button>
          <button
            onClick={validateAndProceed}
            disabled={!characterName.trim() || loading}
            className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tiếp theo
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </motion.div>
  )

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Chọn Tông Phái</h2>
        <p className="text-gray-300">Mỗi tông phái có đặc điểm và kỹ năng riêng biệt</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {Object.values(SECTS).map((sect) => {
          const IconComponent = SECT_ICONS[sect.id]
          const isSelected = selectedSect === sect.id
          const stats = calculateInitialStats(sect.id)
          const resources = calculateInitialResources(sect.id)
          
          return (
            <motion.div
              key={sect.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`card cursor-pointer transition-all duration-300 ${
                isSelected 
                  ? 'ring-2 ring-blue-400 cultivation-glow bg-blue-900/20' 
                  : 'hover:bg-white/5'
              }`}
              onClick={() => handleSectSelect(sect.id)}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${sect.color} flex-shrink-0`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white mb-1">{sect.name}</h3>
                  <p className="text-sm text-gray-300 mb-3 leading-relaxed">{sect.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tấn công:</span>
                        <span className="text-red-400 font-semibold">{stats.attack}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Phòng thủ:</span>
                        <span className="text-blue-400 font-semibold">{stats.defense}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tốc độ:</span>
                        <span className="text-green-400 font-semibold">{stats.speed}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">HP:</span>
                        <span className="text-pink-400 font-semibold">{resources.maxHealth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">MP:</span>
                        <span className="text-cyan-400 font-semibold">{resources.maxMana}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Crit:</span>
                        <span className="text-yellow-400 font-semibold">{(stats.criticalRate * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex-shrink-0"
                  >
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setStep(1)}
          className="flex-1 btn-secondary py-3"
          disabled={loading}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </button>
        <button
          onClick={handleComplete}
          disabled={!selectedSect || loading}
          className="flex-1 btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Đang tạo...
            </>
          ) : (
            <>
              Tạo nhân vật
              <Sparkles className="w-4 h-4 ml-2" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  )

  return (
    <div className="card max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
            step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'
          }`}>
            1
          </div>
          <div className={`w-12 h-1 rounded ${
            step >= 2 ? 'bg-blue-500' : 'bg-gray-600'
          }`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
            step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-300'
          }`}>
            2
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
      </AnimatePresence>
    </div>
  )
}
