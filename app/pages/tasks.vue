<script setup lang="ts">
import {
  ArrowDown,
  ArrowUp,
  CircleCheck,
  ClipboardList,
  Plus,
  SearchX,
  TriangleAlert,
} from '@lucide/vue'
import type { SortDirection, Task, TaskFilter, TaskSortKey } from '~/types/task'

const { tasks, hydrated, loadError, toggleTask, deleteTask, retryInit } = useTasks()
const { openCreate, openEdit } = useTaskForm()
const { confirm } = useConfirm()
const { show } = useToast()

const search = ref('')
const filter = ref<TaskFilter>('all')
const sortKey = ref<TaskSortKey>('dueDate')
const direction = ref<SortDirection>('asc')

/** Sensible starting direction for each sort key. */
const DEFAULT_DIRECTION: Record<TaskSortKey, SortDirection> = {
  dueDate: 'asc',
  priority: 'asc',
  createdAt: 'desc',
}

watch(sortKey, (key) => {
  direction.value = DEFAULT_DIRECTION[key]
})

function toggleDirection(): void {
  direction.value = direction.value === 'asc' ? 'desc' : 'asc'
}

/** Derived list: the source array is never mutated. */
const visibleTasks = computed(() =>
  tasks.value
    .filter((task) => matchesFilter(task, filter.value) && matchesSearch(task, search.value))
    .slice()
    .sort((a, b) => compareTasks(a, b, sortKey.value, direction.value)),
)

const isFiltered = computed(() => filter.value !== 'all' || search.value.trim() !== '')

const emptyState = computed(() => {
  const query = search.value.trim()
  if (query) {
    return {
      title: 'No tasks match your search',
      message: `Nothing matches “${query}”. Try another word or clear the search.`,
      actionLabel: 'Clear search',
      action: () => {
        search.value = ''
      },
      icon: SearchX,
    }
  }

  if (filter.value === 'active') {
    return {
      title: 'No active tasks',
      message: 'Everything on your list is done. Add a new task when you are ready.',
      actionLabel: 'Add task',
      action: () => openCreate(),
      icon: CircleCheck,
    }
  }

  if (filter.value === 'completed') {
    return {
      title: 'No completed tasks yet',
      message: 'Tasks you finish will be listed here.',
      actionLabel: 'Show all tasks',
      action: () => {
        filter.value = 'all'
      },
      icon: ClipboardList,
    }
  }

  if (filter.value === 'overdue') {
    return {
      title: 'Nothing overdue',
      message: 'Nice work keeping your deadlines on track.',
      actionLabel: 'Show all tasks',
      action: () => {
        filter.value = 'all'
      },
      icon: CircleCheck,
    }
  }

  return {
    title: 'No tasks',
    message: 'Add a task to get started.',
    actionLabel: 'Add task',
    action: () => openCreate(),
    icon: ClipboardList,
  }
})

function removeTask(task: Task): void {
  confirm({
    title: 'Delete task?',
    message: `“${task.title}” will be permanently removed. This action cannot be undone.`,
    onConfirm: () => {
      deleteTask(task.id)
      show('Task deleted', 'info')
    },
  })
}
</script>

<template>
  <div>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="w-full sm:max-w-xs">
        <TaskSearch v-model="search" />
      </div>

      <div class="flex items-center gap-2">
        <label for="sort-key" class="hidden text-[0.8125rem] text-foreground-muted sm:block">
          Sort
        </label>
        <select
          id="sort-key"
          v-model="sortKey"
          class="input h-9 w-full py-0 text-[0.8125rem] sm:w-40"
        >
          <option v-for="option in SORT_OPTIONS" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <button
          type="button"
          class="btn btn-secondary btn-icon h-9 w-9"
          :aria-label="direction === 'asc' ? 'Sort descending' : 'Sort ascending'"
          :title="direction === 'asc' ? 'Sort descending' : 'Sort ascending'"
          @click="toggleDirection()"
        >
          <component
            :is="direction === 'asc' ? ArrowUp : ArrowDown"
            class="h-4 w-4"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>

    <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
      <TaskFilters v-model="filter" />

      <div class="flex items-center gap-3">
        <p class="text-sm text-foreground-muted">
          <span class="tabular font-medium text-foreground">{{ visibleTasks.length }}</span>
          {{ visibleTasks.length === 1 ? 'task' : 'tasks' }}
          <span v-if="isFiltered"> of {{ tasks.length }}</span>
        </p>
        <button type="button" class="btn btn-primary btn-sm" @click="openCreate()">
          <Plus class="h-3.5 w-3.5" aria-hidden="true" />
          Add task
        </button>
      </div>
    </div>

    <div class="mt-4">
      <LoadingState v-if="!hydrated && !loadError" />

      <EmptyState
        v-else-if="loadError"
        tone="error"
        :icon="TriangleAlert"
        title="Something went wrong"
        message="We couldn’t read your saved tasks. Your data may be temporarily unavailable."
        action-label="Try again"
        @action="retryInit()"
      />

      <EmptyState
        v-else-if="tasks.length === 0"
        :icon="ClipboardList"
        title="No tasks yet"
        message="Create your first task and start organizing your day."
        action-label="Add your first task"
        @action="openCreate()"
      />

      <EmptyState
        v-else-if="visibleTasks.length === 0"
        :icon="emptyState.icon"
        :title="emptyState.title"
        :message="emptyState.message"
        :action-label="emptyState.actionLabel"
        @action="emptyState.action()"
      />

      <TaskList
        v-else
        :tasks="visibleTasks"
        @toggle="toggleTask"
        @edit="openEdit"
        @delete="removeTask"
      />
    </div>
  </div>
</template>
