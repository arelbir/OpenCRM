// API Response tipi
export interface ApiResponse<T> {
    data: T;
    error?: string;
    message?: string;
}

// Müşteri tipleri
export interface Customer {
    CustomerID: number;
    CustomerCode: string;
    Name: string;
    Email: string;
    Phone: string;
    Address?: string;
    TaxOffice?: string;
    TaxNumber?: string;
    ContactPerson?: string;
    ContactPhone?: string;
    Notes?: string;
    IsActive: boolean;
    CreatedAt: string;
    UpdatedAt: string;
}

export type CreateCustomerInput = Omit<Customer, 'CustomerID' | 'CustomerCode' | 'IsActive' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateCustomerInput = Partial<CreateCustomerInput>;

// Ürün tipleri
export interface Product {
    ProductID: number;
    Brand: string;
    Code: string;
    Description: string;
    Stock: number;
    Price: number;
    ExpiryDate?: string;
    MinimumStock: number;
    IsActive: boolean;
    CreatedAt: string;
    UpdatedAt: string;
}

export type CreateProductInput = Omit<Product, 'ProductID' | 'IsActive' | 'CreatedAt' | 'UpdatedAt'>;
export type UpdateProductInput = Partial<CreateProductInput>;

// Teklif tipleri
export interface QuotationDetail {
    QuotationDetailID: number;
    QuotationID: number;
    ProductID: number;
    Quantity: number;
    UnitPrice: number;
    Discount: number;
    CreatedAt: string;
    UpdatedAt: string;
    Product?: Product;
}

export interface Quotation {
    QuotationID: number;
    QuotationNumber: string;
    CustomerID: number;
    QuotationDate: string;
    ValidUntil: string;
    TotalAmount: number;
    Status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
    Notes?: string;
    IsActive: boolean;
    CreatedAt: string;
    UpdatedAt: string;
    Customer?: Customer;
    Details: QuotationDetail[];
}

export interface CreateQuotationDetailInput {
    ProductID: number;
    Quantity: number;
    UnitPrice: number;
    Discount?: number;
}

export interface CreateQuotationInput {
    CustomerID: number;
    QuotationDate: string;
    ValidUntil: string;
    Status: Quotation['Status'];
    Notes?: string;
    Details: CreateQuotationDetailInput[];
}

export type UpdateQuotationInput = Partial<Omit<CreateQuotationInput, 'CustomerID'>>;

// Hatırlatıcı tipleri
export interface Reminder {
    ReminderID: number;
    CustomerID: number;
    ProductID?: number;
    Title: string;
    Description?: string;
    DueDate: string;
    Status: 'Pending' | 'Completed' | 'Cancelled';
    Priority: 'Low' | 'Medium' | 'High';
    IsActive: boolean;
    CreatedAt: string;
    UpdatedAt: string;
    Customer?: Customer;
    Product?: Product;
}

export interface CreateReminderInput {
    CustomerID: number;
    ProductID?: number;
    Title: string;
    Description?: string;
    DueDate: string;
    Status: Reminder['Status'];
    Priority: Reminder['Priority'];
}

export type UpdateReminderInput = Partial<CreateReminderInput>;
