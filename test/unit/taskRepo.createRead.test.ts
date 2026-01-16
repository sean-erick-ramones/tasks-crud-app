import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createTask, getTaskById } from '../../server/domain/task/task.repository'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { tasks } from '../../server/db/schema.ts'
import type { TaskCreate } from '../../shared/types/task.type'

describe('taskRepo - create and read', () => {
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

    describe('createTask', () => {
        it('should create a task with all fields', async () => {
            const taskData: TaskCreate = {
                title: 'Test Task',
                description: 'Test Description',
                status: 'in-progress',
                priority: 'high',
                dueDate: new Date('2026-01-20')
            }

            const created = await createTask(taskData)

            expect(created).toBeDefined()
            expect(created.id).toBeTruthy()
            expect(created.title).toBe('Test Task')
            expect(created.description).toBe('Test Description')
            expect(created.status).toBe('in-progress')
            expect(created.priority).toBe('high')
            expect(created.createdAt).toBeInstanceOf(Date)
            expect(created.updatedAt).toBeInstanceOf(Date)
        })

        it('should create a task with defaults', async () => {
            const taskData: TaskCreate = {
                title: 'Minimal Task'
            }

            const created = await createTask(taskData)

            expect(created.title).toBe('Minimal Task')
            expect(created.status).toBe('pending')
            expect(created.priority).toBe('medium')
            expect(created.description).toBeNull()
            expect(created.dueDate).toBeNull()
        })

        it('should generate unique UUIDs', async () => {
            const task1 = await createTask({ title: 'Task 1' })
            const task2 = await createTask({ title: 'Task 2' })

            expect(task1.id).not.toBe(task2.id)
            expect(task1.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
        })
    })

    describe('getTaskById', () => {
        it('should retrieve an existing task', async () => {
            const created = await createTask({ title: 'Find Me' })
            const found = await getTaskById(created.id)

            expect(found).toBeDefined()
            expect(found?.id).toBe(created.id)
            expect(found?.title).toBe('Find Me')
        })

        it('should return undefined for non-existent task', async () => {
            const found = await getTaskById('00000000-0000-4000-a000-000000000000')
            expect(found).toBeUndefined()
        })
    })
})
