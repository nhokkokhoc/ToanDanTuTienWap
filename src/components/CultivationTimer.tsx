'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Square, Zap, Clock, TrendingUp } from 'lucide-react'
import { cultivation, CULTIVATION_CONFIG } from '@/lib/cultivation'

interface CultivationTimerProps {
  characterId: string
  isActive: boolean
  onToggle: (active: boolean) => void
  onProgressUpdate?: (progress: any) => void
}

export default function CultivationTimer({ 
  characterId, 
  isActive, 
  onToggle, 
  onProgressUpdate 
}: CultivationTimerProps) {
  const [sessionTime, setSessionTime] = useState(0) // in seconds
  const [currentPoints, setCurrentPoints] = useState(0)
  const [pointsPerHour, setPointsPerHour] = useState(0)
  const [cultivationSpeed, setCultivationSpeed] = useState(1.0)
  const [loading, setLoading] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate points gained this session
  const calculateSessionPoints = (timeInSeconds: number) => {
    const pointsPerSecond = (pointsPerHour / 3600)
    return Math.floor(pointsPerSecond * timeInSeconds)
  }

  // Start cultivation timer
  const startTimer = () => {
    if (intervalRef.current) return
    
    intervalRef.current = setInterval(() => {
      setSessionTime(prev => prev + 1)
    }, 1000)
  }

  // Stop cultivation timer
  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // Update progress from server
  const updateProgress = async () => {
    try {
      const progress = await cultivation.calculateProgress(characterId)
      setCurrentPoints(progress.totalPoints)
      setPointsPerHour(progress.pointsPerHour)
      setCultivationSpeed(progress.cultivationSpeed)
      
      if (onProgressUpdate) {
        onProgressUpdate(progress)
      }
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  // Handle cultivation toggle
  const handleToggle = async () => {
    setLoading(true)
    
    try {
      if (isActive) {
        // Stop cultivation
        await cultivation.stopCultivation(characterId)
        stopTimer()
        setSessionTime(0)
      } else {
        // Start cultivation
        await cultivation.startCultivation(characterId)
        startTimer()
      }
      
      onToggle(!isActive)
      await updateProgress()
    } catch (error) {
      console.error('Error toggling cultivation:', error)
    } finally {
      setLoading(false)
    }
  }

  // Initialize and setup intervals
  useEffect(() => {
    updateProgress()
    
    // Setup periodic progress updates
    updateIntervalRef.current = setInterval(updateProgress, CULTIVATION_CONFIG.SESSION_UPDATE_INTERVAL)
    
    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current)
      }
    }
  }, [characterId])

  // Handle active state changes
  useEffect(() => {
    if (isActive) {
      startTimer()
    } else {
      stopTimer()
      setSessionTime(0)
    }
    
    return () => stopTimer()
  }, [isActive])

  const sessionPoints = calculateSessionPoints(sessionTime)

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Zap className="w-5 h-5 mr-2 text-blue-400" />
          Tu Luyện
        </h3>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <TrendingUp className="w-4 h-4" />
          <span>{cultivationSpeed.toFixed(2)}x tốc độ</span>
        </div>
      </div>

      {/* Cultivation Status */}
      <div className="text-center mb-6">
        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-4"
            >
              {/* Meditation Animation */}
              <div className="relative">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-3xl">🧘</span>
                </motion.div>
                
                {/* Particle Effects */}
                <motion.div
                  animate={{ 
                    rotate: 360,
                  }}
                  transition={{ 
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 w-24 h-24 mx-auto"
                >
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-blue-400 rounded-full"
                      style={{
                        top: '50%',
                        left: '50%',
                        transformOrigin: `${30 * Math.cos(i * 60 * Math.PI / 180)}px ${30 * Math.sin(i * 60 * Math.PI / 180)}px`
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                    />
                  ))}
                </motion.div>
              </div>

              <div className="text-green-400 font-semibold">
                Đang tu luyện...
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="inactive"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-4"
            >
              <div className="w-24 h-24 mx-auto bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-3xl opacity-50">🧘</span>
              </div>
              <div className="text-gray-400">
                Chưa bắt đầu tu luyện
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Timer Display */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-white flex items-center justify-center">
            <Clock className="w-5 h-5 mr-2 text-blue-400" />
            {formatTime(sessionTime)}
          </div>
          <div className="text-sm text-gray-400">Thời gian phiên</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">
            +{sessionPoints.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Điểm phiên này</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Tổng điểm:</span>
          <span className="text-blue-400 font-semibold">
            {currentPoints.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Điểm/giờ:</span>
          <span className="text-green-400 font-semibold">
            {Math.floor(pointsPerHour).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleToggle}
          disabled={loading}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold flex items-center justify-center transition-colors ${
            isActive
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : isActive ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Dừng Tu Luyện
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Bắt Đầu Tu Luyện
            </>
          )}
        </motion.button>
      </div>

      {/* Tips */}
      {!isActive && (
        <div className="mt-4 p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-300">
            💡 <strong>Mẹo:</strong> Tu luyện liên tục để tích lũy điểm tu vi. 
            Ngay cả khi offline, bạn vẫn nhận được 50% hiệu quả tu luyện!
          </p>
        </div>
      )}
    </div>
  )
}
