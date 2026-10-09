<script setup lang="ts">
import { Calendar, Menu, Plus } from '@lucide/vue'

const emit = defineEmits<{ menu: [] }>()

const route = useRoute()
const { openCreate } = useTaskForm()

const page = computed(() => PAGE_META[route.path] ?? { title: 'Taskflow', description: '' })

/** Filled on the client only, so the rendered date always matches the user's locale. */
const todayLabel = ref('')
onMounted(() => {
  todayLabel.value = formatHeaderDate(new Date())
})

useHead(() => ({ title: page.value.title }))
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-border bg-background">
    <div
      class="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-10 lg:py-4"
    >
      <button
        type="button"
        class="btn btn-ghost btn-icon lg:hidden"
        aria-label="Open navigation menu"
        @click="emit('menu')"
      >
        <Menu class="h-5 w-5" aria-hidden="true" />
      </button>

      <div class="min-w-0 flex-1">
        <h1 class="truncate text-lg font-semibold tracking-[-0.02em] sm:text-xl">
          {{ page.title }}
        </h1>
        <p v-if="page.description" class="mt-0.5 hidden truncate text-sm text-foreground-muted sm:block">
          {{ page.description }}
        </p>
      </div>

      <div class="flex shrink-0 items-center gap-3">
        <span
          v-if="todayLabel"
          class="hidden items-center gap-1.5 text-sm text-foreground-muted md:flex"
        >
          <Calendar class="h-3.5 w-3.5" aria-hidden="true" />
          {{ todayLabel }}
        </span>

        <button type="button" class="btn btn-primary btn-md" @click="openCreate()">
          <Plus class="h-4 w-4" aria-hidden="true" />
          <span class="hidden sm:inline">Add task</span>
          <span class="sr-only sm:hidden">Add task</span>
        </button>
      </div>
    </div>
  </header>
</template>
