<script setup lang="ts">
import type { TaskFilter } from '~/types/task'

const model = defineModel<TaskFilter>({ required: true })
</script>

<template>
  <div
    class="flex items-center gap-1 overflow-x-auto rounded-md border border-border bg-surface p-1"
    role="group"
    aria-label="Filter tasks"
  >
    <button
      v-for="option in FILTER_OPTIONS"
      :key="option.value"
      type="button"
      class="whitespace-nowrap rounded px-2.5 py-1 text-[0.8125rem] font-medium transition-colors"
      :class="
        model === option.value
          ? 'bg-primary text-primary-foreground'
          : 'text-foreground-muted hover:bg-surface-muted hover:text-foreground'
      "
      :aria-pressed="model === option.value"
      @click="model = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>
