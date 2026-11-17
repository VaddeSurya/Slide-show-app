import React from 'react'

const fieldsByType = {
  rectangle: ['x', 'y', 'width', 'height', 'fill'],
  circle: ['x', 'y', 'radius', 'fill'],
  text: ['text', 'x', 'y', 'fontSize', 'color'],
}

const labels = {
  text: 'Text',
  x: 'X (%)',
  y: 'Y (%)',
  width: 'Width (%)',
  height: 'Height (%)',
  radius: 'Radius (%)',
  fontSize: 'Font size (px)',
  fill: 'Fill color',
  color: 'Text color',
}

const inputTypes = {
  text: 'text',
  fill: 'color',
  color: 'color',
}

const ItemEditor = ({ item, onUpdateItem, onDeleteItem }) => {
  if (!item) {
    return <p className='w-56 mt-14 text-gray-500'>Click a shape to edit it.</p>
  }

  const fields = fieldsByType[item.type] || ['x', 'y']

  const handleChange = (field, value) => {
    const type = inputTypes[field] || 'number'
    onUpdateItem(item.id, field, type === 'number' ? Number(value) : value)
  }

  return (
    <div className='w-56 mt-14 flex flex-col gap-3'>
      <div className='text-lg font-bold capitalize'>{item.type}</div>

      {fields.map((field) => (
        <label key={field} className='flex flex-col text-sm'>
          {labels[field]}
          <input
            type={inputTypes[field] || 'number'}
            value={item[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            className='border-2 px-2 py-1'
          />
        </label>
      ))}

      <button
        onClick={() => onDeleteItem(item.id)}
        className='border-2 p-2 bg-red-600 text-white cursor-pointer'
      >
        Delete shape
      </button>
    </div>
  )
}

export default ItemEditor