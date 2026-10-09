<script setup lang="ts">
import type { Component } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    value: number
    icon: Component
    tone?: 'default' | 'success' | 'danger'
  }>(),
  { tone: 'default' },
)

const valueClass = computed(() => {
  if (props.value === 0) return 'text-foreground'
  if (props.tone === 'danger') return 'text-danger'
  if (props.tone === 'success') return 'text-success'
  return 'text-foreground'
})

const iconClass = computed(() => {
  if (props.value === 0) return 'text-foreground-muted/70'
  if (props.tone === 'danger') return 'text-danger/80'
  if (props.tone === 'success') return 'text-success/80'
  return 'text-foreground-muted/70'
})
</script>

<template>
  <div class="surface px-4 py-3.5">
    <div class="flex items-center justify-between gap-3">
      <span class="text-[0.8125rem] text-foreground-muted">{{ label }}</span>
      <component :is="icon" class="h-4 w-4 shrink-0" :class="iconClass" aria-hidden="true" />
    </div>
    <p class="mt-2 text-2xl font-semibold tabular tracking-[-0.02em]" :class="valueClass">
      {{ value }}
    </p>
  </div>
</template>
