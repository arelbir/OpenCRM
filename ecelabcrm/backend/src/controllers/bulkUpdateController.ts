import { Request, Response } from 'express';
import { bulkUpdateService } from '../services/bulkUpdateService';
import { catchAsync } from '../utils/catchAsync';

export const bulkUpdateController = {
    // Toplu stok güncelleme
    updateStockBulk: catchAsync(async (req: Request, res: Response) => {
        const { updates } = req.body;
        const results = await bulkUpdateService.updateStockBulk(updates, req.user?.username);
        res.json(results);
    }),

    // Toplu fiyat güncelleme
    updatePriceBulk: catchAsync(async (req: Request, res: Response) => {
        const { updates } = req.body;
        const results = await bulkUpdateService.updatePriceBulk(updates);
        res.json(results);
    }),
};
