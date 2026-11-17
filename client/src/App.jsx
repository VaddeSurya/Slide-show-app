import React from 'react'
import Sidebar from './components/Sidebar'
import Slides from './components/Slides'
import Viewer from './components/Viewer'
import useSlideshows from './Useslideshow'

const App = () => {
  const {
    slideshows,
    view,
    activeSlideshow,
    currentIndex,
    selectedItemId,
    loading,
    error,
    setMode,
    openSlideshow,
    selectSlide,
    finish,
    restart,
    addSlide,
    deleteSlide,
    moveSlide,
    setSelectedItemId,
    addItem,
    updateItem,
    deleteItem,
  } = useSlideshows()

  if (loading) return <p className='p-4 text-gray-500'>Loading slideshows...</p>

  return (
    <div className='p-4'>
      <div className='flex gap-2 mb-4'>
        <button
          onClick={() => setMode('editor')}
          className={`border-2 px-4 py-1 font-bold cursor-pointer ${view.mode === 'editor' ? 'bg-gray-900 text-white' : ''}`}
        >
          Editor
        </button>
        <button
          onClick={() => setMode('viewer')}
          className={`border-2 px-4 py-1 font-bold cursor-pointer ${view.mode === 'viewer' ? 'bg-gray-900 text-white' : ''}`}
        >
          Viewer
        </button>
      </div>

      {view.mode === 'viewer' ? (
        <Viewer
          slideshows={slideshows}
          activeSlideshow={activeSlideshow}
          currentIndex={currentIndex}
          ended={view.ended}
          onOpenSlideshow={openSlideshow}
          onSelectSlide={selectSlide}
          onFinish={finish}
          onRestart={restart}
        />
      ) : (
        <div className='flex gap-8'>
          <Sidebar
            slideshows={slideshows}
            activeSlideshowId={view.activeSlideshowId}
            currentIndex={view.ended ? -1 : currentIndex}
            onOpenSlideshow={openSlideshow}
            onSelectSlide={selectSlide}
            onDeleteSlide={deleteSlide}
            onMoveSlide={moveSlide}
            onAddSlide={addSlide}
          />

          <div className='flex-1'>
            {activeSlideshow ? (
              <Slides
                slideshow={activeSlideshow}
                currentIndex={currentIndex}
                setCurrentIndex={selectSlide}
                ended={view.ended}
                onFinish={finish}
                onRestart={restart}
                selectedItemId={selectedItemId}
                onSelectItem={setSelectedItemId}
                onAddItem={addItem}
                onUpdateItem={updateItem}
                onDeleteItem={deleteItem}
              />
            ) : (
              <p className='mt-4 text-gray-500'>Click a slideshow title to see its slides.</p>
            )}
          </div>
        </div>
      )}

      {error && <p className='text-red-600 mt-4'>{error}</p>}
    </div>
  )
}

export default App