'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Zap, Gift, X, CheckCircle } from 'lucide-react'
import { cultivation } from '@/lib/cultivation'

interface OfflineProgressProps {
  characterId: string
  onClose: () => void
  onClaim: (progress: OfflineProgressData) => void
}

interface OfflineProgressData {
  pointsGained: number
  timeElapsed: number
  efficiency: number
  bonusMultiplier: number
}

export default function OfflineProgress({ characterId, onClose, onClaim }: OfflineProgressProps) {
  const [progress, setProgress] = useState<OfflineProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [claimed, setClaimed] = useState(false)

  useEffect(() => {
    calculateOfflineProgress()
  }, [characterId])

  const calculateOfflineProgress = async () => {
    try {
      setLoading(true)
      const result = await cultivation.calculateOfflineProgress(characterId)
      
      // Calculate additional data
      const efficiency = 0.5 // 50% offline efficiency
      const bonusMultiplier = 1.0 // Base multiplier, can be enhanced later
      
      setProgress({
        pointsGained: result.pointsGained,
        timeElapsed: result.timeElapsed,
        efficiency,
        bonusMultiplier
      })
    } catch (error) {
      console.error('Error calculating offline progress:', error)
      setProgress({
        pointsGained: 0,
        timeElapsed: 0,
        efficiency: 0.5,
        bonusMultiplier: 1.0
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClaim = async () => {
    if (!progress || claimed) return
    
    setClaiming(true)
    try {
      // Update character with offline progress
      await cultivation.updateProgress(characterId)
      setClaimed(true)
      
      // Notify parent component
      onClaim(progress)
      
      // Auto close after 2 seconds
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      console.error('Error claiming offline progress:', error)
    } finally {
      setClaiming(false)
    }
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} phút`
    }
    
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    
    if (hours < 24) {
      return remainingMinutes > 0 
        ? `${hours} giờ ${remainingMinutes} phút`
        : `${hours} giờ`
    }
    
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    
    return remainingHours > 0
      ? `${days} ngày ${remainingHours} giờ`
      : `${days} ngày`
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="card max-w-md w-full">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-300">Đang tính toán tiến độ offline...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!progress || progress.pointsGained === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="card max-w-md w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Tiến Độ Offline</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-300 mb-4">
              Bạn chưa có tiến độ tu luyện offline nào.
            </p>
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="card max-w-md w-full"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Gift className="w-5 h-5 mr-2 text-gold-400" />
            Tiến Độ Offline
          </h3>
          {!claimed && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!claimed ? (
            <motion.div
              key="unclaimed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Welcome Back Message */}
              <div className="text-center mb-6">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-6xl mb-4"
                >
                  🎁
                </motion.div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  Chào mừng trở lại!
                </h4>
                <p className="text-gray-300">
                  Bạn đã tu luyện offline và nhận được phần thưởng
                </p>
              </div>

              {/* Progress Stats */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between p-3 bg-blue-900/30 rounded-lg">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-blue-400 mr-3" />
                    <span className="text-gray-300">Thời gian offline:</span>
                  </div>
                  <span className="text-blue-400 font-semibold">
                    {formatTime(progress.timeElapsed)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-900/30 rounded-lg">
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 text-purple-400 mr-3" />
                    <span className="text-gray-300">Điểm tu luyện:</span>
                  </div>
                  <span className="text-purple-400 font-semibold">
                    +{progress.pointsGained.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-900/30 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-green-400 mr-3">⚡</span>
                    <span className="text-gray-300">Hiệu suất offline:</span>
                  </div>
                  <span className="text-green-400 font-semibold">
                    {(progress.efficiency * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Efficiency Info */}
              <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded-lg mb-6">
                <p className="text-yellow-300 text-sm">
                  💡 <strong>Lưu ý:</strong> Tu luyện offline có hiệu suất 50% so với online. 
                  Để đạt hiệu quả tối đa, hãy tu luyện khi đang online!
                </p>
              </div>

              {/* Claim Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClaim}
                disabled={claiming}
                className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {claiming ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Đang nhận...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Gift className="w-5 h-5 mr-2" />
                    Nhận Phần Thưởng
                  </div>
                )}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="claimed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-8 h-8 text-white" />
              </motion.div>
              
              <h4 className="text-lg font-semibold text-green-400 mb-2">
                Đã nhận thành công!
              </h4>
              <p className="text-gray-300 mb-4">
                Phần thưởng đã được thêm vào tài khoản của bạn
              </p>
              
              <div className="text-2xl font-bold text-purple-400 mb-4">
                +{progress.pointsGained.toLocaleString()} điểm tu luyện
              </div>
              
              <p className="text-sm text-gray-400">
                Cửa sổ này sẽ tự động đóng...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
