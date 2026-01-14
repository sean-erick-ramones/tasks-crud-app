import { z } from 'zod'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { tasks } from '../../db/schema'

// Enums
export const TaskStatus = z.enum(['pending', 'in-progress', 'completed'])
export type TaskStatus = z.infer<typeof TaskStatus>

export const TaskPriority = z.enum(['low', 'medium', 'high'])
export type TaskPriority = z.infer<typeof TaskPriority>

export const SortBy = z.enum(['dueDate', 'createdAt', 'priority'])
export type SortBy = z.infer<typeof SortBy>

export const SortDir = z.enum(['asc', 'desc'])
export type SortDir = z.infer<typeof SortDir>

export const PageSize = z.enum(['5', '10', '25']).transform(Number)
export type PageSize = z.infer<typeof PageSize>

// Base schemas from Drizzle
export const selectTaskSchema = createSelectSchema(tasks)
export const insertTaskSchema = createInsertSchema(tasks, {
  title: (schema) => schema.min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  description: (schema) => schema.max(500, 'Description must be 500 characters or less').nullable().optional(),
  status: () => TaskStatus.optional(),
  priority: () => TaskPriority.optional(),
  dueDate: (schema) => schema.nullable().optional()
})

// API request schemas
export const createTaskSchema = insertTaskSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
})

export const updateTaskSchema = createTaskSchema.required({
  status: true,
  priority: true
})

export const patchTaskSchema = z.object({
  status: TaskStatus
})

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: PageSize.default(10),
  status: TaskStatus.optional(),
  priority: TaskPriority.optional(),
  q: z.string().optional(),
  sortBy: SortBy.default('createdAt'),
  sortDir: SortDir.default('desc')
})

// TypeScript types
export type Task = z.infer<typeof selectTaskSchema>
export type TaskInsert = z.infer<typeof insertTaskSchema>
export type TaskCreate = z.infer<typeof createTaskSchema>
export type TaskUpdate = z.infer<typeof updateTaskSchema>
export type TaskPatch = z.infer<typeof patchTaskSchema>
export type ListQuery = z.infer<typeof listQuerySchema>

// Response types
export type TaskListMeta = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export type TaskListResponse = {
  data: Task[]
  meta: TaskListMeta
}
