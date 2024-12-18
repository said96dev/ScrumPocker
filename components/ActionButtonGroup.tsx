import React, { useState } from 'react'
import { FaRegTrashAlt, FaShare } from 'react-icons/fa'
import { IoSettingsOutline } from 'react-icons/io5'
import { HiOutlineDotsVertical } from 'react-icons/hi'

interface ActionButtonGroupProps {
  onShare: () => void
  onDelete: () => void
  onEdit: () => void
}

const ActionButtonGroup: React.FC<ActionButtonGroupProps> = ({
  onShare,
  onDelete,
  onEdit,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleButtonClick = (action: () => void) => {
    action() // Führe die übergebene Funktion aus (z.B. `onEdit`, `onShare` oder `onDelete`).
    setIsOpen(false) // Schließe das Dropdown.
  }

  return (
    <details className={`dropdown dropdown-bottom dropdown-end`}>
      {/* Trigger-Button */}
      <summary
        tabIndex={0}
        className='btn btn-circle btn-ghost text-xl hover:bg-base-200'
        onClick={() => setIsOpen(!isOpen)} // Öffnen/Schließen des Dropdowns
      >
        <HiOutlineDotsVertical />
      </summary>

      {/* Dropdown-Menü */}
      <ul
        tabIndex={0}
        className='dropdown-content menu bg-base-100 shadow-md rounded-box p-2 grid grid-cols-3 w-36 gap-x-2'
      >
        <li>
          <button
            className='btn btn-sm btn-outline btn-accent flex justify-between items-center gap-2'
            onClick={() => handleButtonClick(onEdit)}
          >
            <IoSettingsOutline />
          </button>
        </li>
        <li>
          <button
            className='btn btn-sm btn-outline btn-neutral flex justify-between items-center gap-2'
            onClick={() => handleButtonClick(onShare)}
          >
            <FaShare />
          </button>
        </li>
        <li>
          <button
            className='btn btn-sm btn-outline btn-error flex justify-between items-center gap-2'
            onClick={() => handleButtonClick(onDelete)}
          >
            <FaRegTrashAlt />
          </button>
        </li>
      </ul>
    </details>
  )
}

export default ActionButtonGroup
