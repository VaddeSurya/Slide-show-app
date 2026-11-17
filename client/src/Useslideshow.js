import { useEffect, useState } from 'react'
import * as api from './api/Slideshowapi'

const SERVER_DOWN = 'Could not reach the server. Is the backend running on port 3000?'

const toMessage = (err) => {
  if (!err.response) return SERVER_DOWN
  const { method, url } = err.config
  return `${err.response.data?.error || 'Server error'} (${method.toUpperCase()} ${url})`
}

const newItemDefaults = {
  rectangle: { type: 'rectangle', x: 10, y: 10, width: 30, height: 20, fill: '#4f46e5' },
  circle: { type: 'circle', x: 45, y: 30, radius: 10, fill: '#f59e0b' },
  text: { type: 'text', x: 10, y: 60, text: 'New text', fontSize: 24, color: '#111827' },
}

export default function useSlideshows() {
  const [slideshows, setSlideshows] = useState([])
  const [view, setView] = useState({ mode: 'editor', activeSlideshowId: null, currentIndex: 0, ended: false })
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setSlideshows(await api.getSlideshows())
        setView(await api.getView())
      } catch (err) {
        setError(toMessage(err))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const handleError = (err) => {
    setError(toMessage(err))
    api.getSlideshows().then(setSlideshows).catch(() => {})
  }

  const activeSlideshow = slideshows.find((s) => s.id === view.activeSlideshowId)

  const currentIndex = activeSlideshow
    ? Math.max(0, Math.min(view.currentIndex, activeSlideshow.slides.length - 1))
    : 0

  const currentSlide = activeSlideshow?.slides[currentIndex]

  const changeView = (changes) => {
    const newView = { ...view, ...changes }
    setView(newView)
    api.saveView(newView).catch(handleError)
  }

  const changeSlides = (slideshowId, changeSlideList) => {
    setSlideshows((prev) =>
      prev.map((s) => (s.id === slideshowId ? { ...s, slides: changeSlideList(s.slides) } : s))
    )
  }

  const changeItems = (slideId, changeItemList) => {
    setSlideshows((prev) =>
      prev.map((s) => ({
        ...s,
        slides: s.slides.map((slide) =>
          slide.id === slideId ? { ...slide, items: changeItemList(slide.items) } : slide
        ),
      }))
    )
  }

  const setMode = (mode) => changeView({ mode })

  const openSlideshow = (id) => {
    changeView({ activeSlideshowId: id, currentIndex: 0, ended: false })
    setSelectedItemId(null)
  }

  const selectSlide = (index) => {
    changeView({ currentIndex: index, ended: false })
    setSelectedItemId(null)
  }

  const finish = () => changeView({ ended: true })

  const restart = () => selectSlide(0)

  const addSlide = async (slideshowId) => {
    try {
      const newSlide = await api.createSlide(slideshowId)
      const slideshow = slideshows.find((s) => s.id === slideshowId)

      changeSlides(slideshowId, (slides) => [...slides, newSlide])
      changeView({ activeSlideshowId: slideshowId, currentIndex: slideshow.slides.length, ended: false })
    } catch (err) {
      handleError(err)
    }
  }

  const deleteSlide = (slideshowId, slideId, index) => {
    changeSlides(slideshowId, (slides) => slides.filter((slide) => slide.id !== slideId))
    api.deleteSlide(slideId).catch(handleError)

    if (slideshowId === view.activeSlideshowId && index <= currentIndex && currentIndex > 0) {
      changeView({ currentIndex: currentIndex - 1 })
    }
  }

  const moveSlide = (slideshowId, index, direction) => {
    const slideshow = slideshows.find((s) => s.id === slideshowId)
    const newIndex = index + direction

    if (newIndex < 0 || newIndex >= slideshow.slides.length) return

    changeSlides(slideshowId, (slides) => {
      const copy = [...slides]
      const temp = copy[index]
      copy[index] = copy[newIndex]
      copy[newIndex] = temp
      return copy
    })
    api.moveSlide(slideshow.slides[index].id, newIndex).catch(handleError)

    if (slideshowId === view.activeSlideshowId) {
      if (currentIndex === index) changeView({ currentIndex: newIndex })
      else if (currentIndex === newIndex) changeView({ currentIndex: index })
    }
  }

  const addItem = async (type) => {
    const slideId = currentSlide.id

    try {
      const newItem = await api.createItem(slideId, newItemDefaults[type])
      changeItems(slideId, (items) => [...items, newItem])
      setSelectedItemId(newItem.id)
    } catch (err) {
      handleError(err)
    }
  }

  const updateItem = (itemId, field, value) => {
    changeItems(currentSlide.id, (items) =>
      items.map((item) => (item.id === itemId ? { ...item, [field]: value } : item))
    )
    api.updateItem(itemId, { [field]: value }).catch(handleError)
  }

  const deleteItem = (itemId) => {
    changeItems(currentSlide.id, (items) => items.filter((item) => item.id !== itemId))
    api.deleteItem(itemId).catch(handleError)
    setSelectedItemId(null)
  }

  return {
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
  }
}