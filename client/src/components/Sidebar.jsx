import React from 'react'

const Sidebar = ({
  slideshows,
  activeSlideshowId,
  currentIndex,
  onOpenSlideshow,
  onSelectSlide,
  onDeleteSlide,
  onMoveSlide,
  onAddSlide,
  readOnly = false,
}) => {
  return (
    <div className='w-74 shrink-0'>
      {slideshows.map((slideshow) => {
        const isOpen = slideshow.id === activeSlideshowId

        return (
          <div key={slideshow.id} className='mb-4'>
            <div
              onClick={() => onOpenSlideshow(slideshow.id)}
              className={`text-2xl font-bold underline cursor-pointer ${isOpen ? 'text-blue-700' : ''}`}
            >
              {slideshow.title}
            </div>

            {isOpen && (
              <div className='ml-4 mt-2'>
                {slideshow.slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    onClick={() => onSelectSlide(index)}
                    className={`flex items-center justify-between cursor-pointer p-2 rounded ${
                      index === currentIndex ? 'bg-blue-100 font-bold' : 'hover:bg-gray-100'
                    }`}
                  >
                    <span>Slide {index + 1}</span>
                    {!readOnly && (
                      <div className='flex gap-1'>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onMoveSlide(slideshow.id, index, -1)
                          }}
                          disabled={index === 0}
                          className='border-2 px-2 cursor-pointer hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed'
                        >
                          ↑
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onMoveSlide(slideshow.id, index, 1)
                          }}
                          disabled={index === slideshow.slides.length - 1}
                          className='border-2 px-2 cursor-pointer hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed'
                        >
                          ↓
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteSlide(slideshow.id, slide.id, index)
                          }}
                          className='border-2 px-2 bg-violet-400 text-white cursor-pointer'
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {!readOnly && (
                  <button
                    onClick={() => onAddSlide(slideshow.id)}
                    className='ml-4 mt-2 w-fit cursor-pointer hover:bg-gray-100'
                  >
                    Add Slide
                  </button>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Sidebar