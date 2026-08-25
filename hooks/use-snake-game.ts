'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  GRID,
  OPPOSITE,
  VECTORS,
  type Direction,
  type Point,
  type Status,
  foodProgress,
  initialSnake,
  levelFromScore,
  pointsForLevel,
  samePoint,
  spawnFood,
  tickForLevel,
} from '@/lib/snake'

export type Toast = { id: number; text: string; kind: 'score' | 'level' }

export function useSnakeGame() {
  const [snake, setSnake] = useState<Point[]>(initialSnake)
  /**
   * Seeded deterministically so server and client markup agree; the first real
   * randomized position is picked on mount, after hydration.
   */
  const [food, setFood] = useState<Point>({ x: GRID - 4, y: Math.floor(GRID / 2) })
  const [status, setStatus] = useState<Status>('idle')
  const [score, setScore] = useState(0)
  const [eaten, setEaten] = useState(0)
  const [best, setBest] = useState(0)
  const [toasts, setToasts] = useState<Toast[]>([])

  const level = levelFromScore(eaten)
  const progress = foodProgress(eaten)

  /**
   * Direction lives in refs so the loop always reads the newest value without
   * re-subscribing, and queued turns are consumed one per tick. That prevents
   * two fast key presses in a single tick from folding the snake into itself.
   */
  const direction = useRef<Direction>('right')
  const queue = useRef<Direction[]>([])
  const toastId = useRef(0)

  const pushToast = useCallback((text: string, kind: Toast['kind']) => {
    const id = toastId.current++
    setToasts((t) => [...t, { id, text, kind }])
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 750)
  }, [])

  const reset = useCallback(() => {
    const fresh = initialSnake()
    direction.current = 'right'
    queue.current = []
    setSnake(fresh)
    setFood(spawnFood(fresh))
    setScore(0)
    setEaten(0)
    setToasts([])
    setStatus('running')
  }, [])

  const turn = useCallback((next: Direction) => {
    const last = queue.current.at(-1) ?? direction.current
    // Ignore reversals and repeats of the current heading.
    if (next === last || next === OPPOSITE[last]) return
    if (queue.current.length < 2) queue.current.push(next)
  }, [])

  const togglePause = useCallback(() => {
    setStatus((s) => (s === 'running' ? 'paused' : s === 'paused' ? 'running' : s))
  }, [])

  // Load persisted high score and randomize the first food, post-hydration.
  useEffect(() => {
    const raw = window.localStorage.getItem('snake:best')
    if (raw) setBest(Number(raw) || 0)
    setFood(spawnFood(initialSnake()))
  }, [])

  useEffect(() => {
    if (score > best) {
      setBest(score)
      window.localStorage.setItem('snake:best', String(score))
    }
  }, [score, best])

  // Keyboard controls.
  useEffect(() => {
    const keys: Record<string, Direction> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      w: 'up',
      s: 'down',
      a: 'left',
      d: 'right',
    }

    const onKey = (e: KeyboardEvent) => {
      const dir = keys[e.key] ?? keys[e.key.toLowerCase()]
      if (dir) {
        e.preventDefault()
        if (status === 'idle') {
          reset()
          direction.current = dir
          return
        }
        if (status === 'running') turn(dir)
        return
      }
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        if (status === 'idle' || status === 'over') reset()
        else togglePause()
      }
      if (e.key.toLowerCase() === 'p') {
        e.preventDefault()
        togglePause()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [status, reset, turn, togglePause])

  // The tick loop. Interval is derived from level, so speed ramps up on level change.
  useEffect(() => {
    if (status !== 'running') return

    const id = window.setInterval(() => {
      const nextDir = queue.current.shift()
      if (nextDir) direction.current = nextDir
      const vec = VECTORS[direction.current]

      setSnake((prev) => {
        const head = prev[0]
        const next: Point = { x: head.x + vec.x, y: head.y + vec.y }

        // Wall collision.
        if (next.x < 0 || next.y < 0 || next.x >= GRID || next.y >= GRID) {
          setStatus('over')
          return prev
        }

        const willEat = samePoint(next, food)
        // The tail cell frees up this tick unless we grow into it.
        const body = willEat ? prev : prev.slice(0, -1)
        if (body.some((seg) => samePoint(seg, next))) {
          setStatus('over')
          return prev
        }

        const grown = [next, ...body]

        if (willEat) {
          const currentLevel = levelFromScore(eaten)
          const gained = pointsForLevel(currentLevel)
          const nextEaten = eaten + 1
          setScore((s) => s + gained)
          setEaten(nextEaten)
          setFood(spawnFood(grown))
          if (levelFromScore(nextEaten) > currentLevel) {
            pushToast(`LEVEL ${levelFromScore(nextEaten)}`, 'level')
          } else {
            pushToast(`+${gained}`, 'score')
          }
        }

        return grown
      })
    }, tickForLevel(level))

    return () => window.clearInterval(id)
  }, [status, level, food, eaten, pushToast])

  return {
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
  }
}
