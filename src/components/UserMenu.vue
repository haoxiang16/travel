<template>
  <div>
    <transition name="fade">
      <div v-if="show" class="fixed top-20 right-4 bg-white rounded-2xl shadow-2xl z-50 border border-gray-100 overflow-hidden min-w-[200px]" style="z-index: 100">
        <div class="p-4 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <div v-if="user?.photoURL" class="w-10 h-10 rounded-full overflow-hidden">
              <img :src="user.photoURL" :alt="user.displayName || 'User'" class="w-full h-full object-cover">
            </div>
            <div v-else class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <i class="fa-solid fa-user"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-dark text-sm truncate">{{ user?.displayName || '使用者' }}</p>
              <p class="text-xs text-gray-400 truncate">{{ user?.email || '匿名使用者' }}</p>
            </div>
          </div>
        </div>
        <button @click="$emit('sign-out')" class="w-full px-4 py-3 text-left text-red-500 hover:bg-red-50 transition flex items-center gap-2">
          <i class="fa-solid fa-right-from-bracket"></i>
          <span class="font-medium">登出</span>
        </button>
      </div>
    </transition>
    
    <!-- Click outside to close -->
    <div v-if="show" @click="$emit('close')" class="fixed inset-0 z-40" style="z-index: 90"></div>
  </div>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
  user: { type: Object, default: null }
})

defineEmits(['close', 'sign-out'])
</script>

