import { Product, Customer } from '../models';
import { ProductAttributes } from '../models/ProductModel';
import { CustomerAttributes } from '../models/CustomerModel';
import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs'; // fs modülü import edildi
import { ValidationError } from 'sequelize';
import { Op } from 'sequelize';

interface ExcelProduct {
    Brand: string;
    Code: string;
    Description: string;
    ExpiryDate: string | number;
    Stock: string | number;
    Price: string | number;
    MinimumStock: string | number;
}

interface ExcelCustomer {
    'Firma Adı *': string;
    'Vergi Numarası': string;
    'Vergi Dairesi': string;
    'Telefon': string;
    'E-posta': string;
    'Adres': string;
    'İl': string;
    'İlçe': string;
    'İlgili Kişi': string;
    'İlgili Kişi Telefonu': string;
    'Notlar': string;
}

interface ImportResult {
    success: boolean;
    message: string;
    totalCount: number;
    successCount: number;
    errorCount: number;
    errors: Array<{
        row: number;
        error: string;
    }>;
}

export const excelService = {
    async importProducts(filePath: string): Promise<ImportResult> {
        const result: ImportResult = {
            success: false,
            message: '',
            totalCount: 0,
            successCount: 0,
            errorCount: 0,
            errors: []
        };

        try {
            // Excel dosyasını oku
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            // Excel verilerini JSON'a dönüştür
            const products = xlsx.utils.sheet_to_json<ExcelProduct>(worksheet);
            result.totalCount = products.length;

            // Her bir ürün için
            for (let i = 0; i < products.length; i++) {
                const product = products[i];
                try {
                    // Tarih dönüşümü
                    let expiryDate: Date | undefined = undefined;
                    if (product.ExpiryDate) {
                        // Excel'den gelen tarih formatını kontrol et
                        if (typeof product.ExpiryDate === 'number') {
                            // Excel sayısal tarih formatı
                            expiryDate = xlsx.SSF.parse_date_code(product.ExpiryDate);
                        } else {
                            // String tarih formatı (GG/AA/YYYY)
                            const [day, month, year] = product.ExpiryDate.split('/');
                            expiryDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                        }
                    }

                    // Fiyat dönüşümü
                    let price = 0;
                    if (typeof product.Price === 'number') {
                        price = product.Price;
                    } else {
                        // Binlik ayracı ve TL işaretini kaldır
                        price = parseFloat(product.Price.replace(/[^\d,]/g, '').replace(',', '.'));
                    }

                    // Ürünü veritabanına ekle
                    await Product.create({
                        Brand: product.Brand,
                        Code: product.Code,
                        Description: product.Description,
                        ExpiryDate: expiryDate,
                        Stock: typeof product.Stock === 'number' ? product.Stock : parseInt(product.Stock),
                        Price: price,
                        MinimumStock: typeof product.MinimumStock === 'number' ? 
                            product.MinimumStock : 
                            parseInt(product.MinimumStock) || 5,
                        IsActive: true
                    });

                    result.successCount++;
                } catch (error) {
                    result.errorCount++;
                    result.errors.push({
                        row: i + 2, // Excel satır numarası (başlık satırını dahil et)
                        error: error instanceof ValidationError ? 
                            error.errors.map(e => e.message).join(', ') : 
                            'Beklenmeyen bir hata oluştu'
                    });
                }
            }

            result.success = result.errorCount === 0;
            result.message = result.success ? 
                `${result.successCount} ürün başarıyla içe aktarıldı.` :
                `${result.successCount} ürün aktarıldı, ${result.errorCount} hata oluştu.`;

        } catch (error) {
            result.success = false;
            result.message = 'Excel dosyası okunurken hata oluştu';
            if (error instanceof Error) {
                result.message += `: ${error.message}`;
            }
        }

        return result;
    },

    async importCustomers(filePath: string): Promise<ImportResult> {
        const result: ImportResult = {
            success: false,
            message: '',
            totalCount: 0,
            successCount: 0,
            errorCount: 0,
            errors: []
        };

        try {
            // Excel dosyasını oku
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            // Excel verilerini JSON'a dönüştür
            const customers = xlsx.utils.sheet_to_json<ExcelCustomer>(worksheet);
            result.totalCount = customers.length;

            // Her bir müşteri için
            for (let i = 0; i < customers.length; i++) {
                const customer = customers[i];
                try {
                    // Validasyonlar
                    if (!customer['Firma Adı *']) {
                        throw new Error('Firma adı zorunludur');
                    }

                    if (customer['Vergi Numarası'] && !/^\d{10,11}$/.test(customer['Vergi Numarası'])) {
                        throw new Error('Vergi numarası 10 veya 11 haneli olmalıdır');
                    }

                    if (customer['E-posta'] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer['E-posta'])) {
                        throw new Error('Geçersiz e-posta formatı');
                    }

                    // Mükerrer kayıt kontrolü
                    if (customer['Vergi Numarası']) {
                        const existingCustomer = await Customer.findOne({
                            where: { TaxNumber: customer['Vergi Numarası'] }
                        });
                        if (existingCustomer) {
                            throw new Error(`${customer['Vergi Numarası']} vergi numaralı müşteri zaten mevcut`);
                        }
                    }

                    // Son müşteri kodunu bul
                    const lastCustomer = await Customer.findOne({
                        order: [['CustomerCode', 'DESC']],
                        where: {
                            CustomerCode: {
                                [Op.like]: `MÜŞ-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}%`
                            }
                        }
                    });

                    // Yeni müşteri kodu oluştur (MÜŞ-YYYYMMXXX formatında)
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = String(today.getMonth() + 1).padStart(2, '0');
                    const lastNumber = lastCustomer
                        ? parseInt(lastCustomer.CustomerCode.slice(-3))
                        : 0;
                    const newNumber = String(lastNumber + 1).padStart(3, '0');
                    const customerCode = `MÜŞ-${year}${month}${newNumber}`;

                    // Müşteriyi veritabanına ekle
                    await Customer.create({
                        CustomerCode: customerCode,
                        Name: customer['Firma Adı *'],
                        TaxNumber: customer['Vergi Numarası'],
                        TaxOffice: customer['Vergi Dairesi'],
                        Phone: customer['Telefon'],
                        Email: customer['E-posta'],
                        Address: customer['Adres'],
                        ContactPerson: customer['İlgili Kişi'],
                        ContactPhone: customer['İlgili Kişi Telefonu'],
                        Notes: customer['Notlar'],
                        IsActive: true
                    });

                    result.successCount++;
                } catch (error) {
                    result.errorCount++;
                    result.errors.push({
                        row: i + 2,
                        error: error instanceof ValidationError ? 
                            error.errors.map(e => e.message).join(', ') : 
                            'Beklenmeyen bir hata oluştu'
                    });
                }
            }

            result.success = result.errorCount === 0;
            result.message = result.success ? 
                `${result.successCount} müşteri başarıyla içe aktarıldı.` :
                `${result.successCount} müşteri aktarıldı, ${result.errorCount} hata oluştu.`;

        } catch (error) {
            result.success = false;
            result.message = 'Excel dosyası okunurken hata oluştu';
            if (error instanceof Error) {
                result.message += `: ${error.message}`;
            }
        }

        return result;
    },

    async exportCustomerTemplate(): Promise<string> {
        try {
            // Örnek veriler
            const data = [
                {
                    'Firma Adı *': 'Örnek Firma A.Ş.',
                    'Vergi Numarası': '1234567890',
                    'Vergi Dairesi': 'Örnek Vergi Dairesi',
                    'Telefon': '0212 123 45 67',
                    'E-posta': 'info@ornekfirma.com',
                    'Adres': 'Örnek Mah. Test Sok. No:1',
                    'İl': 'İstanbul',
                    'İlçe': 'Kadıköy',
                    'İlgili Kişi': 'Ahmet Örnek',
                    'İlgili Kişi Telefonu': '0532 123 45 67',
                    'Notlar': 'Örnek müşteri notu'
                }
            ];

            // Excel dosyası oluştur
            const ws = xlsx.utils.json_to_sheet(data);
            const wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, 'Müşteriler');

            // Dosya adı ve yolu oluştur
            const fileName = `musteri_sablonu_${Date.now()}.xlsx`;
            const filePath = path.join(__dirname, '..', 'uploads', fileName);

            // uploads klasörünün varlığını kontrol et
            const uploadsDir = path.join(__dirname, '..', 'uploads');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }

            // Dosyayı kaydet
            xlsx.writeFile(wb, filePath);

            return filePath;
        } catch (error) {
            console.error('Müşteri şablonu oluşturulurken hata:', error);
            throw new Error('Müşteri şablonu oluşturulamadı');
        }
    },

    async exportProductTemplate(): Promise<string> {
        try {
            // Örnek veriler
            const data = [
                {
                    Brand: 'Örnek Marka',
                    Code: 'PRD001',
                    Description: 'Örnek Ürün Açıklaması',
                    ExpiryDate: '31/12/2024',
                    Stock: 100,
                    Price: 1500.50,
                    MinimumStock: 10
                }
            ];

            // Excel dosyası oluştur
            const ws = xlsx.utils.json_to_sheet(data);
            const wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, 'Ürünler');

            // Dosya adı ve yolu oluştur
            const fileName = `urun_sablonu_${Date.now()}.xlsx`;
            const filePath = path.join(__dirname, '..', 'uploads', fileName);

            // uploads klasörünün varlığını kontrol et
            const uploadsDir = path.join(__dirname, '..', 'uploads');
            if (!fs.existsSync(uploadsDir)) {
                fs.mkdirSync(uploadsDir, { recursive: true });
            }

            // Dosyayı kaydet
            xlsx.writeFile(wb, filePath);

            return filePath;
        } catch (error) {
            console.error('Ürün şablonu oluşturulurken hata:', error);
            throw new Error('Ürün şablonu oluşturulamadı');
        }
    }
};
