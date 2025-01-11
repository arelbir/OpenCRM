# Changelog

## [0.2.0] - 2025-01-11

### Eklenen
- Excel şablon indirme özelliği
  - Ürün şablonunu indirme butonu
  - Excel formatında şablon dosyası
- Excel'den ürün yükleme özelliği
  - Excel dosyası yükleme modal'ı
  - Dosya seçme ve yükleme işlemleri
  - Başarılı/hatalı durum bildirimleri
- Backend Excel servisi
  - Şablon oluşturma ve indirme endpoint'i
  - Excel dosyası okuma ve işleme
  - Ürün verilerini veritabanına kaydetme
- Frontend geliştirmeleri
  - Excel işlemleri için API entegrasyonu
  - Ortak api.ts modülü kullanımı
  - Hata yönetimi ve bildirimler
  - Dark mode desteği

### Değişiklikler
- productService.ts modülü yeniden düzenlendi
- API endpoint'leri standardize edildi
- Blob işleme mantığı iyileştirildi
- Hata mesajları daha açıklayıcı hale getirildi

### Düzeltmeler
- Excel şablon indirme hatası giderildi
- API URL yapılandırması düzeltildi
- FormData işleme sorunları çözüldü
- Badge bileşeni dark mode desteği eklendi

## [0.1.0] - 2025-01-10

### Eklenen
- İlk sürüm
- Temel CRUD işlemleri
- Kullanıcı arayüzü bileşenleri
