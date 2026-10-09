<script setup lang="ts">
import { CircleAlert, CircleCheck, Info, X } from '@lucide/vue'
import type { ToastTone } from '~/types/task'

const { toasts, dismiss } = useToast()

const ICONS: Record<ToastTone, typeof CircleCheck> = {
  success: CircleCheck,
  error: CircleAlert,
  info: Info,
}

const TONES: Record<ToastTone, string> = {
  success: 'text-success',
  error: 'text-danger',
  info: 'text-accent',
}
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-4 sm:items-end sm:p-6"
    aria-live="polite"
  >
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-md border border-border bg-surface px-3.5 py-3 shadow-pop"
      >
        <component
          :is="ICONS[toast.tone]"
          class="mt-0.5 h-4 w-4 shrink-0"
          :class="TONES[toast.tone]"
          aria-hidden="true"
        />
        <p class="flex-1 text-sm text-foreground">{{ toast.text }}</p>
        <button
          type="button"
          class="btn btn-ghost btn-icon h-6 w-6"
          aria-label="Dismiss notification"
          @click="dismiss(toast.id)"
        >
          <X class="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
