import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Product } from './ProductModel';

export interface PriceHistoryAttributes {
    PriceHistoryID: number;
    ProductID: number;
    OldPrice: number;
    NewPrice: number;
    ChangeDate: Date;
    ChangedBy?: string;
    Notes?: string;
    IsActive: boolean;
    CreatedAt: Date;
    UpdatedAt: Date;
}

interface PriceHistoryCreationAttributes extends Optional<PriceHistoryAttributes, 'PriceHistoryID' | 'CreatedAt' | 'UpdatedAt'> {}

class PriceHistory extends Model<PriceHistoryAttributes, PriceHistoryCreationAttributes> implements PriceHistoryAttributes {
    public PriceHistoryID!: number;
    public ProductID!: number;
    public OldPrice!: number;
    public NewPrice!: number;
    public ChangeDate!: Date;
    public ChangedBy?: string;
    public Notes?: string;
    public IsActive!: boolean;
    public CreatedAt!: Date;
    public UpdatedAt!: Date;
}

PriceHistory.init(
    {
        PriceHistoryID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        ProductID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Product,
                key: 'ProductID',
            },
        },
        OldPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        NewPrice: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        ChangeDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        ChangedBy: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Notes: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        IsActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
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
        }
    },
    {
        sequelize,
        tableName: 'PriceHistories',
        timestamps: true,
        createdAt: 'CreatedAt',
        updatedAt: 'UpdatedAt'
    }
);

// İlişkileri tanımla
PriceHistory.belongsTo(Product, {
    foreignKey: 'ProductID',
    as: 'Product',
});

export { PriceHistory };
