import { Transaction } from 'sequelize';
import { StockMovement, Product } from '../models';
import { StockMovementAttributes } from '../models/StockMovementModel';
import { sequelize } from '../config/database';
import ApiError from '../utils/ApiError';

interface CreateMovementInput {
    ProductID: number;
    Type: 'IN' | 'OUT';
    Quantity: number;
    Description: string;
    CreatedBy?: string;
}

export const stockMovementService = {
    // Stok hareketi oluştur
    async createMovement(data: CreateMovementInput) {
        const transaction = await sequelize.transaction();

        try {
            const product = await Product.findByPk(data.ProductID, { transaction });
            
            if (!product) {
                throw new ApiError(404, 'Ürün bulunamadı');
            }

            const previousStock = product.Stock;
            let newStock = previousStock;

            if (data.Type === 'IN') {
                newStock += data.Quantity;
            } else {
                if (previousStock < data.Quantity) {
                    throw new ApiError(400, 'Yetersiz stok');
                }
                newStock -= data.Quantity;
            }

            // Ürün stokunu güncelle
            await product.update({ Stock: newStock }, { transaction });

            // Stok hareketini kaydet
            const movement = await StockMovement.create(
                {
                    ...data,
                    PreviousStock: previousStock,
                    NewStock: newStock,
                },
                { transaction }
            );

            await transaction.commit();
            return movement;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    // Ürüne göre stok hareketlerini getir
    async getMovementsByProduct(productId: number) {
        const movements = await StockMovement.findAll({
            where: { ProductID: productId },
            include: [
                {
                    model: Product,
                    as: 'StockMovementProduct',
                    attributes: ['Brand', 'Code', 'Description'],
                },
            ],
            order: [['CreatedAt', 'DESC']],
        });

        return movements;
    },

    // Tarih aralığına göre stok hareketlerini getir
    async getMovementsByDateRange(startDate: Date, endDate: Date) {
        const movements = await StockMovement.findAll({
            where: {
                CreatedAt: {
                    [Op.between]: [startDate, endDate],
                },
            },
            include: [
                {
                    model: Product,
                    as: 'StockMovementProduct',
                    attributes: ['Brand', 'Code', 'Description'],
                },
            ],
            order: [['CreatedAt', 'DESC']],
        });

        return movements;
    },

    // Tüm stok hareketlerini getir
    async getAllMovements() {
        const movements = await StockMovement.findAll({
            include: [
                {
                    model: Product,
                    as: 'StockMovementProduct',
                    attributes: ['Brand', 'Code', 'Description'],
                },
            ],
            order: [['CreatedAt', 'DESC']],
        });

        return movements;
    },
};
