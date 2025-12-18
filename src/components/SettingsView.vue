<template>
  <div class="absolute inset-0 bg-surface z-30 p-6 overflow-y-auto overflow-x-hidden">
    <h2 class="text-3xl font-serif font-bold mb-8 text-dark">App 設定</h2>
    
    <!-- Account Section -->
    <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 mb-6">
      <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">帳戶</label>
      
      <div v-if="user" class="space-y-4">
        <!-- User Info -->
        <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
          <div v-if="user.photoURL" class="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/30">
            <img :src="user.photoURL" :alt="user.displayName || 'User'" class="w-full h-full object-cover">
          </div>
          <div v-else class="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center border-2 border-primary/30">
            <i class="fa-solid fa-user text-2xl"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="font-bold text-dark text-lg truncate">{{ user.displayName || '匿名使用者' }}</p>
            <p class="text-xs text-gray-400 truncate">{{ user.email || '訪客模式' }}</p>
          </div>
        </div>
        
        <!-- Sign Out Button -->
        <button @click="$emit('sign-out')" class="w-full bg-red-50 text-red-500 py-3 rounded-xl font-bold hover:bg-red-100 transition flex items-center justify-center gap-2">
          <i class="fa-solid fa-right-from-bracket"></i>
          <span>登出</span>
        </button>
      </div>
      
      <div v-else class="space-y-3">
        <p class="text-sm text-gray-600 mb-4">登入以啟用雲端同步功能</p>
        <button @click="$emit('show-login')" class="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-teal-700 transition flex items-center justify-center gap-2">
          <i class="fa-solid fa-right-to-bracket"></i>
          <span>登入</span>
        </button>
      </div>
    </div>
    
    <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 mb-6">
      <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">資料管理</label>
      <div class="grid grid-cols-2 gap-3">
        <button @click="$emit('export')" class="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl hover:bg-primary/5 hover:text-primary transition border border-gray-100 group">
          <i class="fa-solid fa-file-export text-xl mb-2 text-gray-400 group-hover:text-primary"></i>
          <span class="text-xs font-bold">匯出行程 (JSON)</span>
        </button>
        <button @click="$emit('import')" class="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-2xl hover:bg-primary/5 hover:text-primary transition border border-gray-100 group">
          <i class="fa-solid fa-file-import text-xl mb-2 text-gray-400 group-hover:text-primary"></i>
          <span class="text-xs font-bold">匯入行程</span>
        </button>
      </div>
      <p class="text-[10px] text-gray-400 mt-3 leading-relaxed">
        將您的行程下載為檔案備份，或匯入之前的行程檔。
      </p>
    </div>

    <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 mb-6">
      <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">API 狀態</label>
      
      <!-- API Status -->
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full" :class="isMapReady ? 'bg-green-500' : 'bg-gray-300'"></div>
          <span class="text-xs font-medium text-gray-600">
            {{ isMapReady ? 'Google Maps 服務正常' : 'Google Maps 載入中...' }}
          </span>
        </div>
        <button v-if="!isMapReady" @click="$emit('reload-api')" class="text-xs text-primary font-bold hover:underline">
          重新載入
        </button>
      </div>

      <!-- 如果 API 未載入，顯示錯誤提示 -->
      <div v-if="!isMapReady" class="mt-4 p-4 bg-red-50 rounded-2xl border border-red-200 flex gap-3">
        <i class="fa-solid fa-triangle-exclamation text-red-500 mt-0.5"></i>
        <div class="flex-1">
          <p class="text-xs text-red-800 font-bold mb-2">⚠️ 服務暫時無法使用</p>
          <p class="text-[10px] text-red-700 leading-relaxed">
            系統正在嘗試連接 Google Maps 服務。如果長時間未回應，請檢查網路連接或聯繫管理員。
          </p>
        </div>
      </div>
    </div>
    
    <div class="mt-12 text-center">
      <p class="text-xs text-gray-300 font-medium tracking-widest uppercase">Travel PWA v5.3 • Firebase</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: { type: Object, default: null },
  isMapReady: { type: Boolean, default: false }
})

defineEmits([
  'sign-out', 'show-login',
  'export', 'import',
  'reload-api'
])
</script>

