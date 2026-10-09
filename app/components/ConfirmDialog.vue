<script setup lang="ts">
import { TriangleAlert } from '@lucide/vue'

const { confirmState, accept, close } = useConfirm()

const panel = ref<HTMLElement | null>(null)
const isOpen = computed(() => confirmState.value.isOpen)

useDialog({ isOpen: () => isOpen.value, container: panel, onClose: close })
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[55] flex items-center justify-center bg-navy/50 p-4"
        @click.self="close()"
      >
          <div
            ref="panel"
            class="dialog-panel w-full max-w-sm rounded-lg border border-border bg-surface p-5 shadow-pop"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-message"
          >
            <div class="flex items-start gap-3">
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger"
              >
                <TriangleAlert class="h-4 w-4" aria-hidden="true" />
              </span>
              <div class="min-w-0">
                <h2 id="confirm-title" class="text-[0.9375rem] font-semibold text-foreground">
                  {{ confirmState.title }}
                </h2>
                <p id="confirm-message" class="mt-1 text-sm leading-relaxed text-foreground-muted">
                  {{ confirmState.message }}
                </p>
              </div>
            </div>

            <div class="mt-5 flex justify-end gap-2">
              <button type="button" class="btn btn-secondary btn-md" data-autofocus @click="close()">
                Cancel
              </button>
              <button type="button" class="btn btn-danger btn-md" @click="accept()">
                {{ confirmState.confirmLabel }}
              </button>
            </div>
          </div>
      </div>
    </Transition>
  </Teleport>
</template>
