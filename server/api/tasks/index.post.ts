import { createTask } from '~~/server/domain/task/task.repository'
import { createTaskSchema } from '#shared/schemas/task.schema'
import { handleError } from '~~/server/utils/httpErrors'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validated = createTaskSchema.parse(body)
    const task = await createTask(validated)
    
    setResponseStatus(event, 201)
    return task
  } catch (error) {
    throw handleError(error)
  }
})
