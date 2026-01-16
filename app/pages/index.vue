<script setup lang="ts">
import type { TaskCreate, TaskUpdate, Task } from '#shared/types/task.type'

const { fetchTasks, createTask, updateTask, updateTaskStatus, deleteTask } = useTasksApi()

const tasks = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const editingTask = ref<Task | null>(null)
const isEditDialogOpen = ref(false)
const taskToDelete = ref<string | null>(null)

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

const handleEditTask = (task: Task) => {
  editingTask.value = task
  isEditDialogOpen.value = true
}

const handleUpdateTask = async (id: string, taskData: TaskUpdate) => {
  error.value = null
  successMessage.value = null
  try {
    await updateTask(id, taskData)
    successMessage.value = 'Task updated successfully!'
    setTimeout(() => { successMessage.value = null }, 3000)
    isEditDialogOpen.value = false
    editingTask.value = null
    await loadTasks()
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to update task'
  }
}

const handleDeleteRequest = (id: string) => {
  taskToDelete.value = id
}

const confirmDelete = async () => {
  if (!taskToDelete.value) return
  
  error.value = null
  successMessage.value = null
  try {
    await deleteTask(taskToDelete.value)
    successMessage.value = 'Task deleted successfully!'
    setTimeout(() => { successMessage.value = null }, 3000)
    taskToDelete.value = null
    await loadTasks()
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to delete task'
    taskToDelete.value = null
  }
}

const cancelDelete = () => {
  taskToDelete.value = null
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
      @edit="handleEditTask"
      @delete="handleDeleteRequest"
    />

    <!-- Edit Dialog -->
    <TaskEditDialog
      :task="editingTask"
      :open="isEditDialogOpen"
      @close="isEditDialogOpen = false; editingTask = null"
      @submit="handleUpdateTask"
    />

    <!-- Delete Confirmation Dialog -->
    <div
      v-if="taskToDelete"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="delete-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        @click="cancelDelete"
      />

      <!-- Modal -->
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
        >
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 id="delete-modal-title" class="text-base font-semibold leading-6 text-gray-900">
                  Delete Task
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete this task? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              class="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 sm:ml-3 sm:w-auto"
              @click="confirmDelete"
            >
              Delete
            </button>
            <button
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              @click="cancelDelete"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
