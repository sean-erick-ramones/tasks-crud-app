import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { tasks } from '../../server/db/schema';
import type { TaskCreate, ListQuery } from '../../shared/types/task.type';
import { listTasks } from '../../server/domain/task/task.query';

// We'll set the global db in beforeEach
let originalDb: any;

describe('taskQuery - list query builder', () => {
  let testDb: any;
  let sqlite: Database.Database;

  beforeEach(async () => {
    // Create in-memory database for testing
    sqlite = new Database(':memory:');
    testDb = drizzle(sqlite);

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
    `);

    // Replace the global db with our test db
    const dbModule = await import('../../server/db/client');
    originalDb = dbModule.db;
    Object.defineProperty(dbModule, 'db', {
      value: testDb,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    // Restore original db
    if (originalDb) {
      import('../../server/db/client').then(dbModule => {
        Object.defineProperty(dbModule, 'db', {
          value: originalDb,
          writable: true,
          configurable: true,
        });
      });
    }
    sqlite.close();
  });

  // Helper to create tasks directly in test DB
  async function createTestTask(data: TaskCreate, createdAt?: Date) {
    const now = createdAt || new Date();
    const task = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description ?? null,
      status: data.status ?? 'pending',
      priority: data.priority ?? 'medium',
      dueDate: data.dueDate ?? null,
      createdAt: now,
      updatedAt: now,
    };
    const result = await testDb.insert(tasks).values(task).returning();
    return result[0];
  }

  describe('pagination', () => {
    it('should paginate results correctly', async () => {
      // Create 15 tasks
      for (let i = 1; i <= 15; i++) {
        await createTestTask({
          title: `Task ${i}`,
          status: 'pending',
          priority: 'medium',
        });
      }

      // Get first page
      const page1 = await listTasks({
        page: 1,
        pageSize: 5,
        sortBy: 'createdAt',
        sortDir: 'desc',
      });

      expect(page1.data).toHaveLength(5);
      expect(page1.meta.page).toBe(1);
      expect(page1.meta.pageSize).toBe(5);
      expect(page1.meta.total).toBe(15);
      expect(page1.meta.totalPages).toBe(3);

      // Get second page
      const page2 = await listTasks({
        page: 2,
        pageSize: 5,
        sortBy: 'createdAt',
        sortDir: 'desc',
      });

      expect(page2.data).toHaveLength(5);
      expect(page2.meta.page).toBe(2);

      // Ensure different tasks on different pages
      expect(page1.data[0].id).not.toBe(page2.data[0].id);
    });

    it('should handle last page with fewer items', async () => {
      // Create 12 tasks
      for (let i = 1; i <= 12; i++) {
        await createTestTask({
          title: `Task ${i}`,
          status: 'pending',
          priority: 'medium',
        });
      }

      const lastPage = await listTasks({
        page: 3,
        pageSize: 5,
        sortBy: 'createdAt',
        sortDir: 'desc',
      });

      expect(lastPage.data).toHaveLength(2);
      expect(lastPage.meta.totalPages).toBe(3);
    });
  });

  describe('filtering', () => {
    beforeEach(async () => {
      // Create tasks with different statuses and priorities
      await createTestTask({ title: 'Task 1', status: 'pending', priority: 'low' });
      await createTestTask({ title: 'Task 2', status: 'in-progress', priority: 'medium' });
      await createTestTask({ title: 'Task 3', status: 'completed', priority: 'high' });
      await createTestTask({ title: 'Task 4', status: 'pending', priority: 'high' });
      await createTestTask({ title: 'Task 5', status: 'completed', priority: 'low' });
    });

    it('should filter by status', async () => {
      const result = await listTasks({
        page: 1,
        pageSize: 10,
        status: 'completed',
        sortBy: 'createdAt',
        sortDir: 'desc',
      });

      expect(result.data).toHaveLength(2);
      expect(result.data.every(task => task.status === 'completed')).toBe(true);
    });

    it('should filter by priority', async () => {
      const result = await listTasks({
        page: 1,
        pageSize: 10,
        priority: 'high',
        sortBy: 'createdAt',
        sortDir: 'desc',
      });

      expect(result.data).toHaveLength(2);
      expect(result.data.every(task => task.priority === 'high')).toBe(true);
    });

    it('should filter by both status and priority', async () => {
      const result = await listTasks({
        page: 1,
        pageSize: 10,
        status: 'pending',
        priority: 'high',
        sortBy: 'createdAt',
        sortDir: 'desc',
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].status).toBe('pending');
      expect(result.data[0].priority).toBe('high');
    });
  });

  describe('search', () => {
    beforeEach(async () => {
      await createTestTask({
        title: 'Buy groceries',
        description: 'Get milk and eggs',
        status: 'pending',
        priority: 'medium',
      });
      await createTestTask({
        title: 'Review code',
        description: 'Check pull request for new feature',
        status: 'in-progress',
        priority: 'high',
      });
      await createTestTask({
        title: 'Update documentation',
        description: null,
        status: 'completed',
        priority: 'low',
      });
    });

    it('should search by title', async () => {
      const result = await listTasks({
        page: 1,
        pageSize: 10,
        q: 'groceries',
        sortBy: 'createdAt',
        sortDir: 'desc',
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toContain('groceries');
    });

    it('should search by description', async () => {
      const result = await listTasks({
        page: 1,
        pageSize: 10,
        q: 'pull request',
        sortBy: 'createdAt',
        sortDir: 'desc',
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].description).toContain('pull request');
    });

    it('should search case-insensitively', async () => {
      const result = await listTasks({
        page: 1,
        pageSize: 10,
        q: 'GROCERIES',
        sortBy: 'createdAt',
        sortDir: 'desc',
      });

      expect(result.data).toHaveLength(1);
    });
  });

  describe('sorting', () => {
    beforeEach(async () => {
      // Create tasks with different dates and priorities and explicit timestamps
      const baseTime = new Date('2026-01-17T10:00:00Z');

      await createTestTask(
        {
          title: 'Task A',
          status: 'pending',
          priority: 'low',
          dueDate: new Date('2026-02-01'),
        },
        new Date(baseTime.getTime())
      );

      await createTestTask(
        {
          title: 'Task B',
          status: 'pending',
          priority: 'high',
          dueDate: new Date('2026-01-20'),
        },
        new Date(baseTime.getTime() + 1000)
      );

      await createTestTask(
        {
          title: 'Task C',
          status: 'pending',
          priority: 'medium',
          dueDate: null,
        },
        new Date(baseTime.getTime() + 2000)
      );
    });

    it('should sort by createdAt ascending', async () => {
      const result = await listTasks({
        page: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDir: 'asc',
      });

      expect(result.data[0].title).toBe('Task A');
      expect(result.data[2].title).toBe('Task C');
    });

    it('should sort by createdAt descending', async () => {
      const result = await listTasks({
        page: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDir: 'desc',
      });

      expect(result.data[0].title).toBe('Task C');
      expect(result.data[2].title).toBe('Task A');
    });

    it('should sort by priority ascending (low to high)', async () => {
      const result = await listTasks({
        page: 1,
        pageSize: 10,
        sortBy: 'priority',
        sortDir: 'asc',
      });

      expect(result.data[0].priority).toBe('low');
      expect(result.data[1].priority).toBe('medium');
      expect(result.data[2].priority).toBe('high');
    });

    it('should sort by priority descending (high to low)', async () => {
      const result = await listTasks({
        page: 1,
        pageSize: 10,
        sortBy: 'priority',
        sortDir: 'desc',
      });

      expect(result.data[0].priority).toBe('high');
      expect(result.data[1].priority).toBe('medium');
      expect(result.data[2].priority).toBe('low');
    });

    it('should sort by dueDate with nulls last', async () => {
      const result = await listTasks({
        page: 1,
        pageSize: 10,
        sortBy: 'dueDate',
        sortDir: 'asc',
      });

      expect(result.data[0].title).toBe('Task B'); // Jan 20
      expect(result.data[1].title).toBe('Task A'); // Feb 1
      expect(result.data[2].title).toBe('Task C'); // null (last)
      expect(result.data[2].dueDate).toBeNull();
    });
  });

  describe('combined filters', () => {
    beforeEach(async () => {
      // Create diverse set of tasks
      for (let i = 1; i <= 20; i++) {
        await createTestTask({
          title: i % 2 === 0 ? `Even Task ${i}` : `Odd Task ${i}`,
          description: i % 3 === 0 ? 'Important task' : null,
          status: i % 3 === 0 ? 'completed' : 'pending',
          priority: i % 2 === 0 ? 'high' : 'low',
          dueDate: i % 5 === 0 ? new Date('2026-03-01') : null,
        });
      }
    });

    it('should combine search, filter, sort, and pagination', async () => {
      const result = await listTasks({
        page: 1,
        pageSize: 5,
        q: 'Task',
        status: 'pending',
        sortBy: 'createdAt',
        sortDir: 'desc',
      });

      expect(result.data.length).toBeLessThanOrEqual(5);
      expect(result.data.every(task => task.status === 'pending')).toBe(true);
      expect(result.data.every(task => task.title.includes('Task'))).toBe(true);
      expect(result.meta.page).toBe(1);
      expect(result.meta.pageSize).toBe(5);
    });
  });
});
