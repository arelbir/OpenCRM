import { axiosInstance } from '../lib/axios';
import { Customer, CreateCustomerInput, UpdateCustomerInput } from '../types';

const CUSTOMERS_URL = '/customers';

export interface CustomerFilters {
    search?: string;
    city?: string;
    country?: string;
}

export const customerService = {
    // Müşteri listesini getir
    getAll: async (filters?: CustomerFilters) => {
        const { data } = await axiosInstance.get<Customer[]>(CUSTOMERS_URL, { params: filters });
        return data;
    },

    // Müşteri detayını getir
    getById: async (id: number) => {
        const { data } = await axiosInstance.get<Customer>(`${CUSTOMERS_URL}/${id}`);
        return data;
    },

    // Yeni müşteri oluştur
    create: async (customer: CreateCustomerInput) => {
        try {
            const { data } = await axiosInstance.post<Customer>(CUSTOMERS_URL, customer);
            return data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Müşteri oluşturulurken bir hata oluştu');
        }
    },

    // Müşteri güncelle
    update: async (id: number, customer: UpdateCustomerInput) => {
        try {
            const { data } = await axiosInstance.put<Customer>(`${CUSTOMERS_URL}/${id}`, customer);
            return data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Müşteri güncellenirken bir hata oluştu');
        }
    },

    // Müşteri sil
    delete: async (id: number) => {
        try {
            await axiosInstance.delete(`${CUSTOMERS_URL}/${id}`);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Müşteri silinirken bir hata oluştu');
        }
    },

    // Müşterinin tekliflerini getir
    getQuotations: async (customerId: number) => {
        const { data } = await axiosInstance.get(`${CUSTOMERS_URL}/${customerId}/quotations`);
        return data;
    },

    // Excel şablonu indir
    downloadTemplate: async () => {
        const response = await axiosInstance.get('/customers/template', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'musteri_sablonu.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
    },

    // Excel ile müşteri yükle
    import: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axiosInstance.post('/customers/import', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};
