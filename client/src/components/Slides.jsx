import React from 'react'
import SlideItems from './SlideItems'
import ItemEditor from './ItemEditor'

const Slides = ({
  slideshow,
  currentIndex,
  setCurrentIndex,
  ended,
  onFinish,
  onRestart,
  selectedItemId,
  onSelectItem,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}) => {
  const totalSlides = slideshow.slides.length
  const currentSlide = slideshow.slides[currentIndex]

  const goPrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  const goNext = () => {
    if (currentIndex < totalSlides - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      onFinish()
    }
  }

  if (!currentSlide) return <p className='mt-4 ml-4 text-gray-500'>This slideshow has no slides.</p>

  if (ended) {
    return (
      <div className='mt-4 ml-4 flex flex-col items-start gap-3'>
        <p className='text-xl font-bold'>End of slideshow</p>
        <button onClick={onRestart} className='border-2 px-3 py-1 bg-blue-700 text-white cursor-pointer'>
          Start again
        </button>
      </div>
    )
  }

  const selectedItem = currentSlide.items.find((item) => item.id === selectedItemId)

  return (
    <div className='flex gap-6'>
      <div className='w-full max-w-[680px]'>
        <div className='ml-4 flex gap-2'>
          <button onClick={() => onAddItem('rectangle')} className='border-2 px-3 py-1 cursor-pointer hover:bg-gray-100'>
            Rectangle
          </button>
          <button onClick={() => onAddItem('circle')} className='border-2 px-3 py-1 cursor-pointer hover:bg-gray-100'>
            Circle
          </button>
          <button onClick={() => onAddItem('text')} className='border-2 px-3 py-1 cursor-pointer hover:bg-gray-100'>
            Text
          </button>
        </div>

        <SlideItems
          items={currentSlide.items}
          selectedItemId={selectedItemId}
          onSelectItem={onSelectItem}
        />

        <div className='ml-4 flex justify-between items-center'>
          <button
            onClick={goPrevious}
            disabled={currentIndex === 0}
            className='border-2 font-bold p-2 bg-amber-700 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Previous
          </button>

          <span>{currentIndex + 1} / {totalSlides}</span>

          <button
            onClick={goNext}
            className='border-2 font-bold p-2 bg-blue-700 text-white cursor-pointer'
          >
            {currentIndex === totalSlides - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>

      <ItemEditor item={selectedItem} onUpdateItem={onUpdateItem} onDeleteItem={onDeleteItem} />
    </div>
  )
}

export default Slides