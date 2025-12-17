<template>
  <div class="absolute inset-0 bg-surface z-30 p-6 overflow-y-auto">
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
            <div class="flex items-center gap-2 mt-1">
              <div class="w-2 h-2 rounded-full" :class="syncStatus === 'synced' ? 'bg-green-500' : (syncStatus === 'syncing' ? 'bg-yellow-400 animate-pulse' : 'bg-gray-300')"></div>
              <span class="text-[10px] text-gray-500">
                {{ syncStatus === 'synced' ? '已同步' : (syncStatus === 'syncing' ? '同步中...' : '離線') }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Sign Out Button -->
        <button @click="$emit('sign-out')" class="w-full bg-red-50 text-red-500 py-3 rounded-xl font-bold hover:bg-red-100 transition flex items-center justify-center gap-2">
          <i class="fa-solid fa-right-from-bracket"></i>
          <span>登出</span>
        </button>
        
        <!-- Force Logout (for debugging) -->
        <button @click="$emit('force-logout')" class="w-full bg-gray-100 text-gray-600 py-2 rounded-lg text-xs font-medium hover:bg-gray-200 transition">
          <i class="fa-solid fa-power-off mr-1"></i>
          強制登出（如果登出失敗）
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
      <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Google Maps API Key</label>
      <div class="relative">
        <i class="fa-brands fa-google absolute left-4 top-4 text-gray-400"></i>
        <input :value="apiKey" @input="$emit('update:apiKey', $event.target.value)" type="text" placeholder="輸入您的 API Key" class="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm font-medium text-dark outline-none transition">
      </div>
      
      <!-- API Status -->
      <div class="mt-3 flex items-center justify-between p-3 bg-gray-50 rounded-xl">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full" :class="isMapReady ? 'bg-green-500' : 'bg-gray-300'"></div>
          <span class="text-xs font-medium text-gray-600">
            {{ isMapReady ? 'API 已載入' : 'API 未載入' }}
          </span>
        </div>
        <button v-if="apiKey && !isMapReady" @click="$emit('reload-api')" class="text-xs text-primary font-bold hover:underline">
          重新載入
        </button>
      </div>

      <!-- 如果 API 未載入，顯示錯誤提示 -->
      <div v-if="apiKey && !isMapReady" class="mt-4 p-4 bg-red-50 rounded-2xl border border-red-200 flex gap-3">
        <i class="fa-solid fa-triangle-exclamation text-red-500 mt-0.5"></i>
        <div class="flex-1">
          <p class="text-xs text-red-800 font-bold mb-2">⚠️ API 載入失敗</p>
          <p class="text-[10px] text-red-700 leading-relaxed mb-3">
            請依照以下步驟啟用必要的 Google API：
          </p>
          <ol class="text-[10px] text-red-700 leading-relaxed space-y-1 list-decimal list-inside">
            <li>前往 <a href="https://console.cloud.google.com/apis/library" target="_blank" class="underline font-bold">Google Cloud Console</a></li>
            <li>搜尋並啟用「<strong>Maps JavaScript API</strong>」</li>
            <li>搜尋並啟用「<strong>Places API</strong>」</li>
            <li>確認 API Key 沒有 IP 或網域限制（開發時建議設為「無」）</li>
            <li>等待 1-2 分鐘後，點擊下方「重新載入」按鈕</li>
          </ol>
        </div>
      </div>

      <div v-else class="mt-4 p-4 bg-orange-50 rounded-2xl border border-orange-100 flex gap-3">
        <i class="fa-solid fa-circle-info text-orange-400 mt-0.5"></i>
        <div>
          <p class="text-xs text-orange-800 font-bold mb-1">關於 API Key</p>
          <p class="text-[10px] text-orange-700 leading-relaxed">
            此 Key 用於搜尋真實地點與顯示地圖。請確保已在 Google Cloud Console 啟用 <strong>Maps JavaScript API</strong> 與 <strong>Places API</strong>。
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <button @click="$emit('test-api')" class="bg-blue-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition flex items-center justify-center gap-2">
        <i class="fa-solid fa-vial"></i>
        <span>測試連接</span>
      </button>
      <button @click="$emit('save-api')" class="bg-dark text-white py-4 rounded-2xl font-bold shadow-xl shadow-gray-200 active:scale-95 transition flex items-center justify-center gap-2">
        <span>儲存重整</span>
        <i class="fa-solid fa-rotate-right"></i>
      </button>
    </div>

    <!-- Firebase Test Section -->
    <div v-if="user" class="bg-white rounded-3xl p-6 shadow-sm border border-gray-50 mb-6 mt-6">
      <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
        <i class="fa-brands fa-google text-orange-500 mr-1"></i>
        Firebase 測試工具
      </label>
      
      <div class="space-y-3">
        <!-- Status Display -->
        <div class="p-4 bg-gray-50 rounded-2xl space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">登入狀態：</span>
            <span class="font-bold text-primary">✅ {{ user.email || '匿名' }}</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">使用者 ID：</span>
            <span class="text-xs font-mono text-gray-500">{{ user.uid.substring(0, 20) }}...</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">同步狀態：</span>
            <span class="font-bold" :class="syncStatus === 'synced' ? 'text-green-500' : (syncStatus === 'syncing' ? 'text-yellow-500' : 'text-gray-400')">
              {{ syncStatus === 'synced' ? '✅ 已同步' : (syncStatus === 'syncing' ? '⏳ 同步中' : '❌ 離線') }}
            </span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">行程項目數：</span>
            <span class="font-bold text-primary">{{ itineraryCount }} 個</span>
          </div>
        </div>

        <!-- Test Buttons -->
        <button @click="$emit('test-write')" class="w-full bg-green-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-200 active:scale-95 transition flex items-center justify-center gap-2">
          <i class="fa-solid fa-cloud-arrow-up"></i>
          <span>手動上傳到 Firebase</span>
        </button>
        
        <button @click="$emit('test-read')" class="w-full bg-blue-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition flex items-center justify-center gap-2">
          <i class="fa-solid fa-cloud-arrow-down"></i>
          <span>從 Firebase 讀取</span>
        </button>

        <button @click="$emit('open-console')" class="w-full bg-orange-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-orange-200 active:scale-95 transition flex items-center justify-center gap-2">
          <i class="fa-solid fa-external-link-alt"></i>
          <span>開啟 Firebase Console</span>
        </button>
      </div>

      <p class="text-[10px] text-gray-400 mt-3 leading-relaxed">
        使用這些工具來測試 Firebase 連接和數據同步。如果手動上傳成功，請前往 Firebase Console 查看資料。
      </p>
    </div>
    
    <div class="mt-12 text-center">
      <p class="text-xs text-gray-300 font-medium tracking-widest uppercase">Travel PWA v5.1 • Firebase</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: { type: Object, default: null },
  syncStatus: { type: String, default: 'offline' },
  apiKey: { type: String, default: '' },
  isMapReady: { type: Boolean, default: false },
  itineraryCount: { type: Number, default: 0 }
})

defineEmits([
  'sign-out', 'force-logout', 'show-login',
  'export', 'import',
  'update:apiKey', 'reload-api', 'test-api', 'save-api',
  'test-write', 'test-read', 'open-console'
])
</script>

