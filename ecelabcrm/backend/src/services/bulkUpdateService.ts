import { Transaction } from 'sequelize';
import { Product, PriceHistory } from '../models';
import { sequelize } from '../config/database';
import ApiError from '../utils/ApiError';
import { stockMovementService } from './stockMovementService';

interface BulkStockUpdate {
    productId: number;
    newStock: number;
    description: string;
}

interface BulkPriceUpdate {
    productId: number;
    newPrice: number;
    reason?: string;
    changedBy?: string;
}

export const bulkUpdateService = {
    // Toplu stok güncelleme
    async updateStockBulk(updates: BulkStockUpdate[], createdBy?: string) {
        const transaction = await sequelize.transaction();

        try {
            const results = await Promise.all(
                updates.map(async ({ productId, newStock, description }) => {
                    const product = await Product.findByPk(productId, { transaction });
                    
                    if (!product) {
                        throw new ApiError(404, `Ürün bulunamadı: ${productId}`);
                    }

                    const difference = newStock - product.Stock;
                    const type = difference > 0 ? 'IN' : 'OUT';

                    // Stok hareketi oluştur
                    await stockMovementService.createMovement({
                        ProductID: productId,
                        Type: type,
                        Quantity: Math.abs(difference),
                        Description: description,
                        CreatedBy: createdBy,
                    });

                    await product.update({ Stock: newStock }, { transaction });
                    return product;
                })
            );

            await transaction.commit();
            return results;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    // Toplu fiyat güncelleme
    async updatePriceBulk(updates: BulkPriceUpdate[]) {
        const transaction = await sequelize.transaction();

        try {
            const results = await Promise.all(
                updates.map(async ({ productId, newPrice, reason, changedBy }) => {
                    const product = await Product.findByPk(productId, { transaction });
                    
                    if (!product) {
                        throw new ApiError(404, `Ürün bulunamadı: ${productId}`);
                    }

                    // Fiyat geçmişi oluştur
                    await PriceHistory.create(
                        {
                            ProductID: productId,
                            OldPrice: product.Price,
                            NewPrice: newPrice,
                            Reason: reason,
                            ChangedBy: changedBy,
                        },
                        { transaction }
                    );

                    await product.update({ Price: newPrice }, { transaction });
                    return product;
                })
            );

            await transaction.commit();
            return results;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
