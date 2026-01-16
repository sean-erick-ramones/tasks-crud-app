import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createTask, deleteTask, getTaskById } from '../../server/domain/task/task.repository'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import type { TaskCreate } from '../../shared/types/task.type'

describe('taskRepo - delete', () => {
    let testDb: any
    let sqlite: Database.Database

    beforeEach(() => {
        // Create in-memory database for testing
        sqlite = new Database(':memory:')
        testDb = drizzle(sqlite)

        // Create tasks table
        sqlite.exec(`
      CREATE TABLE tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        priority TEXT NOT NULL DEFAULT 'medium',
        due_date INTEGER,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      )
    `)
    })

    afterEach(() => {
        sqlite.close()
    })

    describe('deleteTask', () => {
        it('should delete an existing task', async () => {
            const taskData: TaskCreate = {
                title: 'Task to Delete',
                description: 'This will be deleted',
                status: 'pending',
                priority: 'medium'
            }

            const created = await createTask(taskData)

            // Verify task exists
            const before = await getTaskById(created.id)
            expect(before).toBeDefined()

            // Delete task
            const result = await deleteTask(created.id)
            expect(result).toBe(true)

            // Verify task is gone
            const after = await getTaskById(created.id)
            expect(after).toBeUndefined()
        })

        it('should return false for non-existent task', async () => {
            const result = await deleteTask('non-existent-id')
            expect(result).toBe(false)
        })

        it('should delete task even if it has all fields populated', async () => {
            const taskData: TaskCreate = {
                title: 'Full Task',
                description: 'Complete task with all fields',
                status: 'in-progress',
                priority: 'high',
                dueDate: new Date('2026-02-01')
            }

            const created = await createTask(taskData)
            const deleted = await deleteTask(created.id)

            expect(deleted).toBe(true)

            const found = await getTaskById(created.id)
            expect(found).toBeUndefined()
        })
    })
})
