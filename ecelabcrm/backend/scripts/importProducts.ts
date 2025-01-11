import fs from 'fs';
import csv from 'csv-parse';
import path from 'path';
import { Product } from '../models';
import { sequelize } from '../config/database';

interface ProductCSV {
    Brand: string;
    Code: string;
    Description: string;
    Exp: string;
    Stock: string;
    Price: string;
}

// Tarih formatını dönüştür (DD/MM/YYYY -> YYYY-MM-DD)
const convertDate = (dateStr: string): string => {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
};

// Fiyat formatını dönüştür (1,500.00 -> 1500.00)
const convertPrice = (priceStr: string): number => {
    return parseFloat(priceStr.replace(/,/g, ''));
};

async function importProducts() {
    try {
        // CSV dosyasını oku
        const csvFilePath = path.join(__dirname, '..', 'urunsablonu.csv');
        const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

        // CSV'yi parse et
        const parser = csv.parse(fileContent, {
            columns: true,
            skip_empty_lines: true
        });

        for await (const record of parser) {
            const product: ProductCSV = record;

            try {
                // Ürünü veritabanına ekle
                await Product.create({
                    Brand: product.Brand,
                    Code: product.Code,
                    Description: product.Description,
                    ExpiryDate: convertDate(product.Exp),
                    Stock: parseInt(product.Stock),
                    Price: convertPrice(product.Price),
                    MinimumStock: 5, // Varsayılan değer
                    IsActive: true,
                    CreatedAt: new Date(),
                    UpdatedAt: new Date()
                });

                console.log(`Ürün eklendi: ${product.Brand} - ${product.Code}`);
            } catch (error) {
                console.error(`Ürün eklenirken hata: ${product.Brand} - ${product.Code}`, error);
            }
        }

        console.log('Ürün aktarımı tamamlandı!');
    } catch (error) {
        console.error('CSV okuma hatası:', error);
    }
}

// Veritabanı bağlantısını kur ve ürünleri aktar
sequelize.authenticate()
    .then(() => {
        console.log('Veritabanı bağlantısı başarılı.');
        return importProducts();
    })
    .catch(error => {
        console.error('Veritabanı bağlantı hatası:', error);
    });
