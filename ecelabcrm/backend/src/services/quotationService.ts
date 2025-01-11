import { Quotation, QuotationDetail, Customer, Product } from '../models';
import { Op, WhereOptions, Transaction } from 'sequelize';
import { sequelize } from '../config/database';
import { QuotationAttributes } from '../models/QuotationModel';
import { QuotationDetailAttributes } from '../models/QuotationDetailModel';

// Teklif oluşturma için gerekli alanları tanımla
type CreateQuotationInput = Omit<QuotationAttributes, 'QuotationID' | 'QuotationNumber' | 'CreatedAt' | 'UpdatedAt' | 'IsActive'> & {
    Details?: CreateQuotationDetailInput[];
};

// Teklif güncelleme için gerekli alanları tanımla
type UpdateQuotationInput = Partial<Omit<QuotationAttributes, 'QuotationID' | 'QuotationNumber' | 'CreatedAt' | 'UpdatedAt' | 'IsActive'>> & {
    Details?: CreateQuotationDetailInput[];
};

// Teklif detayı oluşturma için gerekli alanları tanımla
type CreateQuotationDetailInput = Omit<QuotationDetailAttributes, 'QuotationDetailID' | 'CreatedAt' | 'UpdatedAt'> & {
    Discount?: number;
};

// Teklif detayı güncelleme için gerekli alanları tanımla
type UpdateQuotationDetailInput = Partial<Omit<QuotationDetailAttributes, 'QuotationDetailID' | 'QuotationID' | 'CreatedAt' | 'UpdatedAt'>> & {
    Discount?: number;
};

export const quotationService = {
    // Tüm teklifleri getir
    async getAllQuotations() {
        try {
            const quotations = await Quotation.findAll({
                where: { IsActive: true },
                include: [
                    {
                        model: Customer,
                        as: 'Customer',
                        attributes: ['Name', 'Email', 'Phone']
                    },
                    {
                        model: QuotationDetail,
                        as: 'QuotationDetails',
                        include: [{
                            model: Product,
                            as: 'QuotationProduct',
                            attributes: ['Brand', 'Code', 'Description']
                        }]
                    }
                ],
                order: [['CreatedAt', 'DESC']]
            });
            return quotations;
        } catch (error) {
            console.error('Teklifler getirilirken hata oluştu:', error);
            throw error;
        }
    },

    // Teklif detayıyla birlikte teklifi getir
    async getQuotationById(quotationId: number) {
        try {
            const quotation = await Quotation.findOne({
                where: { QuotationID: quotationId },
                include: [
                    {
                        model: Customer,
                        as: 'Customer',
                        attributes: ['Name', 'Email', 'Phone']
                    },
                    {
                        model: QuotationDetail,
                        as: 'QuotationDetails',
                        include: [{
                            model: Product,
                            as: 'QuotationProduct',
                            attributes: ['Brand', 'Code', 'Description']
                        }]
                    }
                ]
            });

            if (!quotation) {
                throw new Error('Teklif bulunamadı');
            }

            return quotation;
        } catch (error) {
            console.error('Teklif getirilirken hata:', error);
            throw error;
        }
    },

    // Yeni teklif ekle
    async createQuotation(quotationData: CreateQuotationInput) {
        let t;
        try {
            t = await sequelize.transaction();

            // Müşteriyi kontrol et
            const customer = await Customer.findByPk(quotationData.CustomerID);
            if (!customer) {
                throw new Error('Müşteri bulunamadı');
            }

            // Son teklif numarasını bul
            const lastQuotation = await Quotation.findOne({
                order: [['QuotationNumber', 'DESC']],
                transaction: t
            });

            // Yeni teklif numarası oluştur (YYYYMMXXX formatında)
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const lastNumber = lastQuotation
                ? parseInt(lastQuotation.QuotationNumber.slice(-3))
                : 0;
            const newNumber = String(lastNumber + 1).padStart(3, '0');
            const quotationNumber = `${year}${month}${newNumber}`;

            // Varsayılan değerleri ekle
            const validUntil = new Date(today);
            validUntil.setMonth(validUntil.getMonth() + 1);

            // Teklif detaylarını ayır
            const { Details, ...quotationFields } = quotationData;

            // Yeni teklif oluştur
            const quotation = await Quotation.create({
                ...quotationFields,
                QuotationNumber: quotationNumber,
                Date: today,
                Status: 'DRAFT',  // Status değerini doğru formatta ayarla
                IsActive: true,
            }, { transaction: t });

            // Teklif detaylarını ekle
            if (Details && Details.length > 0) {
                // Ürünleri detaylı kontrol et
                for (const detail of Details) {
                    const product = await Product.findByPk(detail.ProductID);
                    if (!product) {
                        throw new Error(`Ürün bulunamadı: ${detail.ProductID}`);
                    }
                    // Ürün fiyatını kontrol et
                    if (!product.Price) {
                        throw new Error(`Ürün fiyatı tanımlanmamış: ${detail.ProductID}`);
                    }

                    // LineTotal hesapla
                    const lineTotal = detail.Quantity * detail.UnitPrice * (1 - (detail.Discount || 0) / 100);

                    // Teklif detayı oluştur
                    await QuotationDetail.create({
                        QuotationID: quotation.QuotationID,
                        ProductID: detail.ProductID,
                        Quantity: detail.Quantity,
                        UnitPrice: detail.UnitPrice,
                        Discount: detail.Discount || 0,
                        LineTotal: lineTotal
                    }, { transaction: t });
                }
            }

            await t.commit();

            // Teklifi detaylarıyla birlikte getir
            const createdQuotation = await this.getQuotationById(quotation.QuotationID);
            return createdQuotation;

        } catch (error) {
            if (t) {
                try {
                    await t.rollback();
                } catch (rollbackError) {
                    console.error('Rollback hatası:', rollbackError);
                }
            }
            console.error('Teklif eklenirken hata:', error);
            throw error;
        }
    },

    // Teklifi güncelle
    async updateQuotation(id: number, quotationData: UpdateQuotationInput) {
        try {
            const quotation = await Quotation.findByPk(id);
            if (!quotation) {
                throw new Error('Teklif bulunamadı');
            }

            // Status değerini kontrol et ve düzelt
            if (quotationData.Status) {
                const validStatuses = ['Draft', 'Sent', 'Accepted', 'Rejected'];
                // Gelen status değerini düzelt (büyük/küçük harf)
                const normalizedStatus = quotationData.Status.charAt(0).toUpperCase() + quotationData.Status.slice(1).toLowerCase();
                
                if (!validStatuses.includes(normalizedStatus)) {
                    throw new Error(`Geçersiz status değeri. Geçerli değerler: ${validStatuses.join(', ')}`);
                }
                quotationData.Status = normalizedStatus as QuotationAttributes['Status'];
            }

            // Teklif detaylarını ayır
            const { Details, ...updateFields } = quotationData;

            // Teklifi güncelle
            await quotation.update(updateFields);

            // Detaylar varsa güncelle
            if (Details && Details.length > 0) {
                // Önce mevcut detayları sil
                await QuotationDetail.destroy({
                    where: { QuotationID: id }
                });

                // Yeni detayları ekle
                const detailsWithQuotationId = Details.map((detail: CreateQuotationDetailInput) => ({
                    ...detail,
                    QuotationID: id,
                    CreatedAt: new Date(),
                    UpdatedAt: new Date()
                }));

                await QuotationDetail.bulkCreate(detailsWithQuotationId);
            }

            // Güncellenmiş teklifi getir
            return await this.getQuotationById(id);
        } catch (error) {
            console.error('Teklif güncellenirken hata:', error);
            throw error;
        }
    },

    // Teklifi sil
    async deleteQuotation(id: number) {
        let t;
        try {
            t = await sequelize.transaction();

            // Teklifi bul
            const quotation = await Quotation.findByPk(id);
            if (!quotation) {
                throw new Error('Teklif bulunamadı');
            }

            // Sil (soft delete)
            await quotation.update({ IsActive: false }, { transaction: t });

            await t.commit();
            return true;
        } catch (error) {
            if (t) {
                try {
                    await t.rollback();
                } catch (rollbackError) {
                    console.error('Rollback hatası:', rollbackError);
                }
            }
            console.error(`Teklif (ID: ${id}) silinirken hata:`, error);
            throw error;
        }
    },

    // Teklif detayı ekle
    async addQuotationDetail(quotationId: number, detailData: CreateQuotationDetailInput) {
        let t;
        try {
            t = await sequelize.transaction();

            // Teklifi kontrol et
            const quotation = await Quotation.findByPk(quotationId, { transaction: t });
            if (!quotation) {
                throw new Error('Teklif bulunamadı');
            }

            // Ürünü kontrol et
            const product = await Product.findByPk(detailData.ProductID, { transaction: t });
            if (!product) {
                throw new Error('Ürün bulunamadı');
            }

            // LineTotal hesapla
            const lineTotal = detailData.Quantity * detailData.UnitPrice * (1 - (detailData.Discount || 0) / 100);

            // Teklif detayı oluştur
            const detail = await QuotationDetail.create({
                QuotationID: quotationId,
                ProductID: detailData.ProductID,
                Quantity: detailData.Quantity,
                UnitPrice: detailData.UnitPrice,
                Discount: detailData.Discount || 0,
                LineTotal: lineTotal
            }, { transaction: t });

            // Teklifin toplam tutarını güncelle
            const allDetails = await QuotationDetail.findAll({
                where: { QuotationID: quotationId },
                transaction: t
            });

            const totalAmount = allDetails.reduce((sum, detail) => sum + detail.LineTotal, 0);
            await quotation.update({ TotalAmount: totalAmount }, { transaction: t });

            await t.commit();
            return detail;
        } catch (error) {
            if (t) await t.rollback();
            console.error('Teklif detayı eklenirken hata:', error);
            throw error;
        }
    },

    // Teklif detayı güncelle
    async updateQuotationDetail(id: number, detailData: UpdateQuotationDetailInput) {
        let t;
        try {
            t = await sequelize.transaction();

            // Detayı kontrol et
            const detail = await QuotationDetail.findByPk(id, { transaction: t });
            if (!detail) {
                throw new Error('Teklif detayı bulunamadı');
            }

            // Ürünü kontrol et
            if (detailData.ProductID) {
                const product = await Product.findByPk(detailData.ProductID, { transaction: t });
                if (!product) {
                    throw new Error('Ürün bulunamadı');
                }
            }

            // LineTotal hesapla
            const quantity = detailData.Quantity ?? detail.Quantity;
            const unitPrice = detailData.UnitPrice ?? detail.UnitPrice;
            const discount = detailData.Discount ?? detail.Discount;
            const lineTotal = quantity * unitPrice * (1 - discount / 100);

            // Detayı güncelle
            await detail.update({
                ...detailData,
                LineTotal: lineTotal
            }, { transaction: t });

            // Teklifin toplam tutarını güncelle
            const quotation = await Quotation.findByPk(detail.QuotationID, { transaction: t });
            if (quotation) {
                const allDetails = await QuotationDetail.findAll({
                    where: { QuotationID: detail.QuotationID },
                    transaction: t
                });

                const totalAmount = allDetails.reduce((sum, detail) => sum + detail.LineTotal, 0);
                await quotation.update({ TotalAmount: totalAmount }, { transaction: t });
            }

            await t.commit();
            return detail;
        } catch (error) {
            if (t) await t.rollback();
            console.error('Teklif detayı güncellenirken hata:', error);
            throw error;
        }
    },

    // Teklif detayı sil
    async deleteQuotationDetail(id: number) {
        let t;
        try {
            t = await sequelize.transaction();

            // Detayı bul
            const detail = await QuotationDetail.findByPk(id);
            if (!detail) {
                throw new Error('Teklif detayı bulunamadı');
            }

            // Sil
            await detail.destroy({ transaction: t });

            await t.commit();
            return true;
        } catch (error) {
            if (t) {
                try {
                    await t.rollback();
                } catch (rollbackError) {
                    console.error('Rollback hatası:', rollbackError);
                }
            }
            console.error(`Teklif detayı (ID: ${id}) silinirken hata:`, error);
            throw error;
        }
    }
};
