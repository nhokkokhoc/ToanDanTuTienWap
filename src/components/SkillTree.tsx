'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SectType, SkillTree as SkillTreeType, CharacterSkill, SkillPointsInfo } from '@/types/game'
import { getSkillTreeBySect } from '@/lib/gameData'
import { getCharacterSkills, getCharacterSkillPoints } from '@/lib/skills'
import SkillNode from './SkillNode'
import SkillPointsDisplay from './SkillPointsDisplay'

interface SkillTreeProps {
  characterId: string
  sectId: SectType
  characterLevel: number
  characterRealm: string
  onSkillUpgrade?: () => void
}

export default function SkillTree({ 
  characterId, 
  sectId, 
  characterLevel, 
  characterRealm,
  onSkillUpgrade 
}: SkillTreeProps) {
  const [skillTree, setSkillTree] = useState<SkillTreeType | null>(null)
  const [characterSkills, setCharacterSkills] = useState<CharacterSkill[]>([])
  const [skillPoints, setSkillPoints] = useState<SkillPointsInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSkillData()
  }, [characterId, sectId])

  const loadSkillData = async () => {
    try {
      setLoading(true)
      
      // Load skill tree
      const tree = getSkillTreeBySect(sectId)
      setSkillTree(tree)
      
      // Load character skills
      const skills = await getCharacterSkills(characterId)
      setCharacterSkills(skills)
      
      // Load skill points
      const points = await getCharacterSkillPoints(characterId)
      setSkillPoints(points)
      
    } catch (error) {
      console.error('Error loading skill data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSkillUpgrade = async () => {
    await loadSkillData()
    onSkillUpgrade?.()
  }

  const getCharacterSkillLevel = (skillId: string): number => {
    const skill = characterSkills.find(s => s.skillId === skillId)
    return skill?.skillLevel || 0
  }

  const getUnlockedSkillIds = (): string[] => {
    return characterSkills.map(s => s.skillId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!skillTree || !skillPoints) {
    return (
      <div className="text-center p-8 text-gray-500">
        Không thể tải skill tree
      </div>
    )
  }

  return (
    <div className="skill-tree-container p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Skill Tree - {skillTree.sectId === 'sword' ? 'Kiếm Tông' : 
                       skillTree.sectId === 'lightning' ? 'Lôi Tông' :
                       skillTree.sectId === 'medical' ? 'Y Tông' : 'Phòng Thủ Tông'}
        </h2>
        <SkillPointsDisplay skillPoints={skillPoints} />
      </div>

      {/* Skill Tree Tiers */}
      <div className="space-y-8">
        {skillTree.tiers.map((tier, tierIndex) => (
          <motion.div
            key={tier.tier}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: tierIndex * 0.1 }}
            className="tier-container"
          >
            {/* Tier Header */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-yellow-400">
                Tier {tier.tier}: {tier.name}
              </h3>
              {tier.unlockRequirements.level && (
                <p className="text-sm text-gray-400">
                  Yêu cầu: Level {tier.unlockRequirements.level}
                  {tier.unlockRequirements.previousTierSkills && 
                    ` | ${tier.unlockRequirements.previousTierSkills} skills từ tier trước`}
                </p>
              )}
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tier.skills.map((skill) => (
                <SkillNode
                  key={skill.id}
                  skill={skill}
                  characterLevel={characterLevel}
                  characterRealm={characterRealm}
                  currentLevel={getCharacterSkillLevel(skill.id)}
                  unlockedSkills={getUnlockedSkillIds()}
                  availableSkillPoints={skillPoints.available}
                  characterId={characterId}
                  sectId={sectId}
                  onUpgrade={handleSkillUpgrade}
                />
              ))}
            </div>

            {/* Connection Lines (for visual appeal) */}
            {tierIndex < skillTree.tiers.length - 1 && (
              <div className="flex justify-center my-6">
                <div className="w-px h-8 bg-gradient-to-b from-yellow-400 to-transparent"></div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-8 p-4 bg-gray-800 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Chú thích:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-400">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
            Có thể học
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
            Đã học
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
            Đã max
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-500 rounded mr-2"></div>
            Chưa mở khóa
          </div>
        </div>
      </div>
    </div>
  )
}
