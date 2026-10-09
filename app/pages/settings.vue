<script setup lang="ts">
import { Database, Info, MonitorSmartphone, Moon, Palette, Sparkles, Sun, Trash2 } from '@lucide/vue'
import type { Component } from 'vue'
import type { ThemePreference } from '~/types/task'

const { hydrated, stats, sampleCount, clearAllTasks, removeSampleTasks } = useTasks()
const { preference, setPreference } = useTheme()
const { confirm } = useConfirm()
const { show } = useToast()

const themeOptions: { value: ThemePreference; label: string; icon: Component }[] = [
  { value: 'system', label: 'System', icon: MonitorSmartphone },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
]

function confirmClear(): void {
  confirm({
    title: 'Clear all tasks?',
    message: `This permanently removes all ${stats.value.total} tasks, including completed ones. This action cannot be undone.`,
    confirmLabel: 'Clear all',
    onConfirm: () => {
      clearAllTasks()
      show('All tasks cleared', 'info')
    },
  })
}

function confirmRemoveSamples(): void {
  confirm({
    title: 'Remove sample tasks?',
    message: `The ${sampleCount.value} example tasks will be removed. Tasks you created yourself are untouched.`,
    confirmLabel: 'Remove',
    onConfirm: () => {
      removeSampleTasks()
      show('Sample tasks removed', 'info')
    },
  })
}
</script>

<template>
  <div class="space-y-4">
    <section class="surface p-5 sm:p-6" aria-labelledby="appearance-heading">
      <div class="flex items-start gap-3">
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-muted text-foreground-muted"
        >
          <Palette class="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h2 id="appearance-heading" class="section-title">Appearance</h2>
          <p class="mt-1 text-sm text-foreground-muted">
            Choose how Taskflow looks. System follows your device preference.
          </p>
        </div>
      </div>

      <fieldset class="mt-4">
        <legend class="sr-only">Theme</legend>
        <div class="grid grid-cols-3 gap-2 sm:max-w-sm">
          <label
            v-for="option in themeOptions"
            :key="option.value"
            class="relative cursor-pointer"
          >
            <input
              type="radio"
              name="theme"
              class="peer sr-only"
              :value="option.value"
              :checked="preference === option.value"
              @change="setPreference(option.value)"
            />
            <span
              class="flex flex-col items-center gap-1.5 rounded-md border border-border px-3 py-3 text-[0.8125rem] text-foreground-muted transition-colors peer-hover:border-accent peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-accent/50"
            >
              <component :is="option.icon" class="h-4 w-4" aria-hidden="true" />
              {{ option.label }}
            </span>
          </label>
        </div>
      </fieldset>
    </section>

    <section class="surface p-5 sm:p-6" aria-labelledby="data-heading">
      <div class="flex items-start gap-3">
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-muted text-foreground-muted"
        >
          <Database class="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h2 id="data-heading" class="section-title">Data</h2>
          <p class="mt-1 text-sm text-foreground-muted">
            Taskflow keeps everything in this browser. Review or clear it here.
          </p>
        </div>
      </div>

      <LoadingState v-if="!hydrated" class="mt-4" label="Loading your data…" />

      <template v-else>
        <dl class="mt-4 grid grid-cols-3 gap-4 sm:max-w-md">
          <div>
            <dt class="meta">Total tasks</dt>
            <dd class="mt-0.5 text-lg font-semibold tabular">{{ stats.total }}</dd>
          </div>
          <div>
            <dt class="meta">Completed</dt>
            <dd class="mt-0.5 text-lg font-semibold tabular">{{ stats.completed }}</dd>
          </div>
          <div>
            <dt class="meta">Sample tasks</dt>
            <dd class="mt-0.5 text-lg font-semibold tabular">{{ sampleCount }}</dd>
          </div>
        </dl>

        <div class="mt-5 flex flex-wrap gap-2">
          <button
            v-if="sampleCount > 0"
            type="button"
            class="btn btn-secondary btn-md"
            @click="confirmRemoveSamples()"
          >
            <Sparkles class="h-4 w-4" aria-hidden="true" />
            Remove sample tasks
          </button>
          <button
            type="button"
            class="btn btn-danger btn-md"
            :disabled="stats.total === 0"
            @click="confirmClear()"
          >
            <Trash2 class="h-4 w-4" aria-hidden="true" />
            Clear all tasks
          </button>
        </div>
      </template>
    </section>

    <section class="surface p-5 sm:p-6" aria-labelledby="about-heading">
      <div class="flex items-start gap-3">
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-muted text-foreground-muted"
        >
          <Info class="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <h2 id="about-heading" class="section-title">About Taskflow</h2>
          <p class="mt-1 text-sm text-foreground-muted">
            Version 1.0.0 — built with Nuxt 4, Vue 3, TypeScript and Tailwind CSS 4.
          </p>
        </div>
      </div>

      <p
        class="mt-4 rounded-md border border-border bg-buttercream/30 p-3 text-xs leading-relaxed text-foreground-muted dark:bg-buttercream/10"
      >
        Your tasks are stored only in this browser’s localStorage. Nothing is uploaded anywhere, and
        clearing your browser data will remove them.
      </p>
    </section>
  </div>
</template>
