import { Request, Response } from 'express';
import { stockMovementService } from '../services/stockMovementService';
import { catchAsync } from '../utils/catchAsync';

export const stockMovementController = {
    // Stok hareketi oluştur
    createMovement: catchAsync(async (req: Request, res: Response) => {
        const movement = await stockMovementService.createMovement(req.body);
        res.status(201).json(movement);
    }),

    // Ürüne göre stok hareketlerini getir
    getMovementsByProduct: catchAsync(async (req: Request, res: Response) => {
        const { productId } = req.params;
        const movements = await stockMovementService.getMovementsByProduct(Number(productId));
        res.json(movements);
    }),

    // Tarih aralığına göre stok hareketlerini getir
    getMovementsByDateRange: catchAsync(async (req: Request, res: Response) => {
        const { startDate, endDate } = req.query;
        const movements = await stockMovementService.getMovementsByDateRange(
            new Date(startDate as string),
            new Date(endDate as string)
        );
        res.json(movements);
    }),

    // Tüm stok hareketlerini getir
    getAllMovements: catchAsync(async (req: Request, res: Response) => {
        const movements = await stockMovementService.getAllMovements();
        res.json(movements);
    }),
};
