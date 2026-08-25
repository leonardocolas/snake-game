'use client'

import { Button } from '@/components/ui/button'
import type { Status } from '@/lib/snake'

type Props = {
  status: Status
  score: number
  best: number
  level: number
  onStart: () => void
  onResume: () => void
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-w-6 items-center justify-center rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.7rem] text-primary">
      {children}
    </kbd>
  )
}

export function GameOverlay({
  status,
  score,
  best,
  level,
  onStart,
  onResume,
}: Props) {
  if (status === 'running') return null

  const isOver = status === 'over'
  const isNewBest = isOver && score > 0 && score >= best

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/85 backdrop-blur-sm">
      <div className="animate-pop-in flex w-full max-w-xs flex-col items-center gap-5 px-6 text-center">
        {status === 'idle' && (
          <>
            <h2 className="font-mono text-3xl font-bold tracking-[0.2em] text-primary text-glow">
              SNAKE
            </h2>
            <p className="font-mono text-xs leading-relaxed text-muted-foreground">
              Eat to grow. Every 4 bites raises the level and the speed. Walls
              and your own tail are fatal.
            </p>
            <Button onClick={onStart} className="w-full font-mono tracking-widest">
              INSERT COIN
            </Button>
            <div className="flex flex-col gap-2 font-mono text-[0.65rem] text-muted-foreground">
              <div className="flex items-center justify-center gap-1.5">
                <Key>↑</Key>
                <Key>↓</Key>
                <Key>←</Key>
                <Key>→</Key>
                <span className="ml-1">move</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Key>P</Key>
                <span>pause</span>
                <Key>Space</Key>
                <span>start / restart</span>
              </div>
            </div>
          </>
        )}

        {status === 'paused' && (
          <>
            <h2 className="font-mono text-2xl font-bold tracking-[0.2em] text-primary text-glow">
              PAUSED
            </h2>
            <Button
              onClick={onResume}
              className="w-full font-mono tracking-widest"
            >
              RESUME
            </Button>
            <p className="font-mono text-[0.65rem] text-muted-foreground">
              or press <Key>P</Key>
            </p>
          </>
        )}

        {isOver && (
          <>
            <h2
              className="font-mono text-3xl font-bold tracking-[0.2em] text-destructive"
              style={{ textShadow: '0 0 0.35em var(--destructive)' }}
            >
              GAME OVER
            </h2>

            <div className="grid w-full grid-cols-2 gap-3 rounded-lg border border-border bg-card px-4 py-3">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Score
                </span>
                <span className="font-mono text-2xl font-bold tabular-nums text-primary text-glow">
                  {score}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                  Level
                </span>
                <span className="font-mono text-2xl font-bold tabular-nums text-accent text-glow-accent">
                  {level}
                </span>
              </div>
            </div>

            {isNewBest && (
              <p className="font-mono text-xs tracking-widest text-accent text-glow-accent">
                NEW HIGH SCORE
              </p>
            )}

            <Button onClick={onStart} className="w-full font-mono tracking-widest">
              PLAY AGAIN
            </Button>
            <p className="font-mono text-[0.65rem] text-muted-foreground">
              or press <Key>Space</Key>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
