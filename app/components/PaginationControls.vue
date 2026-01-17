<script setup lang="ts">
interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

const props = defineProps<{
  meta: PaginationMeta;
}>();

const emit = defineEmits<{
  pageChange: [page: number];
  pageSizeChange: [pageSize: number];
}>();

const handlePageChange = (newPage: number) => {
  if (newPage >= 1 && newPage <= props.meta.totalPages) {
    emit('pageChange', newPage);
  }
};

const handlePageSizeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('pageSizeChange', Number(target.value));
};

const pages = computed(() => {
  const { page, totalPages } = props.meta;
  const delta = 2;
  const range: number[] = [];
  const rangeWithDots: (number | string)[] = [];
  let l: number | undefined;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
});

const startItem = computed(() => {
  return (props.meta.page - 1) * props.meta.pageSize + 1;
});

const endItem = computed(() => {
  return Math.min(props.meta.page * props.meta.pageSize, props.meta.total);
});
</script>

<template>
  <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        :disabled="meta.page === 1"
        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        @click="handlePageChange(meta.page - 1)"
      >
        Previous
      </button>
      <button
        :disabled="meta.page === meta.totalPages"
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        @click="handlePageChange(meta.page + 1)"
      >
        Next
      </button>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div class="flex items-center gap-4">
        <p class="text-sm text-gray-700">
          Showing
          <span class="font-medium">{{ startItem }}</span>
          to
          <span class="font-medium">{{ endItem }}</span>
          of
          <span class="font-medium">{{ meta.total }}</span>
          results
        </p>
        <div class="flex items-center gap-2">
          <label
            for="page-size"
            class="text-sm text-gray-700"
          >
            Per page:
          </label>
          <select
            id="page-size"
            :value="meta.pageSize"
            class="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
            @change="handlePageSizeChange"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
          </select>
        </div>
      </div>
      <div>
        <nav
          class="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <button
            :disabled="meta.page === 1"
            class="relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            @click="handlePageChange(meta.page - 1)"
          >
            ‹
          </button>

          <template
            v-for="(pageNum, index) in pages"
            :key="index"
          >
            <span
              v-if="pageNum === '...'"
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
            >
              ...
            </span>
            <button
              v-else
              :class="[
                'relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0',
                pageNum === meta.page
                  ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
              ]"
              @click="handlePageChange(pageNum as number)"
            >
              {{ pageNum }}
            </button>
          </template>

          <button
            :disabled="meta.page === meta.totalPages"
            class="relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-600 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            @click="handlePageChange(meta.page + 1)"
          >
            ›
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
