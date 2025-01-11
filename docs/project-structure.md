# Proje Yapısı ve Dosya Organizasyonu

## Frontend Yapısı
```
frontend/
├── src/
│   ├── components/           # React bileşenleri
│   │   ├── common/          # Ortak bileşenler
│   │   ├── customers/       # Müşteri ile ilgili bileşenler
│   │   ├── stock/          # Stok ile ilgili bileşenler
│   │   └── quotations/     # Teklif ile ilgili bileşenler
│   ├── services/           # API çağrıları
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Yardımcı fonksiyonlar
│   ├── types/              # TypeScript type tanımlamaları
│   ├── styles/             # CSS/SCSS dosyaları
│   └── pages/              # Sayfa bileşenleri
└── public/                 # Statik dosyalar
```

## Backend Yapısı
```
backend/
├── src/
│   ├── controllers/        # Route handler'lar
│   ├── services/          # İş mantığı
│   ├── models/            # Veritabanı modelleri
│   ├── routes/            # API route'ları
│   ├── config/            # Konfigürasyon dosyaları
│   └── utils/             # Yardımcı fonksiyonlar
├── tests/                 # Test dosyaları
└── scripts/               # Yardımcı scriptler
```

## Önemli Dosyalar

### Frontend
- `vite.config.ts`: Vite konfigürasyonu
- `tailwind.config.js`: Tailwind ayarları
- `tsconfig.json`: TypeScript konfigürasyonu
- `.env`: Ortam değişkenleri

### Backend
- `package.json`: Bağımlılıklar ve scriptler
- `tsconfig.json`: TypeScript konfigürasyonu
- `.env`: Ortam değişkenleri

## Klasör Detayları

### Frontend Bileşenleri
- `common/`: Button, Input, Modal gibi ortak bileşenler
- `customers/`: Müşteri listesi, müşteri formu gibi bileşenler
- `stock/`: Stok listesi, Excel upload gibi bileşenler
- `quotations/`: Teklif formu, teklif listesi gibi bileşenler

### Backend Servisleri
- `customerService`: Müşteri işlemleri
- `stockService`: Stok yönetimi
- `quotationService`: Teklif işlemleri
- `reminderService`: Hatırlatma işlemleri

### Veritabanı Modelleri
- `Customer`: Müşteri modeli
- `Product`: Ürün modeli
- `Quotation`: Teklif modeli
- `Reminder`: Hatırlatma modeli
