<template>
  <transition name="fade">
    <div v-if="show" class="fixed top-24 left-1/2 -translate-x-1/2 bg-dark/90 text-white px-6 py-3 rounded-full shadow-2xl z-50 flex items-center gap-3 backdrop-blur-md border border-white/10">
      <i class="fa-solid fa-circle-check text-secondary"></i>
      <span class="text-sm font-medium tracking-wide">{{ message }}</span>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
  message: { type: String, default: '' }
})
</script>

