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

### Schema

The application uses a single `tasks` table with the following structure:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY | UUID generated server-side |
| `title` | TEXT | NOT NULL | Task title (1-100 characters) |
| `description` | TEXT | NULLABLE | Task description (max 500 characters) |
| `status` | TEXT | NOT NULL, DEFAULT 'pending' | Task status: `pending`, `in-progress`, `completed` |
| `priority` | TEXT | NOT NULL, DEFAULT 'medium' | Task priority: `low`, `medium`, `high` |
| `due_date` | INTEGER | NULLABLE | Due date stored as Unix timestamp |
| `created_at` | INTEGER | NOT NULL | Creation timestamp |
| `updated_at` | INTEGER | NOT NULL | Last update timestamp |

**Notes:**
- Timestamps are managed server-side and cannot be set by clients
- IDs are UUIDs generated using `crypto.randomUUID()`
- SQLite stores dates as Unix timestamps (milliseconds)

### Database Setup

Initialize the database:

```bash
pnpm run db:migrate
pnpm run db:seed
```

**Commands:**
- `db:migrate` - Runs Drizzle migrations to create the schema
- `db:seed` - Populates the database with ~10 sample tasks for testing

Database file location: `./data/tasks.sqlite`

**Seed Data:**
The seed script creates diverse sample tasks with:
- Mixed statuses (pending, in-progress, completed)
- Various priorities (low, medium, high)
- Different due dates (past, present, future, null)
- Varied title lengths and descriptions

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

All endpoints return JSON. Error responses follow the shape:
```json
{ "statusCode": 400, "statusMessage": "Error message" }
```

### GET /api/tasks

List tasks with pagination, filtering, sorting, and search.

**Query Parameters:**
- `page` - Page number (default: `1`)
- `pageSize` - Items per page: `5`, `10`, or `25` (default: `10`)
- `status` - Filter by status: `pending`, `in-progress`, `completed`
- `priority` - Filter by priority: `low`, `medium`, `high`
- `q` - Search query (case-insensitive substring match on title/description)
- `sortBy` - Sort field: `dueDate`, `createdAt`, `priority` (default: `createdAt`)
- `sortDir` - Sort direction: `asc`, `desc` (default: `desc`)

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Task title",
      "description": "Optional description",
      "status": "pending",
      "priority": "medium",
      "dueDate": "2026-01-20T00:00:00.000Z",
      "createdAt": "2026-01-17T12:00:00.000Z",
      "updatedAt": "2026-01-17T12:00:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

### POST /api/tasks

Create a new task.

**Request Body:**
```json
{
  "title": "Task title",
  "description": "Optional description",
  "status": "pending",
  "priority": "medium",
  "dueDate": "2026-01-20"
}
```

**Field Requirements:**
- `title` - Required, 1-100 characters
- `description` - Optional, max 500 characters
- `status` - Optional, defaults to `pending`
- `priority` - Optional, defaults to `medium`
- `dueDate` - Optional, ISO date string or null

**Response (201):**
```json
{
  "id": "uuid",
  "title": "Task title",
  "status": "pending",
  "priority": "medium",
  "createdAt": "2026-01-17T12:00:00.000Z",
  "updatedAt": "2026-01-17T12:00:00.000Z"
}
```

**Errors:**
- `400` - Validation error (e.g., title too long, invalid status)

### GET /api/tasks/:id

Get a specific task by ID.

**Response (200):**
```json
{
  "id": "uuid",
  "title": "Task title",
  ...
}
```

**Errors:**
- `404` - Task not found

### PUT /api/tasks/:id

Update a task (full update).

**Request Body:** Same as POST (all fields required)

**Response (200):** Updated task object

**Errors:**
- `400` - Validation error
- `404` - Task not found

### PATCH /api/tasks/:id

Partially update a task (typically for status changes).

**Request Body:**
```json
{
  "status": "completed"
}
```

**Response (200):** Updated task object

**Errors:**
- `400` - Validation error
- `404` - Task not found

### DELETE /api/tasks/:id

Delete a task.

**Response (204):** No content

**Errors:**
- `404` - Task not found

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

### Architecture
- **Single-user, local-first** - No authentication or multi-user support
- **SQLite persistence** - Suitable for local development; not designed for concurrent access
- **No real-time updates** - UI requires manual refresh to see changes from other sources

### Search & Filtering
- **LIKE-based search** - Uses case-insensitive LIKE queries, suitable for expected dataset size (~100 tasks)
- **Client-side state** - Search/filter state is not persisted in URL; refreshing resets filters
- **No fuzzy matching** - Exact substring matching only

### Data Handling
- **Null due dates sort last** - Tasks without due dates appear at the end when sorting by `dueDate`
- **Timestamp precision** - SQLite stores millisecond timestamps; test delays use 1100ms to ensure distinct values
- **No soft deletes** - Deleted tasks are permanently removed from the database

### Validation
- **Basic field validation** - Title length (1-100), description length (max 500), enum validation
- **No duplicate detection** - Multiple tasks with identical titles are allowed
- **No task relationships** - No subtasks, dependencies, or task hierarchies

### UI/UX
- **No confirmation dialogs** - Delete actions are immediate (could add in future)
- **Basic error feedback** - Simple error messages without detailed recovery guidance
- **No optimistic updates** - UI waits for server responses before updating state
- **Text-based icons** - Using Unicode characters (×, ↑, ↓, ‹, ›, !) instead of icon library

### Testing
- **Unit-focused test coverage** - E2E tests are minimal placeholders
- **In-memory test database** - Tests use separate SQLite instances to avoid conflicts
- **Manual timestamps in tests** - Tests explicitly set timestamps for predictable sorting
