# Kurulum Rehberi

## Gereksinimler
- Node.js (v18+)
- Git
- npm veya yarn
- VS Code (önerilen)

## Başlangıç

### 1. Repository'yi Oluşturma
```bash
# Yeni bir klasör oluştur
mkdir ecelabcrm
cd ecelabcrm

# Git repository'si başlat
git init

# İlk commit
git add .
git commit -m "Initial commit"
```

### 2. Frontend Kurulumu
```bash
# Vite ile yeni proje oluştur
npm create vite@latest frontend -- --template react-ts
cd frontend

# Bağımlılıkları yükle
npm install

# UI kütüphaneleri
npm install @headlessui/react @tailwindcss/forms
npm install -D tailwindcss postcss autoprefixer

# Veri yönetimi
npm install @tanstack/react-query axios

# Form ve validasyon
npm install react-hook-form

# Excel ve PDF
npm install xlsx react-pdf

# Utility
npm install date-fns lodash

# Tailwind kurulumu
npx tailwindcss init -p
```

### 3. Backend Kurulumu
```bash
# Backend klasörü oluştur
mkdir backend
cd backend

# Package.json oluştur
npm init -y

# Temel bağımlılıklar
npm install express cors mssql dotenv
npm install -D typescript ts-node @types/node @types/express nodemon

# TypeScript konfigürasyonu
npx tsc --init
```

### 4. Ortam Değişkenleri

Frontend `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

Backend `.env`:
```env
PORT=3000
DB_CONNECTION_STRING=Server=ECELABCRM.mssql.somee.com;Database=ECELABCRM;User Id=arelbebek_SQLLogin_1;Password=73i5tzc1hv;TrustServerCertificate=True;
```

### 5. Veritabanı Bağlantısı

```typescript
// backend/src/config/database.ts
import sql from 'mssql';

const config = {
    server: 'ECELABCRM.mssql.somee.com',
    database: 'ECELABCRM',
    user: 'arelbebek_SQLLogin_1',
    password: '73i5tzc1hv',
    options: {
        trustServerCertificate: true
    }
};

export async function connectDB() {
    try {
        await sql.connect(config);
        console.log('Veritabanı bağlantısı başarılı');
    } catch (err) {
        console.error('Veritabanı bağlantı hatası:', err);
        process.exit(1);
    }
}
```

### 6. Scripts

Frontend `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint src --ext ts,tsx",
    "preview": "vite preview"
  }
}
```

Backend `package.json`:
```json
{
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

### 7. Geliştirme Ortamını Başlatma

```bash
# Frontend'i başlat
cd frontend
npm run dev

# Yeni bir terminal aç
cd backend
npm run dev
```

## VS Code Eklentileri
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- GitLens

## Git İgnore Dosyası
```gitignore
# Dependencies
node_modules/
.pnp/
.pnp.js

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build
dist/
build/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```
