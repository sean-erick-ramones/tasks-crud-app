import { z } from 'zod';
import type {
  TaskStatusSchema,
  TaskPrioritySchema,
  SortBySchema,
  SortDirSchema,
  PageSizeSchema,
  selectTaskSchema,
  insertTaskSchema,
  createTaskSchema,
  updateTaskSchema,
  patchTaskSchema,
  listQuerySchema,
} from '../schemas/task.schema';

// Enum types
export type TaskStatus = z.infer<typeof TaskStatusSchema>;
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;
export type SortBy = z.infer<typeof SortBySchema>;
export type SortDir = z.infer<typeof SortDirSchema>;
export type PageSize = z.infer<typeof PageSizeSchema>;

// Schema-derived types
export type Task = z.infer<typeof selectTaskSchema>;
export type TaskInsert = z.infer<typeof insertTaskSchema>;
export type TaskCreate = z.infer<typeof createTaskSchema>;
export type TaskUpdate = z.infer<typeof updateTaskSchema>;
export type TaskPatch = z.infer<typeof patchTaskSchema>;
export type ListQuery = z.infer<typeof listQuerySchema>;

// Response types
export type TaskListMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type TaskListResponse = {
  data: Task[];
  meta: TaskListMeta;
};
