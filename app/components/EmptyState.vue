<script setup lang="ts">
import type { Component } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string
    message: string
    icon?: Component
    tone?: 'default' | 'success' | 'error'
    actionLabel?: string
    /** When set the action renders as a link instead of a button. */
    to?: string
    compact?: boolean
  }>(),
  { tone: 'default', compact: false },
)

const emit = defineEmits<{ action: [] }>()

const iconClass = computed(() => {
  switch (props.tone) {
    case 'success':
      return 'text-success'
    case 'error':
      return 'text-danger'
    default:
      return 'text-foreground-muted'
  }
})
</script>

<template>
  <div
    class="flex flex-col items-center text-center"
    :class="compact ? 'px-2 py-6' : 'rounded-lg border border-dashed border-border px-6 py-12'"
  >
    <span
      v-if="icon"
      class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted"
      :class="iconClass"
    >
      <component :is="icon" class="h-5 w-5" aria-hidden="true" />
    </span>

    <h3 class="text-sm font-semibold text-foreground">{{ title }}</h3>
    <p class="mt-1 max-w-sm text-sm leading-relaxed text-foreground-muted">{{ message }}</p>

    <NuxtLink
      v-if="actionLabel && to"
      :to="to"
      class="btn btn-primary btn-md mt-4"
    >
      {{ actionLabel }}
    </NuxtLink>
    <button
      v-else-if="actionLabel"
      type="button"
      class="btn btn-primary btn-md mt-4"
      @click="emit('action')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>
