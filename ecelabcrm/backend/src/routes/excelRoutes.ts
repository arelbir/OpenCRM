import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { excelService } from '../services/excelService';

const router = express.Router();

// Multer yapılandırması
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        const uploadDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.xlsx' && ext !== '.xls') {
            cb(new Error('Sadece Excel dosyaları (.xlsx, .xls) yüklenebilir'));
            return;
        }
        cb(null, true);
    }
});

// Ürün şablonu indirme
router.get('/products/template', async (req, res) => {
    try {
        const filePath = await excelService.exportProductTemplate();
        res.download(filePath, 'urun_sablonu.xlsx', (err) => {
            if (err) {
                console.error('Dosya indirme hatası:', err);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Dosya indirme hatası' });
                }
            }
            // Dosyayı temizle
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) console.error('Dosya silme hatası:', unlinkErr);
            });
        });
    } catch (error) {
        console.error('Şablon oluşturma hatası:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Şablon oluşturulurken bir hata oluştu' });
        }
    }
});

// Müşteri şablonu indirme
router.get('/customers/template', async (req, res) => {
    try {
        const filePath = await excelService.exportCustomerTemplate();
        res.download(filePath, 'musteri_sablonu.xlsx', (err) => {
            if (err) {
                console.error('Dosya indirme hatası:', err);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Dosya indirme hatası' });
                }
            }
            // Dosyayı temizle
            fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) console.error('Dosya silme hatası:', unlinkErr);
            });
        });
    } catch (error) {
        console.error('Şablon oluşturma hatası:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Şablon oluşturulurken bir hata oluştu' });
        }
    }
});

// Ürün Excel yükleme
router.post('/products/import', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('Dosya yüklenmedi');
        }

        const result = await excelService.importProducts(req.file.path);

        // Yüklenen dosyayı temizle
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Dosya silme hatası:', err);
        });

        res.json(result);
    } catch (error) {
        console.error('Excel yükleme hatası:', error);
        res.status(500).json({ 
            error: error instanceof Error ? error.message : 'Excel yüklenirken bir hata oluştu' 
        });
    }
});

// Müşteri Excel yükleme
router.post('/customers/import', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('Dosya yüklenmedi');
        }

        const result = await excelService.importCustomers(req.file.path);

        // Yüklenen dosyayı temizle
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Dosya silme hatası:', err);
        });

        res.json(result);
    } catch (error) {
        console.error('Excel yükleme hatası:', error);
        res.status(500).json({ 
            error: error instanceof Error ? error.message : 'Excel yüklenirken bir hata oluştu' 
        });
    }
});

export default router;
