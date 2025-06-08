'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sword, Zap, Heart, Shield } from 'lucide-react'

export default function HomePage() {
  const [selectedSect, setSelectedSect] = useState<string | null>(null)

  const sects = [
    {
      id: 'sword',
      name: 'Kiếm Tông',
      description: 'Chuyên về kiếm thuật, tấn công cao',
      icon: Sword,
      color: 'from-blue-500 to-cyan-500',
      stats: { atk: '+20%', crit: '+15%', def: '+5%' }
    },
    {
      id: 'lightning',
      name: 'Lôi Tông',
      description: 'Sử dụng sức mạnh sấm sét',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      stats: { atk: '+15%', speed: '+20%', mp: '+10%' }
    },
    {
      id: 'medical',
      name: 'Y Tông',
      description: 'Chuyên về y thuật và hỗ trợ',
      icon: Heart,
      color: 'from-green-500 to-emerald-500',
      stats: { hp: '+25%', regen: '+30%', def: '+10%' }
    },
    {
      id: 'defense',
      name: 'Phòng Thủ Tông',
      description: 'Phòng thủ vững chắc như núi',
      icon: Shield,
      color: 'from-gray-500 to-slate-500',
      stats: { def: '+30%', hp: '+20%', resist: '+25%' }
    }
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl font-bold text-gradient mb-4 text-shadow">
          Toàn Dân Tu Tiên
        </h1>
        <p className="text-xl text-blue-200 mb-8">
          Hành trình tu tiên bất tận trong thế giới huyền bí
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-gold-400">1,000+</div>
            <div className="text-sm text-gray-300">Tu Sĩ Online</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-400">50+</div>
            <div className="text-sm text-gray-300">Cảnh Giới</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-400">∞</div>
            <div className="text-sm text-gray-300">Khả Năng</div>
          </div>
        </div>
      </motion.div>

      {/* Sect Selection */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="w-full max-w-4xl"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-white">
          Chọn Tông Phái Tu Luyện
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {sects.map((sect, index) => {
            const IconComponent = sect.icon
            return (
              <motion.div
                key={sect.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className={`card cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedSect === sect.id ? 'ring-2 ring-blue-400 cultivation-glow' : ''
                }`}
                onClick={() => setSelectedSect(sect.id)}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${sect.color} mr-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{sect.name}</h3>
                    <p className="text-gray-300 text-sm">{sect.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-sm">
                  {Object.entries(sect.stats).map(([stat, value]) => (
                    <div key={stat} className="text-center">
                      <div className="text-gray-400 capitalize">{stat}</div>
                      <div className="text-green-400 font-semibold">{value}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary px-8 py-3 text-lg"
            onClick={() => window.location.href = '/characters'}
          >
            Bắt Đầu Tu Tiên
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-secondary px-8 py-3 text-lg"
            onClick={() => window.location.href = '/auth/login'}
          >
            Đăng Nhập
          </motion.button>
        </div>

        {/* Story Demo Link */}
        <div className="text-center mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="text-blue-400 hover:text-blue-300 text-sm underline"
            onClick={() => window.location.href = '/story-demo'}
          >
            📖 Xem trước câu chuyện
          </motion.button>
        </div>
      </motion.div>

      {/* Features Preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="mt-16 w-full max-w-6xl"
      >
        <h3 className="text-2xl font-bold text-center mb-8 text-white">
          Tính Năng Nổi Bật
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h4 className="text-lg font-semibold mb-2 text-white">Tu Luyện Tự Động</h4>
            <p className="text-gray-300 text-sm">
              Tu luyện liên tục ngay cả khi offline, tích lũy tu vi không ngừng nghỉ
            </p>
          </div>
          
          <div className="card text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h4 className="text-lg font-semibold mb-2 text-white">PvP Arena</h4>
            <p className="text-gray-300 text-sm">
              Thách đấu với các tu sĩ khác, tranh đoạt danh hiệu cao nhất
            </p>
          </div>
          
          <div className="card text-center">
            <div className="text-4xl mb-4">🏛️</div>
            <h4 className="text-lg font-semibold mb-2 text-white">Bang Hội</h4>
            <p className="text-gray-300 text-sm">
              Gia nhập bang hội, cùng đồng môn chinh phục thế giới tu tiên
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
