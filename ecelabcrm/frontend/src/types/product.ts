export interface Product {
    ProductID?: number;
    Code: string;
    Brand: string;
    Description: string;
    Stock: number;
    MinimumStock: number;
    UnitPrice: number;
    ExpiryDate?: string | null;
    CreatedAt?: string;
    UpdatedAt?: string;
    DeletedAt?: string | null;
}

export type ProductFormData = Omit<Product, 'ProductID' | 'CreatedAt' | 'UpdatedAt' | 'DeletedAt'>;
