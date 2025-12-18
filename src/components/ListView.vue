<template>
  <div class="absolute inset-0 overflow-y-auto overflow-x-hidden pb-32 bg-surface scroll-smooth">
    <div class="px-5 pt-4 max-w-4xl mx-auto">
      <!-- Empty State -->
      <div v-if="places.length === 0 && !isSearching" class="flex flex-col items-center justify-center py-32 text-center">
        <div class="relative mb-8 group">
          <div class="absolute inset-0 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-colors duration-700"></div>
          <div class="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center relative z-10 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
            <i class="fa-solid fa-earth-asia text-5xl text-primary"></i>
          </div>
        </div>
        <h3 class="text-2xl font-serif font-black text-dark mb-3 tracking-tight">探索下一個目的地</h3>
        <p class="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">輸入景點、餐廳或城市名稱，開始規劃您的精彩旅程。</p>
      </div>

      <!-- Loading -->
      <div v-if="isSearching" class="flex flex-col items-center justify-center py-32">
        <div class="relative">
          <div class="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
          <i class="fa-solid fa-plane absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse"></i>
        </div>
        <p class="text-gray-400 text-sm font-bold tracking-widest mt-6 uppercase">Searching...</p>
      </div>

      <!-- Results -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="(place, index) in places" :key="place.id" 
             class="group bg-white rounded-[2.5rem] p-4 shadow-[0_10px_40px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.1)] transition-all duration-500 border border-gray-50 relative overflow-hidden flex flex-col h-full">
          
          <!-- 編號標籤 -->
          <div class="absolute top-6 left-6 w-10 h-10 bg-dark/80 backdrop-blur-md text-white rounded-2xl flex items-center justify-center font-black text-sm shadow-xl z-20 transition-transform group-hover:scale-110">
            {{ index + 1 }}
          </div>

          <div class="relative h-64 rounded-[2rem] overflow-hidden mb-5 bg-gray-100 shrink-0 group/img cursor-pointer" @click="$emit('select-place', place)">
            <img :src="place.image" class="w-full h-full object-cover group-hover:scale-110 transition duration-1000 ease-out" alt="place.name" onerror="this.src='https://placehold.co/600x400?text=No+Image'">
            
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
            
            <div v-if="place.rating" class="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-xl text-dark">
              <i class="fa-solid fa-star text-accent"></i> {{ place.rating }}
            </div>

            <div class="absolute bottom-6 left-6 right-6 text-white pr-4 transform group-hover:translate-y-[-4px] transition-transform duration-500">
              <h3 class="text-xl font-black tracking-tight leading-tight mb-1">{{ place.name }}</h3>
              <div class="flex items-center text-white/80 text-[10px] font-bold tracking-wide uppercase">
                <i class="fa-solid fa-location-dot mr-1.5"></i> 
                <span class="truncate">{{ place.address?.split(',')[0] || '未知地點' }}</span>
              </div>
            </div>
          </div>
          
          <div class="px-2 pb-2 flex-grow flex flex-col justify-between">
            <div class="flex justify-between items-center gap-4">
              <div class="text-gray-400 text-xs flex-1 min-w-0 font-medium" @click="$emit('select-place', place)">
                <span class="line-clamp-2 leading-relaxed">{{ place.address }}</span>
              </div>
              <div class="flex gap-2 shrink-0">
                <button @click.stop="$emit('view-on-map', place)" class="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 shadow-sm" title="在地圖上查看">
                  <i class="fa-solid fa-map-location-dot text-lg"></i>
                </button>
                <button v-if="isInItinerary(place.id)" class="bg-secondary text-primary text-xs px-4 rounded-2xl font-black flex items-center gap-2 border border-primary/10">
                  <i class="fa-solid fa-check"></i>已加入
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

