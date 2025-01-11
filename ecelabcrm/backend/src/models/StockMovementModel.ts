import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Product } from './ProductModel';

export interface StockMovementAttributes {
    MovementID: number;
    ProductID: number;
    Type: 'IN' | 'OUT';
    Quantity: number;
    PreviousStock: number;
    NewStock: number;
    Description: string;
    CreatedAt: Date;
    UpdatedAt: Date;
    CreatedBy?: string;
}

interface StockMovementCreationAttributes extends Optional<StockMovementAttributes, 'MovementID' | 'CreatedAt' | 'UpdatedAt'> {}

class StockMovement extends Model<StockMovementAttributes, StockMovementCreationAttributes> implements StockMovementAttributes {
    public MovementID!: number;
    public ProductID!: number;
    public Type!: 'IN' | 'OUT';
    public Quantity!: number;
    public PreviousStock!: number;
    public NewStock!: number;
    public Description!: string;
    public CreatedAt!: Date;
    public UpdatedAt!: Date;
    public CreatedBy?: string;
}

StockMovement.init(
    {
        MovementID: {
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
        Type: {
            type: DataTypes.ENUM('IN', 'OUT'),
            allowNull: false,
        },
        Quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        PreviousStock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        NewStock: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: false,
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
        CreatedBy: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'StockMovements',
        timestamps: true,
        createdAt: 'CreatedAt',
        updatedAt: 'UpdatedAt'
    }
);

// İlişkileri tanımla
StockMovement.belongsTo(Product, {
    foreignKey: 'ProductID',
    as: 'Product',
});

export { StockMovement };
