import { Customer } from './customer';

export interface Reminder {
    ReminderID?: number;
    Title: string;
    Description?: string;
    CustomerID: number;
    Customer?: Customer;
    DueDate: string;
    Priority: 'Low' | 'Medium' | 'High';
    Status: 'Pending' | 'Completed' | 'Cancelled';
    IsCompleted: boolean;
    CreatedAt?: string;
    UpdatedAt?: string;
}

export interface ReminderFilters {
    search?: string;
    status?: Reminder['Status'];
    priority?: Reminder['Priority'];
    fromDate?: string;
    toDate?: string;
}

export type CreateReminderInput = Omit<Reminder, 'ReminderID' | 'CreatedAt' | 'UpdatedAt' | 'Customer' | 'IsCompleted'>;

export type UpdateReminderInput = Partial<CreateReminderInput>;
