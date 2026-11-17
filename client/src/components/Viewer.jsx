import React from 'react'
import Sidebar from './Sidebar'
import SlideItems from './SlideItems'

const Viewer = ({
  slideshows,
  activeSlideshow,
  currentIndex,
  ended,
  onOpenSlideshow,
  onSelectSlide,
  onFinish,
  onRestart,
}) => {
  const totalSlides = activeSlideshow ? activeSlideshow.slides.length : 0
  const currentSlide = activeSlideshow?.slides[currentIndex]

  const goPrevious = () => {
    if (currentIndex > 0) onSelectSlide(currentIndex - 1)
  }

  const goNext = () => {
    if (currentIndex < totalSlides - 1) {
      onSelectSlide(currentIndex + 1)
    } else {
      onFinish()
    }
  }

  return (
    <div className='flex gap-8'>
      <Sidebar
        slideshows={slideshows}
        activeSlideshowId={activeSlideshow?.id}
        currentIndex={ended ? -1 : currentIndex}
        onOpenSlideshow={onOpenSlideshow}
        onSelectSlide={onSelectSlide}
        readOnly
      />

      <div className='flex-1'>
        {!activeSlideshow ? (
          <p className='mt-4 text-gray-500'>Click a slideshow title to view it.</p>
        ) : !currentSlide ? (
          <p className='mt-4 ml-4 text-gray-500'>This slideshow has no slides.</p>
        ) : ended ? (
          <div className='mt-4 ml-4 flex flex-col items-start gap-3'>
            <p className='text-xl font-bold'>End of slideshow</p>
            <button onClick={onRestart} className='border-2 px-3 py-1 bg-blue-700 text-white cursor-pointer'>
              Start again
            </button>
          </div>
        ) : (
          <div className='max-w-[680px]'>
            <SlideItems items={currentSlide.items} />

            <div className='ml-4 flex justify-between items-center'>
              <button
                onClick={goPrevious}
                disabled={currentIndex === 0}
                className='border-2 font-bold p-2 bg-amber-700 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Previous
              </button>

              <span>{currentIndex + 1} / {totalSlides}</span>

              <button onClick={goNext} className='border-2 font-bold p-2 bg-blue-700 text-white cursor-pointer'>
                {currentIndex === totalSlides - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Viewer