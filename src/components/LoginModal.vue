<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-dark/40 backdrop-blur-md" @click="$emit('close')"></div>
      
      <div class="bg-white rounded-[2.5rem] w-full max-w-sm p-8 relative z-10 shadow-2xl transform transition-all scale-100 border border-white/50">
        
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-20 h-20 bg-gradient-to-br from-primary to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/30 rotate-6 hover:rotate-0 transition-transform duration-500">
            <i class="fa-solid fa-suitcase-rolling text-3xl text-white -rotate-6"></i>
          </div>
          <h2 class="text-2xl font-serif font-bold text-dark mb-2">歡迎使用</h2>
          <p class="text-sm text-gray-500">台灣輕旅行規劃 App</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <div class="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-sm text-gray-500">登入中...</p>
        </div>

        <!-- Login Options -->
        <div v-else class="space-y-3">
          <!-- Google Login -->
          <button @click="handleGoogleLogin" class="w-full bg-white border-2 border-gray-200 text-dark py-4 rounded-2xl font-bold shadow-sm hover:shadow-md hover:border-primary/30 transition flex items-center justify-center gap-3 active:scale-95">
            <i class="fa-brands fa-google text-xl text-red-500"></i>
            <span>使用 Google 登入</span>
          </button>

          <!-- Anonymous Login -->
          <button @click="handleAnonymousLogin" class="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-200 transition flex items-center justify-center gap-3 active:scale-95">
            <i class="fa-solid fa-user-secret text-lg"></i>
            <span>訪客模式繼續</span>
          </button>
        </div>

        <!-- Features -->
        <div class="mt-8 pt-6 border-t border-gray-100">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">登入後可享有</p>
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <i class="fa-solid fa-cloud text-primary"></i>
              <span>跨裝置同步行程</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <i class="fa-solid fa-shield-halved text-primary"></i>
              <span>雲端自動備份</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <i class="fa-solid fa-sparkles text-primary"></i>
              <span>更多功能即將推出</span>
            </div>
          </div>
        </div>

        <!-- Close Button -->
        <button @click="$emit('close')" class="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition flex items-center justify-center">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <!-- Privacy -->
        <p class="text-[10px] text-gray-400 text-center mt-6 leading-relaxed">
          點擊登入即表示您同意我們的服務條款。<br>
          您的資料將安全地儲存在 Google Cloud。
        </p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'google-login', 'anonymous-login'])

const loading = ref(false)

const handleGoogleLogin = async () => {
  loading.value = true
  try {
    await emit('google-login')
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}

const handleAnonymousLogin = async () => {
  loading.value = true
  try {
    await emit('anonymous-login')
  } catch (error) {
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>


