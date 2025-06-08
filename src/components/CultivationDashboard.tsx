'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Crown, TrendingUp, Clock, Zap, Star, ArrowUp } from 'lucide-react'
import CultivationTimer from './CultivationTimer'
import OfflineProgress from './OfflineProgress'
import BreakthroughModal from './BreakthroughModal'
import LevelProgress from './LevelProgress'
import { cultivation, REALM_DATA } from '@/lib/cultivation'
import { CULTIVATION_REALMS } from '@/lib/gameData'
import type { CultivationRealm } from '@/types/game'

interface CultivationDashboardProps {
  character: {
    id: string
    name: string
    level: number
    realm: string
    current_cultivation_points: number
    is_cultivating: boolean
    sect: string
  }
  onCharacterUpdate?: (character: any) => void
}

export default function CultivationDashboard({ character, onCharacterUpdate }: CultivationDashboardProps) {
  const [showOfflineProgress, setShowOfflineProgress] = useState(false)
  const [showBreakthroughModal, setShowBreakthroughModal] = useState(false)
  const [cultivationActive, setCultivationActive] = useState(character.is_cultivating)
  const [currentProgress, setCurrentProgress] = useState<any>(null)
  const [canBreakthrough, setCanBreakthrough] = useState(false)
  const [breakthroughData, setBreakthroughData] = useState<any>(null)

  const currentRealm = character.realm as CultivationRealm
  const realmData = REALM_DATA[currentRealm]
  const realmInfo = CULTIVATION_REALMS[currentRealm]
  const nextRealm = cultivation.getNextRealm(currentRealm)
  const nextRealmData = nextRealm ? REALM_DATA[nextRealm] : null

  useEffect(() => {
    checkOfflineProgress()
    checkBreakthroughEligibility()
  }, [character.id])

  const checkOfflineProgress = async () => {
    try {
      const result = await cultivation.calculateOfflineProgress(character.id)
      if (result.pointsGained > 0) {
        setShowOfflineProgress(true)
      }
    } catch (error) {
      console.error('Error checking offline progress:', error)
    }
  }

  const checkBreakthroughEligibility = async () => {
    try {
      const result = await cultivation.canBreakthrough(character.id)
      setCanBreakthrough(result.canBreakthrough)
      setBreakthroughData(result)
    } catch (error) {
      console.error('Error checking breakthrough:', error)
    }
  }

  const handleProgressUpdate = (progress: any) => {
    setCurrentProgress(progress)
    checkBreakthroughEligibility()
  }

  const handleOfflineProgressClaim = (progress: any) => {
    // Update character data
    const updatedCharacter = {
      ...character,
      current_cultivation_points: character.current_cultivation_points + progress.pointsGained
    }

    if (onCharacterUpdate) {
      onCharacterUpdate(updatedCharacter)
    }
  }

  const handleBreakthroughSuccess = (result: any) => {
    // Update character data after successful breakthrough
    if (result.success && onCharacterUpdate) {
      // Refresh character data from server
      window.location.reload() // Simple refresh for now
    }
    setShowBreakthroughModal(false)
  }

  const calculateRealmProgress = () => {
    const currentPoints = currentProgress?.totalPoints || character.current_cultivation_points
    const requiredPoints = nextRealmData?.cultivationPointsRequired || realmData.cultivationPointsRequired
    
    if (!nextRealmData) return 100 // Max realm
    
    const progress = (currentPoints / requiredPoints) * 100
    return Math.min(progress, 100)
  }

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* Offline Progress Modal */}
      {showOfflineProgress && (
        <OfflineProgress
          characterId={character.id}
          onClose={() => setShowOfflineProgress(false)}
          onClaim={handleOfflineProgressClaim}
        />
      )}

      {/* Breakthrough Modal */}
      {showBreakthroughModal && canBreakthrough && nextRealm && (
        <BreakthroughModal
          character={character}
          nextRealm={nextRealm}
          requirements={breakthroughData}
          onClose={() => setShowBreakthroughModal(false)}
          onSuccess={handleBreakthroughSuccess}
        />
      )}

      {/* Character Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">{character.name}</h2>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-300">Level {character.level}</span>
              <span className={`${realmInfo?.color || 'text-blue-400'}`}>
                {realmInfo?.name || character.realm}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-purple-400">
              {formatLargeNumber(currentProgress?.totalPoints || character.current_cultivation_points)}
            </div>
            <div className="text-sm text-gray-400">Điểm tu luyện</div>
          </div>
        </div>

        {/* Realm Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Tiến độ cảnh giới</span>
            <span className="text-gray-400">
              {nextRealmData ? `${calculateRealmProgress().toFixed(1)}%` : 'Đã đạt tối đa'}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${calculateRealmProgress()}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-3 rounded-full bg-gradient-to-r ${
                nextRealmData 
                  ? 'from-blue-500 to-purple-500' 
                  : 'from-gold-500 to-yellow-500'
              }`}
            />
          </div>
          {nextRealmData && (
            <div className="flex justify-between text-xs text-gray-500">
              <span>{realmInfo?.name}</span>
              <span>{CULTIVATION_REALMS[nextRealm!]?.name}</span>
            </div>
          )}
        </div>

        {/* Breakthrough Button */}
        {canBreakthrough && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <button
              onClick={() => setShowBreakthroughModal(true)}
              className="w-full btn-primary py-3 flex items-center justify-center cultivation-glow"
            >
              <Crown className="w-5 h-5 mr-2" />
              Đột Phá Lên {CULTIVATION_REALMS[nextRealm!]?.name}
              <ArrowUp className="w-4 h-4 ml-2" />
            </button>
          </motion.div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <CultivationTimer
            characterId={character.id}
            isActive={cultivationActive}
            onToggle={setCultivationActive}
            onProgressUpdate={handleProgressUpdate}
          />

          <LevelProgress character={character} />
        </div>

        {/* Right Column - Realm Stats */}
        <div className="space-y-6">
          {/* Current Realm Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Star className="w-5 h-5 mr-2 text-gold-400" />
              Cảnh Giới Hiện Tại
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Tên:</span>
                <span className={`font-semibold ${realmInfo?.color || 'text-blue-400'}`}>
                  {realmInfo?.name}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Level range:</span>
                <span className="text-white">
                  {realmData.levelMin} - {realmData.levelMax}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Bonus chỉ số:</span>
                <span className="text-green-400">
                  +{((realmData.statMultiplier - 1) * 100).toFixed(0)}%
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Tốc độ tu luyện:</span>
                <span className="text-blue-400">
                  +{(realmData.cultivationSpeedBonus * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>

          {/* Next Realm Preview */}
          {nextRealmData && (
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
                Cảnh Giới Tiếp Theo
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Tên:</span>
                  <span className="font-semibold text-purple-400">
                    {CULTIVATION_REALMS[nextRealm!]?.name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Yêu cầu level:</span>
                  <span className={character.level >= nextRealmData.levelMin ? 'text-green-400' : 'text-red-400'}>
                    {nextRealmData.levelMin}+
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Điểm cần:</span>
                  <span className={
                    (currentProgress?.totalPoints || character.current_cultivation_points) >= nextRealmData.cultivationPointsRequired
                      ? 'text-green-400'
                      : 'text-red-400'
                  }>
                    {formatLargeNumber(nextRealmData.cultivationPointsRequired)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Bonus mới:</span>
                  <span className="text-gold-400">
                    +{((nextRealmData.statMultiplier - 1) * 100).toFixed(0)}% stats
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cultivation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ display: 'none' }}>
        {/* Current Realm Info */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2 text-gold-400" />
            Cảnh Giới Hiện Tại
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Tên:</span>
              <span className={`font-semibold ${realmInfo?.color || 'text-blue-400'}`}>
                {realmInfo?.name}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Level range:</span>
              <span className="text-white">
                {realmData.levelMin} - {realmData.levelMax}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Bonus chỉ số:</span>
              <span className="text-green-400">
                +{((realmData.statMultiplier - 1) * 100).toFixed(0)}%
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Tốc độ tu luyện:</span>
              <span className="text-blue-400">
                +{(realmData.cultivationSpeedBonus * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Next Realm Preview */}
        {nextRealmData && (
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-purple-400" />
              Cảnh Giới Tiếp Theo
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Tên:</span>
                <span className="font-semibold text-purple-400">
                  {CULTIVATION_REALMS[nextRealm!]?.name}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Yêu cầu level:</span>
                <span className={character.level >= nextRealmData.levelMin ? 'text-green-400' : 'text-red-400'}>
                  {nextRealmData.levelMin}+
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Điểm cần:</span>
                <span className={
                  (currentProgress?.totalPoints || character.current_cultivation_points) >= nextRealmData.cultivationPointsRequired 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }>
                  {formatLargeNumber(nextRealmData.cultivationPointsRequired)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Bonus mới:</span>
                <span className="text-gold-400">
                  +{((nextRealmData.statMultiplier - 1) * 100).toFixed(0)}% stats
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cultivation Tips */}
      <div className="card bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/30">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-blue-400" />
          Mẹo Tu Luyện
        </h3>
        
        <div className="space-y-2 text-sm">
          <p className="text-blue-200">
            🧘 <strong>Tu luyện liên tục:</strong> Để game chạy trong background để tích lũy điểm tu vi
          </p>
          <p className="text-purple-200">
            ⚡ <strong>Offline bonus:</strong> Nhận 50% hiệu quả tu luyện ngay cả khi offline (tối đa 24h)
          </p>
          <p className="text-green-200">
            🌟 <strong>Đột phá:</strong> Đạt đủ level và điểm tu luyện để nâng cấp cảnh giới
          </p>
          <p className="text-gold-200">
            💎 <strong>Tông phái:</strong> Mỗi tông phái có bonus tu luyện khác nhau
          </p>
        </div>
      </div>
    </div>
  )
}
