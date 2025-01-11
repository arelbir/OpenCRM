import express, { Request, Response, Router, RequestHandler, NextFunction } from 'express';
import { Product } from '../models';
import { productService } from '../services/productService';
import multer from 'multer';

const router: Router = express.Router();
const upload = multer();

// Tüm ürünleri getir
const getAllProducts: RequestHandler = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        console.error('Ürünler getirilirken hata:', error);
        res.status(500).json({ error: 'Ürünler getirilirken bir hata oluştu' });
    }
};

// Ürün detayını getir
const getProductById: RequestHandler<{ id: string }> = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (!id || isNaN(id)) {
            res.status(400).json({ error: 'Geçersiz ürün ID' });
            return;
        }

        const product = await productService.getProductById(id);
        if (!product) {
            res.status(404).json({ error: 'Ürün bulunamadı' });
            return;
        }

        res.json(product);
    } catch (error) {
        console.error('Ürün detayı getirilirken hata:', error);
        res.status(500).json({ error: 'Ürün detayı getirilirken bir hata oluştu' });
    }
};

// Yeni ürün ekle
const createProduct: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        console.error('Ürün eklenirken hata:', error);
        res.status(500).json({ error: 'Ürün eklenirken bir hata oluştu' });
    }
};

// Ürün güncelle
const updateProduct: RequestHandler<{ id: string }> = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (!id || isNaN(id)) {
            res.status(400).json({ error: 'Geçersiz ürün ID' });
            return;
        }

        const product = await productService.updateProduct(id, req.body);
        if (!product) {
            res.status(404).json({ error: 'Ürün bulunamadı' });
            return;
        }

        res.json(product);
    } catch (error) {
        console.error('Ürün güncellenirken hata:', error);
        res.status(500).json({ error: 'Ürün güncellenirken bir hata oluştu' });
    }
};

// Ürün sil
const deleteProduct: RequestHandler<{ id: string }> = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (!id || isNaN(id)) {
            res.status(400).json({ error: 'Geçersiz ürün ID' });
            return;
        }

        await productService.deleteProduct(id);
        res.json({ message: 'Ürün başarıyla silindi' });
    } catch (error) {
        console.error('Ürün silinirken hata:', error);
        res.status(500).json({ error: 'Ürün silinirken bir hata oluştu' });
    }
};

// Stok güncelle
const updateStock: RequestHandler<{ id: string }> = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const quantity = parseInt(req.body.quantity);

        if (!id || isNaN(id)) {
            res.status(400).json({ error: 'Geçersiz ürün ID' });
            return;
        }

        if (isNaN(quantity)) {
            res.status(400).json({ error: 'Geçersiz miktar' });
            return;
        }

        const product = await productService.updateStock(id, quantity);
        res.json(product);
    } catch (error) {
        console.error('Stok güncellenirken hata:', error);
        res.status(500).json({ error: 'Stok güncellenirken bir hata oluştu' });
    }
};

// Son kullanma tarihi yaklaşan ürünleri getir
const getExpiringProducts: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const days = parseInt(req.query.days as string) || 90;
        const products = await productService.getExpiringProducts(days);
        res.json(products);
    } catch (error) {
        console.error('Son kullanma tarihi yaklaşan ürünler getirilirken hata:', error);
        res.status(500).json({ error: 'Son kullanma tarihi yaklaşan ürünler getirilirken bir hata oluştu' });
    }
};

// Excel şablonu indir
const downloadTemplate: RequestHandler = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const buffer = await productService.generateTemplate();
        if (!buffer) {
            throw new Error('Şablon oluşturulamadı');
        }

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=urun_sablonu.xlsx');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.send(buffer);
    } catch (error) {
        console.error('Excel şablonu oluşturulurken hata:', error);
        res.status(500).json({ error: 'Excel şablonu oluşturulurken bir hata oluştu' });
    }
};

// Ürünleri Excel olarak indir
const downloadExcel: RequestHandler = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const buffer = await productService.generateExcel();
        if (!buffer) {
            throw new Error('Excel dosyası oluşturulamadı');
        }

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=urunler.xlsx');
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
        res.send(buffer);
    } catch (error) {
        console.error('Excel dosyası oluşturulurken hata:', error);
        res.status(500).json({ error: 'Excel dosyası oluşturulurken bir hata oluştu' });
    }
};

// Excel'den ürün yükle
const uploadExcel: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'Dosya yüklenmedi' });
            return;
        }

        const result = await productService.importFromExcel(req.file.buffer);
        res.json(result);
    } catch (error) {
        console.error('Excel dosyası işlenirken hata:', error);
        res.status(500).json({ error: 'Excel dosyası işlenirken bir hata oluştu' });
    }
};

// Route tanımlamaları
router.get('/', getAllProducts);
router.get('/expiring', getExpiringProducts);
router.get('/template', downloadTemplate);
router.get('/excel', downloadExcel);
router.post('/upload', upload.single('file'), uploadExcel);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.put('/:id/stock', updateStock);
router.delete('/:id', deleteProduct);

export default router;
