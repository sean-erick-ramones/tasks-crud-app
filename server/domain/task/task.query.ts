import { SQL, sql, eq, and, or, like, asc, desc } from 'drizzle-orm'
import { db } from '../../db/client'
import { tasks } from '../../db/schema'
import type { Task, ListQuery, TaskListResponse } from '#shared/types/task.type'

export async function listTasks(query: ListQuery): Promise<TaskListResponse> {
  const { page, pageSize, status, priority, q, sortBy, sortDir } = query

  // Build WHERE conditions
  const conditions: SQL[] = []

  if (status) {
    conditions.push(eq(tasks.status, status))
  }

  if (priority) {
    conditions.push(eq(tasks.priority, priority))
  }

  if (q) {
    const searchTerm = `%${q}%`
    conditions.push(
      or(
        like(tasks.title, searchTerm),
        like(tasks.description, searchTerm)
      )!
    )
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  // Get total count
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(tasks)
    .where(whereClause)

  const total = Number(countResult[0].count)
  const totalPages = Math.ceil(total / pageSize)

  // Build ORDER BY
  let orderByClause
  if (sortBy === 'dueDate') {
    // Null due dates sort last
    orderByClause = sortDir === 'asc'
      ? sql`${tasks.dueDate} IS NULL, ${tasks.dueDate} ASC`
      : sql`${tasks.dueDate} IS NULL, ${tasks.dueDate} DESC`
  } else if (sortBy === 'priority') {
    // Map priority to numeric values for sorting: low=1, medium=2, high=3
    const priorityOrder = sql`CASE
      WHEN ${tasks.priority} = 'low' THEN 1
      WHEN ${tasks.priority} = 'medium' THEN 2
      WHEN ${tasks.priority} = 'high' THEN 3
    END`
    orderByClause = sortDir === 'asc' ? asc(priorityOrder) : desc(priorityOrder)
  } else {
    // createdAt
    orderByClause = sortDir === 'asc' ? asc(tasks.createdAt) : desc(tasks.createdAt)
  }

  // Get paginated data
  const offset = (page - 1) * pageSize
  const data = await db
    .select()
    .from(tasks)
    .where(whereClause)
    .orderBy(orderByClause)
    .limit(pageSize)
    .offset(offset)

  return {
    data,
    meta: {
      page,
      pageSize,
      total,
      totalPages
    }
  }
}
