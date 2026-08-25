export const GRID = 19

export type Point = { x: number; y: number }
export type Direction = 'up' | 'down' | 'left' | 'right'
export type Status = 'idle' | 'running' | 'paused' | 'over'

export const VECTORS: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

export const OPPOSITE: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
}

/** Food eaten per level, and the tick interval curve. */
const FOOD_PER_LEVEL = 4
const BASE_TICK = 150
const MIN_TICK = 58

export function levelFromScore(eaten: number) {
  return Math.floor(eaten / FOOD_PER_LEVEL) + 1
}

/** Each level shaves the interval; clamped so it stays humanly playable. */
export function tickForLevel(level: number) {
  return Math.max(MIN_TICK, BASE_TICK - (level - 1) * 9)
}

export function foodProgress(eaten: number) {
  return (eaten % FOOD_PER_LEVEL) / FOOD_PER_LEVEL
}

export function samePoint(a: Point, b: Point) {
  return a.x === b.x && a.y === b.y
}

export function initialSnake(): Point[] {
  const mid = Math.floor(GRID / 2)
  return [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ]
}

/** Pick a free cell for food, avoiding the snake's body. */
export function spawnFood(snake: Point[]): Point {
  const taken = new Set(snake.map((s) => `${s.x},${s.y}`))
  const free: Point[] = []
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) {
      if (!taken.has(`${x},${y}`)) free.push({ x, y })
    }
  }
  if (free.length === 0) return { x: 0, y: 0 }
  return free[Math.floor(Math.random() * free.length)]
}

export function pointsForLevel(level: number) {
  return 10 * level
}
