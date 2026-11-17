import React from 'react'
import SlideItem from './SlideItem'

const SlideItems = ({ items, selectedItemId, onSelectItem }) => {
  return (
    <div className='ml-4 my-4'>
      <div
        onClick={() => onSelectItem?.(null)}
        className='relative w-[640px] max-w-full overflow-hidden rounded-md bg-white shadow ring-1 ring-gray-200'
        style={{ aspectRatio: '16 / 9' }}
      >
        {items.map((eachItem) => (
          <SlideItem
            key={eachItem.id}
            item={eachItem}
            isSelected={eachItem.id === selectedItemId}
            onSelect={onSelectItem ? () => onSelectItem(eachItem.id) : null}
          />
        ))}
      </div>
    </div>
  )
}

export default SlideItems