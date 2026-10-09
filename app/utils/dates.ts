/**
 * Small date helpers. Everything works on local calendar days so a task due
 * "today" stays today regardless of the current time of day.
 */

const MS_PER_DAY = 86_400_000

/** Local date → `yyyy-mm-dd`. */
export function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Today as `yyyy-mm-dd`. */
export function todayKey(): string {
  return toDateKey(new Date())
}

/** `yyyy-mm-dd` → UTC timestamp at midnight (safe for day arithmetic). */
export function toUtcStamp(dateKey: string): number {
  const [year, month, day] = dateKey.split('-').map(Number)
  return Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1)
}

/** Whole calendar days between today and `dateKey` (negative = in the past). */
export function daysUntil(dateKey: string): number {
  return Math.round((toUtcStamp(dateKey) - toUtcStamp(todayKey())) / MS_PER_DAY)
}

/** `Oct 14` — adds the year when it differs from the current year. */
export function formatDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number)
  const date = new Date(year ?? 1970, (month ?? 1) - 1, day ?? 1)
  const sameYear = date.getFullYear() === new Date().getFullYear()
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  })
}

/**
 * Human label for a due date: `Today`, `Tomorrow`, `In 3 days`, `Oct 14`.
 * Overdue dates read backwards (`Yesterday`, `5 days ago`).
 */
export function formatDueLabel(dateKey: string): string {
  const days = daysUntil(dateKey)

  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days === -1) return 'Yesterday'
  if (days < -1) return `${Math.abs(days)} days ago`
  if (days <= 6) return `In ${days} days`

  return formatDateKey(dateKey)
}

/** `Friday, October 9` — used in the header. */
export function formatHeaderDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

/** `Created Oct 2` — used in the task card for context. */
export function formatCreatedAt(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return `Created ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
}

/** Time-of-day greeting used on the dashboard. */
export function greetingForHour(hour: number): string {
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}
