import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Customer } from './CustomerModel';
import { Product } from './ProductModel';

export interface ReminderAttributes {
    ReminderID: number;
    CustomerID: number;
    ProductID?: number;
    Title: string;
    Description: string;
    DueDate: Date;
    Status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
    IsActive: boolean;
    CreatedAt: Date;
    UpdatedAt: Date;
}

interface ReminderCreationAttributes extends Optional<ReminderAttributes, 'ReminderID' | 'CreatedAt' | 'UpdatedAt'> {}

class Reminder extends Model<ReminderAttributes, ReminderCreationAttributes> implements ReminderAttributes {
    public ReminderID!: number;
    public CustomerID!: number;
    public ProductID?: number;
    public Title!: string;
    public Description!: string;
    public DueDate!: Date;
    public Status!: 'PENDING' | 'COMPLETED' | 'CANCELLED';
    public IsActive!: boolean;
    public CreatedAt!: Date;
    public UpdatedAt!: Date;
}

Reminder.init(
    {
        ReminderID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        CustomerID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Customer,
                key: 'CustomerID',
            },
        },
        ProductID: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Product,
                key: 'ProductID',
            },
        },
        Title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        DueDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        Status: {
            type: DataTypes.ENUM('PENDING', 'COMPLETED', 'CANCELLED'),
            allowNull: false,
            defaultValue: 'PENDING',
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
        tableName: 'Reminders',
        timestamps: true,
        createdAt: 'CreatedAt',
        updatedAt: 'UpdatedAt'
    }
);

export { Reminder };
