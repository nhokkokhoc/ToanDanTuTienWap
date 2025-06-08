'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { SkillPointsInfo } from '@/types/game'

interface SkillPointsDisplayProps {
  skillPoints: SkillPointsInfo
}

export default function SkillPointsDisplay({ skillPoints }: SkillPointsDisplayProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="skill-points-display">
      {/* Main Display */}
      <motion.div
        className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-4 cursor-pointer"
        whileHover={{ scale: 1.02 }}
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Điểm Kỹ Năng</h3>
            <p className="text-purple-200 text-sm">Click để xem chi tiết</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {skillPoints.available}
            </div>
            <div className="text-purple-200 text-sm">
              / {skillPoints.totalEarned} tổng
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detailed Breakdown */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-4 bg-gray-800 rounded-lg p-4 border border-gray-600"
        >
          <h4 className="text-lg font-semibold text-white mb-3">
            Chi Tiết Điểm Kỹ Năng
          </h4>
          
          <div className="space-y-3">
            {/* Available Points */}
            <div className="flex justify-between items-center p-3 bg-green-600 bg-opacity-20 rounded-lg border border-green-500">
              <span className="text-green-400 font-medium">Điểm Có Thể Sử Dụng</span>
              <span className="text-green-400 font-bold text-lg">{skillPoints.available}</span>
            </div>

            {/* Total Earned */}
            <div className="flex justify-between items-center p-3 bg-blue-600 bg-opacity-20 rounded-lg border border-blue-500">
              <span className="text-blue-400 font-medium">Tổng Điểm Đã Kiếm</span>
              <span className="text-blue-400 font-bold">{skillPoints.totalEarned}</span>
            </div>

            {/* Used Points */}
            <div className="flex justify-between items-center p-3 bg-red-600 bg-opacity-20 rounded-lg border border-red-500">
              <span className="text-red-400 font-medium">Điểm Đã Sử Dụng</span>
              <span className="text-red-400 font-bold">{skillPoints.totalEarned - skillPoints.available}</span>
            </div>
          </div>

          {/* Sources Breakdown */}
          <div className="mt-4">
            <h5 className="text-md font-semibold text-gray-300 mb-2">Nguồn Điểm:</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-300 text-sm">Tăng Level</span>
                <span className="text-white font-medium">{skillPoints.sources.levelUp}</span>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-300 text-sm">Đột Phá</span>
                <span className="text-white font-medium">{skillPoints.sources.breakthrough}</span>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-300 text-sm">Cột Mốc</span>
                <span className="text-white font-medium">{skillPoints.sources.milestones}</span>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-gray-700 rounded">
                <span className="text-gray-300 text-sm">Thành Tựu</span>
                <span className="text-white font-medium">{skillPoints.sources.achievements}</span>
              </div>
              
              {skillPoints.sources.events > 0 && (
                <div className="flex justify-between items-center p-2 bg-gray-700 rounded md:col-span-2">
                  <span className="text-gray-300 text-sm">Sự Kiện Đặc Biệt</span>
                  <span className="text-white font-medium">{skillPoints.sources.events}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-4 p-3 bg-yellow-600 bg-opacity-20 rounded-lg border border-yellow-500">
            <h6 className="text-yellow-400 font-medium mb-1">💡 Mẹo:</h6>
            <ul className="text-yellow-300 text-sm space-y-1">
              <li>• Mỗi level tăng sẽ cho 1 điểm kỹ năng</li>
              <li>• Đột phá cảnh giới cho 3 điểm kỹ năng</li>
              <li>• Level 10, 20, 30... cho thêm 2 điểm bonus</li>
              <li>• Kỹ năng tier cao tốn nhiều điểm hơn</li>
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  )
}
