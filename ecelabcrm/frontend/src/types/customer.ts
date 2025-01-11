export interface Customer {
    CustomerID: number;
    CompanyName: string;
    ContactName: string;
    ContactTitle: string;
    Address: string;
    City: string;
    Region: string;
    PostalCode: string;
    Country: string;
    Phone: string;
    Email: string;
    CreatedAt: string;
    UpdatedAt: string;
}

export interface CustomerFilters {
    search?: string;
    city?: string;
    country?: string;
}

export type CreateCustomerInput = Omit<Customer, 'CustomerID' | 'CreatedAt' | 'UpdatedAt'>;

export type UpdateCustomerInput = Partial<CreateCustomerInput>;
