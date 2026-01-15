import { patchTaskStatus } from '~~/server/domain/task/task.repository'
import { patchTaskSchema } from '#shared/schemas/task.schema'
import { notFound, handleError } from '~~/server/utils/httpErrors'
import { isValidUUID } from '~~/server/domain/task/task.validation'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id || !isValidUUID(id)) {
      throw notFound('Invalid task ID')
    }

    const body = await readBody(event)
    const validated = patchTaskSchema.parse(body)
    
    const task = await patchTaskStatus(id, validated.status)
    
    if (!task) {
      throw notFound('Task not found')
    }

    return task
  } catch (error) {
    throw handleError(error)
  }
})
