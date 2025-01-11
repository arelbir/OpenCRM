import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Product } from './ProductModel';
import { Quotation } from './QuotationModel';

export interface QuotationDetailAttributes {
    QuotationDetailID: number;
    QuotationID: number;
    ProductID: number;
    Quantity: number;
    UnitPrice: number;
    Discount: number;
    LineTotal: number;
    CreatedAt: Date;
    UpdatedAt: Date;
}

interface QuotationDetailCreationAttributes extends Optional<QuotationDetailAttributes, 'QuotationDetailID' | 'CreatedAt' | 'UpdatedAt'> {}

class QuotationDetail extends Model<QuotationDetailAttributes, QuotationDetailCreationAttributes> implements QuotationDetailAttributes {
    public QuotationDetailID!: number;
    public QuotationID!: number;
    public ProductID!: number;
    public Quantity!: number;
    public UnitPrice!: number;
    public Discount!: number;
    public LineTotal!: number;
    public CreatedAt!: Date;
    public UpdatedAt!: Date;
}

QuotationDetail.init(
    {
        QuotationDetailID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        QuotationID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Quotation,
                key: 'QuotationID',
            },
        },
        ProductID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Product,
                key: 'ProductID',
            },
        },
        Quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        UnitPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        Discount: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0,
        },
        LineTotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        },
        CreatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        UpdatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'QuotationDetails',
        timestamps: true,
        createdAt: 'CreatedAt',
        updatedAt: 'UpdatedAt'
    }
);

// Toplam tutarı hesapla
QuotationDetail.beforeCreate(async (detail: QuotationDetail) => {
    detail.LineTotal = detail.Quantity * detail.UnitPrice * (1 - detail.Discount / 100);
});

QuotationDetail.beforeUpdate(async (detail: QuotationDetail) => {
    detail.LineTotal = detail.Quantity * detail.UnitPrice * (1 - detail.Discount / 100);
});

export { QuotationDetail };
