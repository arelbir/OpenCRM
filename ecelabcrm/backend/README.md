# Ecelab CRM Backend API Dokümantasyonu

## Genel Bakış

Bu proje, Ecelab CRM sisteminin backend API'sini içerir. Node.js, Express, TypeScript ve SQL Server kullanılarak geliştirilmiştir.

## Teknolojiler

- Node.js
- TypeScript
- Express.js
- Sequelize ORM
- SQL Server
- XLSX (Excel işlemleri için)
- Multer (Dosya yüklemeleri için)

## Kurulum

1. Gerekli paketleri yükleyin:
```bash
npm install
```

2. `.env` dosyasını oluşturun:
```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=ECELABCRM
PORT=3000
```

3. Uygulamayı başlatın:
```bash
npm run dev
```

## API Endpoints

### Müşteriler (Customers)

#### GET /api/customers
- Tüm müşterileri listeler
- Filtre parametreleri:
  - search: Müşteri adı veya firma adına göre arama
  - isActive: Aktif/pasif müşterileri filtreleme

#### POST /api/customers
- Yeni müşteri ekler
- Gerekli alanlar:
  - CompanyName: string
  - ContactName: string
  - Email: string
  - Phone: string

#### PUT /api/customers/:id
- Müşteri bilgilerini günceller
- İsteğe bağlı alanlar:
  - CompanyName: string
  - ContactName: string
  - Email: string
  - Phone: string

#### DELETE /api/customers/:id
- Müşteriyi pasife alır (soft delete)

### Ürünler (Products)

#### GET /api/products
- Tüm ürünleri listeler
- Filtre parametreleri:
  - search: Ürün adı veya markaya göre arama
  - isActive: Aktif/pasif ürünleri filtreleme

#### POST /api/products
- Yeni ürün ekler
- Gerekli alanlar:
  - Brand: string
  - Code: string
  - Description: string
  - Price: number
  - Stock: number
  - MinimumStock: number

#### PUT /api/products/:id
- Ürün bilgilerini günceller

#### DELETE /api/products/:id
- Ürünü pasife alır (soft delete)

#### GET /api/products/template
- Ürün import şablonunu indirir

#### POST /api/products/import
- Excel/CSV dosyasından ürün import eder
- Dosya formatı:
  - Brand: Marka (zorunlu)
  - Code: Ürün kodu (zorunlu)
  - Description: Açıklama
  - Price: Fiyat (zorunlu)
  - Stock: Stok miktarı
  - MinimumStock: Minimum stok seviyesi

### Teklifler (Quotations)

#### GET /api/quotations
- Tüm teklifleri listeler
- Filtre parametreleri:
  - customerId: Müşteriye göre filtreleme
  - status: Duruma göre filtreleme
  - startDate: Başlangıç tarihi
  - endDate: Bitiş tarihi

#### POST /api/quotations
- Yeni teklif oluşturur
- Gerekli alanlar:
  - CustomerID: number
  - QuotationDate: Date
  - ValidUntil: Date
  - Status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected'
  - Details: Array of {
    - ProductID: number
    - Quantity: number
    - UnitPrice: number
    - Discount?: number
  }

#### PUT /api/quotations/:id
- Teklif bilgilerini günceller
- Status değerleri:
  - Draft: Taslak
  - Sent: Gönderildi
  - Accepted: Kabul edildi
  - Rejected: Reddedildi

#### DELETE /api/quotations/:id
- Teklifi pasife alır (soft delete)

### Hatırlatıcılar (Reminders)

#### GET /api/reminders
- Tüm hatırlatıcıları listeler
- Filtre parametreleri:
  - status: Duruma göre filtreleme
  - priority: Önceliğe göre filtreleme
  - dueDate: Vade tarihine göre filtreleme

#### POST /api/reminders
- Yeni hatırlatıcı ekler
- Gerekli alanlar:
  - Title: string
  - Description?: string
  - DueDate: Date
  - Status: 'Pending' | 'Completed' | 'Cancelled'
  - Priority: 'Low' | 'Medium' | 'High'
  - CustomerID: number
  - ProductID?: number

#### PUT /api/reminders/:id
- Hatırlatıcı bilgilerini günceller
- Status değerleri:
  - Pending: Beklemede
  - Completed: Tamamlandı
  - Cancelled: İptal edildi

#### DELETE /api/reminders/:id
- Hatırlatıcıyı pasife alır (soft delete)

## Veri Modelleri

### Customer (Müşteri)
```typescript
{
  CustomerID: number;
  CompanyName: string;
  ContactName: string;
  Email: string;
  Phone: string;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}
```

### Product (Ürün)
```typescript
{
  ProductID: number;
  Brand: string;
  Code: string;
  Description: string;
  Stock: number;
  Price: number;
  ExpiryDate?: Date;
  MinimumStock: number;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}
```

### Quotation (Teklif)
```typescript
{
  QuotationID: number;
  QuotationNumber: string;
  CustomerID: number;
  QuotationDate: Date;
  ValidUntil: Date;
  TotalAmount: number;
  Status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
  Notes?: string;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
  Details: QuotationDetail[];
}
```

### Reminder (Hatırlatıcı)
```typescript
{
  ReminderID: number;
  CustomerID: number;
  ProductID?: number;
  Title: string;
  Description?: string;
  DueDate: Date;
  Status: 'Pending' | 'Completed' | 'Cancelled';
  Priority: 'Low' | 'Medium' | 'High';
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
}
```

## Hata Yönetimi

API, aşağıdaki HTTP durum kodlarını kullanır:

- 200: Başarılı
- 201: Oluşturuldu
- 400: Geçersiz istek
- 404: Bulunamadı
- 500: Sunucu hatası

Hata yanıtı formatı:
```json
{
  "error": {
    "message": "Hata mesajı",
    "details": "Varsa detaylı hata açıklaması"
  }
}
```

## Güvenlik

- Tüm API istekleri için gerekli validasyonlar yapılmaktadır
- SQL injection ve XSS saldırılarına karşı koruma mevcuttur
- Hassas veriler için veri maskeleme uygulanmaktadır

## Test

Test senaryolarını çalıştırmak için:
```bash
npm test
```

## Lisans

Bu proje özel lisans altında dağıtılmaktadır. Tüm hakları saklıdır.
