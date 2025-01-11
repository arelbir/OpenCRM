import express from 'express';
import cors from 'cors';
import routes from './routes';
import { sequelize, initializeDatabase } from './config/database';
import './models/associations';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || 'Bir hata oluştu!' });
});

// Database connection and server start
const PORT = process.env.PORT || 3000;

initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database connection failed:', err);
    });
