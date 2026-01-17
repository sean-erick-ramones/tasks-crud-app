import { createTask } from '~~/server/domain/task/task.repository';
import { createTaskSchema } from '#shared/schemas/task.schema';
import { handleError } from '~~/server/utils/httpErrors';
import { TaskCreate } from '~~/shared/types/task.type';

export default defineEventHandler(async event => {
  try {
    const body = await readBody<TaskCreate>(event);

    const data: TaskCreate = createTaskSchema.parse(body);

    const task: TaskCreate = await createTask(data);

    setResponseStatus(event, 201);
    return task;
  } catch (error) {
    throw handleError(error);
  }
});
