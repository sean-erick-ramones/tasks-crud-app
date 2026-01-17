import { getTaskById } from '~~/server/domain/task/task.repository';
import { notFound, handleError } from '~~/server/utils/httpErrors';
import { isValidUUID } from '~~/server/domain/task/task.validation';

export default defineEventHandler(async event => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id || !isValidUUID(id)) {
      throw notFound('Invalid task ID');
    }

    const task = await getTaskById(id);

    if (!task) {
      throw notFound('Task not found');
    }

    return task;
  } catch (error) {
    throw handleError(error);
  }
});
