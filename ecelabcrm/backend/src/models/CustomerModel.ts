import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface CustomerAttributes {
    CustomerID: number;
    CustomerCode: string;
    Name: string;
    Email: string;
    Phone: string;
    Address?: string;
    TaxOffice?: string;
    TaxNumber?: string;
    ContactPerson?: string;
    ContactPhone?: string;
    Notes?: string;
    IsActive: boolean;
    CreatedAt: Date;
    UpdatedAt: Date;
}

interface CustomerCreationAttributes extends Optional<CustomerAttributes, 'CustomerID' | 'CreatedAt' | 'UpdatedAt'> {}

class Customer extends Model<CustomerAttributes, CustomerCreationAttributes> implements CustomerAttributes {
    public CustomerID!: number;
    public CustomerCode!: string;
    public Name!: string;
    public Email!: string;
    public Phone!: string;
    public Address?: string;
    public TaxOffice?: string;
    public TaxNumber?: string;
    public ContactPerson?: string;
    public ContactPhone?: string;
    public Notes?: string;
    public IsActive!: boolean;
    public CreatedAt!: Date;
    public UpdatedAt!: Date;
}

Customer.init(
    {
        CustomerID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        CustomerCode: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        Phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Address: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        TaxOffice: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        TaxNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ContactPerson: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ContactPhone: {
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
        tableName: 'Customers',
        timestamps: true,
        createdAt: 'CreatedAt',
        updatedAt: 'UpdatedAt'
    }
);

export { Customer };
