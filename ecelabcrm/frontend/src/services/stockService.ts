import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface StockMovementInput {
    ProductID: number;
    Type: 'IN' | 'OUT';
    Quantity: number;
    Description: string;
}

interface BulkStockUpdate {
    productId: number;
    newStock: number;
    description: string;
}

interface BulkPriceUpdate {
    productId: number;
    newPrice: number;
    reason?: string;
}

export const stockService = {
    // Stok Hareketleri
    createMovement: async (data: StockMovementInput) => {
        const response = await axios.post(`${API_BASE_URL}/stock/movements`, data);
        return response.data;
    },

    getAllMovements: async () => {
        const response = await axios.get(`${API_BASE_URL}/stock/movements`);
        return response.data;
    },

    getMovementsByProduct: async (productId: number) => {
        const response = await axios.get(`${API_BASE_URL}/stock/movements/product/${productId}`);
        return response.data;
    },

    getMovementsByDateRange: async (startDate: Date, endDate: Date) => {
        const response = await axios.get(`${API_BASE_URL}/stock/movements/date-range`, {
            params: { startDate, endDate },
        });
        return response.data;
    },

    // Stok Alarmları
    getAlerts: async () => {
        const response = await axios.get(`${API_BASE_URL}/stock/alerts`);
        return response.data;
    },

    checkMinimumStock: async () => {
        const response = await axios.get(`${API_BASE_URL}/stock/alerts/check`);
        return response.data;
    },

    updateMinimumStock: async (productId: number, minimumStock: number) => {
        const response = await axios.put(
            `${API_BASE_URL}/stock/alerts/minimum-stock/${productId}`,
            { minimumStock }
        );
        return response.data;
    },

    updateMinimumStockBulk: async (updates: { productId: number; minimumStock: number }[]) => {
        const response = await axios.put(`${API_BASE_URL}/stock/alerts/minimum-stock-bulk`, {
            updates,
        });
        return response.data;
    },

    // Toplu Güncellemeler
    updateStockBulk: async (updates: BulkStockUpdate[]) => {
        const response = await axios.put(`${API_BASE_URL}/stock/bulk/stock`, { updates });
        return response.data;
    },

    updatePriceBulk: async (updates: BulkPriceUpdate[]) => {
        const response = await axios.put(`${API_BASE_URL}/stock/bulk/price`, { updates });
        return response.data;
    },
};
