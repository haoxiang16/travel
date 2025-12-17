<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-dark/30 backdrop-blur-sm" @click="$emit('close')"></div>
    <div class="bg-white rounded-3xl w-full max-w-xs p-6 relative z-10 shadow-2xl transform transition-all scale-100">
      <div class="text-center mb-6">
        <div class="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
          <i class="fa-solid fa-pen-nib"></i>
        </div>
        <h3 class="text-lg font-bold text-dark">設定當日主題</h3>
        <p class="text-xs text-gray-400 mt-1">{{ formatDate(date) }}</p>
      </div>
      
      <input 
        ref="titleInput"
        :value="title"
        @input="$emit('update:title', $event.target.value)"
        @keyup.enter="$emit('save')"
        type="text" 
        placeholder="例如：第一天：抵達台北" 
        class="w-full bg-gray-50 border-none rounded-xl p-4 focus:ring-2 focus:ring-primary/30 focus:bg-white outline-none text-dark font-bold text-center mb-6"
      >

      <div class="flex gap-3">
        <button @click="$emit('close')" class="flex-1 py-3 rounded-xl font-bold text-gray-400 hover:bg-gray-50 transition">取消</button>
        <button @click="$emit('save')" class="flex-1 bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/30 active:scale-95 transition">確認</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  date: { type: String, default: '' },
  title: { type: String, default: '' }
})

defineEmits(['close', 'save', 'update:title'])

const titleInput = ref(null)

watch(() => props.show, (newVal) => {
  if (newVal) {
    nextTick(() => {
      titleInput.value?.focus()
    })
  }
})

const formatDate = (dateStr) => {
  if(!dateStr) return '未定日期'
  const d = new Date(dateStr)
  const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六']
  return `${d.getMonth()+1}/${d.getDate()} ${weekdays[d.getDay()]}`
}
</script>

