import { updateTask } from '~~/server/domain/task/task.repository';
import { isValidUUID } from '~~/server/domain/task/task.validation';
import { updateTaskSchema } from '~~/shared/schemas/task.schema';
import { TaskUpdate } from '~~/shared/types/task.type';

export default defineEventHandler(async event => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id || !isValidUUID(id)) {
      throw notFound('Invalid task ID');
    }

    const body = await readBody<TaskUpdate>(event);
    const validated = updateTaskSchema.parse(body);

    const task = await updateTask(id, validated);

    if (!task) {
      throw notFound('Task not found');
    }

    return task;
  } catch (error) {
    throw handleError(error);
  }
});
