import { Product } from '../models';
import { Op, WhereOptions } from 'sequelize';
import { ProductAttributes, ProductCreationAttributes } from '../models/ProductModel';
import * as xlsx from 'xlsx';

class ProductService {
    // Tüm ürünleri getir
    async getAllProducts() {
        try {
            return await Product.findAll({
                where: { IsActive: true },
                order: [['UpdatedAt', 'DESC']],
            });
        } catch (error) {
            console.error('Ürünler getirilirken hata:', error);
            throw error;
        }
    }

    // ID'ye göre ürün getir
    async getProductById(id: number) {
        try {
            return await Product.findOne({
                where: { ProductID: id, IsActive: true },
            });
        } catch (error) {
            console.error('Ürün detayı getirilirken hata:', error);
            throw error;
        }
    }

    // Yeni ürün oluştur
    async createProduct(data: ProductCreationAttributes) {
        try {
            return await Product.create({
                ...data,
                IsActive: true,
            });
        } catch (error) {
            console.error('Ürün oluşturulurken hata:', error);
            throw error;
        }
    }

    // Ürün güncelle
    async updateProduct(id: number, data: Partial<ProductAttributes>) {
        try {
            const product = await Product.findOne({
                where: { ProductID: id, IsActive: true },
            });

            if (!product) {
                throw new Error('Ürün bulunamadı');
            }

            return await product.update(data);
        } catch (error) {
            console.error('Ürün güncellenirken hata:', error);
            throw error;
        }
    }

    // Ürün sil (soft delete)
    async deleteProduct(id: number) {
        try {
            const product = await Product.findOne({
                where: { ProductID: id, IsActive: true },
            });

            if (!product) {
                throw new Error('Ürün bulunamadı');
            }

            return await product.update({ IsActive: false });
        } catch (error) {
            console.error('Ürün silinirken hata:', error);
            throw error;
        }
    }

    // Stok güncelleme
    async updateStock(id: number, quantity: number) {
        try {
            const product = await Product.findOne({
                where: { ProductID: id, IsActive: true },
            });

            if (!product) {
                throw new Error('Ürün bulunamadı');
            }

            const currentStock = product.Stock;
            const newStock = currentStock + quantity;

            if (newStock < 0) {
                throw new Error('Stok miktarı 0\'ın altına düşemez');
            }

            return await product.update({
                Stock: newStock,
                UpdatedAt: new Date()
            });
        } catch (error) {
            console.error('Stok güncellenirken hata:', error);
            throw error;
        }
    }

    // Son kullanma tarihi yaklaşan ürünleri getir
    async getExpiringProducts(dayThreshold: number = 90) {
        try {
            const thresholdDate = new Date();
            thresholdDate.setDate(thresholdDate.getDate() + dayThreshold);

            return await Product.findAll({
                where: {
                    ExpiryDate: {
                        [Op.lte]: thresholdDate,
                        [Op.gte]: new Date()
                    },
                    IsActive: true
                },
                order: [['ExpiryDate', 'ASC']]
            });
        } catch (error) {
            console.error('Son kullanma tarihi yaklaşan ürünler getirilirken hata:', error);
            throw error;
        }
    }

    // Excel şablonu oluştur
    async generateTemplate() {
        try {
            // Şablon başlıkları
            const headers = [
                'Brand',
                'Code',
                'Description',
                'ExpiryDate',
                'Stock',
                'Price',
                'MinimumStock'
            ];

            // Örnek veri
            const exampleData = [
                ['Roche', '4481798190', 'Elecsys AFP', '30/04/2026', '23', '1500.00', '5'],
                ['Roche', '4487761190', 'AFP CalSet II', '31/03/2026', '0', '1160.00', '5'],
                ['Roche', '11731629322', 'Elecsys CEA', '30/09/2025', '11', '1500.00', '5']
            ];

            // Workbook oluştur
            const wb = xlsx.utils.book_new();
            
            // Worksheet oluştur
            const ws = xlsx.utils.aoa_to_sheet([headers, ...exampleData]);

            // Kolon genişliklerini ayarla
            const colWidths = [
                { wch: 15 }, // Brand
                { wch: 15 }, // Code
                { wch: 30 }, // Description
                { wch: 15 }, // ExpiryDate
                { wch: 10 }, // Stock
                { wch: 15 }, // Price
                { wch: 15 }  // MinimumStock
            ];
            ws['!cols'] = colWidths;

            // Worksheet'i workbook'a ekle
            xlsx.utils.book_append_sheet(wb, ws, 'Ürünler');

            // Buffer olarak dönüştür
            const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
            return buffer;
        } catch (error) {
            console.error('Excel şablonu oluşturulurken hata:', error);
            throw error;
        }
    }

    // Excel'den ürünleri oku
    async readExcel(buffer: Buffer) {
        try {
            const workbook = xlsx.read(buffer, { type: 'buffer' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = xlsx.utils.sheet_to_json(worksheet);

            // Veriyi doğrula ve dönüştür
            const products = data.map((row: any) => ({
                Brand: row.Brand,
                Code: row.Code?.toString(),
                Description: row.Description,
                ExpiryDate: row.ExpiryDate,
                Stock: Number(row.Stock) || 0,
                Price: Number(row.Price) || 0,
                MinimumStock: Number(row.MinimumStock) || 0
            }));

            return products;
        } catch (error) {
            console.error('Excel dosyası okunurken hata:', error);
            throw error;
        }
    }

    // Ürünleri Excel olarak dışa aktar
    async exportToExcel(products: ProductAttributes[]) {
        try {
            // Başlıkları hazırla
            const headers = [
                'Brand',
                'Code',
                'Description',
                'ExpiryDate',
                'Stock',
                'Price',
                'MinimumStock'
            ];

            // Veriyi hazırla
            const data = products.map(product => [
                product.Brand,
                product.Code,
                product.Description,
                product.ExpiryDate,
                product.Stock.toString(),
                product.Price.toString(),
                product.MinimumStock.toString()
            ]);

            // Workbook oluştur
            const wb = xlsx.utils.book_new();
            
            // Worksheet oluştur
            const ws = xlsx.utils.aoa_to_sheet([headers, ...data]);

            // Kolon genişliklerini ayarla
            const colWidths = [
                { wch: 15 }, // Brand
                { wch: 15 }, // Code
                { wch: 30 }, // Description
                { wch: 15 }, // ExpiryDate
                { wch: 10 }, // Stock
                { wch: 15 }, // Price
                { wch: 15 }  // MinimumStock
            ];
            ws['!cols'] = colWidths;

            // Worksheet'i workbook'a ekle
            xlsx.utils.book_append_sheet(wb, ws, 'Ürünler');

            // Buffer olarak dönüştür
            const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
            return buffer;
        } catch (error) {
            console.error('Excel dosyası oluşturulurken hata:', error);
            throw error;
        }
    }

    // Excel'den ürün içe aktar
    async importFromExcel(buffer: Buffer): Promise<{ success: boolean; message: string; errors?: string[] }> {
        try {
            const products = await this.readExcel(buffer);

            const errors: string[] = [];
            let successCount = 0;

            for (const [index, product] of products.entries()) {
                try {
                    // Zorunlu alanları kontrol et
                    if (!product.Code || !product.Brand || !product.Description) {
                        errors.push(`Satır ${index + 2}: Kod, Marka ve Açıklama alanları zorunludur`);
                        continue;
                    }

                    // Sayısal değerleri kontrol et
                    if (isNaN(product.Stock) || isNaN(product.MinimumStock) || isNaN(product.Price)) {
                        errors.push(`Satır ${index + 2}: Stok, Minimum Stok ve Fiyat sayısal olmalıdır`);
                        continue;
                    }

                    // Ürünü güncelle veya oluştur
                    await Product.upsert({
                        Code: product.Code,
                        Brand: product.Brand,
                        Description: product.Description,
                        ExpiryDate: product.ExpiryDate,
                        Stock: product.Stock,
                        Price: product.Price,
                        MinimumStock: product.MinimumStock,
                        IsActive: true,
                    });
                    successCount++;
                } catch (error) {
                    if (error instanceof Error) {
                        errors.push(`Satır ${index + 2}: İşlem hatası - ${error.message}`);
                    } else {
                        errors.push(`Satır ${index + 2}: Bilinmeyen hata`);
                    }
                }
            }

            return {
                success: true,
                message: `${successCount} ürün başarıyla işlendi${errors.length > 0 ? `, ${errors.length} hata oluştu` : ''}`,
                errors: errors.length > 0 ? errors : undefined
            };
        } catch (error) {
            return {
                success: false,
                message: 'Excel dosyası işlenirken bir hata oluştu',
                errors: error instanceof Error ? [error.message] : ['Bilinmeyen hata']
            };
        }
    }

    // Ürünleri Excel olarak dışa aktar
    async generateExcel() {
        try {
            const products = await Product.findAll({
                where: { IsActive: true },
                order: [['UpdatedAt', 'DESC']],
            });

            return this.exportToExcel(products);
        } catch (error) {
            console.error('Excel dosyası oluşturulurken hata:', error);
            throw error;
        }
    }
}

export const productService = new ProductService();
