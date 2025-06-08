'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { SectSkill } from '@/types/game'

interface SkillTooltipProps {
  skill: SectSkill
  currentLevel: number
  canUnlock: boolean
  isUnlocked: boolean
  upgradeCost: number
  availableSkillPoints: number
}

export default function SkillTooltip({
  skill,
  currentLevel,
  canUnlock,
  isUnlocked,
  upgradeCost,
  availableSkillPoints
}: SkillTooltipProps) {
  const isMaxLevel = currentLevel >= skill.maxLevel

  const formatEffectValue = (effect: any, level: number) => {
    const baseValue = effect.value
    const perLevelValue = effect.valuePerLevel || 0
    const totalValue = baseValue + (perLevelValue * level)
    
    // Format based on stat type
    if (effect.statType === 'criticalRate' || effect.statType === 'accuracy' || effect.statType === 'evasion') {
      return `${(totalValue * 100).toFixed(1)}%`
    }
    if (effect.type === 'cultivation_speed') {
      return `${(totalValue * 100).toFixed(1)}%`
    }
    return totalValue.toString()
  }

  const getStatDisplayName = (statType: string) => {
    const names: Record<string, string> = {
      attack: 'Tấn Công',
      defense: 'Phòng Thủ',
      speed: 'Tốc Độ',
      criticalRate: 'Tỷ Lệ Chí Mạng',
      criticalDamage: 'Sát Thương Chí Mạng',
      accuracy: 'Chính Xác',
      evasion: 'Né Tránh',
      spiritualPower: 'Sức Mạnh Tinh Thần',
      comprehension: 'Lĩnh Ngộ',
      luck: 'May Mắn'
    }
    return names[statType] || statType
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80"
    >
      <div className="bg-gray-900 border border-gray-600 rounded-lg p-4 shadow-xl">
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-white flex items-center">
              <span className="mr-2">{skill.icon || '⭐'}</span>
              {skill.name}
            </h3>
            <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded">
              Tier {skill.tier}
            </span>
          </div>
          <p className="text-sm text-gray-300">{skill.description}</p>
        </div>

        {/* Current Effects */}
        {currentLevel > 0 && (
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-blue-400 mb-2">
              Hiệu Ứng Hiện Tại (Level {currentLevel}):
            </h4>
            <div className="space-y-1">
              {skill.effects.map((effect, index) => (
                <div key={index} className="text-sm text-green-400">
                  {effect.type === 'stat_bonus' && effect.statType && (
                    <span>
                      +{formatEffectValue(effect, currentLevel)} {getStatDisplayName(effect.statType)}
                    </span>
                  )}
                  {effect.type === 'cultivation_speed' && (
                    <span>
                      +{formatEffectValue(effect, currentLevel)} Tốc Độ Tu Luyện
                    </span>
                  )}
                  {effect.type === 'passive_ability' && (
                    <span>
                      Khả năng đặc biệt: {formatEffectValue(effect, currentLevel)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Level Preview */}
        {!isMaxLevel && isUnlocked && (
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-yellow-400 mb-2">
              Hiệu Ứng Level {currentLevel + 1}:
            </h4>
            <div className="space-y-1">
              {skill.effects.map((effect, index) => (
                <div key={index} className="text-sm text-yellow-300">
                  {effect.type === 'stat_bonus' && effect.statType && (
                    <span>
                      +{formatEffectValue(effect, currentLevel + 1)} {getStatDisplayName(effect.statType)}
                    </span>
                  )}
                  {effect.type === 'cultivation_speed' && (
                    <span>
                      +{formatEffectValue(effect, currentLevel + 1)} Tốc Độ Tu Luyện
                    </span>
                  )}
                  {effect.type === 'passive_ability' && (
                    <span>
                      Khả năng đặc biệt: {formatEffectValue(effect, currentLevel + 1)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Requirements */}
        <div className="mb-3">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Yêu Cầu:</h4>
          <div className="space-y-1 text-xs">
            {skill.requirements.level && (
              <div className="text-gray-300">
                Level: {skill.requirements.level}
              </div>
            )}
            {skill.requirements.realm && (
              <div className="text-gray-300">
                Cảnh giới: {skill.requirements.realm}
              </div>
            )}
            {skill.requirements.prerequisiteSkills && skill.requirements.prerequisiteSkills.length > 0 && (
              <div className="text-gray-300">
                Kỹ năng tiên quyết: {skill.requirements.prerequisiteSkills.join(', ')}
              </div>
            )}
          </div>
        </div>

        {/* Upgrade Info */}
        {!isMaxLevel && (
          <div className="border-t border-gray-700 pt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-300">
                Chi phí nâng cấp:
              </span>
              <span className={`text-sm font-semibold ${
                availableSkillPoints >= upgradeCost ? 'text-green-400' : 'text-red-400'
              }`}>
                {upgradeCost} điểm
              </span>
            </div>
            
            {!canUnlock && (
              <div className="mt-2 text-xs text-red-400">
                Chưa đủ điều kiện để mở khóa
              </div>
            )}
            
            {canUnlock && !isUnlocked && (
              <div className="mt-2 text-xs text-green-400">
                Click để mở khóa kỹ năng
              </div>
            )}
            
            {isUnlocked && availableSkillPoints < upgradeCost && (
              <div className="mt-2 text-xs text-red-400">
                Không đủ điểm kỹ năng
              </div>
            )}
            
            {isUnlocked && availableSkillPoints >= upgradeCost && (
              <div className="mt-2 text-xs text-green-400">
                Click để nâng cấp
              </div>
            )}
          </div>
        )}

        {isMaxLevel && (
          <div className="border-t border-gray-700 pt-3">
            <div className="text-center text-yellow-400 font-semibold">
              ⭐ Đã đạt cấp độ tối đa ⭐
            </div>
          </div>
        )}

        {/* Tooltip Arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2">
          <div className="border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-900"></div>
        </div>
      </div>
    </motion.div>
  )
}
