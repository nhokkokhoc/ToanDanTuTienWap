'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import StoryIntro from './StoryIntro'
import CharacterCreation from './CharacterCreation'
import type { SectType } from '@/types/game'

interface GameIntroProps {
  onCharacterCreated: (characterData: { name: string; sect: SectType }) => void
  onCancel: () => void
  loading?: boolean
}

type IntroStep = 'story' | 'character-creation'

export default function GameIntro({ onCharacterCreated, onCancel, loading = false }: GameIntroProps) {
  const [currentStep, setCurrentStep] = useState<IntroStep>('story')
  const [showStory, setShowStory] = useState(true)

  const handleStoryComplete = () => {
    setCurrentStep('character-creation')
  }

  const handleStorySkip = () => {
    setCurrentStep('character-creation')
  }

  const handleCharacterCreated = (characterData: { name: string; sect: SectType }) => {
    onCharacterCreated(characterData)
  }

  const handleCharacterCancel = () => {
    // Option to go back to story or cancel completely
    setCurrentStep('story')
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentStep === 'story' && (
          <motion.div
            key="story"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StoryIntro
              onComplete={handleStoryComplete}
              onSkip={handleStorySkip}
            />
          </motion.div>
        )}

        {currentStep === 'character-creation' && (
          <motion.div
            key="character-creation"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex items-center justify-center p-4"
          >
            <div className="w-full max-w-4xl">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl font-bold text-gradient mb-4"
                >
                  Tạo Nhân Vật Tu Tiên
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-gray-300"
                >
                  Hành trình tu tiên của bạn bắt đầu từ đây
                </motion.p>
              </div>

              {/* Character Creation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <CharacterCreation
                  onComplete={handleCharacterCreated}
                  onCancel={onCancel}
                  loading={loading}
                />
              </motion.div>

              {/* Story Replay Option */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center mt-8"
              >
                <button
                  onClick={() => setCurrentStep('story')}
                  className="text-blue-400 hover:text-blue-300 text-sm underline"
                >
                  📖 Xem lại câu chuyện
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
