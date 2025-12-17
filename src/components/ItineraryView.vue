<template>
  <div class="absolute inset-0 overflow-y-auto pb-32 bg-surface">
    <!-- Background Decoration -->
    <div class="blob w-64 h-64 bg-primary/10 rounded-full top-0 -left-20"></div>
    <div class="blob w-64 h-64 bg-accent/10 rounded-full bottom-0 -right-20" style="animation-delay: 2s"></div>

    <div class="px-6 py-6 relative z-10">
      <div class="flex justify-between items-end mb-6">
        <div>
          <h2 class="text-3xl font-serif font-bold text-dark tracking-tight">我的行程</h2>
          <div class="flex items-center gap-3 mt-2 text-xs font-medium text-gray-500">
            <span>{{ sortedItinerary.length }} 個項目</span>
            <span class="w-1 h-1 rounded-full bg-gray-300"></span>
            <span v-if="totalCost > 0" class="text-primary font-bold">預估 NT$ {{ totalCost.toLocaleString() }}</span>
            <span v-else>未設定預算</span>
          </div>
        </div>
        <div class="flex gap-2">
          <button v-if="itinerary.length > 0" @click="$emit('clear')" class="w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-400 flex items-center justify-center hover:text-red-500 hover:border-red-200 transition shadow-sm">
            <i class="fa-solid fa-trash-can text-sm"></i>
          </button>
          <button @click="$emit('add')" class="bg-dark text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-dark/20 hover:bg-gray-800 transition flex items-center gap-2 active:scale-95">
            <i class="fa-solid fa-plus"></i>
            新增
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="itinerary.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
        <div class="w-full max-w-[280px] bg-white rounded-[2rem] p-6 shadow-xl shadow-gray-100 border border-gray-50 transform rotate-1 mb-8">
          <div class="flex gap-2 mb-4">
            <div class="w-3 h-3 rounded-full bg-red-400"></div>
            <div class="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div class="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div class="space-y-3">
            <div class="h-10 bg-blue-50 rounded-lg w-full flex items-center px-3 gap-2">
              <div class="w-4 h-4 bg-blue-200 rounded-full"></div>
              <div class="h-2 bg-blue-200 rounded w-1/2"></div>
            </div>
            <div class="h-10 bg-orange-50 rounded-lg w-full flex items-center px-3 gap-2">
              <div class="w-4 h-4 bg-orange-200 rounded-full"></div>
              <div class="h-2 bg-orange-200 rounded w-2/3"></div>
            </div>
            <div class="h-10 bg-green-50 rounded-lg w-full flex items-center px-3 gap-2">
              <div class="w-4 h-4 bg-green-200 rounded-full"></div>
              <div class="h-2 bg-green-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
        
        <h3 class="text-xl font-bold text-dark mb-2">雲端行程本</h3>
        <p class="text-gray-400 text-sm mb-8 leading-relaxed max-w-xs">
          所有規劃都會自動儲存到本地。<br>開始安排您的第一個景點吧！
        </p>
        
        <button @click="$emit('add')" class="px-8 py-3 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/30 active:scale-95 transition">
          <i class="fa-solid fa-pen-to-square mr-2"></i>開始規劃
        </button>
      </div>

      <!-- Timeline List -->
      <div v-else class="space-y-4 pb-20">
        <transition-group name="list">
          <div v-for="(place, index) in sortedItinerary" :key="place.id">
            <!-- Date Header -->
            <div v-if="shouldShowDateHeader(index)" class="sticky top-0 z-10 pt-4 pb-2 bg-surface/95 backdrop-blur-sm mb-2 flex items-center justify-between group/header">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold bg-dark text-white px-3 py-1 rounded-full shadow-sm tracking-wide">
                  {{ formatDate(place.date) }}
                </span>
                <div class="flex items-center cursor-pointer hover:bg-white/50 px-2 py-1 rounded-lg transition" @click="$emit('edit-day-title', place.date)">
                  <span class="text-sm font-bold text-gray-700 truncate max-w-[150px]">{{ dayTitles[place.date] || '設定主題' }}</span>
                  <i class="fa-solid fa-pencil text-gray-300 ml-2 text-xs opacity-50 group-hover/header:opacity-100"></i>
                </div>
              </div>
            </div>

            <div class="flex gap-4 group" @click="$emit('select-place', place)">
              <!-- Time Column -->
              <div class="flex flex-col items-end pt-3 w-12 shrink-0">
                <span v-if="place.time" class="text-xs font-bold text-gray-700">{{ place.time }}</span>
                <span v-else class="text-[10px] font-medium text-gray-400">--:--</span>
                
                <div class="h-full w-px bg-gray-200 mt-2 relative">
                  <div class="absolute -top-1 -right-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                       :class="getTypeColor(place.type)"></div>
                </div>
              </div>

              <!-- Card Content -->
              <div class="flex-grow pb-2">
                <div class="relative bg-white rounded-2xl p-4 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all active:scale-[0.99] flex gap-3 overflow-hidden group/card min-h-[90px]">
                  <div class="absolute top-0 left-0 bottom-0 w-1" :class="getTypeColor(place.type)"></div>
                  
                  <div class="w-14 h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-gray-50 text-gray-400">
                    <img v-if="place.image" :src="place.image" class="w-full h-full object-cover" onerror="this.style.display='none'">
                    <i v-else :class="getTypeIcon(place.type) + ' text-lg'"></i>
                  </div>
                  
                  <div class="flex-grow min-w-0 flex flex-col justify-between py-0.5">
                    <div class="flex justify-between items-start">
                      <h4 class="font-bold text-dark text-sm truncate pr-2 leading-tight">{{ place.name }}</h4>
                      <div class="flex gap-1 shrink-0">
                        <button @click.stop="$emit('edit', place)" class="w-7 h-7 rounded-full bg-gray-50 text-gray-400 hover:bg-primary/10 hover:text-primary transition flex items-center justify-center">
                          <i class="fa-solid fa-pen text-xs"></i>
                        </button>
                        <button @click.stop="$emit('remove', place.id)" class="w-7 h-7 rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition flex items-center justify-center">
                          <i class="fa-solid fa-xmark text-xs"></i>
                        </button>
                      </div>
                    </div>
                    
                    <div class="flex justify-between items-end mt-auto">
                      <div class="flex flex-col gap-1 max-w-[65%]">
                        <span class="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded w-fit leading-none">{{ place.typeLabel || '自訂' }}</span>
                        <span v-if="place.address" 
                              @click.stop="$emit('navigate', place)"
                              class="text-[10px] text-gray-400 flex items-center gap-1 hover:text-primary cursor-pointer transition line-clamp-1">
                          <i class="fa-solid fa-location-dot text-[8px] shrink-0"></i>
                          <span class="truncate">{{ place.address }}</span>
                        </span>
                      </div>
                      <span v-if="place.cost" class="text-xs font-bold text-dark shrink-0">
                        NT$ {{ Number(place.cost).toLocaleString() }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  itinerary: { type: Array, default: () => [] },
  dayTitles: { type: Object, default: () => ({}) }
})

defineEmits(['add', 'clear', 'edit', 'remove', 'select-place', 'edit-day-title', 'navigate'])

const sortedItinerary = computed(() => {
  return [...props.itinerary].sort((a, b) => {
    const dateA = a.date || '9999-12-31'
    const dateB = b.date || '9999-12-31'
    if (dateA !== dateB) return dateA.localeCompare(dateB)
    const timeA = a.time || '00:00'
    const timeB = b.time || '00:00'
    return timeA.localeCompare(timeB)
  })
})

const totalCost = computed(() => {
  return props.itinerary.reduce((sum, item) => sum + (Number(item.cost) || 0), 0)
})

const shouldShowDateHeader = (index) => {
  if (index === 0) return true
  const curr = sortedItinerary.value[index]
  const prev = sortedItinerary.value[index - 1]
  return curr.date !== prev.date
}

const formatDate = (dateStr) => {
  if(!dateStr) return '未定日期'
  const d = new Date(dateStr)
  const weekdays = ['週日', '週一', '週二', '週三', '週四', '週五', '週六']
  return `${d.getMonth()+1}/${d.getDate()} ${weekdays[d.getDay()]}`
}

const getTypeColor = (type) => {
  const colors = {
    spot: 'bg-blue-500',
    hotel: 'bg-purple-500',
    transport: 'bg-orange-500',
    food: 'bg-red-500'
  }
  return colors[type] || 'bg-gray-400'
}

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

