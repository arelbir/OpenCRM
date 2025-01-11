import express, { RequestHandler } from 'express';
import { quotationService } from '../services/quotationService';

const router = express.Router();

// Tüm teklifleri getir
const getAllQuotations: RequestHandler = async (_req, res): Promise<void> => {
    try {
        const quotations = await quotationService.getAllQuotations();
        res.json(quotations);
    } catch (error) {
        console.error('Teklifler getirilirken hata:', error);
        res.status(500).json({ error: 'Teklifler getirilirken bir hata oluştu' });
    }
};

// Teklif detayını getir
const getQuotationById: RequestHandler<{ id: string }> = async (req, res): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (!id || isNaN(id)) {
            res.status(400).json({ error: 'Geçersiz teklif ID' });
            return;
        }

        const quotation = await quotationService.getQuotationById(id);
        if (!quotation) {
            res.status(404).json({ error: 'Teklif bulunamadı' });
            return;
        }

        res.json(quotation);
    } catch (error) {
        console.error('Teklif detayı getirilirken hata:', error);
        res.status(500).json({ error: 'Teklif detayı getirilirken bir hata oluştu' });
    }
};

// Yeni teklif ekle
const createQuotation: RequestHandler = async (req, res): Promise<void> => {
    try {
        const quotation = await quotationService.createQuotation(req.body);
        res.status(201).json(quotation);
    } catch (error) {
        console.error('Teklif eklenirken hata:', error);
        res.status(500).json({ error: 'Teklif eklenirken bir hata oluştu' });
    }
};

// Teklif güncelle
const updateQuotation: RequestHandler<{ id: string }> = async (req, res): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (!id || isNaN(id)) {
            res.status(400).json({ error: 'Geçersiz teklif ID' });
            return;
        }

        const quotation = await quotationService.updateQuotation(id, req.body);
        if (!quotation) {
            res.status(404).json({ error: 'Teklif bulunamadı' });
            return;
        }

        res.json(quotation);
    } catch (error) {
        console.error('Teklif güncellenirken hata:', error);
        res.status(500).json({ error: 'Teklif güncellenirken bir hata oluştu' });
    }
};

// Teklif sil
const deleteQuotation: RequestHandler<{ id: string }> = async (req, res): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        if (!id || isNaN(id)) {
            res.status(400).json({ error: 'Geçersiz teklif ID' });
            return;
        }

        const success = await quotationService.deleteQuotation(id);
        if (!success) {
            res.status(404).json({ error: 'Teklif bulunamadı' });
            return;
        }

        res.json({ message: 'Teklif başarıyla silindi' });
    } catch (error) {
        console.error('Teklif silinirken hata:', error);
        res.status(500).json({ error: 'Teklif silinirken bir hata oluştu' });
    }
};

// Route tanımlamaları
router.get('/', getAllQuotations);
router.get('/:id', getQuotationById);
router.post('/', createQuotation);
router.put('/:id', updateQuotation);
router.delete('/:id', deleteQuotation);

export default router;
