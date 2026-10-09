interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
}

interface ConfirmState {
  isOpen: boolean
  title: string
  message: string
  confirmLabel: string
}

/**
 * The callback is intentionally kept outside reactive state: it is only ever
 * set from client interactions and functions must not be serialized.
 */
let pendingAction: (() => void) | null = null

/**
 * Shared confirmation dialog (delete task, clear all tasks, …).
 * Rendered once in the default layout.
 */
export function useConfirm() {
  const state = useState<ConfirmState>('taskflow:confirm', () => ({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Delete',
  }))

  function confirm(options: ConfirmOptions): void {
    pendingAction = options.onConfirm
    state.value = {
      isOpen: true,
      title: options.title,
      message: options.message,
      confirmLabel: options.confirmLabel ?? 'Delete',
    }
  }

  function accept(): void {
    const action = pendingAction
    close()
    action?.()
  }

  function close(): void {
    pendingAction = null
    state.value = { ...state.value, isOpen: false }
  }

  return { confirmState: readonly(state), confirm, accept, close }
}
