'use client'

import StoryIntro from '@/components/StoryIntro'

export default function StoryDemoPage() {
  const handleStoryComplete = () => {
    console.log('Story completed!')
    // In real app, this would navigate to character creation
    alert('Câu chuyện hoàn thành! Sẽ chuyển đến tạo nhân vật.')
  }

  const handleStorySkip = () => {
    console.log('Story skipped!')
    // In real app, this would navigate to character creation
    alert('Đã bỏ qua câu chuyện! Sẽ chuyển đến tạo nhân vật.')
  }

  return (
    <StoryIntro
      onComplete={handleStoryComplete}
      onSkip={handleStorySkip}
    />
  )
}
