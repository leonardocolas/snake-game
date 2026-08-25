'use client'

type Props = {
  score: number
  best: number
  level: number
  progress: number
  length: number
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string
  value: string | number
  accent?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <span
        className={`font-mono text-2xl font-bold tabular-nums ${
          accent ? 'text-accent text-glow-accent' : 'text-primary text-glow'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

export function GameHud({ score, best, level, progress, length }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-4 gap-4 rounded-lg border border-border bg-card px-4 py-3">
        <Stat label="Score" value={score} />
        <Stat label="Level" value={level} accent />
        <Stat label="Length" value={length} />
        <Stat label="Best" value={best} />
      </div>

      {/* Progress toward the next level */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
          Next
        </span>
        <div
          className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progress to next level"
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-300 ease-out"
            style={{ width: `${Math.max(progress * 100, 2)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
