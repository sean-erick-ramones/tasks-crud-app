import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { tasks } from './schema'

const sqlite = new Database('./data/tasks.sqlite')
const db = drizzle(sqlite)

console.log('Seeding database...')

const sampleTasks = [
  {
    id: crypto.randomUUID(),
    title: 'Complete project proposal',
    description: 'Draft and submit the Q1 project proposal to stakeholders',
    status: 'in-progress' as const,
    priority: 'high' as const,
    dueDate: new Date('2026-01-20'),
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-12')
  },
  {
    id: crypto.randomUUID(),
    title: 'Review pull requests',
    description: 'Review and merge pending PRs in the main repository',
    status: 'pending' as const,
    priority: 'medium' as const,
    dueDate: new Date('2026-01-15'),
    createdAt: new Date('2026-01-11'),
    updatedAt: new Date('2026-01-11')
  },
  {
    id: crypto.randomUUID(),
    title: 'Update documentation',
    description: null,
    status: 'completed' as const,
    priority: 'low' as const,
    dueDate: null,
    createdAt: new Date('2026-01-08'),
    updatedAt: new Date('2026-01-09')
  },
  {
    id: crypto.randomUUID(),
    title: 'Fix authentication bug',
    description: 'Users are experiencing login timeouts on mobile devices',
    status: 'in-progress' as const,
    priority: 'high' as const,
    dueDate: new Date('2026-01-14'),
    createdAt: new Date('2026-01-12'),
    updatedAt: new Date('2026-01-13')
  },
  {
    id: crypto.randomUUID(),
    title: 'Schedule team meeting',
    description: 'Organize sprint planning meeting for next week',
    status: 'pending' as const,
    priority: 'medium' as const,
    dueDate: new Date('2026-01-16'),
    createdAt: new Date('2026-01-13'),
    updatedAt: new Date('2026-01-13')
  }
]

db.insert(tasks).values(sampleTasks).run()

console.log(`Seeded ${sampleTasks.length} tasks successfully!`)

sqlite.close()
