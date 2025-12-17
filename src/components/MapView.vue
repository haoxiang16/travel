<template>
  <div class="absolute inset-0 z-0">
    <div v-if="!isMapReady" class="absolute inset-0 flex flex-col items-center justify-center bg-surface z-10 text-center p-8">
      <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse ring-8 ring-primary/5">
        <i class="fa-solid fa-map-location-dot text-3xl text-primary"></i>
      </div>
      <h3 class="text-xl font-bold mb-2 text-dark font-serif">準備探索</h3>
      <p class="text-gray-400 mb-8 text-sm leading-relaxed max-w-xs mx-auto">請輸入 Google Maps API Key 以啟用真實資料搜尋與地圖功能。</p>
      <button @click="$emit('open-settings')" class="bg-dark text-white px-8 py-3 rounded-2xl shadow-xl shadow-dark/20 hover:bg-gray-800 transition transform active:scale-95 font-medium tracking-wide">
        前往設定 API Key
      </button>
    </div>
    <div id="map" class="w-full h-full grayscale-[20%]"></div>
    
    <div v-if="isMapReady" class="absolute top-4 right-4 flex flex-col gap-3">
      <button @click="$emit('get-location')" class="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-gray-700 active:scale-90 transition">
        <i class="fa-solid fa-location-dot"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isMapReady: { type: Boolean, default: false }
})

defineEmits(['open-settings', 'get-location'])
</script>

