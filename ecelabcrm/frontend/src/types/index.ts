// API Response Type
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

// Customer Types
export interface Customer {
  CustomerID: number;
  CompanyName: string;
  ContactName: string;
  Email: string;
  Phone?: string;
  Address?: string;
  Notes?: string;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export interface CustomerFormData {
  CustomerID?: number;
  CompanyName: string;
  ContactName: string;
  Email: string;
  Phone?: string;
  Address?: string;
  Notes?: string;
}

// Product Types
export interface Product {
  ProductID: number;
  Brand: string;
  Code: string;
  Description: string;
  Stock: number;
  Price: number;
  ExpiryDate?: Date;
  MinimumStock: number;
  IsActive: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
  Model?: string;
  Unit?: string;
  Category?: string;
  SubCategory?: string;
}

export type CreateProductInput = Omit<Product, 'ProductID' | 'CreatedAt' | 'UpdatedAt' | 'IsActive'>;
export type UpdateProductInput = Partial<CreateProductInput>;

export interface ProductFormData {
  ProductID?: number;
  Brand: string;
  Description: string;
  Code: string;
  Stock: number;
  MinimumStock: number;
  UnitPrice: number;
  ExpiryDate?: string;
}

// Quotation Types
export interface QuotationDetail {
  QuotationDetailID?: number;
  QuotationID?: number;
  ProductID: number;
  Product?: Product;
  Quantity: number;
  UnitPrice: number;
  TotalPrice: number;
}

export interface Quotation {
  QuotationID?: number;
  QuotationNumber?: string;
  CustomerID: number;
  Customer?: Customer;
  QuotationDate: Date;
  ValidUntil: Date;
  Status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
  Notes?: string;
  TotalAmount: number;
  Details: QuotationDetail[];
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export interface QuotationFormData {
  QuotationID?: number;
  QuotationNumber?: string;
  CustomerID: number;
  QuotationDate: string;
  ValidUntil: string;
  Status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
  Notes?: string;
  TotalAmount?: number;
  Details: {
    ProductID: number;
    Quantity: number;
    UnitPrice: number;
    TotalPrice: number;
  }[];
}

// Reminder Types
export interface Reminder {
  ReminderID?: number;
  CustomerID: number;
  Customer?: Customer;
  Title: string;
  Description?: string;
  DueDate: Date;
  Priority: 'Low' | 'Medium' | 'High';
  IsCompleted: boolean;
  CreatedAt?: Date;
  UpdatedAt?: Date;
}

export interface ReminderFormData {
  ReminderID?: number;
  CustomerID: number;
  Title: string;
  Description?: string;
  DueDate: string;
  Priority: 'Low' | 'Medium' | 'High';
  IsCompleted?: boolean;
}

export * from './api';
export * from './customer';
export * from './product';
export * from './quotation';
export * from './reminder';
