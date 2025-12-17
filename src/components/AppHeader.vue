<template>
  <header class="pt-safe px-4 pb-2 bg-white/80 backdrop-blur-md sticky top-0 z-20 transition-all duration-300 shadow-sm border-b border-gray-100/50">
    <div class="h-16 flex items-center gap-3">
      <!-- Cloud Status Indicator -->
      <div class="flex items-center gap-1.5 px-2">
        <div class="w-2 h-2 rounded-full transition-colors duration-500" 
             :class="syncStatus === 'synced' ? 'bg-green-500' : (syncStatus === 'syncing' ? 'bg-yellow-400 animate-pulse' : 'bg-gray-300')"></div>
        <span class="text-[10px] text-gray-400 font-medium hidden sm:inline-block">
          {{ syncStatus === 'synced' ? '已同步' : (syncStatus === 'syncing' ? '同步中...' : '離線') }}
        </span>
      </div>

      <!-- Search Bar -->
      <div class="flex-grow relative group">
        <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"></i>
        <input 
          :value="searchQuery" 
          @input="$emit('update:searchQuery', $event.target.value)"
          @keyup.enter="$emit('search')"
          type="text" 
          placeholder="搜尋地點 (例如: 台北咖啡廳)" 
          class="w-full pl-10 pr-10 py-3 bg-gray-100/80 border border-transparent rounded-2xl focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 text-dark outline-none transition-all placeholder-gray-400 font-medium text-sm"
        >
        <button v-if="searchQuery" @click="$emit('update:searchQuery', '')" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition">
          <i class="fa-solid fa-xmark text-xs"></i>
        </button>
      </div>

      <!-- User Avatar / Login Button -->
      <button 
        v-if="user && user.photoURL" 
        @click="$emit('toggle-user-menu')"
        class="w-11 h-11 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-sm hover:shadow-md transition shrink-0 relative"
      >
        <img :src="user.photoURL" :alt="user.displayName || 'User'" class="w-full h-full object-cover">
      </button>
      <button 
        v-else-if="user && !user.photoURL"
        @click="$emit('toggle-user-menu')"
        class="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold hover:bg-primary/20 transition shadow-sm shrink-0"
      >
        <i class="fa-solid fa-user"></i>
      </button>
      <button 
        v-else
        @click="$emit('show-login')"
        class="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition shadow-sm shrink-0"
        title="登入"
      >
        <i class="fa-solid fa-right-to-bracket"></i>
      </button>

      <button @click="$emit('open-settings')" class="w-11 h-11 rounded-2xl bg-white flex items-center justify-center text-gray-500 hover:text-dark hover:bg-gray-50 transition shadow-sm border border-gray-100 shrink-0 relative">
        <i class="fa-solid fa-sliders"></i>
        <span v-if="!apiKey" class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  syncStatus: { type: String, default: 'offline' },
  searchQuery: { type: String, default: '' },
  user: { type: Object, default: null },
  apiKey: { type: String, default: '' }
})

defineEmits(['update:searchQuery', 'search', 'toggle-user-menu', 'show-login', 'open-settings'])
</script>

