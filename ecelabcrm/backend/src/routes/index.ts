import express from 'express';
import customerRoutes from './customerRoutes';
import productRoutes from './productRoutes';
import quotationRoutes from './quotationRoutes';
import reminderRoutes from './reminderRoutes';
import stockRoutes from './stockRoutes';

const router = express.Router();

router.use('/customers', customerRoutes);
router.use('/products', productRoutes);
router.use('/quotations', quotationRoutes);
router.use('/reminders', reminderRoutes);
router.use('/stock', stockRoutes);

export default router;
