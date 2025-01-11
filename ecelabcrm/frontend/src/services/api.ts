import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { ApiResponse } from '../types';

// API temel URL'si
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Axios instance oluştur
export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor
api.interceptors.response.use(
    (response) => {
        // Başarılı response'ları doğrudan döndür
        return response;
    },
    (error: AxiosError<ApiResponse<unknown>>) => {
        // Hata mesajını hazırla
        const message = error.response?.data?.error || error.response?.data?.message || 'Bir hata oluştu';
        
        // Hata detaylarını console'a yaz
        console.error('API Error:', {
            status: error.response?.status,
            message,
            error,
        });

        // Hata fırlat
        return Promise.reject(error.response?.data?.error || error.response?.data?.message || 'Bir hata oluştu');
    }
);

export const handleApiError = (error: Error): string => {
    return error.message || 'Bir hata oluştu';
};

// Generic API functions
export const get = async <T>(url: string, config?: AxiosRequestConfig) => {
    try {
        const response = await api.get<T>(url, config);
        // Eğer responseType blob ise direkt response'u dön
        if (config?.responseType === 'blob') {
            return response;
        }
        return response.data;
    } catch (error) {
        throw handleApiError(error as Error);
    }
};

export const post = async <T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<T> => {
    try {
        const response = await api.post<T>(url, data, config);
        return response.data;
    } catch (error) {
        throw handleApiError(error as Error);
    }
};

export const put = async <T>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<T> => {
    try {
        const response = await api.put<T>(url, data, config);
        return response.data;
    } catch (error) {
        throw handleApiError(error as Error);
    }
};

export const patch = async <T>(url: string, data: unknown): Promise<ApiResponse<T>> => {
    try {
        const response = await api.patch<ApiResponse<T>>(url, data);
        return response.data;
    } catch (error) {
        throw new Error(handleApiError(error as Error));
    }
};

export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
        const response = await api.delete<T>(url, config);
        return response.data;
    } catch (error) {
        throw handleApiError(error as Error);
    }
};
