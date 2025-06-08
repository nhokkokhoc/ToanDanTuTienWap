'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { SectType, SectSkill } from '@/types/game'
import { canUnlockSkill, upgradeSkill } from '@/lib/skills'
import { SKILL_COSTS } from '@/lib/gameData'
import SkillTooltip from './SkillTooltip'

interface SkillNodeProps {
  skill: SectSkill
  characterLevel: number
  characterRealm: string
  currentLevel: number
  unlockedSkills: string[]
  availableSkillPoints: number
  characterId: string
  sectId: SectType
  onUpgrade: () => void
}

export default function SkillNode({
  skill,
  characterLevel,
  characterRealm,
  currentLevel,
  unlockedSkills,
  availableSkillPoints,
  characterId,
  sectId,
  onUpgrade
}: SkillNodeProps) {
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const isUnlocked = unlockedSkills.includes(skill.id) || currentLevel > 0
  const canUnlock = canUnlockSkill(skill, characterLevel, characterRealm, unlockedSkills)
  const isMaxLevel = currentLevel >= skill.maxLevel
  const upgradeCost = SKILL_COSTS[`tier_${skill.tier}` as keyof typeof SKILL_COSTS] || 1
  const canUpgrade = isUnlocked && !isMaxLevel && availableSkillPoints >= upgradeCost

  const getNodeColor = () => {
    if (isMaxLevel) return 'from-yellow-500 to-yellow-600' // Max level
    if (isUnlocked) return 'from-blue-500 to-blue-600' // Learned
    if (canUnlock) return 'from-green-500 to-green-600' // Can learn
    return 'from-gray-500 to-gray-600' // Locked
  }

  const getNodeBorder = () => {
    if (isMaxLevel) return 'border-yellow-400'
    if (isUnlocked) return 'border-blue-400'
    if (canUnlock) return 'border-green-400'
    return 'border-gray-400'
  }

  const handleUpgrade = async () => {
    if (!canUpgrade || isUpgrading) return

    try {
      setIsUpgrading(true)
      const success = await upgradeSkill(characterId, skill.id, sectId)
      if (success) {
        onUpgrade()
      }
    } catch (error) {
      console.error('Error upgrading skill:', error)
    } finally {
      setIsUpgrading(false)
    }
  }

  return (
    <div className="relative">
      <motion.div
        className={`
          skill-node relative p-4 rounded-lg border-2 cursor-pointer
          bg-gradient-to-br ${getNodeColor()} ${getNodeBorder()}
          transition-all duration-200 hover:scale-105
          ${canUpgrade ? 'hover:shadow-lg hover:shadow-green-500/20' : ''}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleUpgrade}
      >
        {/* Skill Icon */}
        <div className="text-center mb-2">
          <div className="text-2xl mb-1">{skill.icon || '⭐'}</div>
          <h4 className="text-sm font-semibold text-white truncate">
            {skill.name}
          </h4>
        </div>

        {/* Level Progress */}
        <div className="mb-2">
          <div className="flex justify-between items-center text-xs text-gray-200 mb-1">
            <span>Level {currentLevel}/{skill.maxLevel}</span>
            {!isMaxLevel && canUnlock && (
              <span className="text-yellow-300">Cost: {upgradeCost}</span>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentLevel / skill.maxLevel) * 100}%` }}
            />
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex justify-center">
          {isMaxLevel && (
            <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full font-semibold">
              MAX
            </span>
          )}
          {!isUnlocked && !canUnlock && (
            <span className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded-full">
              Locked
            </span>
          )}
          {canUpgrade && (
            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full font-semibold animate-pulse">
              Upgrade
            </span>
          )}
        </div>

        {/* Upgrade Loading */}
        {isUpgrading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        )}

        {/* Tier Indicator */}
        <div className="absolute top-1 right-1">
          <span className="text-xs bg-purple-600 text-white px-1 py-0.5 rounded">
            T{skill.tier}
          </span>
        </div>
      </motion.div>

      {/* Tooltip */}
      {showTooltip && (
        <SkillTooltip
          skill={skill}
          currentLevel={currentLevel}
          canUnlock={canUnlock}
          isUnlocked={isUnlocked}
          upgradeCost={upgradeCost}
          availableSkillPoints={availableSkillPoints}
        />
      )}
    </div>
  )
}
