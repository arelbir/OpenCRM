import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
    up: async (queryInterface: QueryInterface) => {
        await queryInterface.addColumn('Products', 'Model', {
            type: DataTypes.STRING(100),
            allowNull: true,
        });

        await queryInterface.addColumn('Products', 'Unit', {
            type: DataTypes.STRING(50),
            allowNull: true,
        });

        await queryInterface.addColumn('Products', 'Category', {
            type: DataTypes.STRING(100),
            allowNull: true,
        });

        await queryInterface.addColumn('Products', 'SubCategory', {
            type: DataTypes.STRING(100),
            allowNull: true,
        });
    },

    down: async (queryInterface: QueryInterface) => {
        await queryInterface.removeColumn('Products', 'Model');
        await queryInterface.removeColumn('Products', 'Unit');
        await queryInterface.removeColumn('Products', 'Category');
        await queryInterface.removeColumn('Products', 'SubCategory');
    }
};
