import type { ThemePreference } from '~/types/task'

const THEME_KEY = 'taskflow_theme'

let mediaQueryBound = false

/**
 * Theme handling for the System / Light / Dark setting. The resolved theme is
 * applied as a `.dark` class on <html>, which the CSS tokens react to.
 */
export function useTheme() {
  const preference = useState<ThemePreference>('taskflow:theme', () => 'system')
  const resolved = useState<'light' | 'dark'>('taskflow:theme-resolved', () => 'light')

  function prefersDark(): boolean {
    return (
      import.meta.client && window.matchMedia('(prefers-color-scheme: dark)').matches
    )
  }

  function apply(value: ThemePreference = preference.value): void {
    const next: 'light' | 'dark' = value === 'system' ? (prefersDark() ? 'dark' : 'light') : value
    resolved.value = next
    if (import.meta.client) {
      document.documentElement.classList.toggle('dark', next === 'dark')
    }
  }

  function setPreference(value: ThemePreference): void {
    preference.value = value
    if (import.meta.client) {
      try {
        localStorage.setItem(THEME_KEY, value)
      } catch {
        // Ignore unavailable storage — the choice still applies for this session.
      }
    }
    apply(value)
  }

  /** Called once from the default layout, after mount. */
  function initTheme(): void {
    if (!import.meta.client) return

    try {
      const stored = localStorage.getItem(THEME_KEY)
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        preference.value = stored
      }
    } catch {
      // Fall back to the System preference.
    }

    apply()

    if (!mediaQueryBound) {
      mediaQueryBound = true
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', () => {
          if (preference.value === 'system') apply()
        })
    }
  }

  return {
    preference: readonly(preference),
    resolved: readonly(resolved),
    setPreference,
    initTheme,
  }
}
