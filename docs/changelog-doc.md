# Değişiklik Geçmişi

## [Unreleased] - Geliştirme Aşamasında

### Eklenenler
- Temel proje yapısı oluşturuldu
- Frontend React + TypeScript altyapısı kuruldu
- Backend Express + TypeScript altyapısı kuruldu
- MSSQL veritabanı bağlantısı yapılandırıldı

### Değişenler
- -

### Düzeltilenler
- -

## [0.1.0] - 2025-01-09

### Başlangıç Özellikleri
- Müşteri yönetimi modülü
  - Müşteri ekleme/düzenleme/silme
  - Müşteri listesi görüntüleme
  - Müşteri detay sayfası

- Stok yönetimi modülü
  - Excel ile toplu stok güncelleme
  - Stok listesi görüntüleme
  - Son kullanma tarihi takibi

- Teklif sistemi
  - Teklif oluşturma
  - PDF çıktı alma
  - Teklif listesi görüntüleme

- Hatırlatma sistemi
  - Hatırlatma oluşturma
  - Takvim görünümü
  - Bildirim sistemi

### Teknik Detaylar
- Frontend: React 18 + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Veritabanı: MSSQL (somee.com)
- UI: TailwindCSS + Headless UI

## Versiyonlama Kuralları

Semantic Versioning (SemVer) kullanıyoruz:
- MAJOR version - uyumsuz API değişiklikleri için
- MINOR version - geriye dönük uyumlu fonksiyonellik eklemeleri için
- PATCH version - geriye dönük uyumlu hata düzeltmeleri için

## Planlanan Özellikler

### Yakın Dönem (1-2 Ay)
- [ ] Toplu e-posta gönderim sistemi
- [ ] Dashboard ve raporlama
- [ ] Gelişmiş arama filtreleri
- [ ] Excel export özelliği

### Orta Dönem (2-4 Ay)
- [ ] Çoklu dil desteği
- [ ] Gelişmiş raporlama sistemi
- [ ] Mobil uyumlu tasarım
- [ ] API dokümantasyonu

### Uzun Dönem (4+ Ay)
- [ ] Multi-tenant yapı
- [ ] API entegrasyonları
- [ ] Gelişmiş analitik
- [ ] Mobile app
