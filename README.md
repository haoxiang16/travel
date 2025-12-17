Travel PWA

一個使用 Vue 3 + Vite + Firebase 構建的旅遊行程規劃 PWA 應用。

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-12.x-FFCA28?logo=firebase)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8)

## ✨ 功能特色

- 📍 **Google Maps 整合** - 搜尋真實地點資料
- 📱 **PWA 支援** - 可安裝到手機桌面，離線可用
- ☁️ **Firebase 同步** - 跨裝置雲端同步行程資料
- 🔐 **多種登入方式** - Google 登入或訪客模式
- 📤 **匯入/匯出** - JSON 格式備份行程

## 🚀 快速開始

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

訪問 http://localhost:3000

### 建置生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## ⚙️ 環境設定

### Google Maps API Key

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立專案並啟用以下 API：
   - Maps JavaScript API
   - Places API
3. 建立 API Key
4. 在應用設定頁面輸入 API Key

### Firebase 設定

Firebase 設定已內建於專案中。如需使用自己的 Firebase 專案：

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 建立新專案
3. 啟用 Authentication（匿名登入 + Google 登入）
4. 建立 Firestore Database
5. 更新 `src/firebase.js` 中的設定

## 📁 專案結構

```
src/
├── App.vue                    # 主應用組件
├── main.js                    # 應用入口
├── firebase.js                # Firebase 設定與函數
├── style.css                  # 全域樣式
└── components/
    ├── AppHeader.vue          # 頂部導航欄
    ├── MapView.vue            # 地圖視圖
    ├── ListView.vue           # 搜尋結果列表
    ├── ItineraryView.vue      # 行程列表
    ├── SettingsView.vue       # 設定頁面
    ├── BottomNav.vue          # 底部導航
    ├── LoginModal.vue         # 登入彈窗
    ├── ManualInputModal.vue   # 新增行程彈窗
    ├── DayTitleModal.vue      # 日期主題編輯
    ├── PlaceDetailModal.vue   # 地點詳情
    ├── UserMenu.vue           # 用戶選單
    └── ToastNotification.vue  # 消息提示
```

## 🔧 GitHub Actions 自動部署

專案已配置 GitHub Actions，推送到 `main` 分支時會自動部署到 GitHub Pages。

### 設定步驟

1. **啟用 GitHub Pages**
   - 前往 Repository → Settings → Pages
   - Source 選擇 "GitHub Actions"

2. **推送程式碼**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **查看部署狀態**
   - 前往 Repository → Actions
   - 等待 workflow 完成

4. **訪問應用**
   - 部署完成後訪問：`https://<username>.github.io/travel/`

## 📝 注意事項

- 確保 `vite.config.js` 中的 `base` 設定與您的 repository 名稱一致
- 如果 repository 名稱不是 `travel`，請更新 base 設定

## 🛠️ 技術棧

- **前端框架**: Vue 3 (Composition API)
- **建置工具**: Vite 5
- **樣式**: Tailwind CSS (CDN)
- **圖標**: Font Awesome 6
- **後端服務**: Firebase (Auth + Firestore)
- **地圖服務**: Google Maps JavaScript API + Places API
- **PWA**: vite-plugin-pwa + Workbox

## 📄 License

MIT License
