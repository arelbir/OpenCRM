import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ProductAttributes {
    ProductID: number;
    Code: string;
    Brand: string;
    Description: string;
    ExpiryDate?: Date;
    Stock: number;
    MinimumStock: number;
    Price: number;
    IsActive: boolean;
    CreatedAt?: Date;
    UpdatedAt?: Date;
}

export interface ProductCreationAttributes extends Optional<ProductAttributes, 'ProductID' | 'CreatedAt' | 'UpdatedAt'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
    public ProductID!: number;
    public Code!: string;
    public Brand!: string;
    public Description!: string;
    public ExpiryDate?: Date;
    public Stock!: number;
    public MinimumStock!: number;
    public Price!: number;
    public IsActive!: boolean;
    public readonly CreatedAt!: Date;
    public readonly UpdatedAt!: Date;
}

Product.init(
    {
        ProductID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        Code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        Brand: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ExpiryDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        Stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        MinimumStock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        Price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
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
        },
    },
    {
        sequelize,
        tableName: 'Products',
        timestamps: true,
        createdAt: 'CreatedAt',
        updatedAt: 'UpdatedAt'
    }
);

export { Product };
