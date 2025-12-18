<template>
  <header class="pt-safe px-4 pb-2 bg-white/80 backdrop-blur-md sticky top-0 z-20 transition-all duration-300 shadow-sm border-b border-gray-100/50">
    <div class="max-w-[1440px] mx-auto h-16 flex items-center gap-4">
      <!-- App Logo/Title -->
      <div class="flex items-center gap-2 px-2 shrink-0 cursor-pointer" @click="$emit('open-settings')">
        <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transform -rotate-3 group hover:rotate-0 transition-transform duration-300">
          <i class="fa-solid fa-plane-departure text-white text-lg"></i>
        </div>
        <h1 class="text-xl font-serif font-black text-dark tracking-tighter hidden sm:block">輕旅行</h1>
      </div>

      <!-- Search Bar -->
      <div class="flex-grow relative group max-w-2xl mx-auto">
        <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"></i>
        <input 
          :value="searchQuery" 
          @input="$emit('update:searchQuery', $event.target.value)"
          @keyup.enter="$emit('search')"
          type="text" 
          placeholder="探索目的地..." 
          class="w-full pl-11 pr-10 py-3 bg-gray-100/80 border border-transparent rounded-2xl focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 text-dark outline-none transition-all placeholder-gray-400 font-medium text-sm"
        >
        <button v-if="searchQuery" @click="$emit('update:searchQuery', '')" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition">
          <i class="fa-solid fa-xmark text-xs"></i>
        </button>
      </div>

      <!-- User Avatar / Settings -->
      <div class="flex items-center gap-2 shrink-0">
        <button 
          v-if="user" 
          @click="$emit('toggle-user-menu')"
          class="w-11 h-11 rounded-2xl overflow-hidden border-2 border-primary/10 shadow-sm hover:shadow-md transition relative group"
        >
          <img v-if="user.photoURL" :src="user.photoURL" :alt="user.displayName || 'User'" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
          <div v-else class="w-full h-full bg-primary/10 text-primary flex items-center justify-center font-bold">
            <i class="fa-solid fa-user"></i>
          </div>
        </button>
        <button 
          v-else
          @click="$emit('show-login')"
          class="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-teal-700 transition shadow-lg shadow-primary/20"
          title="登入"
        >
          <i class="fa-solid fa-user-plus text-sm"></i>
        </button>

        <button @click="$emit('open-settings')" class="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-gray-500 hover:text-dark hover:bg-gray-50 transition shadow-sm border border-gray-100 relative group">
          <i class="fa-solid fa-sliders group-hover:rotate-180 transition-transform duration-500"></i>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  searchQuery: { type: String, default: '' },
  user: { type: Object, default: null }
})

defineEmits(['update:searchQuery', 'search', 'toggle-user-menu', 'show-login', 'open-settings'])
</script>
