<script setup lang="ts">
import { X } from '@lucide/vue'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const panel = ref<HTMLElement | null>(null)
const route = useRoute()

useDialog({
  isOpen: () => props.open,
  container: panel,
  onClose: () => emit('close'),
})

function isActive(to: string): boolean {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 bg-navy/50 lg:hidden"
        aria-hidden="true"
        @click="emit('close')"
      />
    </Transition>

    <Transition name="slide">
      <div
        v-if="open"
        ref="panel"
        class="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85%] flex-col bg-sidebar lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div class="flex items-center justify-between px-5 pb-5 pt-6">
          <AppLogo />
          <button
            type="button"
            class="btn btn-icon text-sidebar-muted hover:bg-white/10 hover:text-white"
            aria-label="Close navigation menu"
            @click="emit('close')"
          >
            <X class="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <nav class="flex-1 px-3" aria-label="Main navigation">
          <ul class="space-y-0.5">
            <li v-for="item in NAV_ITEMS" :key="item.to">
              <NuxtLink
                :to="item.to"
                class="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors"
                :class="
                  isActive(item.to)
                    ? 'bg-sidebar-active font-medium text-white'
                    : 'text-sidebar-foreground hover:bg-white/5 hover:text-white'
                "
                :aria-current="isActive(item.to) ? 'page' : undefined"
                @click="emit('close')"
              >
                <component
                  :is="item.icon"
                  class="h-4 w-4 shrink-0"
                  :class="isActive(item.to) ? 'text-ivory' : 'text-sidebar-muted'"
                  aria-hidden="true"
                />
                <span>{{ item.label }}</span>
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div class="border-t border-sidebar-border px-5 py-4">
          <p class="text-xs leading-relaxed text-sidebar-muted">
            Everything is stored locally in your browser. No account, no servers.
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
