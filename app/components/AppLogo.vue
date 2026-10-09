<script setup lang="ts">
import { CheckCheck } from '@lucide/vue'
</script>

<template>
  <NuxtLink to="/" class="flex items-center gap-2.5" aria-label="Taskflow — go to dashboard">
    <span
      class="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-ivory ring-1 ring-inset ring-white/15"
    >
      <CheckCheck class="h-4 w-4" aria-hidden="true" />
    </span>
    <span class="text-[0.9375rem] font-semibold tracking-[-0.01em] text-white">Taskflow</span>
  </NuxtLink>
</template>
