import { eq } from 'drizzle-orm'
import { db } from '../../db/client'
import { tasks } from '../../db/schema'
import type { Task, TaskInsert, TaskCreate, TaskUpdate } from '#shared/types/task.type'

export async function createTask(data: TaskCreate): Promise<Task> {
  const now = new Date()
  const task: TaskInsert = {
    id: crypto.randomUUID(),
    title: data.title,
    description: data.description ?? null,
    status: data.status ?? 'pending',
    priority: data.priority ?? 'medium',
    dueDate: data.dueDate ?? null,
    createdAt: now,
    updatedAt: now
  }

  const result = await db.insert(tasks).values(task).returning()
  return result[0]
}

export async function getTaskById(id: string): Promise<Task | undefined> {
  const result = await db.select().from(tasks).where(eq(tasks.id, id))
  return result[0]
}

export async function updateTask(id: string, data: TaskUpdate): Promise<Task | undefined> {
  const now = new Date()
  const result = await db
    .update(tasks)
    .set({
      title: data.title,
      description: data.description ?? null,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ?? null,
      updatedAt: now
    })
    .where(eq(tasks.id, id))
    .returning()

  return result[0]
}

export async function patchTaskStatus(id: string, status: Task['status']): Promise<Task | undefined> {
  const now = new Date()
  const result = await db
    .update(tasks)
    .set({ status, updatedAt: now })
    .where(eq(tasks.id, id))
    .returning()

  return result[0]
}

export async function deleteTask(id: string): Promise<boolean> {
  const result = await db.delete(tasks).where(eq(tasks.id, id)).returning()
  return result.length > 0
}
