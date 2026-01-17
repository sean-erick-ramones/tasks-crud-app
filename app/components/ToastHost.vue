<script setup lang="ts">
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const toasts = ref<Toast[]>([]);
let nextId = 0;

function addToast(message: string, type: Toast['type'] = 'info') {
  const id = nextId++;
  toasts.value.push({ id, message, type });

  setTimeout(() => {
    removeToast(id);
  }, 4000);
}

function removeToast(id: number) {
  const index = toasts.value.findIndex(t => t.id === id);
  if (index !== -1) {
    toasts.value.splice(index, 1);
  }
}

defineExpose({ addToast });
</script>

<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="[
        'px-4 py-3 rounded shadow-lg min-w-64 max-w-md text-white animate-slide-in',
        toast.type === 'success' && 'bg-green-600',
        toast.type === 'error' && 'bg-red-600',
        toast.type === 'info' && 'bg-blue-600',
      ]"
    >
      <div class="flex items-center justify-between gap-2">
        <span class="text-sm">{{ toast.message }}</span>
        <button
          type="button"
          class="text-white hover:text-gray-200 text-lg font-bold"
          @click="removeToast(toast.id)"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
</style>
