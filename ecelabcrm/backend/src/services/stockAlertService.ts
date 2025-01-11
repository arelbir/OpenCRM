import { Op } from 'sequelize';
import { Product } from '../models';
import ApiError from '../utils/ApiError';

export const stockAlertService = {
    // Minimum stok kontrolü
    async checkMinimumStock() {
        const products = await Product.findAll({
            where: {
                Stock: {
                    [Op.lte]: sequelize.col('MinimumStock'),
                },
                IsActive: true,
            },
        });

        return products;
    },

    // Stok alarmlarını getir
    async getAlerts() {
        const alerts = await Product.findAll({
            where: {
                [Op.and]: [
                    {
                        Stock: {
                            [Op.lte]: sequelize.col('MinimumStock'),
                        },
                    },
                    { IsActive: true },
                ],
            },
            attributes: [
                'ProductID',
                'Brand',
                'Code',
                'Description',
                'Stock',
                'MinimumStock',
            ],
        });

        return alerts.map(product => ({
            ...product.toJSON(),
            shortage: product.MinimumStock - product.Stock,
        }));
    },

    // Minimum stok güncelle
    async updateMinimumStock(productId: number, minimumStock: number) {
        const product = await Product.findByPk(productId);

        if (!product) {
            throw new ApiError(404, 'Ürün bulunamadı');
        }

        await product.update({ MinimumStock: minimumStock });

        return product;
    },

    // Toplu minimum stok güncelleme
    async updateMinimumStockBulk(updates: { productId: number; minimumStock: number }[]) {
        const transaction = await sequelize.transaction();

        try {
            const results = await Promise.all(
                updates.map(async ({ productId, minimumStock }) => {
                    const product = await Product.findByPk(productId, { transaction });
                    
                    if (!product) {
                        throw new ApiError(404, `Ürün bulunamadı: ${productId}`);
                    }

                    await product.update({ MinimumStock: minimumStock }, { transaction });
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
