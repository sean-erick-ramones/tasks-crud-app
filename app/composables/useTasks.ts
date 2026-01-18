import type { Task, TaskListMeta, TaskStatus, TaskPriority, SortBy, SortDir, ListQuery } from '#shared/types/task.type';

export const useTasks = () => {
  // Get API methods
  const api = useTasksApi();

  /** States */
  // Tasks list state
  const tasks = useState<Task[]>('tasks', () => []);
  const meta = useState<TaskListMeta>('tasks-meta', () => ({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  }));

  // Query parameters
  const searchQuery = useState<string>('tasks-search', () => '');
  const statusFilter = useState<TaskStatus | undefined>('tasks-status', () => undefined);
  const priorityFilter = useState<TaskPriority | undefined>('tasks-priority', () => undefined);
  const sortBy = useState<SortBy>('tasks-sortBy', () => 'createdAt');
  const sortDir = useState<SortDir>('tasks-sortDir', () => 'desc');
  const currentPage = useState<number>('tasks-page', () => 1);
  const pageSize = useState<number>('tasks-pageSize', () => 10);

  const { pending, status, refresh, execute } = useAsyncData(
    'load-tasks',
    async () => {
      console.log('useAsyncData executing!');
      await _loadTasks();
    },
    {
      server: false,
      immediate: false,
      watch: [searchQuery, statusFilter, priorityFilter, sortBy, sortDir, currentPage, pageSize],
    }
  );

  /** Actions */
  const _loadTasks = async () => {
    try {
      const params: Partial<ListQuery> = {
        page: currentPage.value,
        pageSize: pageSize.value,
        sortBy: sortBy.value,
        sortDir: sortDir.value,
      };

      if (searchQuery.value) {
        params.q = searchQuery.value;
      }

      if (statusFilter.value) {
        params.status = statusFilter.value;
      }

      if (priorityFilter.value) {
        params.priority = priorityFilter.value;
      }

      const response = await api.fetchTasks(params);
      tasks.value = response.data;
      meta.value = response.meta;
    } catch (error) {
      throw error;
    }
  };

  const handleSearch = (query: string) => {
    searchQuery.value = query;
    currentPage.value = 1;
  };

  const handleFilter = () => {
    currentPage.value = 1;
  };

  const handleSort = () => {
    return refresh();
  };

  const handlePageChange = (page: number) => {
    currentPage.value = page;
  };

  const handlePageSizeChange = (newPageSize: number) => {
    pageSize.value = newPageSize;
    currentPage.value = 1;
  };

  return {
    // State
    tasks,
    meta,
    pending,
    status,
    refresh,
    execute,
    searchQuery,
    statusFilter,
    priorityFilter,
    sortBy,
    sortDir,
    currentPage,
    pageSize,

    // Actions
    handleSearch,
    handleFilter,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
  };
};
