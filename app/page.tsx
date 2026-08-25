'use client'

import { GameBoard } from '@/components/game-board'
import { GameHud } from '@/components/game-hud'
import { GameOverlay } from '@/components/game-overlay'
import { TouchControls } from '@/components/touch-controls'
import { useSnakeGame } from '@/hooks/use-snake-game'

export default function Page() {
  const {
    snake,
    food,
    status,
    score,
    best,
    level,
    progress,
    toasts,
    reset,
    turn,
    togglePause,
  } = useSnakeGame()

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 px-4 py-8">
      <header className="flex w-full max-w-lg items-baseline justify-between">
        <h1 className="font-mono text-sm font-bold uppercase tracking-[0.35em] text-primary text-glow">
          Snake
        </h1>
        <button
          type="button"
          onClick={togglePause}
          disabled={status === 'idle' || status === 'over'}
          className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary disabled:opacity-40"
        >
          {status === 'paused' ? 'Resume' : 'Pause'}
        </button>
      </header>

      <div className="flex w-full max-w-lg flex-col gap-4">
        <GameHud
          score={score}
          best={best}
          level={level}
          progress={progress}
          length={snake.length}
        />

        <div className="relative">
          <GameBoard snake={snake} food={food} status={status} toasts={toasts} />
          <GameOverlay
            status={status}
            score={score}
            best={best}
            level={level}
            onStart={reset}
            onResume={togglePause}
          />
        </div>

        <TouchControls
          onTurn={(d) => {
            if (status === 'idle' || status === 'over') reset()
            else turn(d)
          }}
        />

        <p className="hidden text-center font-mono text-[0.65rem] tracking-wider text-muted-foreground md:block">
          Arrow keys to move &middot; P to pause &middot; Space to restart
        </p>
      </div>
    </main>
  )
}
