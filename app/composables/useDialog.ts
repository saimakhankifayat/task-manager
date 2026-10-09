/**
 * Focus handling shared by every overlay (task form, confirm dialog, mobile
 * drawer): remembers the trigger, focuses the first field, traps Tab, closes on
 * Escape and restores focus on close.
 */
export function useDialog(options: {
  isOpen: () => boolean
  container: Ref<HTMLElement | null>
  onClose: () => void
}) {
  const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

  let previouslyFocused: HTMLElement | null = null
  let bodyOverflow = ''

  function focusableItems(): HTMLElement[] {
    const root = options.container.value
    if (!root) return []
    return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (element) => element.offsetParent !== null,
    )
  }

  function onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault()
      options.onClose()
      return
    }

    if (event.key !== 'Tab') return

    const items = focusableItems()
    if (items.length === 0) return

    const first = items[0]!
    const last = items[items.length - 1]!
    const active = document.activeElement as HTMLElement | null

    if (event.shiftKey && (active === first || !active)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  function activate(): void {
    previouslyFocused = document.activeElement as HTMLElement | null
    bodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeydown, true)

    nextTick(() => {
      const preferred = options.container.value?.querySelector<HTMLElement>('[data-autofocus]')
      const target = preferred ?? focusableItems()[0] ?? options.container.value
      target?.focus()
    })
  }

  function deactivate(): void {
    document.removeEventListener('keydown', onKeydown, true)
    document.body.style.overflow = bodyOverflow
    previouslyFocused?.focus?.()
    previouslyFocused = null
  }

  watch(
    () => options.isOpen(),
    (open) => (open ? activate() : deactivate()),
    { flush: 'post' },
  )

  onBeforeUnmount(deactivate)

  return { activate, deactivate }
}
