<script setup lang="ts">
import type { TaskCreate, TaskUpdate, Task, TaskStatus } from '#shared/types/task.type';
import ToastHost from '~/components/ToastHost.vue';

// Get API methods
const { createTask, updateTask, updateTaskStatus, deleteTask } = useTasksApi();

// Get state management
const {
  tasks,
  meta,
  status,
  refresh,
  execute,
  searchQuery,
  statusFilter,
  priorityFilter,
  sortBy,
  sortDir,
  handleSearch,
  handleFilter,
  handleSort,
  handlePageChange,
  handlePageSizeChange,
} = useTasks();
console.log('status in index.vue:', status);
// Component-specific state
const editingTask = ref<Task | null>(null);
const isEditDialogOpen = ref(false);
const taskToDelete = ref<string | null>(null);

// Toast notifications
const toastHost = ref<InstanceType<typeof ToastHost> | null>(null);

const handleCreateTask = async (taskData: TaskCreate) => {
  try {
    await createTask(taskData);
    toastHost.value?.addToast('Task created successfully!', 'success');
    await refresh();
  } catch (e: unknown) {
    const error = e as { data?: { message?: string } };
    toastHost.value?.addToast(error.data?.message || 'Failed to create task', 'error');
  }
};

const handleStatusChange = async (id: string, status: TaskStatus) => {
  try {
    await updateTaskStatus(id, status);
    toastHost.value?.addToast('Status updated successfully!', 'success');
    await refresh();
  } catch (e: unknown) {
    const error = e as { data?: { message?: string } };
    toastHost.value?.addToast(error.data?.message || 'Failed to update task status', 'error');
  }
};

const handleEditTask = (task: Task) => {
  editingTask.value = task;
  isEditDialogOpen.value = true;
};

const handleUpdateTask = async (id: string, taskData: TaskUpdate) => {
  try {
    await updateTask(id, taskData);
    toastHost.value?.addToast('Task updated successfully!', 'success');
    isEditDialogOpen.value = false;
    editingTask.value = null;
    await refresh();
  } catch (e: unknown) {
    if (!toastHost.value) return;
    const error = e as { data?: { message?: string } };
    toastHost.value.addToast(error.data?.message || 'Failed to update task', 'error');
  }
};

const handleDeleteRequest = (id: string) => {
  taskToDelete.value = id;
};

const confirmDelete = async () => {
  if (!taskToDelete.value) return;

  try {
    await deleteTask(taskToDelete.value);
    toastHost.value?.addToast('Task deleted successfully!', 'success');
    taskToDelete.value = null;
    await refresh();
  } catch (e: unknown) {
    const error = e as { data?: { message?: string } };
    toastHost.value?.addToast(error.data?.message || 'Failed to delete task', 'error');
    taskToDelete.value = null;
  }
};

const cancelDelete = () => {
  taskToDelete.value = null;
};

onMounted(() => {
  // Initial load of tasks
  execute();
});
</script>

<template>
  <div class="space-y-6">
    <!-- Toast Host -->
    <ToastHost ref="toastHost" />

    <TaskForm @submit="handleCreateTask" />

    <!-- Search, Filter, and Sort Controls -->
    <div class="bg-white rounded-lg shadow p-6 space-y-4">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Find Tasks</h3>

      <TaskSearchBar
        v-model="searchQuery"
        @search="handleSearch"
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TaskFilters
          v-model:status="statusFilter"
          v-model:priority="priorityFilter"
          @filter="handleFilter"
        />

        <TaskSort
          v-model:sort-by="sortBy"
          v-model:sort-dir="sortDir"
          @sort="handleSort"
        />
      </div>
    </div>

    <TaskList
      :tasks="tasks"
      :request-status="status"
      @status-change="handleStatusChange"
      @edit="handleEditTask"
      @delete="handleDeleteRequest"
    />

    <!-- Pagination -->
    <PaginationControls
      v-if="meta.total > 0"
      :meta="meta"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    />

    <!-- Edit Dialog -->
    <TaskEditDialog
      :task="editingTask"
      :open="isEditDialogOpen"
      @close="
        isEditDialogOpen = false;
        editingTask = null;
      "
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
              <div
                class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
              >
                <span class="text-2xl text-red-600">!</span>
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3
                  id="delete-modal-title"
                  class="text-base font-semibold leading-6 text-gray-900"
                >
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

<style scoped></style>
