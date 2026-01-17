import { listTasks } from '~~/server/domain/task/task.query';
import { listQuerySchema } from '#shared/schemas/task.schema';
import { handleError } from '~~/server/utils/httpErrors';
import { ListQuery } from '~~/shared/types/task.type';

export default defineEventHandler(async event => {
  try {
    const query = getQuery<ListQuery>(event);
    const validated = listQuerySchema.parse(query);
    const result = await listTasks(validated);

    return result;
  } catch (error) {
    throw handleError(error);
  }
});
