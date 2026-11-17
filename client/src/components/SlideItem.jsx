import React from 'react'

const SlideItem = ({ item, isSelected, onSelect }) => {
  const style = {
    position: 'absolute',
    left: `${item.x}%`,
    top: `${item.y}%`,
    cursor: onSelect ? 'pointer' : 'default',
    outline: isSelected ? '2px dashed #2563eb' : 'none',
    outlineOffset: '2px',
  }

  const handleClick = (e) => {
    if (!onSelect) return
    e.stopPropagation()
    onSelect()
  }

  if (item.type === 'rectangle') {
    return (
      <div
        onClick={handleClick}
        style={{ ...style, width: `${item.width}%`, height: `${item.height}%`, background: item.fill }}
      />
    )
  }

  if (item.type === 'circle') {
    return (
      <div
        onClick={handleClick}
        style={{ ...style, width: `${item.radius * 2}%`, aspectRatio: '1 / 1', borderRadius: '50%', background: item.fill }}
      />
    )
  }

  if (item.type === 'text') {
    return (
      <div
        onClick={handleClick}
        style={{ ...style, fontSize: item.fontSize, color: item.color, whiteSpace: 'nowrap' }}
      >
        {item.text}
      </div>
    )
  }

  return (
    <div onClick={handleClick} style={style} className='border border-dashed border-gray-400 px-2 text-gray-500'>
      {item.text || item.type}
    </div>
  )
}

export default SlideItem