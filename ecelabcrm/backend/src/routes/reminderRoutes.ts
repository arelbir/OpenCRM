import express, { Request, Response, RequestHandler } from 'express';
import { Reminder } from '../models';
import { Op } from 'sequelize';

const router = express.Router();

// Tüm hatırlatıcıları getir
const getAllReminders: RequestHandler = async (_req: Request, res: Response, next): Promise<void> => {
    try {
        const reminders = await Reminder.findAll({
            where: { IsActive: true },
            order: [['DueDate', 'DESC']]
        });
        res.json(reminders);
    } catch (error) {
        console.error('Hatırlatıcılar getirilirken hata:', error);
        res.status(500).json({ error: 'Hatırlatıcılar getirilirken bir hata oluştu' });
    }
};

// Hatırlatıcı detayını getir
const getReminderById: RequestHandler<{ id: string }> = async (req: Request, res: Response, next): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const reminder = await Reminder.findOne({
            where: {
                ReminderID: id,
                IsActive: true
            }
        });

        if (!reminder) {
            res.status(404).json({ error: 'Hatırlatıcı bulunamadı' });
            return;
        }

        res.json(reminder);
    } catch (error) {
        console.error('Hatırlatıcı detayı getirilirken hata:', error);
        res.status(500).json({ error: 'Hatırlatıcı detayı getirilirken bir hata oluştu' });
    }
};

// Yeni hatırlatıcı ekle
const createReminder: RequestHandler = async (req: Request, res: Response, next): Promise<void> => {
    try {
        const reminder = await Reminder.create({
            ...req.body,
            IsActive: true,
            CreatedAt: new Date(),
            UpdatedAt: new Date()
        });
        res.status(201).json(reminder);
    } catch (error) {
        console.error('Hatırlatıcı eklenirken hata:', error);
        res.status(500).json({ error: 'Hatırlatıcı eklenirken bir hata oluştu' });
    }
};

// Hatırlatıcı güncelle
const updateReminder: RequestHandler<{ id: string }> = async (req: Request, res: Response, next): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const reminder = await Reminder.findOne({
            where: {
                ReminderID: id,
                IsActive: true
            }
        });

        if (!reminder) {
            res.status(404).json({ error: 'Hatırlatıcı bulunamadı' });
            return;
        }

        await reminder.update({
            ...req.body,
            UpdatedAt: new Date()
        });

        res.json(reminder);
    } catch (error) {
        console.error('Hatırlatıcı güncellenirken hata:', error);
        res.status(500).json({ error: 'Hatırlatıcı güncellenirken bir hata oluştu' });
    }
};

// Hatırlatıcı sil
const deleteReminder: RequestHandler<{ id: string }> = async (req: Request, res: Response, next): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const reminder = await Reminder.findOne({
            where: {
                ReminderID: id,
                IsActive: true
            }
        });

        if (!reminder) {
            res.status(404).json({ error: 'Hatırlatıcı bulunamadı' });
            return;
        }

        await reminder.update({
            IsActive: false,
            UpdatedAt: new Date()
        });

        res.json({ message: 'Hatırlatıcı başarıyla silindi' });
    } catch (error) {
        console.error('Hatırlatıcı silinirken hata:', error);
        res.status(500).json({ error: 'Hatırlatıcı silinirken bir hata oluştu' });
    }
};

// Yaklaşan hatırlatıcıları getir
const getUpcomingReminders: RequestHandler<{ days: string }> = async (req: Request, res: Response, next): Promise<void> => {
    try {
        const days = req.params.days ? parseInt(req.params.days) : 7;
        const reminders = await Reminder.findAll({
            where: {
                DueDate: {
                    [Op.gte]: new Date(),
                    [Op.lte]: new Date(new Date().getTime() + days * 24 * 60 * 60 * 1000)
                },
                IsActive: true
            },
            order: [['DueDate', 'ASC']]
        });
        res.json(reminders);
    } catch (error) {
        console.error('Yaklaşan hatırlatıcılar getirilirken hata:', error);
        res.status(500).json({ error: 'Yaklaşan hatırlatıcılar getirilirken bir hata oluştu' });
    }
};

// Gecikmiş hatırlatıcıları getir
const getOverdueReminders: RequestHandler = async (_req: Request, res: Response, next): Promise<void> => {
    try {
        const reminders = await Reminder.findAll({
            where: {
                DueDate: {
                    [Op.lt]: new Date()
                },
                Status: 'Pending',
                IsActive: true
            },
            order: [['DueDate', 'ASC']]
        });
        res.json(reminders);
    } catch (error) {
        console.error('Gecikmiş hatırlatıcılar getirilirken hata:', error);
        res.status(500).json({ error: 'Gecikmiş hatırlatıcılar getirilirken bir hata oluştu' });
    }
};

// Müşterinin hatırlatıcılarını getir
const getCustomerReminders: RequestHandler<{ customerId: string }> = async (req: Request, res: Response, next): Promise<void> => {
    try {
        const customerId = parseInt(req.params.customerId);
        const reminders = await Reminder.findAll({
            where: {
                CustomerID: customerId,
                IsActive: true
            },
            order: [['DueDate', 'ASC']]
        });
        res.json(reminders);
    } catch (error) {
        console.error('Müşteri hatırlatıcıları getirilirken hata:', error);
        res.status(500).json({ error: 'Müşteri hatırlatıcıları getirilirken bir hata oluştu' });
    }
};

// Route tanımlamaları
router.get('/upcoming/:days?', getUpcomingReminders);
router.get('/overdue', getOverdueReminders);
router.get('/customer/:customerId', getCustomerReminders);
router.get('/', getAllReminders);
router.get('/:id', getReminderById);
router.post('/', createReminder);
router.put('/:id', updateReminder);
router.delete('/:id', deleteReminder);

export default router;
