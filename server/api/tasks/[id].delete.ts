import { deleteTask } from '~~/server/domain/task/task.repository';
import { isValidUUID } from '~~/server/domain/task/task.validation';
import { notFound } from '~~/server/utils/httpErrors';
import { handleError } from '~~/server/utils/httpErrors';

export default defineEventHandler(async event => {
  try {
    const id = getRouterParam(event, 'id');

    if (!id || !isValidUUID(id)) {
      throw notFound('Invalid task ID');
    }

    const deleted = await deleteTask(id);

    if (!deleted) {
      throw notFound('Task not found');
    }

    setResponseStatus(event, 204);
    return null;
  } catch (error) {
    throw handleError(error);
  }
});
