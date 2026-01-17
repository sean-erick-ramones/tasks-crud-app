<script setup lang="ts">
import type { TaskCreate } from '#shared/types/task.type';
import { createTaskSchema } from '#shared/schemas/task.schema';

const emit = defineEmits<{
  submit: [task: TaskCreate];
}>();

const formData = ref<TaskCreate>({
  title: '',
  description: null,
  status: 'pending',
  priority: 'medium',
  dueDate: null,
});

const handleSubmit = () => {
  const taskData: TaskCreate = {
    ...formData.value,
    dueDate: formData.value.dueDate ? new Date(formData.value.dueDate) : null,
  };

  // Validate data
  const validation = createTaskSchema.safeParse(taskData);
  if (!validation.success) {
    console.error('Validation errors:', validation.error);
    return;
  }

  emit('submit', validation.data);

  // Reset form
  formData.value = {
    title: '',
    description: null,
    status: 'pending',
    priority: 'medium',
    dueDate: null,
  };
};
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">Create New Task</h2>

    <form
      class="space-y-4"
      @submit.prevent="handleSubmit"
    >
      <div>
        <label
          for="title"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Title
          <span class="text-red-500">*</span>
        </label>
        <input
          id="title"
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
          for="description"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          v-model="formData.description"
          rows="3"
          maxlength="500"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter task description (optional)"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label
            for="status"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Status
          </label>
          <select
            id="status"
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
            for="priority"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Priority
          </label>
          <select
            id="priority"
            v-model="formData.priority"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label
            for="dueDate"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Due Date
          </label>
          <input
            id="dueDate"
            v-model="formData.dueDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        class="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Create Task
      </button>
    </form>
  </div>
</template>

<style scoped></style>
