# Task Management App

A full-stack task management application built with Nuxt 4, Vue 3, TypeScript, and SQLite.

## Features

- Create, read, update, and delete tasks
- Search tasks by title and description
- Filter by status (pending, in-progress, completed) and priority (low, medium, high)
- Sort by due date, created date, or priority
- Paginated task listing
- SQLite persistence with Drizzle ORM

## Prerequisites

- Node.js 18+ (required runtime)
- pnpm (package manager)

## Setup

Install dependencies:

```bash
pnpm install
```

## Database

Initialize the database:

```bash
pnpm run db:migrate
pnpm run db:seed
```

Database file location: `./data/tasks.sqlite`

## Development

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Testing

Run tests:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

## Production

Build for production:

```bash
pnpm build
```

Preview production build:

```bash
pnpm preview
```

## API Documentation

### Endpoints

- `GET /api/tasks` - List tasks (with pagination, filtering, sorting, search)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `PATCH /api/tasks/:id` - Update task status
- `DELETE /api/tasks/:id` - Delete a task

### Query Parameters

- `page` - Page number (default: 1)
- `pageSize` - Items per page (5, 10, or 25; default: 10)
- `status` - Filter by status (pending, in-progress, completed)
- `priority` - Filter by priority (low, medium, high)
- `q` - Search query (case-insensitive substring match on title/description)
- `sortBy` - Sort field (dueDate, createdAt, priority; default: createdAt)
- `sortDir` - Sort direction (asc, desc; default: desc)

## Project Structure

```
app/              # Frontend application
├── pages/        # Nuxt pages
├── components/   # Vue components
└── composables/  # Composable functions

server/           # Backend API
├── api/          # API routes
├── db/           # Database schema and migrations
└── domain/task   # Business logic and repositories (simple grouped by feature)

test/             # Test files
├── unit/         # Unit tests
└── e2e/          # End-to-end tests

data/             # SQLite database
```

## Known Limitations / Trade-offs

- Single-user, local-first application (no authentication)
- Search uses LIKE queries (suitable for expected dataset size ~100 tasks)
- Tasks with null due dates sort last when sorting by dueDate

