import express, { RequestHandler } from 'express';
import customerService from '../services/customerService';

const router = express.Router();

// Tüm müşterileri getir
const getAllCustomers: RequestHandler = async (_req, res, next): Promise<void> => {
    try {
        const customers = await customerService.getAllCustomers();
        res.json(customers);
    } catch (error) {
        console.error('Müşteriler getirilirken hata:', error);
        res.status(500).json({ error: 'Müşteriler getirilirken bir hata oluştu' });
    }
};

// Müşteri detayını getir
const getCustomerById: RequestHandler<{ id: string }> = async (req, res, next): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const customer = await customerService.getCustomerById(id);
        
        if (!customer) {
            res.status(404).json({ error: 'Müşteri bulunamadı' });
            return;
        }
        
        res.json(customer);
    } catch (error) {
        console.error('Müşteri detayı getirilirken hata:', error);
        res.status(500).json({ error: 'Müşteri detayı getirilirken bir hata oluştu' });
    }
};

// Yeni müşteri ekle
const createCustomer: RequestHandler = async (req, res, next): Promise<void> => {
    try {
        const customer = await customerService.createCustomer(req.body);
        res.status(201).json(customer);
    } catch (error) {
        console.error('Müşteri eklenirken hata:', error);
        res.status(500).json({ error: 'Müşteri eklenirken bir hata oluştu' });
    }
};

// Müşteri güncelle
const updateCustomer: RequestHandler<{ id: string }> = async (req, res, next): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const customer = await customerService.updateCustomer(id, req.body);
        
        if (!customer) {
            res.status(404).json({ error: 'Müşteri bulunamadı' });
            return;
        }
        
        res.json(customer);
    } catch (error) {
        console.error('Müşteri güncellenirken hata:', error);
        res.status(500).json({ error: 'Müşteri güncellenirken bir hata oluştu' });
    }
};

// Müşteri sil
const deleteCustomer: RequestHandler<{ id: string }> = async (req, res, next): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const success = await customerService.deleteCustomer(id);
        
        if (!success) {
            res.status(404).json({ error: 'Müşteri bulunamadı' });
            return;
        }
        
        res.json({ message: 'Müşteri başarıyla silindi' });
    } catch (error) {
        console.error('Müşteri silinirken hata:', error);
        res.status(500).json({ error: 'Müşteri silinirken bir hata oluştu' });
    }
};

// Müşteri koduna göre getir
const getCustomerByCode: RequestHandler<{ code: string }> = async (req, res, next): Promise<void> => {
    try {
        const code = req.params.code;
        const customer = await customerService.getCustomerByCode(code);
        
        if (!customer) {
            res.status(404).json({ error: 'Müşteri bulunamadı' });
            return;
        }
        
        res.json(customer);
    } catch (error) {
        console.error('Müşteri kodu ile getirilirken hata:', error);
        res.status(500).json({ error: 'Müşteri getirilirken bir hata oluştu' });
    }
};

// Route tanımlamaları
router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.post('/', createCustomer);
router.put('/:id', updateCustomer);
router.delete('/:id', deleteCustomer);
router.get('/code/:code', getCustomerByCode);

export default router;
