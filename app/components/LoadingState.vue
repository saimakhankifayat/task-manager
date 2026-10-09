<script setup lang="ts">
import { LoaderCircle } from '@lucide/vue'

withDefaults(defineProps<{ label?: string }>(), { label: 'Loading your tasks…' })
</script>

<template>
  <div
    class="flex flex-col items-center gap-3 rounded-lg border border-border bg-surface px-6 py-14 text-center"
    role="status"
    aria-live="polite"
  >
    <LoaderCircle class="h-5 w-5 animate-spin text-foreground-muted" aria-hidden="true" />
    <p class="text-sm text-foreground-muted">{{ label }}</p>
  </div>
</template>
