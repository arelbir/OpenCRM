const { DataTypes } = require('sequelize');

module.exports = {
    up: async (queryInterface) => {
        // Create Customers Table
        await queryInterface.createTable('Customers', {
            CustomerID: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            CustomerCode: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
            },
            CompanyName: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            Country: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            City: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            ContactName: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            Email: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            Phone: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            Notes: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            CreatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            UpdatedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            IsActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        });

        // Create Products Table
        await queryInterface.createTable('Products', {
            ProductID: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            Brand: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            Code: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
            },
            Description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            Stock: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            Price: {
                type: DataTypes.DECIMAL(18, 2),
                allowNull: false,
            },
            ExpiryDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            MinimumStock: {
                type: DataTypes.INTEGER,
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
                allowNull: true,
            },
            IsActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        });

        // Create Quotations Table
        await queryInterface.createTable('Quotations', {
            QuotationID: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            QuotationNumber: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
            },
            CustomerID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Customers',
                    key: 'CustomerID',
                },
            },
            QuotationDate: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            ValidUntil: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            TotalAmount: {
                type: DataTypes.DECIMAL(18, 2),
                allowNull: false,
            },
            Status: {
                type: DataTypes.STRING(20),
                allowNull: false,
                defaultValue: 'Draft',
            },
            Notes: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            CreatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            UpdatedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            IsActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        });

        // Create QuotationDetails Table
        await queryInterface.createTable('QuotationDetails', {
            QuotationDetailID: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            QuotationID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Quotations',
                    key: 'QuotationID',
                },
            },
            ProductID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Products',
                    key: 'ProductID',
                },
            },
            Quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            UnitPrice: {
                type: DataTypes.DECIMAL(18, 2),
                allowNull: false,
            },
            TotalPrice: {
                type: DataTypes.DECIMAL(18, 2),
                allowNull: false,
            },
            CreatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        });

        // Create Reminders Table
        await queryInterface.createTable('Reminders', {
            ReminderID: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            CustomerID: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Customers',
                    key: 'CustomerID',
                },
            },
            Title: {
                type: DataTypes.STRING(200),
                allowNull: false,
            },
            Description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            DueDate: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            IsCompleted: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            Priority: {
                type: DataTypes.TINYINT,
                allowNull: false,
            },
            CreatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            UpdatedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        });

        // Create Indexes
        await queryInterface.addIndex('Customers', ['CustomerCode']);
        await queryInterface.addIndex('Products', ['Code']);
        await queryInterface.addIndex('Products', ['ExpiryDate']);
        await queryInterface.addIndex('Quotations', ['CustomerID']);
        await queryInterface.addIndex('Quotations', ['Status']);
        await queryInterface.addIndex('QuotationDetails', ['QuotationID']);
        await queryInterface.addIndex('Reminders', ['CustomerID']);
        await queryInterface.addIndex('Reminders', ['DueDate']);
    },

    down: async (queryInterface) => {
        // Drop tables in reverse order to handle foreign key constraints
        await queryInterface.dropTable('Reminders');
        await queryInterface.dropTable('QuotationDetails');
        await queryInterface.dropTable('Quotations');
        await queryInterface.dropTable('Products');
        await queryInterface.dropTable('Customers');
    },
};
