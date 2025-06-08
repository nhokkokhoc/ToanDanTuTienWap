'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, SkipForward, Volume2, VolumeX } from 'lucide-react'

interface StoryIntroProps {
  onComplete: () => void
  onSkip: () => void
}

interface StoryChapter {
  id: number
  title: string
  content: string[]
  background: string
  image: string
  sound?: string
}

const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 1,
    title: "Thiên Địa Khai Tích",
    content: [
      "Ngàn năm trước, khi thiên địa mới khai, linh khí tràn ngập khắp đại lục...",
      "Những tu sĩ đầu tiên đã khám phá ra bí mật của việc hấp thụ linh khí từ thiên địa.",
      "Họ lập nên các tông phái, truyền thừa những pháp môn tu luyện huyền bí.",
      "Từ đó, con đường tu tiên chính thức được mở ra cho nhân loại."
    ],
    background: "bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900",
    image: "🌌",
    sound: "✨ Âm thanh thiên địa khai tích..."
  },
  {
    id: 2,
    title: "Đại Chiến Tông Phái",
    content: [
      "Thời gian trôi qua, các tông phái ngày càng hùng mạnh và bắt đầu tranh chấp.",
      "Kiếm Tông với kiếm khí bạc thiên, Lôi Tông với sấm sét chấn động cửu thiên...",
      "Y Tông cứu chữa thương tật, Phòng Thủ Tông vững như núi Thái Sơn.",
      "Cuộc đại chiến kéo dài hàng trăm năm, khiến đại lục tan hoang.",
      "Máu và lửa bao phủ khắp nơi, tiếng kêu thảm thiết vang khắp chín tầng trời."
    ],
    background: "bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900",
    image: "⚔️",
    sound: "⚡ Tiếng sấm sét và tiếng kiếm..."
  },
  {
    id: 3,
    title: "Thời Đại Hỗn Loạn",
    content: [
      "Sau đại chiến, linh khí thiên địa bị tổn thương nặng nề.",
      "Các cao thủ một thời đều ẩn dật, không ai dám lộ diện.",
      "Thế giới tu tiên rơi vào thời kỳ đen tối nhất trong lịch sử.",
      "Những bí kíp tu luyện cổ xưa dần bị thất truyền...",
      "Chỉ còn lại những truyền thuyết mờ nhạt về thời hoàng kim."
    ],
    background: "bg-gradient-to-br from-gray-900 via-slate-900 to-black",
    image: "🌑",
    sound: "🌪️ Tiếng gió hú trong đêm tối..."
  },
  {
    id: 4,
    title: "Sự Hồi Sinh",
    content: [
      "Nhưng thiên đạo luân hồi, cực tắc tất lai...",
      "Gần đây, linh khí thiên địa bắt đầu phục hồi một cách kỳ diệu.",
      "Những dấu hiệu của thời đại tu tiên mới đang dần hiện ra.",
      "Các tông phái cổ xưa bắt đầu mở cửa đón nhận đệ tử.",
      "Và bạn... chính là một trong những người được chọn!"
    ],
    background: "bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900",
    image: "✨",
    sound: "🎵 Âm thanh thiên nhiên hồi sinh..."
  },
  {
    id: 5,
    title: "Hành Trình Bắt Đầu",
    content: [
      "Trong bạn đang tiềm ẩn một nguồn linh lực mạnh mẽ chưa được khai phá.",
      "Hãy chọn một tông phái phù hợp với bản thân và bắt đầu tu luyện.",
      "Con đường tu tiên đầy gian nan, nhưng phần thưởng sẽ là bất tử và vĩnh hằng.",
      "Từ Luyện Khí đến Chân Tiên, mỗi bước đều là một thử thách mới.",
      "Liệu bạn có thể trở thành một trong những cao thủ huyền thoại?"
    ],
    background: "bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900",
    image: "🚀",
    sound: "🎶 Khúc nhạc khởi đầu hành trình..."
  }
]

export default function StoryIntro({ onComplete, onSkip }: StoryIntroProps) {
  const [currentChapter, setCurrentChapter] = useState(0)
  const [currentLine, setCurrentLine] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [autoPlay, setAutoPlay] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const chapter = STORY_CHAPTERS[currentChapter]
  const totalChapters = STORY_CHAPTERS.length

  useEffect(() => {
    if (!chapter) return

    const text = chapter.content[currentLine]
    if (!text) return

    setIsTyping(true)
    setDisplayedText('')

    let index = 0
    const typeInterval = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1))
      index++

      if (index >= text.length) {
        clearInterval(typeInterval)
        setIsTyping(false)
        
        // Auto advance to next line after delay
        if (autoPlay) {
          setTimeout(() => {
            nextLine()
          }, 2000)
        }
      }
    }, 50) // Typing speed

    return () => clearInterval(typeInterval)
  }, [currentChapter, currentLine, autoPlay])

  const nextLine = () => {
    if (currentLine < chapter.content.length - 1) {
      setCurrentLine(currentLine + 1)
    } else {
      nextChapter()
    }
  }

  const nextChapter = () => {
    if (currentChapter < totalChapters - 1) {
      setCurrentChapter(currentChapter + 1)
      setCurrentLine(0)
    } else {
      onComplete()
    }
  }

  const handleNext = () => {
    if (isTyping) {
      // Skip typing animation
      setDisplayedText(chapter.content[currentLine])
      setIsTyping(false)
    } else {
      nextLine()
    }
  }

  const handleSkip = () => {
    onSkip()
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-1000 ${chapter.background}`}>
      <div className="max-w-4xl mx-auto">
        {/* Skip Button */}
        <div className="absolute top-6 right-6 flex gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="btn-secondary p-2"
            title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`btn-secondary p-2 ${autoPlay ? 'bg-blue-600' : ''}`}
            title={autoPlay ? "Tắt tự động" : "Bật tự động"}
          >
            ⏯️
          </button>
          <button
            onClick={handleSkip}
            className="btn-secondary flex items-center"
          >
            <SkipForward className="w-4 h-4 mr-1" />
            Bỏ qua
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex space-x-2">
              {STORY_CHAPTERS.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index <= currentChapter ? 'bg-blue-400' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${((currentChapter * chapter.content.length + currentLine + 1) / 
                  (totalChapters * chapter.content.length)) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Story Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentChapter}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Chapter Image */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="text-8xl mb-8"
            >
              {chapter.image}
            </motion.div>

            {/* Sound Effect (Text) */}
            {soundEnabled && chapter.sound && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mb-4"
              >
                <p className="text-sm text-gray-400 italic">{chapter.sound}</p>
              </motion.div>
            )}

            {/* Chapter Title */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-6xl font-bold text-gradient mb-8"
            >
              {chapter.title}
            </motion.h1>

            {/* Story Text */}
            <div className="card max-w-3xl mx-auto mb-8">
              <div className="min-h-[200px] flex items-center justify-center">
                <motion.p
                  key={`${currentChapter}-${currentLine}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xl md:text-2xl text-gray-100 leading-relaxed text-center"
                >
                  {displayedText}
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="ml-1"
                    >
                      |
                    </motion.span>
                  )}
                </motion.p>
              </div>

              {/* Chapter Progress */}
              <div className="mt-6 flex justify-center">
                <div className="flex space-x-2">
                  {chapter.content.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index <= currentLine ? 'bg-blue-400' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="btn-primary px-8 py-3 text-lg flex items-center"
                disabled={isTyping && autoPlay}
              >
                {isTyping ? 'Bỏ qua hiệu ứng' : 
                 currentChapter === totalChapters - 1 && currentLine === chapter.content.length - 1 
                   ? 'Bắt đầu hành trình' : 'Tiếp tục'}
                <ChevronRight className="w-5 h-5 ml-2" />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400 text-sm">
          <p>Toàn Dân Tu Tiên - Hành trình tu tiên bất tận</p>
        </div>
      </div>
    </div>
  )
}
