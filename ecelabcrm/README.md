# Ecelab CRM Projesi

## Proje Hakkında
Ecelab CRM, müşteri ilişkileri yönetimi için geliştirilmiş bir web uygulamasıdır. Müşteri takibi, ürün yönetimi, teklif oluşturma ve hatırlatma sistemi gibi temel CRM özelliklerini içerir.

## Teknolojiler

### Backend
- Node.js
- Express.js
- TypeScript
- MS SQL Server
- JWT Authentication
- Multer (Dosya yükleme)
- xlsx (Excel işleme)

### Frontend
- React
- TypeScript
- TailwindCSS
- React Router
- React Hook Form
- Axios
- HeadlessUI
- HeroIcons
- date-fns

## Proje Yapısı

### Backend (/backend)
- **/src**
  - **/config**: Veritabanı ve diğer yapılandırmalar
  - **/models**: Veritabanı model tanımlamaları
  - **/services**: İş mantığı katmanı
  - **/routes**: API endpoint'leri
  - **/types**: TypeScript tip tanımlamaları
  - **/uploads**: Yüklenen dosyaların saklandığı klasör

### Frontend (/frontend)
- **/src**
  - **/components**
    - **/shared**: Ortak komponentler (Button, Input, Table, vb.)
    - **/customers**: Müşteri yönetimi komponentleri
    - **/products**: Ürün yönetimi komponentleri
    - **/quotations**: Teklif yönetimi komponentleri
    - **/reminders**: Hatırlatma yönetimi komponentleri
  - **/services**: API servis katmanı
  - **/types**: TypeScript tip tanımlamaları

## Tamamlanan Özellikler

### Backend
- [x] Veritabanı şeması oluşturuldu
- [x] Model tanımlamaları yapıldı
- [x] Servis katmanı implementasyonu tamamlandı
- [x] API endpoint'leri oluşturuldu
- [x] TypeScript entegrasyonu yapıldı
- [x] Error handling mekanizması kuruldu
- [x] Excel şablon oluşturma ve indirme
- [x] Excel'den ürün import etme
- [x] Dosya yükleme sistemi

### Frontend
- [x] Proje yapısı oluşturuldu
- [x] Temel bağımlılıklar yüklendi
- [x] Tip tanımlamaları yapıldı
- [x] API servis katmanı oluşturuldu
- [x] Ortak komponentler geliştirildi
  - [x] Button
  - [x] Input
  - [x] Select
  - [x] Table
  - [x] Modal
  - [x] Card
  - [x] Badge
- [x] Modül komponentleri geliştirildi
  - [x] Customer (Müşteri) komponentleri
  - [x] Product (Ürün) komponentleri
  - [x] Quotation (Teklif) komponentleri
  - [x] Reminder (Hatırlatma) komponentleri
- [x] Sayfa yapısı ve routing
- [x] Dark mode desteği
- [x] API entegrasyonu
- [x] Excel şablon indirme
- [x] Excel'den ürün yükleme
- [x] Hata yönetimi ve bildirimler

## Yapılacaklar

### Frontend
1. [ ] State yönetiminin yapılandırılması
   - [ ] Global state yönetimi
   - [ ] Authentication state
   - [ ] Loading state
   - [ ] Error handling

2. [ ] Tema ve stil düzenlemeleri
   - [ ] Renk paleti
   - [ ] Tipografi
   - [ ] Responsive tasarım kontrolleri
   - [ ] Dark mode desteği

3. [ ] Optimizasyonlar
   - [ ] Code splitting
   - [ ] Lazy loading
   - [ ] Performance optimizasyonları

## Kurulum

```bash
# Backend kurulumu
cd backend
npm install
npm run dev

# Frontend kurulumu
cd frontend
npm install
npm run dev
```

## API Dokümantasyonu
API endpoint'leri ve kullanımları için Postman koleksiyonunu inceleyebilirsiniz:
`/docs/postman/EcelabCRM.postman_collection.json`
