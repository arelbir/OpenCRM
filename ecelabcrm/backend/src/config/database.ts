import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize({
    dialect: 'mssql',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    logging: false,
    dialectOptions: {
        options: {
            encrypt: true,
            trustServerCertificate: true
        }
    }
});

export async function initializeDatabase() {
    try {
        // Veritabanı bağlantısını test et
        await sequelize.authenticate();
        console.log('Veritabanı bağlantısı başarılı.');

        // Modelleri senkronize et (force: true ile tabloları yeniden oluştur)
        await sequelize.sync({ force: true });
        console.log('Veritabanı modelleri senkronize edildi.');

        return true;
    } catch (error) {
        console.error('Veritabanı başlatılırken hata:', error);
        return false;
    }
}
