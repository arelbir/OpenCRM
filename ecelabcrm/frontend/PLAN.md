# Frontend Geliştirme Planı

## 1. Teknoloji Stack'i
- **Framework**: React + TypeScript
- **State Yönetimi**: Redux Toolkit
- **Stil**: TailwindCSS
- **Form Yönetimi**: React Hook Form + Yup
- **Tarih İşlemleri**: date-fns
- **Tablo Yönetimi**: TanStack Table
- **Grafik**: Recharts
- **HTTP İstekleri**: Axios
- **Test**: Jest + React Testing Library

## 2. Klasör Yapısı
```
src/
├── assets/         # Resimler, ikonlar, fontlar
├── components/     # Paylaşılan bileşenler
│   ├── common/     # Genel bileşenler (Button, Input, vs.)
│   ├── layout/     # Layout bileşenleri
│   └── features/   # Özellik bazlı bileşenler
├── hooks/          # Custom hooks
├── lib/           # Üçüncü parti kütüphane konfigürasyonları
├── pages/         # Sayfa bileşenleri
├── routes/        # Routing konfigürasyonu
├── services/      # API servisleri
├── store/         # Redux store ve slice'lar
├── types/         # TypeScript tipleri
└── utils/         # Yardımcı fonksiyonlar
```

## 3. Geliştirme Fazları

### Faz 1: Temel Altyapı (Mevcut)
- [x] Proje kurulumu
- [x] Temel paketlerin yüklenmesi
- [x] Klasör yapısının oluşturulması
- [x] API servislerinin güncellenmesi
- [x] Tip tanımlarının güncellenmesi

### Faz 2: Temel Bileşenler
- [ ] Layout bileşenleri
  - [ ] Navbar
  - [ ] Sidebar
  - [ ] Footer
  - [ ] PageContainer
- [ ] Ortak bileşenler
  - [ ] Button
  - [ ] Input
  - [ ] Select
  - [ ] Table
  - [ ] Modal
  - [ ] Form
  - [ ] Card
  - [ ] Alert
  - [ ] Loading
  - [ ] ErrorBoundary

### Faz 3: Özellik Sayfaları
- [ ] Dashboard
  - [ ] İstatistikler
  - [ ] Grafikler
  - [ ] Son aktiviteler
- [ ] Müşteri Yönetimi
  - [ ] Müşteri listesi
  - [ ] Müşteri detay
  - [ ] Müşteri ekleme/düzenleme formu
- [ ] Ürün Yönetimi
  - [ ] Ürün listesi
  - [ ] Ürün detay
  - [ ] Ürün ekleme/düzenleme formu
  - [ ] Stok takibi
  - [ ] Excel import/export
- [ ] Teklif Yönetimi
  - [ ] Teklif listesi
  - [ ] Teklif detay
  - [ ] Teklif oluşturma/düzenleme formu
  - [ ] PDF export
  - [ ] E-posta gönderimi
- [ ] Hatırlatıcı Yönetimi
  - [ ] Hatırlatıcı listesi
  - [ ] Hatırlatıcı detay
  - [ ] Hatırlatıcı ekleme/düzenleme formu
  - [ ] Takvim görünümü

### Faz 4: İyileştirmeler
- [ ] Hata yakalama ve işleme
- [ ] Loading durumları
- [ ] Form validasyonları
- [ ] Responsive tasarım
- [ ] Performans optimizasyonları
- [ ] Test yazımı
- [ ] Dokümantasyon

## 4. Öncelikli Görevler (Güncel)

1. **Layout Bileşenleri**
   - Responsive Navbar tasarımı
   - Dinamik Sidebar menüsü
   - Temel sayfa container'ı

2. **Ortak Bileşenler**
   - Button çeşitleri (primary, secondary, danger)
   - Form elemanları (input, select, checkbox)
   - Tablo bileşeni (sıralama, filtreleme, sayfalama)
   - Modal ve Dialog bileşenleri

3. **Müşteri Sayfası**
   - Liste görünümü
   - Detay sayfası
   - Ekleme/düzenleme formu

## 5. Stil Rehberi

### Renkler
```css
--primary: #2563eb;    /* Mavi */
--secondary: #475569;  /* Gri */
--success: #16a34a;    /* Yeşil */
--danger: #dc2626;     /* Kırmızı */
--warning: #f59e0b;    /* Turuncu */
--info: #0891b2;       /* Açık Mavi */
```

### Tipografi
- Font: Inter
- Başlıklar: 24px, 20px, 18px
- Ana metin: 16px
- Küçük metin: 14px

### Boşluklar
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)

## 6. Performans Hedefleri
- İlk yükleme: < 2 saniye
- Sayfa geçişleri: < 300ms
- API yanıtları: < 500ms
- Lighthouse skorları: > 90

## 7. Test Stratejisi
- Birim testler: Bileşenler ve hooks
- Entegrasyon testler: Sayfa akışları
- E2E testler: Kritik kullanıcı yolları
- Test coverage hedefi: > %80

## 8. Güvenlik Kontrolleri
- XSS koruması
- CSRF koruması
- Input validasyonu
- API güvenliği
- Oturum yönetimi

## 9. Deployment
- Build optimizasyonu
- Environment değişkenleri
- CI/CD pipeline
- Monitoring ve logging

## 10. Dokümantasyon
- Bileşen kullanım kılavuzu
- API entegrasyon rehberi
- Stil rehberi
- Test dokümantasyonu
