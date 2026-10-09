<script setup lang="ts">
import { TriangleAlert } from '@lucide/vue'
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

function goHome(): void {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4">
    <div class="w-full max-w-md text-center">
      <span
        class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-danger"
      >
        <TriangleAlert class="h-5 w-5" aria-hidden="true" />
      </span>
      <p class="text-xs font-medium uppercase tracking-wider text-foreground-muted">
        {{ props.error.statusCode }}
      </p>
      <h1 class="mt-1 text-xl font-semibold tracking-[-0.02em]">Something went wrong</h1>
      <p class="mt-2 text-sm text-foreground-muted">
        {{ props.error.message || 'The page could not be loaded.' }}
      </p>
      <button type="button" class="btn btn-primary btn-md mt-5" @click="goHome()">
        Back to dashboard
      </button>
    </div>
  </div>
</template>
