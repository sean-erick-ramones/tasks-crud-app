<script setup lang="ts">
const modelValue = defineModel<string>({ default: '' })

const emit = defineEmits<{
  search: [query: string]
}>()

const handleSearch = () => {
  emit('search', modelValue.value)
}

const handleClear = () => {
  modelValue.value = ''
  emit('search', '')
}
</script>

<template>
  <div class="relative">
    <input
v-model="modelValue" type="text"
      class="block w-full rounded-md border-0 py-2 px-3 pr-16 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
      placeholder="Search tasks..." @keyup.enter="handleSearch">
    <div v-if="modelValue" class="absolute inset-y-0 right-0 flex items-center pr-3">
      <button
type="button" class="rounded-md px-2 py-1 text-gray-500 hover:text-gray-700 font-semibold text-lg"
        @click="handleClear">
        ×
      </button>
    </div>
  </div>
</template>

<style scoped></style>
