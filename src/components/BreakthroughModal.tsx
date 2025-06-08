'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, X, Zap, TrendingUp, AlertTriangle, CheckCircle, XCircle, Sparkles } from 'lucide-react'
import { cultivation, REALM_DATA } from '@/lib/cultivation'
import { CULTIVATION_REALMS } from '@/lib/gameData'
import type { CultivationRealm } from '@/types/game'

interface BreakthroughModalProps {
  character: {
    id: string
    name: string
    level: number
    realm: string
    current_cultivation_points: number
  }
  nextRealm: CultivationRealm
  requirements: any
  onClose: () => void
  onSuccess: (result: any) => void
}

type BreakthroughPhase = 'confirmation' | 'preparation' | 'attempt' | 'result'

export default function BreakthroughModal({ 
  character, 
  nextRealm, 
  requirements, 
  onClose, 
  onSuccess 
}: BreakthroughModalProps) {
  const [phase, setPhase] = useState<BreakthroughPhase>('confirmation')
  const [attempting, setAttempting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [countdown, setCountdown] = useState(3)

  const currentRealmInfo = CULTIVATION_REALMS[character.realm as CultivationRealm]
  const nextRealmInfo = CULTIVATION_REALMS[nextRealm]
  const nextRealmData = REALM_DATA[nextRealm]

  const handleAttemptBreakthrough = async () => {
    setPhase('preparation')
    setAttempting(true)

    // Preparation phase (3 seconds)
    let count = 3
    setCountdown(count)
    
    const countdownInterval = setInterval(() => {
      count--
      setCountdown(count)
      if (count <= 0) {
        clearInterval(countdownInterval)
        setPhase('attempt')
        
        // Attempt phase (3 seconds)
        setTimeout(async () => {
          try {
            const breakthroughResult = await cultivation.attemptBreakthrough(character.id)
            setResult(breakthroughResult)
            setPhase('result')
            
            if (breakthroughResult.success) {
              onSuccess(breakthroughResult)
            }
          } catch (error) {
            console.error('Breakthrough error:', error)
            setResult({ 
              success: false, 
              error: 'Lỗi khi thực hiện đột phá' 
            })
            setPhase('result')
          } finally {
            setAttempting(false)
          }
        }, 3000)
      }
    }, 1000)
  }

  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="card max-w-lg w-full"
      >
        <AnimatePresence mode="wait">
          {/* Confirmation Phase */}
          {phase === 'confirmation' && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center">
                  <Crown className="w-6 h-6 mr-2 text-gold-400" />
                  Đột Phá Cảnh Giới
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Realm Transition */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${currentRealmInfo?.color || 'text-blue-400'}`}>
                      {currentRealmInfo?.name}
                    </div>
                    <div className="text-sm text-gray-400">Hiện tại</div>
                  </div>
                  
                  <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <TrendingUp className="w-8 h-8 text-gold-400" />
                  </motion.div>
                  
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${nextRealmInfo?.color || 'text-purple-400'}`}>
                      {nextRealmInfo?.name}
                    </div>
                    <div className="text-sm text-gray-400">Mục tiêu</div>
                  </div>
                </div>
              </div>

              {/* Requirements Check */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <span className="text-gray-300">Level yêu cầu:</span>
                  <span className={character.level >= nextRealmData.levelMin ? 'text-green-400' : 'text-red-400'}>
                    {character.level} / {nextRealmData.levelMin}
                    {character.level >= nextRealmData.levelMin ? ' ✓' : ' ✗'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <span className="text-gray-300">Điểm tu luyện:</span>
                  <span className={character.current_cultivation_points >= nextRealmData.cultivationPointsRequired ? 'text-green-400' : 'text-red-400'}>
                    {formatLargeNumber(character.current_cultivation_points)} / {formatLargeNumber(nextRealmData.cultivationPointsRequired)}
                    {character.current_cultivation_points >= nextRealmData.cultivationPointsRequired ? ' ✓' : ' ✗'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-900/30 rounded-lg">
                  <span className="text-gray-300">Tỷ lệ thành công:</span>
                  <span className="text-green-400 font-bold">90%</span>
                </div>
              </div>

              {/* Bonuses Preview */}
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg p-4 mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Phần thưởng khi thành công:</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-400">Bonus chỉ số:</span>
                    <div className="text-gold-400 font-semibold">
                      +{((nextRealmData.statMultiplier - REALM_DATA[character.realm as CultivationRealm].statMultiplier) * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Tốc độ tu luyện:</span>
                    <div className="text-blue-400 font-semibold">
                      +{(nextRealmData.cultivationSpeedBonus * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Skill slots:</span>
                    <div className="text-green-400 font-semibold">
                      +{nextRealmData.newSkillSlots}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400">Hồi phục:</span>
                    <div className="text-pink-400 font-semibold">
                      HP/MP đầy
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-red-300 text-sm">
                      <strong>Cảnh báo:</strong> Nếu đột phá thất bại, bạn sẽ mất 50% điểm tu luyện hiện tại. 
                      Tuy nhiên, bạn có thể thử lại sau khi tích lũy đủ điểm.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 btn-secondary py-3"
                >
                  Hủy bỏ
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAttemptBreakthrough}
                  disabled={attempting}
                  className="flex-1 btn-primary py-3 cultivation-glow"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Bắt đầu đột phá
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Preparation Phase */}
          {phase === 'preparation' && (
            <motion.div
              key="preparation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
              >
                <Zap className="w-12 h-12 text-white" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Chuẩn bị đột phá...</h3>
              <p className="text-gray-300 mb-6">Tập trung tinh thần, hấp thụ linh khí thiên địa</p>
              
              <motion.div
                key={countdown}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-6xl font-bold text-gold-400"
              >
                {countdown}
              </motion.div>
            </motion.div>
          )}

          {/* Attempt Phase */}
          {phase === 'attempt' && (
            <motion.div
              key="attempt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 0.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-gold-500 to-yellow-500 rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-16 h-16 text-white" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-white mb-4">Đang đột phá...</h3>
              <p className="text-gray-300">Phá vỡ giới hạn, vượt lên cảnh giới mới!</p>
              
              {/* Energy Effects */}
              <div className="relative mt-8">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gold-400 rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                      transformOrigin: `${60 * Math.cos(i * 45 * Math.PI / 180)}px ${60 * Math.sin(i * 45 * Math.PI / 180)}px`
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.125
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Result Phase */}
          {phase === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-8"
            >
              {result.success ? (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle className="w-12 h-12 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-green-400 mb-4">Đột phá thành công!</h3>
                  <p className="text-gray-300 mb-6">{result.message}</p>
                  
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Phần thưởng nhận được:</h4>
                    {result.bonuses && (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-gold-400">
                          ATK: +{result.bonuses.statIncrease.attack}
                        </div>
                        <div className="text-gold-400">
                          DEF: +{result.bonuses.statIncrease.defense}
                        </div>
                        <div className="text-gold-400">
                          SPD: +{result.bonuses.statIncrease.speed}
                        </div>
                        <div className="text-blue-400">
                          Tu luyện: +{(result.bonuses.cultivationSpeedIncrease * 100).toFixed(0)}%
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <XCircle className="w-12 h-12 text-white" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-red-400 mb-4">Đột phá thất bại!</h3>
                  <p className="text-gray-300 mb-6">{result.message}</p>
                  
                  {result.canRetry && (
                    <div className="bg-yellow-900/30 border border-yellow-500/30 rounded-lg p-4 mb-6">
                      <p className="text-yellow-300 text-sm">
                        💡 Đừng nản lòng! Hãy tiếp tục tu luyện để tích lũy thêm điểm và thử lại.
                      </p>
                    </div>
                  )}
                </>
              )}
              
              <button
                onClick={onClose}
                className="btn-primary px-8 py-3"
              >
                Đóng
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
