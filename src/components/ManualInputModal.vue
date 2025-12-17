<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-dark/30 backdrop-blur-sm" @click="$emit('close')"></div>
    <div class="bg-white rounded-[2rem] w-full max-w-sm p-6 relative z-10 shadow-2xl transform transition-all scale-100 border border-white/50 max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold text-dark">{{ editingId ? '編輯項目' : '新增行程項目' }}</h3>
        <button @click="$emit('close')" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      
      <div class="space-y-5">
        <!-- Type Selector -->
        <div>
          <label class="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">類型</label>
          <div class="grid grid-cols-4 gap-2">
            <button v-for="type in types" :key="type.value" 
              @click="updateItem('type', type.value)"
              :class="item.type === type.value ? 'bg-dark text-white shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'"
              class="flex flex-col items-center justify-center py-3 rounded-xl transition duration-200 gap-1">
              <i :class="type.icon"></i>
              <span class="text-[10px] font-bold">{{ type.label }}</span>
            </button>
          </div>
        </div>

        <!-- Name -->
        <div>
          <label class="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">名稱 / 地點</label>
          <input :value="item.name" @input="updateItem('name', $event.target.value)" type="text" placeholder="例如：台北喜來登、高鐵..." class="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-primary/30 focus:bg-white outline-none text-dark font-bold transition-colors">
        </div>

        <!-- Address -->
        <div>
          <label class="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">地址 / 定位 (選填)</label>
          <input :value="item.address" @input="updateItem('address', $event.target.value)" type="text" placeholder="輸入地址以啟用導航功能" class="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-primary/30 focus:bg-white outline-none text-dark font-medium transition-colors text-sm">
        </div>

        <!-- Date & Time -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">日期</label>
            <input :value="item.date" @input="updateItem('date', $event.target.value)" type="date" class="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-primary/30 focus:bg-white outline-none text-dark font-medium transition-colors text-sm">
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">時間</label>
            <input :value="item.time" @input="updateItem('time', $event.target.value)" type="time" class="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-primary/30 focus:bg-white outline-none text-dark font-medium transition-colors text-sm">
          </div>
        </div>

        <!-- Cost -->
        <div>
          <label class="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">預估花費 (NT$)</label>
          <input :value="item.cost" @input="updateItem('cost', Number($event.target.value))" type="number" placeholder="0" class="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-primary/30 focus:bg-white outline-none text-dark font-medium transition-colors">
        </div>

        <!-- Note -->
        <div>
          <label class="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">備註</label>
          <textarea :value="item.note" @input="updateItem('note', $event.target.value)" rows="2" placeholder="訂位代號、注意事項..." class="w-full bg-gray-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-primary/30 focus:bg-white outline-none text-dark font-medium resize-none transition-colors text-sm"></textarea>
        </div>
      </div>

      <div class="mt-8">
        <button @click="$emit('confirm')" class="w-full bg-primary text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary/30 active:scale-95 transition hover:bg-teal-700 flex items-center justify-center gap-2">
          <i class="fa-solid fa-check"></i>
          {{ editingId ? '儲存修改' : '確認新增' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: { type: Boolean, default: false },
  editingId: { type: String, default: null },
  item: { type: Object, required: true }
})

const emit = defineEmits(['close', 'confirm', 'update:item'])

const types = [
  { label: '景點', value: 'spot', icon: 'fa-solid fa-camera' },
  { label: '住宿', value: 'hotel', icon: 'fa-solid fa-bed' },
  { label: '交通', value: 'transport', icon: 'fa-solid fa-train-subway' },
  { label: '餐飲', value: 'food', icon: 'fa-solid fa-utensils' }
]

const updateItem = (key, value) => {
  emit('update:item', { ...props.item, [key]: value })
}
</script>

