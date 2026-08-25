'use client'

import { GRID, type Point, type Status } from '@/lib/snake'
import type { Toast } from '@/hooks/use-snake-game'

type Props = {
  snake: Point[]
  food: Point
  status: Status
  toasts: Toast[]
}

/**
 * Cells are absolutely positioned in percentage space and transitioned, so each
 * segment glides to its next cell instead of snapping — that is what makes the
 * movement read as smooth despite the discrete grid.
 */
export function GameBoard({ snake, food, status, toasts }: Props) {
  const unit = 100 / GRID
  const dimmed = status === 'paused' || status === 'over'

  return (
    <div
      className="crt relative aspect-square w-full overflow-hidden rounded-lg border border-border bg-card box-glow"
      style={{
        backgroundImage:
          'linear-gradient(to right, color-mix(in oklab, var(--primary) 7%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--primary) 7%, transparent) 1px, transparent 1px)',
        backgroundSize: `${unit}% ${unit}%`,
      }}
      role="img"
      aria-label={`Snake game board. Score grid ${GRID} by ${GRID}. Snake length ${snake.length}.`}
    >
      <div
        className={`absolute inset-0 isolate transition-opacity duration-300 ${
          dimmed ? 'opacity-40' : 'opacity-100'
        }`}
      >
        {/* Food */}
        <div
          className="animate-flicker absolute left-0 top-0 rounded-full bg-accent shadow-[0_0_0.6rem_var(--accent)]"
          style={{
            width: `${unit * 0.66}%`,
            height: `${unit * 0.66}%`,
            left: `${(food.x + 0.17) * unit}%`,
            top: `${(food.y + 0.17) * unit}%`,
          }}
        />

        {/* Snake — head is brightest, body fades toward the tail */}
        {snake.map((seg, i) => {
          const isHead = i === 0
          const fade = 1 - Math.min(i / (snake.length + 4), 0.62)
          const inset = isHead ? 0.06 : 0.12
          const size = unit * (1 - inset * 2)
          return (
            <div
              key={`seg-${i}`}
              className="absolute bg-primary"
              style={{
                width: `${size}%`,
                height: `${size}%`,
                left: `${(seg.x + inset) * unit}%`,
                top: `${(seg.y + inset) * unit}%`,
                opacity: fade,
                borderRadius: isHead ? '28%' : '34%',
                boxShadow: isHead ? '0 0 0.75rem var(--primary)' : undefined,
                transitionProperty: 'left, top',
                transitionDuration: '110ms',
                transitionTimingFunction: 'linear',
                zIndex: snake.length - i,
              }}
            />
          )
        })}
      </div>

      {/* Floating score / level-up toasts */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {toasts.map((t) => (
          <span
            key={t.id}
            className={`animate-rise absolute left-1/2 top-[38%] whitespace-nowrap font-mono text-lg font-bold tracking-widest ${
              t.kind === 'level'
                ? 'text-accent text-glow-accent'
                : 'text-primary text-glow'
            }`}
          >
            {t.text}
          </span>
        ))}
      </div>
    </div>
  )
}
