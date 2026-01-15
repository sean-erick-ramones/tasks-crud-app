<script setup lang="ts">
import type { TaskCreate } from '#shared/types/task.type'

const { fetchTasks, createTask, updateTaskStatus } = useTasksApi()

const tasks = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const loadTasks = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await fetchTasks()
    tasks.value = response.data
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to load tasks'
  } finally {
    loading.value = false
  }
}

const handleCreateTask = async (taskData: TaskCreate) => {
  error.value = null
  successMessage.value = null
  try {
    await createTask(taskData)
    successMessage.value = 'Task created successfully!'
    setTimeout(() => { successMessage.value = null }, 3000)
    await loadTasks()
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to create task'
  }
}

const handleStatusChange = async (id: string, status: string) => {
  error.value = null
  try {
    await updateTaskStatus(id, status)
    await loadTasks()
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to update task status'
  }
}

// Load tasks on mount
onMounted(() => {
  loadTasks()
})
</script>

<template>
  <div class="space-y-6">
    <div v-if="error" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
      {{ successMessage }}
    </div>

    <TaskForm @submit="handleCreateTask" />
    
    <TaskList 
      :tasks="tasks" 
      :loading="loading"
      @status-change="handleStatusChange"
    />
  </div>
</template>

<style scoped>
</style>
