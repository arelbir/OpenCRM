import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async (queryInterface: QueryInterface) => {
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
                type: DataTypes.STRING(500),
                allowNull: false,
            },
            Stock: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            Price: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            ExpiryDate: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            MinimumStock: {
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
        });
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.dropTable('Products');
    },
};
