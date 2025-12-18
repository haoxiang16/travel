<template>
  <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-md lg:max-w-lg h-20 bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center z-30 border border-white/50 pb-safe transition-all duration-300 px-2">
    <!-- Left Section -->
    <div class="flex-1 flex justify-center">
      <button @click="$emit('switch', 'map')" class="relative w-16 h-full flex flex-col items-center justify-center transition group lg:hidden">
        <div :class="currentView === 'map' ? 'bg-primary/10 text-primary scale-110' : 'text-gray-300 hover:text-gray-500'" class="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300">
          <i class="fa-solid fa-map text-lg"></i>
        </div>
      </button>
      
      <button v-if="currentView === 'map'" @click="$emit('switch', 'itinerary')" class="hidden lg:flex relative w-16 h-full flex-col items-center justify-center transition group">
        <div class="text-gray-300 hover:text-gray-500 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300">
          <i class="fa-solid fa-chevron-left text-lg"></i>
        </div>
      </button>
      
      <!-- Placeholder for desktop alignment when map is hidden -->
      <div v-if="currentView !== 'map'" class="hidden lg:block w-16 h-12"></div>
    </div>

    <!-- Center Section -->
    <div class="flex-none relative -top-8">
      <button @click="$emit('switch', 'itinerary')" 
        :class="currentView === 'itinerary' ? 'bg-dark text-white scale-110 ring-4 ring-white' : 'bg-white text-dark border border-gray-100'"
        class="w-20 h-20 rounded-full shadow-2xl shadow-gray-300 flex items-center justify-center hover:scale-105 active:scale-95 transition transform">
        <div class="relative flex flex-col items-center justify-center">
          <i class="fa-solid fa-suitcase-rolling text-2xl mb-0.5"></i>
          <span v-if="itineraryCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white font-bold">{{ itineraryCount }}</span>
        </div>
      </button>
    </div>

    <!-- Right Section -->
    <div class="flex-1 flex justify-center">
      <button @click="$emit('switch', 'list')" class="relative w-16 h-full flex flex-col items-center justify-center transition group">
        <div :class="currentView === 'list' ? 'bg-primary/10 text-primary scale-110' : 'text-gray-300 hover:text-gray-500'" class="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300">
          <i class="fa-solid fa-magnifying-glass text-lg"></i>
        </div>
      </button>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  currentView: { type: String, required: true },
  itineraryCount: { type: Number, default: 0 }
})

defineEmits(['switch'])
</script>

