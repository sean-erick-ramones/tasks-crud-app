import { createTask } from '~~/server/domain/task/task.repository'
import { createTaskSchema } from '#shared/schemas/task.schema'
import { handleError } from '~~/server/utils/httpErrors'
import { TaskCreate } from '~~/shared/types/task.type'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<TaskCreate>(event)

    const convertedDueDate: Date | null = body.dueDate ? new Date(body.dueDate) : null

    const validated = createTaskSchema.safeParse({...body, dueDate: convertedDueDate})

    if (!validated.success) {
      throw handleError(validated.error)
    }

    const task = await createTask(validated.data)

    setResponseStatus(event, 201)
    return task
  } catch (error) {
    throw handleError(error)
  }
})
