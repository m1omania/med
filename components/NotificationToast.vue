<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="px-4 py-3 rounded-lg shadow-lg text-white text-sm animate-in fade-in slide-in-from-bottom-2"
        :class="
          t.type === 'error'
            ? 'bg-red-500'
            : t.type === 'info'
              ? 'bg-calming-500'
              : 'bg-calming-600'
        "
      >
        {{ t.message }}
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { toasts } = useToast()
</script>
