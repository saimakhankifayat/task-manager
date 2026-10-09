import type {
  SortDirection,
  Task,
  TaskFilter,
  TaskPriority,
  TaskSortKey,
} from '~/types/task'

export const PRIORITY_RANK: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
}

export const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

export const FILTER_OPTIONS: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
]

export const SORT_OPTIONS: { value: TaskSortKey; label: string }[] = [
  { value: 'dueDate', label: 'Due date' },
  { value: 'priority', label: 'Priority' },
  { value: 'createdAt', label: 'Created date' },
]

/** Active task with a deadline in the past. */
export function isOverdue(task: Task): boolean {
  return task.status === 'active' && !!task.dueDate && daysUntil(task.dueDate) < 0
}

export function matchesFilter(task: Task, filter: TaskFilter): boolean {
  switch (filter) {
    case 'active':
      return task.status === 'active'
    case 'completed':
      return task.status === 'completed'
    case 'overdue':
      return isOverdue(task)
    default:
      return true
  }
}

export function matchesSearch(task: Task, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return (
    task.title.toLowerCase().includes(needle) ||
    (task.description?.toLowerCase().includes(needle) ?? false)
  )
}

/**
 * Compares two tasks for the given sort key. Tasks without a due date always
 * sink to the bottom of the due-date sort so real deadlines stay visible.
 */
export function compareTasks(
  a: Task,
  b: Task,
  key: TaskSortKey,
  direction: SortDirection,
): number {
  const sign = direction === 'asc' ? 1 : -1
  let result = 0

  if (key === 'priority') {
    result = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
  } else if (key === 'createdAt') {
    result = Date.parse(a.createdAt) - Date.parse(b.createdAt)
  } else {
    if (a.dueDate && b.dueDate) result = toUtcStamp(a.dueDate) - toUtcStamp(b.dueDate)
    else if (a.dueDate) return -1
    else if (b.dueDate) return 1
  }

  if (result === 0) return Date.parse(b.createdAt) - Date.parse(a.createdAt)
  return result * sign
}
