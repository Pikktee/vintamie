# Vintamie - AI-Powered Listing Automation

Vintamie automates listing items on Second-Hand platforms (Vinted and Kleinanzeigen) by capturing photos, generating titles, descriptions, categories, and prices using Vision AI, and autofilling listing forms via a WebExtension or a native Android WebView Shell.

## Project Structure
```
/Users/henrik/Dev/vintamie/
├── backend/          # FastAPI server, SQLite DB, Gemini Vision Service
├── frontend/         # Vite + React PWA (fully responsive, glassmorphic dark design)
├── extension/        # manifest.json V3 WebExtension (Chrome / Firefox Android)
└── android/          # Native Android WebView Shell (ready for Android Studio)
```

---

## Developer Guides & Commands

### 1. Backend (FastAPI)
- **Framework:** FastAPI
- **Database:** SQLite (SQLAlchemy)
- **AI SDK:** `google-generativeai` (Gemini 1.5 Flash / 2.5 Flash)
- **Location:** `/Users/henrik/Dev/vintamie/backend`
- **Virtual Env:** `.venv/` (managed by `uv`)
- **Key Commands:**
  - Start Server: `uvicorn main:app --reload --host 0.0.0.0 --port 8000` (or `.venv/bin/uvicorn main:app --reload --host 0.0.0.0 --port 8000`)
  - Install dependencies: `uv pip install -r requirements.txt`
  - Database File: `vintamie.db` (auto-created on start)

### 2. Frontend (React + Vite)
- **Framework:** React + Vite
- **Styling:** Custom Vanilla CSS (Dark glassmorphism theme in `src/index.css`)
- **Location:** `/Users/henrik/Dev/vintamie/frontend`
- **Key Commands:**
  - Start Dev Server: `npm run dev` (Runs on `http://localhost:5173`)
  - Build App: `npm run build`
  - Preview Build: `npm run preview`
  - Install dependencies: `npm install`

### 3. WebExtension
- **Manifest Version:** V3
- **Supported Browsers:** Chrome, Edge, Brave (Desktop) and Firefox (Android / Desktop)
- **Location:** `/Users/henrik/Dev/vintamie/extension`
- **Target Pages:**
  - Vinted Listing: `*://*.vinted.de/items/new*` and `*://*.vinted.fr/items/new*`
  - Kleinanzeigen Listing: `*://*.kleinanzeigen.de/p-anzeige-aufgeben.html*`
- **Key Files:**
  - `manifest.json`: Defines extension metadata and matching rules.
  - `content.js`: Main DOM autofilling script + programmatic photo uploader (DataTransfer injection).

### 4. Android WebView Shell
- **Language:** Kotlin
- **Build Tool:** Gradle (compileSdk 34, minSdk 26)
- **Features:** JavascriptInterface bridge (`VintamieBridge`), custom Chrome Android User Agent, custom `WebChromeClient` to automatically upload draft photo through file inputs.
- **Location:** `/Users/henrik/Dev/vintamie/android`
- **Configuration:** Emulators route to host localhost via `http://10.0.2.2:5173` (Frontend) and `http://10.0.2.2:8000` (Backend). Uses FileProvider `com.vintamie.app.fileprovider` to share temporary cache image files.
