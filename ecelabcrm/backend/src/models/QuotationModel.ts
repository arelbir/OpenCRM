import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Customer } from './CustomerModel';

export interface QuotationAttributes {
    QuotationID: number;
    CustomerID: number;
    QuotationNumber: string;
    Date: Date;
    Status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';
    TotalAmount: number;
    Notes?: string;
    IsActive: boolean;
    CreatedAt: Date;
    UpdatedAt: Date;
}

interface QuotationCreationAttributes extends Optional<QuotationAttributes, 'QuotationID' | 'CreatedAt' | 'UpdatedAt'> {}

class Quotation extends Model<QuotationAttributes, QuotationCreationAttributes> implements QuotationAttributes {
    public QuotationID!: number;
    public CustomerID!: number;
    public QuotationNumber!: string;
    public Date!: Date;
    public Status!: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';
    public TotalAmount!: number;
    public Notes?: string;
    public IsActive!: boolean;
    public CreatedAt!: Date;
    public UpdatedAt!: Date;
}

Quotation.init(
    {
        QuotationID: {
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
        QuotationNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        Date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        Status: {
            type: DataTypes.ENUM('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED'),
            allowNull: false,
            defaultValue: 'DRAFT',
        },
        TotalAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
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
        },
    },
    {
        sequelize,
        tableName: 'Quotations',
        timestamps: true,
        createdAt: 'CreatedAt',
        updatedAt: 'UpdatedAt'
    }
);

export { Quotation };
