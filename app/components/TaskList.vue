<script setup lang="ts">
import type { Task } from '#shared/types/task.type'

defineProps<{
  tasks: Task[]
  loading?: boolean
}>()

const emit = defineEmits<{
  statusChange: [id: string, status: string]
}>()

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'in-progress':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-green-100 text-green-800'
  }
}

const formatDate = (date: Date | null) => {
  if (!date) return 'No due date'
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const handleStatusChange = (taskId: string, newStatus: string) => {
  emit('statusChange', taskId, newStatus)
}
</script>

<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-6 border-b border-gray-200">
      <h2 class="text-xl font-semibold text-gray-900">Tasks</h2>
    </div>

    <div v-if="loading" class="p-8 text-center text-gray-500">
      Loading tasks...
    </div>

    <div v-else-if="tasks.length === 0" class="p-8 text-center text-gray-500">
      No tasks found. Create your first task above!
    </div>

    <div v-else class="divide-y divide-gray-200">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="p-6 hover:bg-gray-50 transition-colors"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-medium text-gray-900 truncate">
              {{ task.title }}
            </h3>
            <p v-if="task.description" class="mt-1 text-sm text-gray-600">
              {{ task.description }}
            </p>
            <div class="mt-2 flex flex-wrap gap-2">
              <span :class="['px-2 py-1 text-xs font-medium rounded-full', getStatusColor(task.status)]">
                {{ task.status }}
              </span>
              <span :class="['px-2 py-1 text-xs font-medium rounded-full', getPriorityColor(task.priority)]">
                {{ task.priority }} priority
              </span>
              <span class="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                {{ formatDate(task.dueDate) }}
              </span>
            </div>
          </div>

          <div class="ml-4">
            <label :for="`status-${task.id}`" class="sr-only">Change status</label>
            <select
              :id="`status-${task.id}`"
              :value="task.status"
              class="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @change="handleStatusChange(task.id, ($event.target as HTMLSelectElement).value)"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
