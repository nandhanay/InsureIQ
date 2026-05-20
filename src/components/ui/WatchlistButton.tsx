import React, { useState } from 'react'
import { Bookmark } from 'lucide-react'

interface WatchlistButtonProps {
  isWatchlisted?: boolean
  onToggle?: () => void
  className?: string
}

export default function WatchlistButton({
  isWatchlisted = false,
  onToggle,
  className = '',
}: WatchlistButtonProps) {
  const [saved, setSaved] = useState(isWatchlisted)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSaved(!saved)
    onToggle?.()
  }

  return (
    <button
      onClick={handleClick}
      className={`
        p-2 rounded-full transition-all duration-200
        ${saved
          ? 'bg-white/[0.12] text-white'
          : 'bg-transparent text-white/30 hover:text-white/60 hover:bg-white/[0.06]'
        }
        ${className}
      `}
      title={saved ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <Bookmark
        className="w-4 h-4"
        fill={saved ? 'currentColor' : 'none'}
        strokeWidth={1.5}
      />
    </button>
  )
}
