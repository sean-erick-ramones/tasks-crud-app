<script setup lang="ts">
import type { Task, TaskUpdate } from '#shared/types/task.type';
import { updateTaskSchema } from '#shared/schemas/task.schema';

const props = defineProps<{
  task: Task | null;
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
  submit: [id: string, task: TaskUpdate];
}>();

const formData = ref<TaskUpdate>({
  title: '',
  description: null,
  status: 'pending',
  priority: 'medium',
  dueDate: null,
});

// Watch for task changes to populate the form
watch(
  () => props.task,
  newTask => {
    if (!newTask) return;

    formData.value = {
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      priority: newTask.priority,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null,
    };
  },
  { immediate: true }
);

const handleSubmit = () => {
  if (!props.task) return;

  const taskData: TaskUpdate = {
    ...formData.value,
    dueDate: formData.value.dueDate ? new Date(formData.value.dueDate) : null,
  };

  // Validate data
  const validation = updateTaskSchema.safeParse(taskData);
  if (!validation.success) {
    console.error('Validation errors:', validation.error);
    return;
  }

  emit('submit', props.task.id, validation.data);
  emit('close');
};

const handleClose = () => {
  emit('close');
};

// Close on escape key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    handleClose();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <!-- Backdrop -->
    <div
      class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
      @click="handleClose"
    />

    <!-- Modal -->
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <div
        class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
      >
        <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3
                id="modal-title"
                class="text-lg font-semibold leading-6 text-gray-900 mb-4"
              >
                Edit Task
              </h3>

              <form
                class="space-y-4"
                @submit.prevent="handleSubmit"
              >
                <div>
                  <label
                    for="edit-title"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Title
                    <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="edit-title"
                    v-model="formData.title"
                    type="text"
                    required
                    maxlength="100"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task title"
                  />
                </div>

                <div>
                  <label
                    for="edit-description"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="edit-description"
                    v-model="formData.description"
                    rows="3"
                    maxlength="500"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task description (optional)"
                  />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      for="edit-status"
                      class="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Status
                    </label>
                    <select
                      id="edit-status"
                      v-model="formData.status"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label
                      for="edit-priority"
                      class="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Priority
                    </label>
                    <select
                      id="edit-priority"
                      v-model="formData.priority"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    for="edit-dueDate"
                    class="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Due Date
                  </label>
                  <input
                    id="edit-dueDate"
                    v-model="formData.dueDate"
                    type="date"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                  <button
                    type="submit"
                    class="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:w-auto"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    @click="handleClose"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
