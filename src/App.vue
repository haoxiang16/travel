<template>
  <div id="app" class="flex flex-col h-full relative">
    <!-- Header -->
    <AppHeader
      v-model:search-query="searchQuery"
      :user="user"
      @search="searchPlaces"
      @toggle-user-menu="showUserMenu = !showUserMenu"
      @show-login="showLoginModal = true"
      @open-settings="currentView = 'settings'"
    />

    <!-- Main Content Area -->
    <main class="flex-grow relative overflow-hidden flex flex-col lg:flex-row">
      <!-- Desktop Sidebar (Itinerary/List/Settings) -->
      <aside v-if="currentView !== 'map'" 
             class="hidden lg:flex flex-col w-[450px] border-r border-gray-100 bg-surface z-10 shadow-xl overflow-hidden shrink-0">
        <div class="h-full relative overflow-y-auto custom-scrollbar">
          <!-- View: List in Sidebar -->
          <ListView 
            v-if="currentView === 'list'"
            :places="places"
            :is-searching="isSearching"
            :is-in-itinerary="isInItinerary"
            @select-place="selectPlace"
            @view-on-map="viewOnMap"
          />
          <!-- View: Itinerary in Sidebar -->
          <ItineraryView 
            v-if="currentView === 'itinerary'"
            :itinerary="itinerary"
            :day-titles="dayTitles"
            @add="openManualInput"
            @clear="clearItinerary"
            @edit="editItem"
            @remove="removeFromItinerary"
            @select-place="selectPlace"
            @edit-day-title="editDayTitle"
            @navigate="navigateTo"
          />
          <!-- View: Settings in Sidebar -->
          <SettingsView 
            v-if="currentView === 'settings'"
            :user="user"
            :is-map-ready="isMapReady"
            @sign-out="handleSignOut"
            @show-login="showLoginModal = true"
            @export="exportItinerary"
            @import="triggerImport"
            @reload-api="loadGoogleMapsScript"
          />
        </div>
      </aside>

      <!-- Map View (Always visible on Desktop, Swappable on Mobile) -->
      <section class="flex-grow relative h-full transition-all duration-500 ease-in-out">
        <MapView 
          v-show="currentView === 'map' || (isLargeScreen && currentView !== 'settings')"
          :is-map-ready="isMapReady"
          @open-settings="currentView = 'settings'"
          @get-location="getUserLocation"
        />
        
        <!-- Mobile Swappable Views (Hidden on Desktop split screen) -->
        <div class="lg:hidden h-full">
          <!-- VIEW: LIST -->
          <transition name="fade">
            <ListView 
              v-show="currentView === 'list'"
              :places="places"
              :is-searching="isSearching"
              :is-in-itinerary="isInItinerary"
              @select-place="selectPlace"
              @view-on-map="viewOnMap"
            />
          </transition>

          <!-- VIEW: ITINERARY -->
          <transition name="fade">
            <ItineraryView 
              v-show="currentView === 'itinerary'"
              :itinerary="itinerary"
              :day-titles="dayTitles"
              @add="openManualInput"
              @clear="clearItinerary"
              @edit="editItem"
              @remove="removeFromItinerary"
              @select-place="selectPlace"
              @edit-day-title="editDayTitle"
              @navigate="navigateTo"
            />
          </transition>

          <!-- VIEW: SETTINGS -->
          <transition name="fade">
            <SettingsView 
              v-show="currentView === 'settings'"
              :user="user"
              :is-map-ready="isMapReady"
              @sign-out="handleSignOut"
              @show-login="showLoginModal = true"
              @export="exportItinerary"
              @import="triggerImport"
              @reload-api="loadGoogleMapsScript"
            />
          </transition>
      </div>
      </section>

      <!-- Manual Input Modal -->
      <transition name="fade">
        <ManualInputModal
          :show="showManualInput"
          :editing-id="editingId"
          v-model:item="manualItem"
          @close="showManualInput = false"
          @confirm="confirmManualItem"
        />
      </transition>

      <!-- Day Title Editor Modal -->
      <transition name="fade">
        <DayTitleModal
          :show="showTitleModal"
          :date="currentEditingDate"
          v-model:title="tempTitle"
          @close="showTitleModal = false"
          @save="saveDayTitle"
        />
      </transition>

      <!-- Place Details Modal -->
      <transition name="slide-up">
        <PlaceDetailModal
          :place="selectedPlace"
          :is-in-itinerary="selectedPlace ? isInItinerary(selectedPlace.id) : false"
          v-model:date-time="detailDateTime"
          @close="selectedPlace = null"
          @toggle-itinerary="toggleItinerary"
          @view-on-map="viewOnMap"
          @navigate="navigateTo"
        />
      </transition>
    </main>

    <!-- Bottom Navigation -->
    <BottomNav
      :current-view="currentView"
      :itinerary-count="itinerary.length"
      @switch="switchTab"
    />

    <!-- User Menu Dropdown -->
    <UserMenu
      :show="showUserMenu"
      :user="user"
      @close="showUserMenu = false"
      @sign-out="handleSignOut(); showUserMenu = false"
    />

    <!-- Login Modal -->
    <LoginModal 
      :show="showLoginModal" 
      @close="showLoginModal = false"
      @google-login="handleGoogleLogin"
      @anonymous-login="handleAnonymousLogin"
    />

    <!-- Toast -->
    <ToastNotification :show="toast.show" :message="toast.message" />

    <!-- Hidden file input for import -->
    <input type="file" ref="fileInput" @change="handleImport" class="hidden" accept=".json">
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { signInAnonymous, signInWithGoogle, signOut, onAuthChange, saveItineraryData, loadItineraryData, onItineraryDataChange } from './firebase.js'

// Components
import AppHeader from './components/AppHeader.vue'
import MapView from './components/MapView.vue'
import ListView from './components/ListView.vue'
import ItineraryView from './components/ItineraryView.vue'
import SettingsView from './components/SettingsView.vue'
import BottomNav from './components/BottomNav.vue'
import ManualInputModal from './components/ManualInputModal.vue'
import DayTitleModal from './components/DayTitleModal.vue'
import PlaceDetailModal from './components/PlaceDetailModal.vue'
import UserMenu from './components/UserMenu.vue'
import LoginModal from './components/LoginModal.vue'
import ToastNotification from './components/ToastNotification.vue'

// ==================== State ====================
const currentView = ref('itinerary')
const isLargeScreen = ref(window.innerWidth >= 1024)
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
const map = ref(null)
const googleMarkers = ref([])
const isMapReady = ref(false)
const isSearching = ref(false)
const selectedPlace = ref(null)
const itinerary = ref([])
const dayTitles = ref({})
const searchQuery = ref('')
const user = ref(null)
const unsubscribeListener = ref(null)
const showLoginModal = ref(false)
const showUserMenu = ref(false)
const showManualInput = ref(false)
const editingId = ref(null)
const showTitleModal = ref(false)
const tempTitle = ref('')
const currentEditingDate = ref('')
const fileInput = ref(null)
const toast = ref({ show: false, message: '' })
const places = ref([])

const detailDateTime = ref({
  date: new Date().toISOString().split('T')[0],
  time: '10:00'
})

const manualItem = ref({
  name: '',
  address: '',
  note: '',
  date: new Date().toISOString().split('T')[0],
  time: '10:00',
  type: 'spot',
  cost: 0
})

const types = [
  { label: '景點', value: 'spot', icon: 'fa-solid fa-camera' },
  { label: '住宿', value: 'hotel', icon: 'fa-solid fa-bed' },
  { label: '交通', value: 'transport', icon: 'fa-solid fa-train-subway' },
  { label: '餐飲', value: 'food', icon: 'fa-solid fa-utensils' }
]

// ==================== Lifecycle ====================
onMounted(async () => {
  initFirebase()
  if (apiKey) {
    loadGoogleMapsScript()
  }
  
  window.addEventListener('resize', () => {
    isLargeScreen.value = window.innerWidth >= 1024
    if (isLargeScreen.value && currentView.value === 'map') {
      currentView.value = 'itinerary'
    }
  })
})

// ==================== Firebase Methods ====================
const initFirebase = async () => {
  try {
    onAuthChange((firebaseUser) => {
      user.value = firebaseUser
      if (firebaseUser) {
        console.log('✅ 使用者已登入:', firebaseUser.uid, firebaseUser.displayName || '匿名')
        setupRealtimeListener()
      } else {
        console.log('ℹ️ 使用者未登入')
        showLoginModal.value = true
      }
    })
  } catch (error) {
    console.error('❌ Firebase 初始化失敗:', error)
    if (error.code === 'auth/configuration-not-found') {
      showToast('Firebase 認證未啟用，請檢查設定')
    }
  }
}

const handleGoogleLogin = async () => {
  try {
    showLoginModal.value = false
    await signInWithGoogle()
    showToast('Google 登入成功')
    showUserMenu.value = false
  } catch (error) {
    console.error('❌ Google 登入失敗:', error)
    if (error.code === 'auth/popup-closed-by-user') {
      showToast('登入已取消')
    } else if (error.code === 'auth/popup-blocked') {
      showToast('彈出視窗被阻擋，請允許彈出視窗')
    } else {
      showToast('Google 登入失敗，請重試')
    }
  }
}

const handleAnonymousLogin = async () => {
  try {
    showLoginModal.value = false
    await signInAnonymous()
    showToast('訪客模式已啟用')
  } catch (error) {
    console.error('❌ 匿名登入失敗:', error)
    if (error.code === 'auth/configuration-not-found') {
      showToast('請先在 Firebase Console 啟用匿名登入')
    } else {
      showToast('登入失敗，請重試')
    }
  }
}

const handleSignOut = async () => {
  try {
    console.log('🔄 開始登出...')
    if (unsubscribeListener.value) {
      unsubscribeListener.value()
      unsubscribeListener.value = null
    }
    await signOut()
    user.value = null
    showUserMenu.value = false
    itinerary.value = []
    dayTitles.value = {}
    showToast('已登出')
    setTimeout(() => { showLoginModal.value = true }, 500)
  } catch (error) {
    console.error('❌ 登出失敗:', error)
    showToast('登出失敗: ' + (error.message || '請重試'))
  }
}

const setupRealtimeListener = () => {
  if (!user.value) return
  
  loadItineraryData(user.value.uid).then((data) => {
    if (data) {
      itinerary.value = data.itinerary
      dayTitles.value = data.dayTitles
    }
  }).catch(() => {
    // Silently fail
  })
  
  unsubscribeListener.value = onItineraryDataChange(user.value.uid, (data) => {
    if (data) {
      itinerary.value = data.itinerary
      dayTitles.value = data.dayTitles
    }
  })
}

// ==================== Data Methods ====================
const saveItinerary = async () => {
  if (user.value) {
    try {
      await saveItineraryData(user.value.uid, itinerary.value, dayTitles.value)
    } catch (error) {
      console.error('❌ 同步到 Firebase 失敗:', error)
    }
  } else {
    console.warn('⚠️ 未登入，無法儲存資料')
    showToast('請先登入以儲存資料')
  }
}

const exportItinerary = () => {
  const data = { itinerary: itinerary.value, dayTitles: dayTitles.value }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `travel_backup_${new Date().toISOString().slice(0,10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  showToast('行程已匯出')
}

const triggerImport = () => { fileInput.value.click() }

const handleImport = (event) => {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result)
      if (data.itinerary) {
        itinerary.value = data.itinerary
        dayTitles.value = data.dayTitles || {}
        saveItinerary()
        showToast('行程匯入成功')
        currentView.value = 'itinerary'
      } else {
        alert('檔案格式錯誤')
      }
    } catch (err) {
      alert('無法讀取檔案')
    }
  }
  reader.readAsText(file)
  event.target.value = ''
}

// ==================== UI Methods ====================
const switchTab = (tab) => {
  currentView.value = tab
  if (tab === 'map') {
    if (!map.value && isMapReady.value) {
      nextTick(() => { initMap() })
    } else if (map.value && places.value.length > 0) {
      nextTick(() => { updateMapMarkers() })
    }
  }
}

const openManualInput = () => {
  editingId.value = null
  manualItem.value = {
    name: '', address: '', note: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00', type: 'spot', cost: 0
  }
  showManualInput.value = true
}

const editItem = (item) => {
  editingId.value = item.id
  manualItem.value = {
    name: item.name, address: item.address || '', note: item.note || '',
    date: item.date, time: item.time, type: item.type || 'spot', cost: item.cost || 0
  }
  showManualInput.value = true
}

const editDayTitle = (date) => {
  if (!date) return
  currentEditingDate.value = date
  tempTitle.value = dayTitles.value[date] || ''
  showTitleModal.value = true
}

const saveDayTitle = () => {
  if (currentEditingDate.value) {
    dayTitles.value[currentEditingDate.value] = tempTitle.value
    saveItinerary()
    showTitleModal.value = false
    showToast('主題已更新')
  }
}

const selectPlace = (place) => {
  selectedPlace.value = place
  detailDateTime.value = {
    date: new Date().toISOString().split('T')[0],
    time: '10:00'
  }
  if (!place.isManual && map.value && place.lat && place.lng) {
    const pos = { lat: place.lat, lng: place.lng }
    if (currentView.value === 'map') {
      map.value.panTo(pos)
      map.value.setZoom(15)
    }
  }
}

const confirmManualItem = () => {
  if(!manualItem.value.name) {
    showToast('請輸入名稱')
    return
  }
  const typeObj = types.find(t => t.value === manualItem.value.type)
  
  if (editingId.value) {
    const index = itinerary.value.findIndex(p => p.id === editingId.value)
    if (index !== -1) {
      itinerary.value[index] = {
        ...itinerary.value[index],
        name: manualItem.value.name, address: manualItem.value.address,
        note: manualItem.value.note, date: manualItem.value.date,
        time: manualItem.value.time, type: manualItem.value.type,
        typeLabel: typeObj ? typeObj.label : '自訂', cost: manualItem.value.cost
      }
      showToast('修改成功')
    }
  } else {
    const newItem = {
      id: 'manual_' + Date.now(),
      name: manualItem.value.name, address: manualItem.value.address || '',
      note: manualItem.value.note, date: manualItem.value.date,
      time: manualItem.value.time, type: manualItem.value.type,
      typeLabel: typeObj ? typeObj.label : '自訂', cost: manualItem.value.cost,
      isManual: true, image: '', lat: null, lng: null
    }
    addToItinerary(newItem)
  }
  saveItinerary()
  showManualInput.value = false
}

const toggleItinerary = (place) => {
  if (isInItinerary(place.id)) {
    removeFromItinerary(place.id)
  } else {
    const typeObj = types.find(t => t.value === 'spot')
    const newItem = {
      ...place,
      date: detailDateTime.value.date, time: detailDateTime.value.time,
      type: place.type || 'spot', typeLabel: place.typeLabel || (typeObj ? typeObj.label : '景點'),
      cost: place.cost || 0, note: ''
    }
    addToItinerary(newItem)
  }
}

const addToItinerary = (place) => {
  itinerary.value.push(place)
  saveItinerary()
  showToast(`已加入: ${place.name}`)
}

const removeFromItinerary = (id) => {
  itinerary.value = itinerary.value.filter(p => p.id !== id)
  saveItinerary()
  showToast('已移除項目')
  if(selectedPlace.value && selectedPlace.value.id === id) {
    selectedPlace.value = null
  }
}

const clearItinerary = () => {
  if(confirm('確定要清空所有行程嗎？')) {
    itinerary.value = []
    dayTitles.value = {}
    saveItinerary()
  }
}

const isInItinerary = (id) => itinerary.value.some(p => p.id === id)

const showToast = (msg) => {
  toast.value.message = msg
  toast.value.show = true
  setTimeout(() => { toast.value.show = false }, 2000)
}

// ==================== API Methods ====================
const loadGoogleMapsScript = () => {
  if (window.google && window.google.maps) {
    if (!map.value) { isMapReady.value = true; initMap() }
    return
  }
  if (!apiKey) {
    console.error('❌ Google Maps API Key is missing in .env')
    return
  }
  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMapGlobal&libraries=places`
  script.async = true
  script.defer = true
  window.initMapGlobal = () => { isMapReady.value = true; initMap() }
  script.onerror = () => { isMapReady.value = false; alert('Google Maps API 載入失敗') }
  document.head.appendChild(script)
}

const initMap = () => {
  const mapElement = document.getElementById('map')
  if (!mapElement) return
  isMapReady.value = true
  map.value = new google.maps.Map(mapElement, {
    center: { lat: 25.040, lng: 121.550 },
    zoom: 13,
    disableDefaultUI: true,
    styles: [{ "featureType": "poi", "stylers": [{ "visibility": "off" }] }]
  })
  if(places.value.length > 0) { updateMapMarkers() }
}

const searchPlaces = () => {
  if (!apiKey) { alert("系統未設定 Google Maps API Key"); return }
  if (!window.google || !window.google.maps) { alert("Google Maps API 尚未載入"); loadGoogleMapsScript(); return }
  if (!searchQuery.value.trim()) return
  
  isSearching.value = true
  currentView.value = 'list'
  
  const service = new google.maps.places.PlacesService(document.createElement('div'))
  service.textSearch({ query: searchQuery.value }, (results, status) => {
    isSearching.value = false
    if (status === google.maps.places.PlacesServiceStatus.OK && results?.length > 0) {
      places.value = results.map(place => ({
        id: place.place_id,
        name: place.name,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        rating: place.rating || 'N/A',
        address: place.formatted_address,
        image: place.photos?.[0]?.getUrl({maxWidth: 600}) || 'https://placehold.co/600x400?text=No+Image',
        isManual: false, type: 'spot', cost: 0
      }))
      showToast(`找到 ${places.value.length} 個結果`)
      if(isMapReady.value && map.value) { nextTick(() => updateMapMarkers()) }
    } else {
      places.value = []
      showToast(status === 'REQUEST_DENIED' ? '❌ API 權限被拒絕' : '找不到相關結果')
    }
  })
}

const updateMapMarkers = () => {
  googleMarkers.value.forEach(m => m.setMap(null))
  googleMarkers.value = []
  if(!map.value) return
  
  const bounds = new google.maps.LatLngBounds()
  places.value.forEach((place, index) => {
    const position = { lat: place.lat, lng: place.lng }
    const marker = new google.maps.Marker({
      position, map: map.value, title: place.name,
      label: { text: (index + 1).toString(), color: 'white', fontSize: '12px', fontWeight: 'bold' },
      icon: { path: google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: "#0d9488", fillOpacity: 1, strokeColor: "#ffffff", strokeWeight: 2 }
    })
    marker.addListener("click", () => { selectedPlace.value = place; map.value.panTo(marker.getPosition()); map.value.setZoom(15) })
    googleMarkers.value.push(marker)
    bounds.extend(position)
  })
  if(places.value.length > 0) { 
    map.value.fitBounds(bounds)
    const listener = google.maps.event.addListener(map.value, "idle", () => {
      if (map.value.getZoom() > 16) map.value.setZoom(16)
      google.maps.event.removeListener(listener)
    })
  }
}

const viewOnMap = (place) => {
  if (!place.lat || !place.lng) return
  selectedPlace.value = null
  currentView.value = 'map'
  nextTick(() => {
    if (map.value) {
      map.value.panTo({ lat: place.lat, lng: place.lng })
      map.value.setZoom(16)
      setTimeout(() => { selectedPlace.value = place }, 500)
    }
  })
}

const getUserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const pos = { lat: position.coords.latitude, lng: position.coords.longitude }
      map.value.setCenter(pos)
      map.value.setZoom(15)
      new google.maps.Marker({ position: pos, map: map.value, title: '目前位置' })
    })
  }
}

const navigateTo = (place) => {
  let destination = ''
  if (place.lat && place.lng) { destination = `${place.lat},${place.lng}` }
  else if (place.address) { destination = encodeURIComponent(place.address) }
  else if (place.name) { destination = encodeURIComponent(place.name) }
  else { return }
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, '_blank')
}
</script>

<style scoped>
/* Transitions handled by Tailwind */
</style>

