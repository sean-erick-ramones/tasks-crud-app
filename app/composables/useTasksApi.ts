import type { Task, TaskCreate, TaskUpdate, TaskListResponse } from '#shared/types/task.type'

export const useTasksApi = () => {
  const fetchTasks = async (params?: Record<string, any>): Promise<TaskListResponse> => {
    return await $fetch('/api/tasks', { params })
  }

  const fetchTask = async (id: string): Promise<Task> => {
    return await $fetch(`/api/tasks/${id}`)
  }

  const createTask = async (data: TaskCreate): Promise<Task> => {
    return await $fetch('/api/tasks', {
      method: 'POST',
      body: data
    })
  }

  const updateTask = async (id: string, data: TaskUpdate): Promise<Task> => {
    return await $fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      body: data
    })
  }

  const updateTaskStatus = async (id: string, status: string): Promise<Task> => {
    return await $fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      body: { status }
    })
  }

  const deleteTask = async (id: string): Promise<void> => {
    return await $fetch(`/api/tasks/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask
  }
}
