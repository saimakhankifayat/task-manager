<script setup lang="ts">
const { initTasks } = useTasks()
const { initTheme } = useTheme()

const route = useRoute()
const drawerOpen = ref(false)

// Client-only initialisation: reading localStorage after hydration keeps the
// server and client markup identical.
onMounted(() => {
  initTheme()
  initTasks()
})

watch(
  () => route.fullPath,
  () => {
    drawerOpen.value = false
  },
)
</script>

<template>
  <div class="min-h-screen">
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <AppSidebar />
    <AppDrawer :open="drawerOpen" @close="drawerOpen = false" />

    <div class="flex min-h-screen flex-col lg:pl-64">
      <AppHeader @menu="drawerOpen = true" />

      <main id="main-content" class="flex-1 px-4 pb-16 pt-6 sm:px-6 lg:px-10 lg:pt-8">
        <div class="mx-auto w-full max-w-6xl">
          <slot />
        </div>
      </main>
    </div>

    <TaskForm />
    <ConfirmDialog />
    <ToastHost />
  </div>
</template>
