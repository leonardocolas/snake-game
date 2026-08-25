'use client'

import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Direction } from '@/lib/snake'

type Props = { onTurn: (d: Direction) => void }

const base =
  'flex h-14 w-14 items-center justify-center rounded-md border border-border bg-card text-primary active:bg-muted transition-colors'

export function TouchControls({ onTurn }: Props) {
  return (
    <div className="flex flex-col items-center gap-2 md:hidden">
      <button
        type="button"
        className={base}
        onClick={() => onTurn('up')}
        aria-label="Move up"
      >
        <ChevronUp className="h-6 w-6" />
      </button>
      <div className="flex gap-2">
        <button
          type="button"
          className={base}
          onClick={() => onTurn('left')}
          aria-label="Move left"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          type="button"
          className={base}
          onClick={() => onTurn('down')}
          aria-label="Move down"
        >
          <ChevronDown className="h-6 w-6" />
        </button>
        <button
          type="button"
          className={base}
          onClick={() => onTurn('right')}
          aria-label="Move right"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}
