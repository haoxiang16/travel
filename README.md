# 旅遊行程規劃 PWA

使用 Vue 3 和 Google Maps API 打造的旅遊行程規劃應用，支援 PWA 功能。

## 功能特色

✨ **現代化 Vue 3 架構**
- 使用 Composition API
- Pinia 狀態管理
- Vue Router 路由管理

🗺️ **Google Maps 整合**
- 互動式地圖顯示
- 地點搜尋功能
- 自動標記景點位置
- 資訊視窗顯示

📱 **PWA 支援**
- 可安裝到桌面/主畫面
- 離線快取支援
- Service Worker 自動更新

💾 **本地儲存**
- 使用 LocalStorage 儲存行程資料
- 無需後端伺服器
- 資料保存在本地裝置

🎨 **美觀的使用者介面**
- 響應式設計
- 行動裝置優化
- 現代化 UI/UX

## 安裝步驟

### 1. 安裝相依套件

```bash
npm install
```

### 2. 設定 Google Maps API Key

1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 建立新專案或選擇現有專案
3. 啟用以下 API：
   - Maps JavaScript API
   - Places API
4. 建立 API 金鑰
5. 在專案根目錄建立 `.env` 檔案：

```bash
VITE_GOOGLE_MAPS_API_KEY=你的_API_金鑰
```

### 3. 啟動開發伺服器

```bash
npm run dev
```

應用程式將在 `http://localhost:3000` 啟動

### 4. 建置生產版本

```bash
npm run build
```

建置完成的檔案將在 `dist` 目錄中

### 5. 預覽生產版本

```bash
npm run preview
```

## 使用說明

### 建立新行程

1. 點擊「新增行程」
2. 輸入行程名稱、日期範圍和描述
3. 點擊「建立行程」

### 新增景點

1. 進入行程詳細頁面
2. 使用地圖上方的搜尋框搜尋地點
3. 選擇地點後會自動填入名稱和地址
4. 可以新增備註說明
5. 點擊「新增景點」

### 檢視地圖

- 地圖會自動顯示所有景點的標記
- 點擊標記可以檢視景點資訊
- 地圖會自動調整視角以顯示所有景點

### 管理行程

- 在行程列表可以檢視所有行程
- 點擊行程卡片進入詳細頁面
- 使用「編輯」按鈕修改行程資訊
- 使用「刪除」按鈕移除行程

## 技術架構

### 核心技術

- **Vue 3** - 前端框架
- **Vite** - 建置工具
- **Pinia** - 狀態管理
- **Vue Router** - 路由管理
- **Google Maps API** - 地圖服務
- **Vite PWA Plugin** - PWA 支援

### 專案結構

```
├── public/              # 靜態資源
├── src/
│   ├── components/      # Vue 組件
│   │   └── GoogleMap.vue
│   ├── stores/          # Pinia stores
│   │   ├── mapStore.js
│   │   └── tripStore.js
│   ├── views/           # 頁面組件
│   │   ├── TripList.vue
│   │   ├── TripNew.vue
│   │   └── TripDetail.vue
│   ├── router/          # 路由配置
│   │   └── index.js
│   ├── App.vue          # 根組件
│   ├── main.js          # 應用程式入口
│   └── style.css        # 全域樣式
├── index.html
├── vite.config.js       # Vite 配置
└── package.json
```

## PWA 功能

### 安裝應用程式

在支援的瀏覽器中，可以將此應用程式安裝到：
- 桌面裝置（Windows、macOS、Linux）
- 行動裝置（iOS、Android）

### 離線支援

應用程式會快取必要的資源，即使在離線狀態下也能：
- 瀏覽已儲存的行程
- 檢視景點列表
- 使用基本功能

註：地圖功能需要網路連線

## 瀏覽器支援

- Chrome / Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Chrome for Android

## 開發說明

### 新增功能

1. 在 `src/components/` 新增組件
2. 在 `src/views/` 新增頁面
3. 在 `src/router/index.js` 新增路由
4. 在 `src/stores/` 新增狀態管理

### 樣式自訂

全域樣式變數定義在 `src/style.css` 中：

```css
:root {
  --primary-color: #4285f4;
  --secondary-color: #34a853;
  --danger-color: #ea4335;
  --warning-color: #fbbc04;
  /* ... 更多變數 */
}
```

## 注意事項

1. **API 金鑰安全**：不要將 API 金鑰提交到公開的版本控制系統
2. **API 配額**：注意 Google Maps API 的使用配額和計費
3. **資料備份**：本地儲存的資料在清除瀏覽器快取時會遺失，建議定期匯出備份
4. **HTTPS 需求**：PWA 功能需要在 HTTPS 環境下運作（開發環境的 localhost 除外）

## 未來改進

- [ ] 匯出/匯入行程資料功能
- [ ] 行程分享功能
- [ ] 景點排序和拖曳功能
- [ ] 路線規劃和導航
- [ ] 照片上傳功能
- [ ] 多語言支援
- [ ] 雲端同步功能

## 授權

MIT License

## 作者

建立於 2025

