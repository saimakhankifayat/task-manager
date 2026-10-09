/**
 * All task-related types live here so the data model stays in one place.
 */

export type TaskPriority = 'low' | 'medium' | 'high'

export type TaskStatus = 'active' | 'completed'

export interface Task {
  id: string
  title: string
  description?: string
  priority: TaskPriority
  status: TaskStatus
  /** ISO calendar date (`yyyy-mm-dd`) or undefined when the task has no deadline. */
  dueDate?: string
  /** ISO timestamp. */
  createdAt: string
  /** ISO timestamp, set while the task is completed. */
  completedAt?: string
  /** Example tasks created on first launch are flagged so they can be removed separately. */
  isSample?: boolean
}

/** Values the create / edit form produces. */
export interface TaskDraft {
  title: string
  description?: string
  priority: TaskPriority
  dueDate?: string
}

export type TaskFilter = 'all' | 'active' | 'completed' | 'overdue'

export type TaskSortKey = 'dueDate' | 'priority' | 'createdAt'

export type SortDirection = 'asc' | 'desc'

export interface TaskStats {
  total: number
  completed: number
  active: number
  overdue: number
}

export interface FilterOption {
  value: TaskFilter
  label: string
}

export interface SortOption {
  value: TaskSortKey
  label: string
}

export type ThemePreference = 'system' | 'light' | 'dark'

export type ToastTone = 'success' | 'error' | 'info'

export interface ToastMessage {
  id: number
  text: string
  tone: ToastTone
}
