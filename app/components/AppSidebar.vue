<script setup lang="ts">
const route = useRoute()

function isActive(to: string): boolean {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}
</script>

<template>
  <aside
    class="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex"
  >
    <div class="px-5 pb-5 pt-6">
      <AppLogo />
    </div>

    <nav class="flex-1 px-3" aria-label="Main navigation">
      <ul class="space-y-0.5">
        <li v-for="item in NAV_ITEMS" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors"
            :class="
              isActive(item.to)
                ? 'bg-sidebar-active font-medium text-white'
                : 'text-sidebar-foreground hover:bg-white/5 hover:text-white'
            "
            :aria-current="isActive(item.to) ? 'page' : undefined"
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
  </aside>
</template>
