import { listTasks } from '~~/server/domain/task/task.query'
import { listQuerySchema } from '#shared/schemas/task.schema'
import { handleError } from '~~/server/utils/httpErrors'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const validated = listQuerySchema.parse(query)
    const result = await listTasks(validated)
    
    return result
  } catch (error) {
    throw handleError(error)
  }
})
