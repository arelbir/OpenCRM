import { get, post, put, del } from './api';
import { Reminder, CreateReminderInput, UpdateReminderInput } from '../types';

const BASE_URL = '/reminders';

export interface ReminderFilters {
    status?: 'Pending' | 'Completed' | 'Cancelled';
    priority?: 'Low' | 'Medium' | 'High';
    dueDate?: string;
    customerId?: number;
}

export const reminderService = {
    // Tüm hatırlatıcıları getir
    getAll: async (filters?: ReminderFilters) => {
        const queryParams = new URLSearchParams();
        if (filters?.status) queryParams.append('status', filters.status);
        if (filters?.priority) queryParams.append('priority', filters.priority);
        if (filters?.dueDate) queryParams.append('dueDate', filters.dueDate);
        if (filters?.customerId) queryParams.append('customerId', String(filters.customerId));
        
        const url = `${BASE_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return get<Reminder[]>(url);
    },

    // ID'ye göre hatırlatıcı getir
    getById: async (id: number) => {
        return get<Reminder>(`${BASE_URL}/${id}`);
    },

    // Yeni hatırlatıcı oluştur
    create: async (data: CreateReminderInput) => {
        return post<Reminder>(BASE_URL, data);
    },

    // Hatırlatıcı güncelle
    update: async (id: number, data: UpdateReminderInput) => {
        return put<Reminder>(`${BASE_URL}/${id}`, data);
    },

    // Hatırlatıcı sil (soft delete)
    delete: async (id: number) => {
        return del<void>(`${BASE_URL}/${id}`);
    },

    // Yaklaşan hatırlatıcıları getir
    getUpcoming: async (days: number = 7) => {
        return get<Reminder[]>(`${BASE_URL}/upcoming?days=${days}`);
    },

    // Bugünkü hatırlatıcıları getir
    getToday: async () => {
        return get<Reminder[]>(`${BASE_URL}/today`);
    },

    // Gecikmiş hatırlatıcıları getir
    getOverdue: async () => {
        return get<Reminder[]>(`${BASE_URL}/overdue`);
    }
};
