<script setup lang="ts">
import { Search, X } from '@lucide/vue'

const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="relative">
    <Search
      class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted"
      aria-hidden="true"
    />
    <input
      v-model="model"
      type="search"
      class="input pl-9 pr-9 [&::-webkit-search-cancel-button]:hidden"
      placeholder="Search tasks…"
      aria-label="Search tasks by title or description"
    />
    <button
      v-if="model"
      type="button"
      class="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-foreground-muted transition-colors hover:text-foreground"
      aria-label="Clear search"
      @click="model = ''"
    >
      <X class="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  </div>
</template>
