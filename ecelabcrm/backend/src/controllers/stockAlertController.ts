import { Request, Response } from 'express';
import { stockAlertService } from '../services/stockAlertService';
import { catchAsync } from '../utils/catchAsync';

export const stockAlertController = {
    // Minimum stok kontrolü
    checkMinimumStock: catchAsync(async (req: Request, res: Response) => {
        const products = await stockAlertService.checkMinimumStock();
        res.json(products);
    }),

    // Stok alarmlarını getir
    getAlerts: catchAsync(async (req: Request, res: Response) => {
        const alerts = await stockAlertService.getAlerts();
        res.json(alerts);
    }),

    // Minimum stok güncelle
    updateMinimumStock: catchAsync(async (req: Request, res: Response) => {
        const { productId } = req.params;
        const { minimumStock } = req.body;
        const product = await stockAlertService.updateMinimumStock(Number(productId), minimumStock);
        res.json(product);
    }),

    // Toplu minimum stok güncelleme
    updateMinimumStockBulk: catchAsync(async (req: Request, res: Response) => {
        const { updates } = req.body;
        const results = await stockAlertService.updateMinimumStockBulk(updates);
        res.json(results);
    }),
};
