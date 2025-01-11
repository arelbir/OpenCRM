import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
    // Önce tabloyu sil (eğer varsa)
    await queryInterface.dropTable('Customers', { force: true });

    // Yeni tabloyu oluştur
    await queryInterface.createTable('Customers', {
        CustomerID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        CustomerCode: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },
        CompanyName: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        ContactPerson: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        ContactPhone: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        Email: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        Phone: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        Address: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        City: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        District: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        TaxOffice: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        TaxNumber: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        Notes: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        IsActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    });

    // İndexleri ekle
    await queryInterface.addIndex('Customers', ['CustomerCode'], {
        unique: true,
        name: 'customers_customer_code_unique'
    });

    await queryInterface.addIndex('Customers', ['Email'], {
        unique: true,
        name: 'customers_email_unique'
    });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable('Customers');
}
