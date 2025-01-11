import axios from 'axios';
import { Product, ApiResponse } from '../types';

// API temel URL'si
const BASE_URL = 'http://localhost:3000/api/products';

// Axios instance oluştur
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    responseType: 'json'
});

export const productService = {
    getAll: async (search?: string) => {
        const response = await api.get<ApiResponse<Product[]>>(search ? `?search=${search}` : '');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await api.get<ApiResponse<Product>>(`/${id}`);
        return response.data;
    },

    create: async (data: Partial<Product>) => {
        const response = await api.post<ApiResponse<Product>>('/', data);
        return response.data;
    },

    update: async (id: number, data: Partial<Product>) => {
        const response = await api.put<ApiResponse<Product>>(`/${id}`, data);
        return response.data;
    },

    delete: async (id: number) => {
        const response = await api.delete<ApiResponse<void>>(`/${id}`);
        return response.data;
    },

    downloadTemplate: async () => {
        const response = await axios.get(`${BASE_URL}/template`, {
            responseType: 'blob',
            headers: {
                Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
        });
        return response;
    },

    downloadExcel: async () => {
        const response = await axios.get(`${BASE_URL}/excel`, {
            responseType: 'blob',
            headers: {
                Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
        });
        return response;
    },

    uploadExcel: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post<ApiResponse<void>>('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
