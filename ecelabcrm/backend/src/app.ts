import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './config/database';

// Routes
import customerRoutes from './routes/customerRoutes';
import productRoutes from './routes/productRoutes';
import quotationRoutes from './routes/quotationRoutes';
import reminderRoutes from './routes/reminderRoutes';
import excelRoutes from './routes/excelRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/excel', excelRoutes);

// Gerekli klasörleri oluştur
import fs from 'fs';
import path from 'path';

const createDirIfNotExists = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const uploadsDir = path.join(__dirname, '..', 'uploads');
const tempDir = path.join(__dirname, '..', 'temp');

createDirIfNotExists(uploadsDir);
createDirIfNotExists(tempDir);

// Veritabanını başlat
initializeDatabase().then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => {
    console.error('Server başlatılamadı:', error);
    process.exit(1);
});

export default app;
