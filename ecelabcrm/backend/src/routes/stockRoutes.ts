import express from 'express';
import { stockMovementController } from '../controllers/stockMovementController';
import { stockAlertController } from '../controllers/stockAlertController';
import { bulkUpdateController } from '../controllers/bulkUpdateController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Stok hareketleri
router.post('/movements', authenticate, stockMovementController.createMovement);
router.get('/movements', authenticate, stockMovementController.getAllMovements);
router.get('/movements/product/:productId', authenticate, stockMovementController.getMovementsByProduct);
router.get('/movements/date-range', authenticate, stockMovementController.getMovementsByDateRange);

// Stok alarmları
router.get('/alerts', authenticate, stockAlertController.getAlerts);
router.get('/alerts/check', authenticate, stockAlertController.checkMinimumStock);
router.put('/alerts/minimum-stock/:productId', authenticate, stockAlertController.updateMinimumStock);
router.put('/alerts/minimum-stock-bulk', authenticate, stockAlertController.updateMinimumStockBulk);

// Toplu güncelleme
router.put('/bulk/stock', authenticate, bulkUpdateController.updateStockBulk);
router.put('/bulk/price', authenticate, bulkUpdateController.updatePriceBulk);

export default router;
