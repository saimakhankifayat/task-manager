<script setup lang="ts">
import { CircleAlert, X } from '@lucide/vue'
import type { TaskDraft, TaskPriority } from '~/types/task'

const { formState, close } = useTaskForm()
const { createTask, updateTask } = useTasks()
const { show } = useToast()

const panel = ref<HTMLElement | null>(null)
const titleInput = ref<HTMLInputElement | null>(null)

const title = ref('')
const description = ref('')
const priority = ref<TaskPriority>('medium')
const dueDate = ref('')
const titleError = ref('')

const isOpen = computed(() => formState.value.isOpen)
const isEditing = computed(() => formState.value.task !== null)

useDialog({ isOpen: () => isOpen.value, container: panel, onClose: close })

// Populate the form every time it opens: empty for create, filled for edit.
watch(isOpen, (open) => {
  if (!open) return
  const task = formState.value.task
  title.value = task?.title ?? ''
  description.value = task?.description ?? ''
  priority.value = task?.priority ?? 'medium'
  dueDate.value = task?.dueDate ?? ''
  titleError.value = ''
})

function setDueOffset(days: number): void {
  dueDate.value = toDateKey(new Date(Date.now() + days * 86_400_000))
}

function submit(): void {
  const trimmed = title.value.trim()

  if (!trimmed) {
    titleError.value = 'Give the task a title so you know what to do.'
    titleInput.value?.focus()
    return
  }

  const draft: TaskDraft = {
    title: trimmed,
    description: description.value,
    priority: priority.value,
    dueDate: dueDate.value || undefined,
  }

  const current = formState.value.task
  if (current) {
    updateTask(current.id, draft)
    show('Task updated')
  } else {
    createTask(draft)
    show('Task added')
  }

  close()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[70] flex items-end justify-center overflow-y-auto bg-navy/50 sm:items-center sm:p-6"
        @click.self="close()"
      >
          <div
            ref="panel"
            class="dialog-panel flex max-h-[92vh] w-full flex-col rounded-t-xl border border-border bg-surface shadow-pop sm:max-w-lg sm:rounded-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-form-title"
          >
            <form class="flex min-h-0 flex-col" novalidate @submit.prevent="submit">
              <div class="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
                <div>
                  <h2 id="task-form-title" class="text-base font-semibold tracking-[-0.01em]">
                    {{ isEditing ? 'Edit task' : 'New task' }}
                  </h2>
                  <p class="mt-0.5 text-[0.8125rem] text-foreground-muted">
                    {{ isEditing ? 'Update the details below.' : 'Add something to your list.' }}
                  </p>
                </div>
                <button
                  type="button"
                  class="btn btn-ghost btn-icon"
                  aria-label="Close dialog"
                  @click="close()"
                >
                  <X class="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div class="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
                <div>
                  <label for="task-title" class="label">
                    Title <span class="text-danger" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="task-title"
                    ref="titleInput"
                    v-model="title"
                    type="text"
                    class="input"
                    :class="titleError ? 'border-danger' : ''"
                    placeholder="e.g. Finish physics notes"
                    autocomplete="off"
                    :aria-invalid="titleError ? 'true' : undefined"
                    :aria-describedby="titleError ? 'task-title-error' : undefined"
                    data-autofocus
                    @input="titleError = ''"
                  />
                  <p v-if="titleError" id="task-title-error" class="field-error">
                    <CircleAlert class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {{ titleError }}
                  </p>
                </div>

                <div>
                  <label for="task-description" class="label">
                    Description
                    <span class="font-normal text-foreground-muted/70">(optional)</span>
                  </label>
                  <textarea
                    id="task-description"
                    v-model="description"
                    rows="3"
                    class="input resize-y"
                    placeholder="Add any details that will help later."
                  />
                </div>

                <fieldset>
                  <legend class="label">Priority</legend>
                  <div class="grid grid-cols-3 gap-2">
                    <label
                      v-for="option in PRIORITY_OPTIONS"
                      :key="option.value"
                      class="relative cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="task-priority"
                        class="peer sr-only"
                        :value="option.value"
                        :checked="priority === option.value"
                        @change="priority = option.value"
                      />
                      <span
                        class="flex h-9 items-center justify-center rounded-md border border-border text-[0.8125rem] text-foreground-muted transition-colors peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-accent/50 peer-hover:border-accent"
                      >
                        {{ option.label }}
                      </span>
                    </label>
                  </div>
                </fieldset>

                <div>
                  <label for="task-due" class="label">
                    Due date
                    <span class="font-normal text-foreground-muted/70">(optional)</span>
                  </label>
                  <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      id="task-due"
                      v-model="dueDate"
                      type="date"
                      class="input sm:flex-1"
                    />
                    <div class="flex items-center gap-1">
                      <button
                        type="button"
                        class="btn btn-secondary btn-sm"
                        @click="setDueOffset(0)"
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        class="btn btn-secondary btn-sm"
                        @click="setDueOffset(1)"
                      >
                        Tomorrow
                      </button>
                      <button
                        v-if="dueDate"
                        type="button"
                        class="btn btn-ghost btn-sm"
                        @click="dueDate = ''"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
                <button type="button" class="btn btn-secondary btn-md" @click="close()">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary btn-md">
                  {{ isEditing ? 'Save changes' : 'Create task' }}
                </button>
              </div>
            </form>
          </div>
      </div>
    </Transition>
  </Teleport>
</template>
