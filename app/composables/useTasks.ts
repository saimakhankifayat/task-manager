import type { Task, TaskDraft, TaskStats } from '~/types/task'

const STORAGE_KEY = 'taskflow_tasks'

function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `task_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

/** Example tasks created once, on the very first launch. */
function createSampleTasks(): Task[] {
  const now = new Date().toISOString()
  const day = 86_400_000
  const offset = (days: number) => toDateKey(new Date(Date.now() + days * day))

  return [
    {
      id: uid(),
      title: 'Finish physics notes',
      description: 'Complete chapter 3 — vectors and motion.',
      priority: 'high',
      status: 'active',
      dueDate: offset(0),
      createdAt: now,
      isSample: true,
    },
    {
      id: uid(),
      title: 'Reply to Maya about the standup',
      description: 'Share the notes from yesterday and confirm the time.',
      priority: 'medium',
      status: 'active',
      dueDate: offset(0),
      createdAt: now,
      isSample: true,
    },
    {
      id: uid(),
      title: 'Book dentist appointment',
      priority: 'low',
      status: 'active',
      dueDate: offset(2),
      createdAt: now,
      isSample: true,
    },
    {
      id: uid(),
      title: 'Review the quarterly report',
      description: 'Skim the summary, flag anything that needs follow-up.',
      priority: 'high',
      status: 'active',
      dueDate: offset(5),
      createdAt: now,
      isSample: true,
    },
    {
      id: uid(),
      title: 'Send the invoice',
      description: 'Client number 042, reference the March work.',
      priority: 'medium',
      status: 'completed',
      dueDate: offset(-1),
      createdAt: now,
      completedAt: now,
      isSample: true,
    },
  ]
}

function sanitizeTask(value: unknown): Task | null {
  if (typeof value !== 'object' || value === null) return null
  const raw = value as Record<string, unknown>

  const title = typeof raw.title === 'string' ? raw.title.trim() : ''
  if (!title) return null

  const priority =
    raw.priority === 'low' || raw.priority === 'high' || raw.priority === 'medium'
      ? raw.priority
      : 'medium'

  const status = raw.status === 'completed' ? 'completed' : 'active'

  const description =
    typeof raw.description === 'string' && raw.description.trim() ? raw.description.trim() : undefined

  const dueDate = typeof raw.dueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw.dueDate)
    ? raw.dueDate
    : undefined

  const createdAt =
    typeof raw.createdAt === 'string' && !Number.isNaN(Date.parse(raw.createdAt))
      ? raw.createdAt
      : new Date().toISOString()

  const completedAt =
    status === 'completed' && typeof raw.completedAt === 'string' && !Number.isNaN(Date.parse(raw.completedAt))
      ? raw.completedAt
      : undefined

  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : uid(),
    title,
    description,
    priority,
    status,
    dueDate,
    createdAt,
    ...(completedAt ? { completedAt } : {}),
    ...(raw.isSample === true ? { isSample: true } : {}),
  }
}

function sanitizeTasks(value: unknown): Task[] {
  if (!Array.isArray(value)) return []
  return value.map(sanitizeTask).filter((task): task is Task => task !== null)
}

/**
 * Central store for every task operation: reading, writing, persisting and the
 * derived views the pages need. Pages never touch localStorage themselves.
 */
export function useTasks() {
  const tasks = useState<Task[]>('taskflow:tasks', () => [])
  const hydrated = useState<boolean>('taskflow:hydrated', () => false)
  const loadError = useState<boolean>('taskflow:load-error', () => false)

  function persist(): void {
    if (import.meta.server) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks.value))
    } catch {
      // Storage can be unavailable (private mode, quota). The app keeps working
      // in memory for the current session.
    }
  }

  /** Loads persisted tasks. Runs on the client, after mount. */
  function initTasks(): void {
    if (import.meta.server || hydrated.value) return

    const toast = useToast()

    let stored: string | null
    try {
      stored = localStorage.getItem(STORAGE_KEY)
    } catch {
      // Storage access is blocked entirely (private mode, disabled cookies).
      tasks.value = []
      loadError.value = true
      hydrated.value = true
      return
    }

    try {
      if (stored === null) {
        // First visit: seed a small, tasteful set of examples.
        tasks.value = createSampleTasks()
        persist()
      } else {
        const parsed: unknown = JSON.parse(stored)

        if (Array.isArray(parsed)) {
          const cleaned = sanitizeTasks(parsed)
          tasks.value = cleaned
          // Some entries were unusable — rewrite storage in its clean form.
          if (cleaned.length !== parsed.length) {
            persist()
            toast.show('Some saved tasks were unreadable and have been removed.', 'error')
          }
        } else {
          tasks.value = []
          persist()
          toast.show('Saved task data was unreadable and has been reset.', 'error')
        }
      }
      loadError.value = false
    } catch {
      // Corrupted JSON: recover with an empty list and self-heal storage.
      tasks.value = []
      persist()
      toast.show('Saved task data was unreadable and has been reset.', 'error')
      loadError.value = false
    }

    hydrated.value = true
  }

  /** Retries a failed load — used by the error state's "Try again" button. */
  function retryInit(): void {
    hydrated.value = false
    initTasks()
  }

  function createTask(draft: TaskDraft): Task | null {
    const title = draft.title.trim()
    if (!title) return null

    const task: Task = {
      id: uid(),
      title,
      description: draft.description?.trim() || undefined,
      priority: draft.priority,
      status: 'active',
      dueDate: draft.dueDate || undefined,
      createdAt: new Date().toISOString(),
    }

    tasks.value = [task, ...tasks.value]
    persist()
    return task
  }

  function updateTask(id: string, draft: TaskDraft): void {
    const title = draft.title.trim()
    if (!title) return

    tasks.value = tasks.value.map((task) =>
      task.id === id
        ? {
            ...task,
            title,
            description: draft.description?.trim() || undefined,
            priority: draft.priority,
            dueDate: draft.dueDate || undefined,
          }
        : task,
    )
    persist()
  }

  function deleteTask(id: string): void {
    tasks.value = tasks.value.filter((task) => task.id !== id)
    persist()
  }

  function toggleTask(id: string): void {
    tasks.value = tasks.value.map((task) => {
      if (task.id !== id) return task

      if (task.status === 'completed') {
        const reopened: Task = { ...task, status: 'active' }
        delete reopened.completedAt
        return reopened
      }

      return { ...task, status: 'completed' as const, completedAt: new Date().toISOString() }
    })
    persist()
  }

  function clearAllTasks(): void {
    tasks.value = []
    persist()
  }

  function removeSampleTasks(): void {
    tasks.value = tasks.value.filter((task) => task.isSample !== true)
    persist()
  }

  const stats = computed<TaskStats>(() => {
    let completed = 0
    let overdue = 0

    for (const task of tasks.value) {
      if (task.status === 'completed') {
        completed += 1
      } else if (task.dueDate && daysUntil(task.dueDate) < 0) {
        overdue += 1
      }
    }

    return {
      total: tasks.value.length,
      completed,
      active: tasks.value.length - completed,
      overdue,
    }
  })

  /** Tasks that need attention today: overdue items first, then today's. */
  const todayTasks = computed(() =>
    tasks.value
      .filter((task) => task.dueDate && daysUntil(task.dueDate) <= 0)
      .sort((a, b) => {
        if (a.status !== b.status) return a.status === 'active' ? -1 : 1
        return toUtcStamp(a.dueDate!) - toUtcStamp(b.dueDate!)
      }),
  )

  /** Upcoming deadlines, nearest first. */
  const upcomingTasks = computed(() =>
    tasks.value
      .filter((task) => task.status === 'active' && task.dueDate && daysUntil(task.dueDate) > 0)
      .sort((a, b) => toUtcStamp(a.dueDate!) - toUtcStamp(b.dueDate!)),
  )

  const sampleCount = computed(() => tasks.value.filter((task) => task.isSample === true).length)

  return {
    tasks,
    hydrated: readonly(hydrated),
    loadError: readonly(loadError),

    stats,
    todayTasks,
    upcomingTasks,
    sampleCount,

    initTasks,
    retryInit,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
    clearAllTasks,
    removeSampleTasks,
  }
}
