import type { Task } from '~/types/task'

interface TaskFormState {
  isOpen: boolean
  /** The task being edited, or null when creating a new one. */
  task: Task | null
}

/**
 * One shared task form, opened from anywhere in the app (header, dashboard,
 * tasks page, task cards) and rendered once in the default layout.
 */
export function useTaskForm() {
  const state = useState<TaskFormState>('taskflow:task-form', () => ({
    isOpen: false,
    task: null,
  }))

  function openCreate(): void {
    state.value = { isOpen: true, task: null }
  }

  function openEdit(task: Task): void {
    state.value = { isOpen: true, task }
  }

  function close(): void {
    state.value = { isOpen: false, task: null }
  }

  return {
    formState: readonly(state),
    openCreate,
    openEdit,
    close,
  }
}
