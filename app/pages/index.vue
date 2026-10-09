<script setup lang="ts">
import {
  ArrowRight,
  CalendarClock,
  Circle,
  CircleCheckBig,
  ClipboardList,
  TriangleAlert,
} from '@lucide/vue'
import type { Task, TaskPriority } from '~/types/task'

const {
  tasks,
  hydrated,
  loadError,
  stats,
  todayTasks,
  upcomingTasks,
  toggleTask,
  deleteTask,
  retryInit,
} = useTasks()
const { openCreate, openEdit } = useTaskForm()
const { confirm } = useConfirm()
const { show } = useToast()

/** Set after mount so the greeting always uses the visitor's local time. */
const greeting = ref('')
onMounted(() => {
  greeting.value = greetingForHour(new Date().getHours())
})

const hasTasks = computed(() => tasks.value.length > 0)

const progress = computed(() => ({
  completed: todayTasks.value.filter((task) => task.status === 'completed').length,
  total: todayTasks.value.length,
}))

const upcomingPreview = computed(() =>
  upcomingTasks.value
    .slice(0, 5)
    .map((task) => ({ task, due: task.dueDate ? formatDueLabel(task.dueDate) : '' })),
)

const PRIORITY_DOT: Record<TaskPriority, string> = {
  high: 'text-danger',
  medium: 'text-accent',
  low: 'text-foreground-muted',
}

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
    <div>
      <h2 class="text-xl font-semibold tracking-[-0.02em]">{{ greeting || 'Welcome' }}</h2>
      <p class="mt-1 text-sm text-foreground-muted">Here’s what needs your attention.</p>
    </div>

    <LoadingState v-if="!hydrated && !loadError" class="mt-6" />

    <EmptyState
      v-else-if="loadError"
      class="mt-6"
      tone="error"
      :icon="TriangleAlert"
      title="Something went wrong"
      message="We couldn’t read your saved tasks. Your data may be temporarily unavailable."
      action-label="Try again"
      @action="retryInit()"
    />

    <EmptyState
      v-else-if="!hasTasks"
      class="mt-6"
      :icon="ClipboardList"
      title="No tasks yet"
      message="Create your first task and start organizing your day."
      action-label="Add your first task"
      @action="openCreate()"
    />

    <template v-else>
      <div class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Tasks" :value="stats.total" :icon="ClipboardList" />
        <StatCard label="Completed" :value="stats.completed" :icon="CircleCheckBig" tone="success" />
        <StatCard label="Active" :value="stats.active" :icon="Circle" />
        <StatCard label="Overdue" :value="stats.overdue" :icon="TriangleAlert" tone="danger" />
      </div>

      <ProgressCard
        class="mt-4"
        title="Today’s Progress"
        :completed="progress.completed"
        :total="progress.total"
        empty-text="Nothing is due today. Add a task with today’s date to track progress."
      />

      <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section class="lg:col-span-3" aria-labelledby="today-heading">
          <div class="flex items-center justify-between gap-3">
            <h2 id="today-heading" class="section-title">Today’s Tasks</h2>
            <NuxtLink
              to="/tasks"
              class="inline-flex items-center gap-1 text-[0.8125rem] font-medium text-accent hover:underline"
            >
              View all
              <ArrowRight class="h-3.5 w-3.5" aria-hidden="true" />
            </NuxtLink>
          </div>

          <div class="mt-3">
            <TaskList
              v-if="todayTasks.length"
              :tasks="todayTasks"
              @toggle="toggleTask"
              @edit="openEdit"
              @delete="removeTask"
            />
            <EmptyState
              v-else
              compact
              tone="success"
              :icon="CircleCheckBig"
              title="You’re all caught up"
              message="Nothing is due today. Enjoy the clear runway."
            />
          </div>
        </section>

        <section class="lg:col-span-2" aria-labelledby="upcoming-heading">
          <div class="flex items-center justify-between gap-3">
            <h2 id="upcoming-heading" class="section-title">Upcoming</h2>
            <span v-if="upcomingTasks.length" class="tabular text-xs text-foreground-muted">
              {{ upcomingTasks.length }}
            </span>
          </div>

          <div class="surface mt-3 p-4">
            <ul v-if="upcomingPreview.length" class="divide-y divide-border">
              <li
                v-for="item in upcomingPreview"
                :key="item.task.id"
                class="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
              >
                <span
                  class="h-1.5 w-1.5 shrink-0 rounded-full bg-current"
                  :class="PRIORITY_DOT[item.task.priority]"
                  aria-hidden="true"
                />
                <span class="min-w-0 flex-1 truncate text-sm text-foreground">
                  {{ item.task.title }}
                </span>
                <span class="shrink-0 text-xs text-foreground-muted">{{ item.due }}</span>
              </li>
            </ul>

            <EmptyState
              v-else
              compact
              :icon="CalendarClock"
              title="Nothing scheduled"
              message="Tasks with future due dates will appear here."
            />

            <NuxtLink
              v-if="upcomingTasks.length > upcomingPreview.length"
              to="/tasks"
              class="mt-2 inline-flex items-center gap-1 text-[0.8125rem] font-medium text-accent hover:underline"
            >
              View all upcoming
              <ArrowRight class="h-3.5 w-3.5" aria-hidden="true" />
            </NuxtLink>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>
