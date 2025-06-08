'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Star, Award, Gift, Info } from 'lucide-react'
import { experience, EXPERIENCE_CONFIG } from '@/lib/experience'
import type { CultivationRealm } from '@/types/game'

interface LevelProgressProps {
  character: {
    id: string
    level: number
    total_experience: number
    experience_to_next_level: number
    realm: string
  }
}

export default function LevelProgress({ character }: LevelProgressProps) {
  const [levelData, setLevelData] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLevelProgress()
  }, [character.id])

  const loadLevelProgress = async () => {
    try {
      const result = await experience.getLevelProgress(character.id)
      if (result.success) {
        setLevelData(result)
      }
    } catch (error) {
      console.error('Error loading level progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  const getNextMilestone = (currentLevel: number) => {
    const milestones = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    return milestones.find(milestone => milestone > currentLevel) || null
  }

  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-8 bg-gray-700 rounded mb-4"></div>
          <div className="h-2 bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (!levelData) {
    return (
      <div className="card">
        <p className="text-red-400">Không thể tải dữ liệu level</p>
      </div>
    )
  }

  const nextMilestone = getNextMilestone(character.level)
  const realm = character.realm as CultivationRealm
  const maxLevel = EXPERIENCE_CONFIG.MAX_LEVEL_PER_REALM[realm]

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
          Tiến Độ Level
        </h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Level Display */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Star className="w-6 h-6 text-gold-400" />
          <span className="text-3xl font-bold text-white">
            Level {character.level}
          </span>
          <Star className="w-6 h-6 text-gold-400" />
        </div>
        
        {levelData.isMaxLevel ? (
          <div className="text-center">
            <div className="text-gold-400 font-semibold mb-2">
              🏆 Đã đạt level tối đa cho cảnh giới này!
            </div>
            <p className="text-gray-400 text-sm">
              Hãy đột phá lên cảnh giới cao hơn để tiếp tục phát triển
            </p>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <div className="relative mb-3">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelData.progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </motion.div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-semibold text-white drop-shadow-lg">
                  {levelData.progressPercent.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* EXP Numbers */}
            <div className="flex justify-between text-sm text-gray-300 mb-4">
              <span>{formatNumber(levelData.currentLevelExp)} EXP</span>
              <span>{formatNumber(levelData.expToNextLevel)} EXP</span>
            </div>

            {/* Next Level Info */}
            <div className="text-center text-sm text-gray-400">
              <span>Cần thêm </span>
              <span className="text-blue-400 font-semibold">
                {formatNumber(levelData.expToNextLevel - levelData.currentLevelExp)} EXP
              </span>
              <span> để lên level {character.level + 1}</span>
            </div>
          </>
        )}
      </div>

      {/* Level Cap Warning */}
      {character.level >= maxLevel - 5 && !levelData.isMaxLevel && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-3 mb-4"
        >
          <div className="flex items-start">
            <Award className="w-4 h-4 text-yellow-400 mr-2 mt-0.5" />
            <div>
              <p className="text-yellow-300 text-sm">
                <strong>Sắp đạt giới hạn!</strong> Level tối đa cho {realm} là {maxLevel}.
              </p>
              <p className="text-yellow-400 text-xs mt-1">
                Hãy chuẩn bị đột phá lên cảnh giới tiếp theo!
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Next Milestone */}
      {nextMilestone && !levelData.isMaxLevel && (
        <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Gift className="w-4 h-4 text-purple-400 mr-2" />
              <span className="text-purple-300 text-sm">
                Milestone tiếp theo: Level {nextMilestone}
              </span>
            </div>
            <span className="text-purple-400 text-sm font-semibold">
              {nextMilestone - character.level} levels
            </span>
          </div>
        </div>
      )}

      {/* Detailed Stats */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-gray-700 pt-4 mt-4"
        >
          <h4 className="text-sm font-semibold text-white mb-3">Chi Tiết Kinh Nghiệm</h4>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-gray-400 mb-1">Tổng EXP</div>
              <div className="text-white font-semibold">
                {formatNumber(levelData.totalExp)}
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-gray-400 mb-1">Level hiện tại</div>
              <div className="text-white font-semibold">
                {character.level} / {maxLevel}
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-gray-400 mb-1">EXP level này</div>
              <div className="text-blue-400 font-semibold">
                {formatNumber(levelData.currentLevelExp)}
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="text-gray-400 mb-1">EXP cần thiết</div>
              <div className="text-purple-400 font-semibold">
                {formatNumber(levelData.expToNextLevel)}
              </div>
            </div>
          </div>

          {/* EXP Sources Preview */}
          <div className="mt-4 p-3 bg-gray-800 rounded-lg">
            <h5 className="text-xs font-semibold text-gray-300 mb-2">Nguồn EXP chính:</h5>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Tu luyện (mỗi giờ):</span>
                <span className="text-green-400">+10 EXP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Đột phá thành công:</span>
                <span className="text-gold-400">+1,000 EXP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Đăng nhập hàng ngày:</span>
                <span className="text-blue-400">+25 EXP</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Level Up Tips */}
      {!levelData.isMaxLevel && (
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <h5 className="text-sm font-semibold text-blue-300 mb-2">💡 Mẹo tăng EXP nhanh:</h5>
          <ul className="text-xs text-blue-200 space-y-1">
            <li>• Tu luyện liên tục để nhận EXP theo thời gian</li>
            <li>• Đột phá thành công sẽ cho rất nhiều EXP</li>
            <li>• Đăng nhập hàng ngày để nhận bonus EXP</li>
            <li>• Hoàn thành quest và achievement (sắp có)</li>
          </ul>
        </div>
      )}
    </div>
  )
}
