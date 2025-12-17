// Firebase 配置與初始化
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { 
  getAuth, 
  signInAnonymously, 
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut as firebaseSignOut
} from 'firebase/auth'
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  onSnapshot,
  collection,
  query,
  where
} from 'firebase/firestore'

// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyC8WwZ-LDo8OGoKxtoNoYpRGPp6xzDglpM",
  authDomain: "tarvelapp-e68a6.firebaseapp.com",
  projectId: "tarvelapp-e68a6",
  storageBucket: "tarvelapp-e68a6.firebasestorage.app",
  messagingSenderId: "445397101136",
  appId: "1:445397101136:web:4e66f7b220bfb20a1cbf55",
  measurementId: "G-FGLJ838F0F"
};

// 初始化 Firebase
let app = null
let auth = null
let db = null
let analytics = null

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  // Analytics 只在瀏覽器環境中初始化
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app)
  }
  console.log('✅ Firebase 初始化成功')
  console.log('📋 專案 ID:', firebaseConfig.projectId)
} catch (error) {
  console.error('❌ Firebase 初始化失敗:', error)
  console.error(`
⚠️ 請檢查：
1. Firebase 配置是否正確（apiKey, projectId 等）
2. Firebase 專案是否存在
3. 網路連線是否正常
  `)
}

// 導出 Firebase 服務
export { auth, db }

// 認證相關函數
export const signInAnonymous = async () => {
  try {
    if (!auth) {
      throw new Error('Firebase Auth 未初始化。請檢查 Firebase 配置。')
    }
    const result = await signInAnonymously(auth)
    console.log('✅ 匿名登入成功:', result.user.uid)
    return result.user
  } catch (error) {
    console.error('❌ 匿名登入失敗:', error)
    
    // 提供更詳細的錯誤訊息
    if (error.code === 'auth/configuration-not-found') {
      console.error(`
⚠️ Firebase Authentication 配置錯誤！

請確認以下步驟：
1. 前往 Firebase Console → Authentication
2. 點擊「開始使用」啟用 Authentication
3. 在「登入方法」標籤中，啟用「匿名」登入方式
4. 點擊「匿名」→ 啟用 → 儲存

詳細說明請參考：Firebase認證設定指南.md
      `)
    }
    
    throw error
  }
}

export const signInWithGoogle = async () => {
  try {
    if (!auth) {
      throw new Error('Firebase Auth 未初始化。請檢查 Firebase 配置。')
    }
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({
      prompt: 'select_account'
    })
    const result = await signInWithPopup(auth, provider)
    console.log('✅ Google 登入成功:', result.user.displayName)
    return result.user
  } catch (error) {
    console.error('❌ Google 登入失敗:', error)
    
    // 提供更詳細的錯誤訊息
    if (error.code === 'auth/configuration-not-found') {
      console.error(`
⚠️ Google 登入未啟用！

請確認以下步驟：
1. 前往 Firebase Console → Authentication
2. 點擊「登入方法」標籤
3. 找到「Google」登入方式
4. 點擊「Google」→ 啟用 → 儲存
5. 輸入專案支援電子郵件（可選）

詳細說明請參考：Firebase認證設定指南.md
      `)
    } else if (error.code === 'auth/popup-closed-by-user') {
      console.log('ℹ️ 使用者關閉了登入視窗')
    } else if (error.code === 'auth/popup-blocked') {
      console.error('⚠️ 彈出視窗被瀏覽器阻擋，請允許彈出視窗')
    }
    
    throw error
  }
}

export const signOut = async () => {
  try {
    console.log('🔄 Firebase signOut 被呼叫')
    if (!auth) {
      console.error('⚠️ Firebase Auth 未初始化')
      throw new Error('Firebase Auth 未初始化。請檢查 Firebase 配置。')
    }
    console.log('🔄 執行 firebaseSignOut...')
    await firebaseSignOut(auth)
    console.log('✅ Firebase 登出成功')
  } catch (error) {
    console.error('❌ Firebase 登出失敗:', error)
    console.error('錯誤代碼:', error.code)
    console.error('錯誤訊息:', error.message)
    throw error
  }
}

export const onAuthChange = (callback) => {
  if (!auth) {
    console.warn('⚠️ Firebase Auth 未初始化')
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}

// Firestore 資料操作
export const saveUserData = async (userId, data) => {
  try {
    if (!db || !userId) {
      throw new Error('Firestore 未初始化或使用者 ID 無效')
    }
    const userDocRef = doc(db, 'users', userId)
    await setDoc(userDocRef, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true })
    console.log('✅ 資料已儲存到 Firebase')
  } catch (error) {
    console.error('❌ 儲存資料失敗:', error)
    throw error
  }
}

export const getUserData = async (userId) => {
  try {
    if (!db || !userId) {
      throw new Error('Firestore 未初始化或使用者 ID 無效')
    }
    const userDocRef = doc(db, 'users', userId)
    const docSnap = await getDoc(userDocRef)
    
    if (docSnap.exists()) {
      console.log('✅ 從 Firebase 載入資料')
      return docSnap.data()
    } else {
      console.log('ℹ️ 使用者資料不存在')
      return null
    }
  } catch (error) {
    console.error('❌ 讀取資料失敗:', error)
    throw error
  }
}

export const onUserDataChange = (userId, callback) => {
  try {
    if (!db || !userId) {
      console.warn('⚠️ Firestore 未初始化或使用者 ID 無效')
      return null
    }
    const userDocRef = doc(db, 'users', userId)
    return onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        console.log('🔄 資料已更新')
        callback(doc.data())
      }
    }, (error) => {
      console.error('❌ 監聽資料失敗:', error)
    })
  } catch (error) {
    console.error('❌ 設定監聽失敗:', error)
    throw error
  }
}

// 檢查 Firebase 是否已正確配置
export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY"
}

// 專門用於保存行程資料的函數
export const saveItineraryData = async (userId, itinerary, dayTitles) => {
  try {
    if (!db || !userId) {
      console.warn('⚠️ Firebase 未初始化或使用者未登入')
      return false
    }
    const userDocRef = doc(db, 'users', userId)
    await setDoc(userDocRef, {
      itinerary: itinerary || [],
      dayTitles: dayTitles || {},
      updatedAt: new Date().toISOString()
    }, { merge: true })
    console.log('✅ 行程資料已儲存到 Firebase')
    return true
  } catch (error) {
    console.error('❌ 儲存行程資料失敗:', error)
    throw error
  }
}

// 從 Firebase 載入行程資料
export const loadItineraryData = async (userId) => {
  try {
    if (!db || !userId) {
      console.warn('⚠️ Firebase 未初始化或使用者未登入')
      return null
    }
    const userDocRef = doc(db, 'users', userId)
    const docSnap = await getDoc(userDocRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      console.log('✅ 從 Firebase 載入行程資料')
      return {
        itinerary: data.itinerary || [],
        dayTitles: data.dayTitles || {}
      }
    } else {
      console.log('ℹ️ 使用者行程資料不存在')
      return null
    }
  } catch (error) {
    console.error('❌ 讀取行程資料失敗:', error)
    throw error
  }
}

// 監聽行程資料的即時更新
export const onItineraryDataChange = (userId, callback) => {
  try {
    if (!db || !userId) {
      console.warn('⚠️ Firebase 未初始化或使用者未登入')
      return null
    }
    const userDocRef = doc(db, 'users', userId)
    return onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data()
        console.log('🔄 行程資料已更新')
        callback({
          itinerary: data.itinerary || [],
          dayTitles: data.dayTitles || {}
        })
      }
    }, (error) => {
      console.error('❌ 監聽行程資料失敗:', error)
    })
  } catch (error) {
    console.error('❌ 設定監聽失敗:', error)
    throw error
  }
}
