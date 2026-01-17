import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createTask, updateTask } from '../../server/domain/task/task.repository';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import type { TaskCreate, TaskUpdate } from '../../shared/types/task.type';

describe('taskRepo - update fields', () => {
  let testDb: any;
  let sqlite: Database.Database;

  beforeEach(() => {
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
  });

  afterEach(() => {
    sqlite.close();
  });

  describe('updateTask', () => {
    it('should update all task fields', async () => {
      // Create initial task
      const taskData: TaskCreate = {
        title: 'Original Title',
        description: 'Original Description',
        status: 'pending',
        priority: 'low',
        dueDate: new Date('2026-01-20'),
      };

      const created = await createTask(taskData);
      const originalUpdatedAt = created.updatedAt;

      // Wait to ensure updatedAt changes (SQLite timestamp resolution)
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Update task
      const updateData: TaskUpdate = {
        title: 'Updated Title',
        description: 'Updated Description',
        status: 'completed',
        priority: 'high',
        dueDate: new Date('2026-01-25'),
      };

      const updated = await updateTask(created.id, updateData);

      expect(updated).toBeDefined();
      expect(updated!.id).toBe(created.id);
      expect(updated!.title).toBe('Updated Title');
      expect(updated!.description).toBe('Updated Description');
      expect(updated!.status).toBe('completed');
      expect(updated!.priority).toBe('high');
      expect(updated!.dueDate?.toISOString()).toBe(new Date('2026-01-25').toISOString());
      expect(updated!.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });

    it('should handle null description and dueDate', async () => {
      const taskData: TaskCreate = {
        title: 'Test Task',
        description: 'Has description',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date('2026-01-20'),
      };

      const created = await createTask(taskData);

      const updateData: TaskUpdate = {
        title: 'Updated Title',
        description: null,
        status: 'in-progress',
        priority: 'medium',
        dueDate: null,
      };

      const updated = await updateTask(created.id, updateData);

      expect(updated).toBeDefined();
      expect(updated!.description).toBeNull();
      expect(updated!.dueDate).toBeNull();
    });

    it('should return undefined for non-existent task', async () => {
      const updateData: TaskUpdate = {
        title: 'Updated Title',
        description: 'Updated Description',
        status: 'completed',
        priority: 'high',
        dueDate: null,
      };

      const result = await updateTask('non-existent-id', updateData);

      expect(result).toBeUndefined();
    });

    it('should update updatedAt timestamp', async () => {
      const taskData: TaskCreate = {
        title: 'Test Task',
        status: 'pending',
        priority: 'medium',
      };

      const created = await createTask(taskData);
      const originalUpdatedAt = created.updatedAt;

      await new Promise(resolve => setTimeout(resolve, 1100));

      const updateData: TaskUpdate = {
        title: 'Updated Task',
        status: 'completed',
        priority: 'high',
      };

      const updated = await updateTask(created.id, updateData);

      expect(updated).toBeDefined();
      expect(updated!.updatedAt).not.toEqual(originalUpdatedAt);
      expect(updated!.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
      expect(updated!.createdAt).toEqual(created.createdAt);
    });
  });
});
