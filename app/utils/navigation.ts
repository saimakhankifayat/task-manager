import { LayoutDashboard, ListChecks, Settings } from '@lucide/vue'
import type { Component } from 'vue'

export interface NavItem {
  label: string
  to: string
  icon: Component
}

/** Single source of truth for primary navigation (sidebar + mobile drawer). */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Tasks', to: '/tasks', icon: ListChecks },
  { label: 'Settings', to: '/settings', icon: Settings },
]

export interface PageMeta {
  title: string
  description: string
}

/** Title + supporting line shown in the app header for each route. */
export const PAGE_META: Record<string, PageMeta> = {
  '/': {
    title: 'Dashboard',
    description: 'A quick look at what needs your attention.',
  },
  '/tasks': {
    title: 'Tasks',
    description: 'Search, filter and organise everything on your list.',
  },
  '/settings': {
    title: 'Settings',
    description: 'Appearance and data preferences.',
  },
}
