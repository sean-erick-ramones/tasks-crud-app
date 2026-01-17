<script setup lang="ts">
import type { SortBy, SortDir } from '#shared/types/task.type';

const sortBy = defineModel<SortBy>('sortBy', { default: 'createdAt' });
const sortDir = defineModel<SortDir>('sortDir', { default: 'desc' });

const emit = defineEmits<{
  sort: [];
}>();

const handleSortChange = () => {
  emit('sort');
};

const toggleSortDir = () => {
  sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  emit('sort');
};
</script>

<template>
  <div class="flex items-center gap-3">
    <div class="flex-1 min-w-[200px]">
      <label
        for="sort-by"
        class="block text-sm font-medium text-gray-700 mb-1"
      >
        Sort By
      </label>
      <select
        id="sort-by"
        v-model="sortBy"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        @change="handleSortChange"
      >
        <option value="createdAt">Created Date</option>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
      </select>
    </div>

    <div class="flex-1">
      <label
        for="sort-dir"
        class="block text-sm font-medium text-gray-700 mb-1"
      >
        Sort Order
      </label>
      <button
        type="button"
        class="px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2 font-semibold text-gray-600"
        :title="sortDir === 'asc' ? 'Ascending' : 'Descending'"
        @click="toggleSortDir"
      >
        <span v-if="sortDir === 'asc'">↑</span>
        <span v-else>↓</span>
        {{ sortDir === 'asc' ? 'Asc' : 'Desc' }}
      </button>
    </div>
  </div>
</template>

<style scoped></style>
