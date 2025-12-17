<template>
  <div v-if="place" class="absolute inset-0 z-40 flex flex-col justify-end pointer-events-none">
    <div class="bg-black/20 absolute inset-0 backdrop-blur-[2px] pointer-events-auto" @click="$emit('close')"></div>
    
    <div class="bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] h-[85%] flex flex-col overflow-hidden pointer-events-auto relative">
      <div class="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 rounded-full z-20"></div>

      <div class="relative h-64 shrink-0 bg-gray-100 flex items-center justify-center overflow-hidden">
        <img v-if="place.image" :src="place.image" class="w-full h-full object-cover">
        <i v-else :class="getTypeIcon(place.type) + ' text-6xl text-gray-300'"></i>
        
        <button @click="$emit('close')" class="absolute top-6 right-6 w-10 h-10 bg-black/10 backdrop-blur-md rounded-full flex items-center justify-center text-white z-20">
          <i class="fa-solid fa-xmark"></i>
        </button>
        
        <div class="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
          <span class="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-2 inline-block">
            {{ place.typeLabel || '自訂行程' }}
          </span>
          <h2 class="text-2xl font-bold">{{ place.name }}</h2>
        </div>
      </div>

      <div class="p-8 overflow-y-auto bg-white flex-grow space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-50 p-3 rounded-2xl">
            <p class="text-xs text-gray-400 font-bold uppercase mb-1">時間</p>
            <p class="font-medium text-dark">{{ place.date || '未定' }} {{ place.time }}</p>
          </div>
          <div class="bg-gray-50 p-3 rounded-2xl">
            <p class="text-xs text-gray-400 font-bold uppercase mb-1">花費</p>
            <p class="font-medium text-dark">NT$ {{ Number(place.cost || 0).toLocaleString() }}</p>
          </div>
        </div>

        <div>
          <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">詳細資訊</h4>
          <p class="text-gray-600 leading-relaxed font-medium whitespace-pre-line bg-gray-50 p-4 rounded-2xl">
            {{ place.note || '無備註' }}
          </p>
        </div>

        <div v-if="place.address">
          <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">地址</h4>
          <p class="text-gray-600 leading-relaxed font-medium whitespace-pre-line bg-gray-50 p-4 rounded-2xl flex justify-between items-center cursor-pointer hover:bg-gray-100 transition" @click="$emit('navigate', place)">
            <span>{{ place.address }}</span>
            <i class="fa-solid fa-diamond-turn-right text-primary"></i>
          </p>
        </div>
      </div>
      
      <div class="p-6 bg-white border-t border-gray-50 shrink-0 pb-safe">
        <!-- 日期時間選擇器 (只在未加入時顯示) -->
        <div v-if="!isInItinerary" class="mb-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
            <i class="fa-regular fa-calendar mr-1"></i>
            設定加入時間
          </label>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <input 
                :value="dateTime.date" 
                @input="$emit('update:dateTime', { ...dateTime, date: $event.target.value })"
                type="date" 
                class="w-full bg-white border-none rounded-xl p-2.5 focus:ring-2 focus:ring-primary/30 outline-none text-dark font-medium transition-colors text-sm shadow-sm"
              >
            </div>
            <div>
              <input 
                :value="dateTime.time" 
                @input="$emit('update:dateTime', { ...dateTime, time: $event.target.value })"
                type="time" 
                class="w-full bg-white border-none rounded-xl p-2.5 focus:ring-2 focus:ring-primary/30 outline-none text-dark font-medium transition-colors text-sm shadow-sm"
              >
            </div>
          </div>
        </div>

        <div class="grid gap-3 mb-3" :class="place.isManual ? 'grid-cols-1' : 'grid-cols-2'">
          <button @click="$emit('toggle-itinerary', place)" 
            :class="isInItinerary ? 'bg-gray-100 text-gray-400' : 'bg-primary text-white'"
            class="py-3 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2 active:scale-95">
            <i :class="isInItinerary ? 'fa-solid fa-check' : 'fa-solid fa-plus'"></i>
            {{ isInItinerary ? '已加入' : '加入行程' }}
          </button>
          
          <button v-if="!place.isManual && place.lat && place.lng" 
            @click="$emit('view-on-map', place)" 
            class="bg-blue-500 text-white py-3 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2 active:scale-95">
            <i class="fa-solid fa-map-location-dot"></i> 在地圖查看
          </button>
        </div>
        
        <button v-if="!place.isManual || place.address" @click="$emit('navigate', place)" class="w-full bg-dark text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-gray-200 active:scale-[0.98] transition flex items-center justify-center gap-2">
          <i class="fa-solid fa-location-arrow text-sm"></i> Google 導航
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  place: { type: Object, default: null },
  isInItinerary: { type: Boolean, default: false },
  dateTime: { type: Object, default: () => ({ date: '', time: '' }) }
})

defineEmits(['close', 'toggle-itinerary', 'view-on-map', 'navigate', 'update:dateTime'])

const getTypeIcon = (type) => {
  const icons = {
    spot: 'fa-solid fa-camera',
    hotel: 'fa-solid fa-bed',
    transport: 'fa-solid fa-train-subway',
    food: 'fa-solid fa-utensils'
  }
  return icons[type] || 'fa-solid fa-map-pin'
}
</script>

