import type { ToastMessage, ToastTone } from '~/types/task'

let nextToastId = 0

/**
 * Tiny toast store. Only ever used from user interactions, so the timers are
 * safely client-only.
 */
export function useToast() {
  const toasts = useState<ToastMessage[]>('taskflow:toasts', () => [])

  function dismiss(id: number): void {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  function show(text: string, tone: ToastTone = 'success', duration = 3200): void {
    const id = ++nextToastId
    toasts.value = [...toasts.value, { id, text, tone }]
    if (import.meta.client) {
      window.setTimeout(() => dismiss(id), duration)
    }
  }

  return { toasts, show, dismiss }
}
