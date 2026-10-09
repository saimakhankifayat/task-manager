<script setup lang="ts">
import type { Task } from '~/types/task'

defineProps<{ tasks: Task[] }>()

const emit = defineEmits<{
  toggle: [id: string]
  edit: [task: Task]
  delete: [task: Task]
}>()
</script>

<template>
  <TransitionGroup tag="ul" name="list" class="relative space-y-2">
    <TaskCard
      v-for="task in tasks"
      :key="task.id"
      :task="task"
      @toggle="emit('toggle', $event)"
      @edit="emit('edit', $event)"
      @delete="emit('delete', $event)"
    />
  </TransitionGroup>
</template>
