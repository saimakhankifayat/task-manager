<script setup lang="ts">
import { Check, Clock, Pencil, Trash2 } from '@lucide/vue'
import type { Task, TaskPriority } from '~/types/task'

const props = defineProps<{ task: Task }>()

const emit = defineEmits<{
  toggle: [id: string]
  edit: [task: Task]
  delete: [task: Task]
}>()

const completed = computed(() => props.task.status === 'completed')
const overdue = computed(() => isOverdue(props.task))

const PRIORITY_CLASS: Record<TaskPriority, string> = {
  high: 'text-danger',
  medium: 'text-accent',
  low: 'text-foreground-muted',
}

const priorityClass = computed(() => PRIORITY_CLASS[props.task.priority])
const dueLabel = computed(() => (props.task.dueDate ? formatDueLabel(props.task.dueDate) : ''))
</script>

<template>
  <li
    class="group relative flex items-start gap-3 rounded-lg border border-border bg-surface px-3.5 py-3 transition-colors hover:border-foreground-muted/30"
  >
    <label class="relative mt-0.5 flex h-[18px] w-[18px] shrink-0 cursor-pointer">
      <input
        type="checkbox"
        class="peer sr-only"
        :checked="completed"
        :aria-label="
          completed ? `Mark “${task.title}” as active` : `Mark “${task.title}” as complete`
        "
        @change="emit('toggle', task.id)"
      />
      <span
        class="h-[18px] w-[18px] rounded-[5px] border border-border bg-surface transition-colors peer-hover:border-accent peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-accent/50"
        aria-hidden="true"
      />
      <Check
        class="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-primary-foreground opacity-0 transition-opacity peer-checked:opacity-100"
        aria-hidden="true"
      />
    </label>

    <div class="min-w-0 flex-1">
      <p
        class="text-sm font-medium leading-snug"
        :class="completed ? 'text-foreground-muted line-through decoration-foreground-muted/50' : 'text-foreground'"
      >
        {{ task.title }}
      </p>

      <p
        v-if="task.description"
        class="mt-1 line-clamp-2 text-[0.8125rem] leading-relaxed text-foreground-muted"
        :class="completed ? 'opacity-70' : ''"
      >
        {{ task.description }}
      </p>

      <div class="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs">
        <span
          class="inline-flex items-center gap-1.5 font-medium uppercase tracking-wide"
          :class="priorityClass"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
          {{ task.priority }}
        </span>

        <template v-if="dueLabel">
          <span class="text-foreground-muted/50" aria-hidden="true">·</span>
          <span
            class="inline-flex items-center gap-1"
            :class="overdue ? 'font-medium text-danger' : 'text-foreground-muted'"
          >
            <Clock class="h-3 w-3" aria-hidden="true" />
            {{ dueLabel }}
            <span class="sr-only">{{ overdue ? 'overdue' : 'due' }}</span>
          </span>
        </template>

        <template v-if="task.isSample">
          <span class="text-foreground-muted/50" aria-hidden="true">·</span>
          <span
            class="rounded border border-border px-1.5 py-px text-[0.6875rem] uppercase tracking-wide text-foreground-muted"
          >
            Sample
          </span>
        </template>
      </div>
    </div>

    <div
      class="flex shrink-0 items-center gap-0.5 sm:opacity-0 sm:transition-opacity sm:group-focus-within:opacity-100 sm:group-hover:opacity-100"
    >
      <button
        type="button"
        class="btn btn-ghost btn-icon"
        :aria-label="`Edit “${task.title}”`"
        @click="emit('edit', task)"
      >
        <Pencil class="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <button
        type="button"
        class="btn btn-ghost btn-icon hover:text-danger"
        :aria-label="`Delete “${task.title}”`"
        @click="emit('delete', task)"
      >
        <Trash2 class="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  </li>
</template>
