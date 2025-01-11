import { get, post, put, del } from './api';
import { Quotation, CreateQuotationInput, UpdateQuotationInput } from '../types';

const BASE_URL = '/quotations';

export interface QuotationFilters {
    customerId?: number;
    status?: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
    startDate?: string;
    endDate?: string;
}

export const quotationService = {
    // Tüm teklifleri getir
    getAll: async (filters?: QuotationFilters) => {
        const queryParams = new URLSearchParams();
        if (filters?.customerId) queryParams.append('customerId', String(filters.customerId));
        if (filters?.status) queryParams.append('status', filters.status);
        if (filters?.startDate) queryParams.append('startDate', filters.startDate);
        if (filters?.endDate) queryParams.append('endDate', filters.endDate);
        
        const url = `${BASE_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return get<Quotation[]>(url);
    },

    // ID'ye göre teklif getir
    getById: async (id: number) => {
        return get<Quotation>(`${BASE_URL}/${id}`);
    },

    // Yeni teklif oluştur
    create: async (data: CreateQuotationInput) => {
        return post<Quotation>(BASE_URL, data);
    },

    // Teklif güncelle
    update: async (id: number, data: UpdateQuotationInput) => {
        return put<Quotation>(`${BASE_URL}/${id}`, data);
    },

    // Teklif sil (soft delete)
    delete: async (id: number) => {
        return del<void>(`${BASE_URL}/${id}`);
    },

    // Teklifi PDF olarak indir
    downloadPdf: async (id: number) => {
        return get<Blob>(`${BASE_URL}/${id}/pdf`, {
            responseType: 'blob',
            headers: {
                'Accept': 'application/pdf'
            }
        });
    },

    // Teklifi e-posta olarak gönder
    sendEmail: async (id: number, email: string) => {
        return post<void>(`${BASE_URL}/${id}/send-email`, { email });
    }
};
