<template>
  <div class="absolute inset-0 overflow-y-auto pb-32 bg-surface scroll-smooth">
    <div class="px-5 pt-4">
      <!-- Empty State -->
      <div v-if="places.length === 0 && !isSearching" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="relative mb-6">
          <div class="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
          <i class="fa-solid fa-earth-asia text-6xl text-primary/80 relative z-10"></i>
        </div>
        <h3 class="text-lg font-bold text-dark mb-2">開始您的旅程</h3>
        <p class="text-gray-400 text-sm">輸入關鍵字，探索世界各地的景點與美食</p>
      </div>

      <!-- Loading -->
      <div v-if="isSearching" class="flex flex-col items-center justify-center py-20">
        <div class="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p class="text-gray-400 text-sm font-medium tracking-wide">搜尋真實資料中...</p>
      </div>

      <!-- Results -->
      <div v-else class="space-y-6">
        <div v-for="(place, index) in places" :key="place.id" 
             class="group bg-white rounded-[2rem] p-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition duration-300 border border-gray-50 relative">
          
          <!-- 編號標籤 -->
          <div class="absolute top-6 left-6 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg z-10">
            {{ index + 1 }}
          </div>

          <div class="relative h-56 rounded-[1.5rem] overflow-hidden mb-4 bg-gray-100" @click="$emit('select-place', place)">
            <img :src="place.image" class="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out" alt="place.name" onerror="this.src='https://placehold.co/600x400?text=No+Image'">
            <div v-if="place.rating" class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm text-dark">
              <i class="fa-solid fa-star text-yellow-400 text-[10px]"></i> {{ place.rating }}
            </div>
            <div class="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-4 left-4 text-white pr-4">
              <h3 class="text-lg font-bold tracking-tight leading-snug shadow-sm">{{ place.name }}</h3>
            </div>
          </div>
          
          <div class="px-2 pb-2">
            <div class="flex justify-between items-center gap-2">
              <div class="flex items-center text-gray-400 text-xs flex-1 min-w-0" @click="$emit('select-place', place)">
                <i class="fa-solid fa-location-dot mr-1 shrink-0"></i> 
                <span class="line-clamp-1">{{ place.address }}</span>
              </div>
              <div class="flex gap-2 shrink-0">
                <button @click.stop="$emit('view-on-map', place)" class="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition" title="在地圖上查看">
                  <i class="fa-solid fa-map-location-dot text-sm"></i>
                </button>
                <button v-if="isInItinerary(place.id)" class="text-primary text-xs bg-secondary px-3 py-1 rounded-full font-bold">
                  <i class="fa-solid fa-check mr-1"></i>已安排
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  places: { type: Array, default: () => [] },
  isSearching: { type: Boolean, default: false },
  isInItinerary: { type: Function, required: true }
})

defineEmits(['select-place', 'view-on-map'])
</script>

