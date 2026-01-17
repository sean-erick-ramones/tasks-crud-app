<script setup lang="ts">
import type { TaskStatus, TaskPriority } from '#shared/types/task.type';

const statusFilter = defineModel<TaskStatus | undefined>('status');
const priorityFilter = defineModel<TaskPriority | undefined>('priority');

const emit = defineEmits<{
  filter: [];
}>();

const handleFilterChange = () => {
  emit('filter');
};

const clearFilters = () => {
  statusFilter.value = undefined;
  priorityFilter.value = undefined;
  emit('filter');
};

const hasActiveFilters = computed(() => {
  return statusFilter.value !== undefined || priorityFilter.value !== undefined;
});
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <div class="flex-1 min-w-[200px]">
      <label
        for="status-filter"
        class="block text-sm font-medium text-gray-700 mb-1"
      >
        Status
      </label>
      <select
        id="status-filter"
        v-model="statusFilter"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        @change="handleFilterChange"
      >
        <option :value="undefined">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>

    <div class="flex-1 min-w-[200px]">
      <label
        for="priority-filter"
        class="block text-sm font-medium text-gray-700 mb-1"
      >
        Priority
      </label>
      <select
        id="priority-filter"
        v-model="priorityFilter"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        @change="handleFilterChange"
      >
        <option :value="undefined">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>

    <div
      v-if="hasActiveFilters"
      class="flex items-end"
    >
      <button
        type="button"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        @click="clearFilters"
      >
        Clear Filters
      </button>
    </div>
  </div>
</template>

<style scoped></style>
