import { z } from 'zod'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { tasks } from '../../server/db/schema'

// Enums
export const TaskStatusSchema = z.enum(['pending', 'in-progress', 'completed'])
export const TaskPrioritySchema = z.enum(['low', 'medium', 'high'])
export const SortBySchema = z.enum(['dueDate', 'createdAt', 'priority'])
export const SortDirSchema = z.enum(['asc', 'desc'])
export const PageSizeSchema = z.enum(['5', '10', '25']).transform(Number)

// Base schemas from Drizzle
export const selectTaskSchema = createSelectSchema(tasks)
export const insertTaskSchema = createInsertSchema(tasks, {
  title: (schema) => schema.min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  description: (schema) => schema.max(500, 'Description must be 500 characters or less').nullable().optional(),
  status: () => TaskStatusSchema.optional(),
  priority: () => TaskPrioritySchema.optional(),
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
  status: TaskStatusSchema
})

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: PageSizeSchema.default(10),
  status: TaskStatusSchema.optional(),
  priority: TaskPrioritySchema.optional(),
  q: z.string().optional(),
  sortBy: SortBySchema.default('createdAt'),
  sortDir: SortDirSchema.default('desc')
})
