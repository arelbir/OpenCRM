# API Dokümantasyonu

## Genel Bilgiler

### Base URL
```
http://localhost:3000/api
```

### Response Format
```typescript
{
    success: boolean;
    data?: any;
    error?: string;
    message?: string;
}
```

## API Endpoints

### 1. Müşteri İşlemleri

#### Müşteri Listesi
```http
GET /customers

Query Parameters:
- search: string (optional)
- page: number (default: 1)
- limit: number (default: 10)
- country: string (optional)

Response:
{
    "success": true,
    "data": {
        "customers": [
            {
                "customerID": number,
                "customerCode": string,
                "companyName": string,
                "country": string,
                "contactName": string,
                "email": string,
                "phone": string
            }
        ],
        "total": number,
        "page": number,
        "limit": number
    }
}
```

#### Yeni Müşteri Ekleme
```http
POST /customers

Body:
{
    "customerCode": string,
    "companyName": string,
    "country": string,
    "contactName": string,
    "email": string,
    "phone": string,
    "notes": string
}

Response:
{
    "success": true,
    "data": {
        "customerID": number,
        "customerCode": string
    }
}
```

#### Müşteri Güncelleme
```http
PUT /customers/:id

Body:
{
    "companyName": string,
    "country": string,
    "contactName": string,
    "email": string,
    "phone": string,
    "notes": string
}

Response:
{
    "success": true,
    "message": "Müşteri başarıyla güncellendi"
}
```

### 2. Stok İşlemleri

#### Ürün Listesi
```http
GET /products

Query Parameters:
- search: string (optional)
- brand: string (optional)
- page: number (default: 1)
- limit: number (default: 10)

Response:
{
    "success": true,
    "data": {
        "products": [
            {
                "productID": number,
                "brand": string,
                "code": string,
                "description": string,
                "stock": number,
                "price": number,
                "expiryDate": string
            }
        ],
        "total": number
    }
}
```

#### Excel ile Stok Güncelleme
```http
POST /products/bulk-update

Content-Type: multipart/form-data
Body:
- file: Excel dosyası

Response:
{
    "success": true,
    "data": {
        "updatedCount": number,
        "errorCount": number,
        "errors": string[]
    }
}
```

### 3. Hatırlatma İşlemleri

#### Hatırlatma Listesi
```http
GET /reminders

Query Parameters:
- startDate: string (YYYY-MM-DD)
- endDate: string (YYYY-MM-DD)
- isCompleted: boolean (optional)
- customerID: number (optional)

Response:
{
    "success": true,
    "data": {
        "reminders": [
            {
                "reminderID": number,
                "title": string,
                "description": string,
                "dueDate": string,
                "isCompleted": boolean,
                "customerID": number,
                "customerName": string
            }
        ]
    }
}
```

#### Yeni Hatırlatma
```http
POST /reminders

Body:
{
    "customerID": number,
    "title": string,
    "description": string,
    "dueDate": string,
    "priority": number
}

Response:
{
    "success": true,
    "data": {
        "reminderID": number
    }
}
```

### 4. Teklif İşlemleri

#### Yeni Teklif Oluşturma
```http
POST /quotations

Body:
{
    "customerID": number,
    "validUntil": string,
    "notes": string,
    "items": [
        {
            "productID": number,
            "quantity": number,
            "unitPrice": number
        }
    ]
}

Response:
{
    "success": true,
    "data": {
        "quotationID": number,
        "quotationNumber": string,
        "totalAmount": number
    }
}
```

#### Teklif PDF'i
```http
GET /quotations/:id/pdf

Response:
- Content-Type: application/pdf
- Binary PDF dosyası
```

## Hata Kodları

```typescript
enum ErrorCodes {
    VALIDATION_ERROR = 400,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
    INTERNAL_ERROR = 500
}
```

## Örnek Kullanımlar

### JavaScript/TypeScript (Axios)
```typescript
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api'
});

// Müşteri listesi alma
const getCustomers = async () => {
    try {
        const response = await api.get('/customers', {
            params: {
                page: 1,
                limit: 10
            }
        });
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Yeni müşteri ekleme
const createCustomer = async (customerData) => {
    try {
        const response = await api.post('/customers', customerData);
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};
```

## Notlar

1. Tüm tarih alanları ISO 8601 formatında (YYYY-MM-DD veya YYYY-MM-DDTHH:mm:ss.sssZ)
2. Para birimi alanları decimal (18,2) formatında
3. Sayfa numaraları 1'den başlar
4. Hata durumunda her zaman `error` alanı döner
5. Başarılı işlemlerde her zaman `success: true` döner

## Güvenlik

- API istekleri sadece uygulama üzerinden yapılabilir
- Rate limiting her IP için 100 istek/dakika
- Maximum request body size: 10MB
- Maximum file upload size: 5MB
