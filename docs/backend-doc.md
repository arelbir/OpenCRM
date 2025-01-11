# Backend Dokümantasyonu

## Proje Yapısı

```
backend/
├── src/
│   ├── controllers/        # Route handler'lar
│   │   ├── customerController.ts
│   │   ├── productController.ts
│   │   ├── quotationController.ts
│   │   └── reminderController.ts
│   ├── services/          # İş mantığı katmanı
│   │   ├── customerService.ts
│   │   ├── productService.ts
│   │   └── quotationService.ts
│   ├── models/            # Veritabanı modelleri
│   │   ├── Customer.ts
│   │   ├── Product.ts
│   │   └── Quotation.ts
│   ├── middleware/        # Middleware'ler
│   │   ├── errorHandler.ts
│   │   └── validateRequest.ts
│   ├── routes/            # API route'ları
│   │   ├── customerRoutes.ts
│   │   ├── productRoutes.ts
│   │   └── quotationRoutes.ts
│   ├── config/           # Konfigürasyon
│   │   ├── database.ts
│   │   └── server.ts
│   └── utils/            # Yardımcı fonksiyonlar
│       ├── logger.ts
│       └── validators.ts
└── tests/               # Test dosyaları
```

## Temel Kurulum

### 1. Express App Kurulumu
```typescript
// src/app.ts
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database';
import customerRoutes from './routes/customerRoutes';
import productRoutes from './routes/productRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);

// Error handling
app.use(errorHandler);

// Database connection
connectDB()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection error:', err));

export default app;
```

### 2. Veritabanı Bağlantısı
```typescript
// src/config/database.ts
import sql from 'mssql';

const config = {
    server: process.env.DB_SERVER || 'ECELABCRM.mssql.somee.com',
    database: process.env.DB_NAME || 'ECELABCRM',
    user: process.env.DB_USER || 'arelbebek_SQLLogin_1',
    password: process.env.DB_PASSWORD || '73i5tzc1hv',
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
        throw err;
    }
}

export function getConnection() {
    return sql;
}
```

## Controller Örnekleri

### 1. Müşteri Controller
```typescript
// src/controllers/customerController.ts
import { Request, Response, NextFunction } from 'express';
import { CustomerService } from '../services/customerService';

export class CustomerController {
    private customerService: CustomerService;

    constructor() {
        this.customerService = new CustomerService();
    }

    async getCustomers(req: Request, res: Response, next: NextFunction) {
        try {
            const { page = 1, limit = 10, search } = req.query;
            const customers = await this.customerService.getCustomers({
                page: Number(page),
                limit: Number(limit),
                search: search as string
            });
            res.json({ success: true, data: customers });
        } catch (error) {
            next(error);
        }
    }

    async createCustomer(req: Request, res: Response, next: NextFunction) {
        try {
            const customerData = req.body;
            const customer = await this.customerService.createCustomer(customerData);
            res.json({ success: true, data: customer });
        } catch (error) {
            next(error);
        }
    }
}
```

## Service Örnekleri

### 1. Müşteri Service
```typescript
// src/services/customerService.ts
import sql from 'mssql';
import { getConnection } from '../config/database';

export class CustomerService {
    async getCustomers({ page, limit, search }: { 
        page: number; 
        limit: number; 
        search?: string;
    }) {
        const pool = await getConnection();
        const offset = (page - 1) * limit;

        let query = `
            SELECT *
            FROM Customers
            WHERE IsActive = 1
        `;

        if (search) {
            query += `
                AND (
                    CompanyName LIKE @search
                    OR CustomerCode LIKE @search
                    OR ContactName LIKE @search
                )
            `;
        }

        query += `
            ORDER BY CreatedAt DESC
            OFFSET @offset ROWS
            FETCH NEXT @limit ROWS ONLY
        `;

        const result = await pool.request()
            .input('search', sql.NVarChar, search ? `%${search}%` : null)
            .input('offset', sql.Int, offset)
            .input('limit', sql.Int, limit)
            .query(query);

        return result.recordset;
    }

    async createCustomer(customerData: any) {
        const pool = await getConnection();
        const result = await pool.request()
            .input('CustomerCode', sql.NVarChar, customerData.customerCode)
            .input('CompanyName', sql.NVarChar, customerData.companyName)
            .input('Country', sql.NVarChar, customerData.country)
            .input('ContactName', sql.NVarChar, customerData.contactName)
            .input('Email', sql.NVarChar, customerData.email)
            .input('Phone', sql.NVarChar, customerData.phone)
            .input('Notes', sql.NText, customerData.notes)
            .execute('sp_CreateCustomer');

        return result.recordset[0];
    }
}
```

## Middleware Örnekleri

### 1. Error Handler
```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err);

    if (err.sql) {
        return res.status(500).json({
            success: false,
            error: 'Veritabanı hatası'
        });
    }

    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Sunucu hatası'
    });
};
```

### 2. Request Validation
```typescript
// src/middleware/validateRequest.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validateRequest = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};
```

## Excel İşleme Örneği

```typescript
// src/services/stockService.ts
import * as XLSX from 'xlsx';
import { getConnection } from '../config/database';

export class StockService {
    async processExcelUpload(fileBuffer: Buffer) {
        const workbook = XLSX.read(fileBuffer);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet);

        const pool = await getConnection();
        const transaction = pool.transaction();

        try {
            await transaction.begin();

            for (const row of data) {
                await transaction.request()
                    .input('Brand', sql.NVarChar, row.Brand)
                    .input('Code', sql.NVarChar, row.Code)
                    .input('Description', sql.NVarChar, row.Description)
                    .input('Stock', sql.Int, row.Stock)
                    .input('ExpiryDate', sql.Date, new Date(row.ExpiryDate))
                    .execute('sp_UpdateStock');
            }

            await transaction.commit();
            return { success: true, updatedCount: data.length };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}
```

## PDF Oluşturma Örneği

```typescript
// src/services/quotationService.ts
import PDFDocument from 'pdfkit';

export class QuotationService {
    async generateQuotationPDF(quotationId: number) {
        const doc = new PDFDocument();
        
        // PDF içeriği oluşturma
        const quotation = await this.getQuotationDetails(quotationId);
        
        doc.fontSize(20).text('Teklif', { align: 'center' });
        doc.moveDown();
        
        // Müşteri bilgileri
        doc.fontSize(12).text(`Müşteri: ${quotation.customerName}`);
        doc.text(`Tarih: ${quotation.date}`);
        
        // Ürün tablosu
        // ... PDF oluşturma mantığı
        
        return doc;
    }
}
```

## Optimizasyon ve Güvenlik

### 1. Rate Limiting
```typescript
// src/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 100 // limit
});
```

### 2. CORS Yapılandırması
```typescript
// src/config/cors.ts
export const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
```

### 3. Input Validation
```typescript
// src/validators/customerValidator.ts
import { body } from 'express-validator';

export const createCustomerValidation = [
    body('companyName').notEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
    body('phone').matches(/^\+?[\d\s-]+$/)
];
```
