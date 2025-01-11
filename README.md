# EceLab CRM

EceLab CRM, müşteri ilişkileri yönetimi için geliştirilmiş modern bir web uygulamasıdır.

## Özellikler

- 👥 Müşteri Yönetimi
- 📦 Ürün Yönetimi
- 💰 Teklif Yönetimi
- 📅 Hatırlatıcılar
- 📊 Stok Takibi
- 📈 Fiyat Geçmişi
- 📑 Excel Import/Export

## Teknolojiler

### Backend
- Node.js
- Express.js
- TypeScript
- Sequelize ORM
- SQL Server

### Frontend
- React
- TypeScript
- Vite
- TailwindCSS
- React Query
- React Hook Form

## Kurulum

### Gereksinimler
- Node.js (v18 veya üzeri)
- SQL Server
- npm veya yarn

### Backend Kurulumu

```bash
cd backend
npm install
npm run build
npm start
```

### Frontend Kurulumu

```bash
cd frontend
npm install
npm run dev
```

### Veritabanı Kurulumu

1. SQL Server'da yeni bir veritabanı oluşturun
2. backend/.env dosyasını oluşturun ve veritabanı bilgilerini girin:

```env
DB_HOST=localhost
DB_NAME=ecelabcrm
DB_USER=your_username
DB_PASS=your_password
PORT=3000
```

## Kullanım

1. Frontend: http://localhost:5173
2. Backend API: http://localhost:3000

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
