<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string
    completed: number
    total: number
    /** Copy shown when there is nothing to measure yet. */
    emptyText?: string
  }>(),
  { emptyText: 'Nothing on the schedule yet.' },
)

const percent = computed(() =>
  props.total > 0 ? Math.round((props.completed / props.total) * 100) : 0,
)
</script>

<template>
  <section class="surface p-5" aria-labelledby="progress-heading">
    <div class="flex items-baseline justify-between gap-4">
      <h2 id="progress-heading" class="section-title">{{ title }}</h2>
      <span v-if="total > 0" class="text-sm font-medium tabular text-foreground-muted">
        {{ percent }}%
      </span>
    </div>

    <p class="mt-1 text-sm text-foreground-muted">
      <template v-if="total > 0">{{ completed }} of {{ total }} tasks completed</template>
      <template v-else>{{ emptyText }}</template>
    </p>

    <div
      v-if="total > 0"
      class="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted"
      role="progressbar"
      :aria-valuenow="percent"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-label="`${title}: ${percent}%`"
    >
      <div
        class="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
        :style="{ width: `${percent}%` }"
      />
    </div>
  </section>
</template>
