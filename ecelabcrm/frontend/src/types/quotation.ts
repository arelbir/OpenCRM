import { Customer } from './customer';
import { Product } from './product';

export interface QuotationDetail {
    QuotationDetailID?: number;
    QuotationID?: number;
    ProductID: number;
    Product?: Product;
    Quantity: number;
    UnitPrice: number;
    TotalPrice?: number;
}

export interface Quotation {
    QuotationID?: number;
    QuotationNumber: string;
    CustomerID: number;
    Customer?: Customer;
    Status: 'Draft' | 'Sent' | 'Accepted' | 'Rejected';
    TotalAmount: number;
    Notes?: string;
    Details: QuotationDetail[];
    QuotationDate: string;
    ValidUntil?: string;
    CreatedAt?: string;
    UpdatedAt?: string;
    DeletedAt?: string | null;
}

export type QuotationFormData = Omit<Quotation, 'QuotationID' | 'CreatedAt' | 'UpdatedAt' | 'DeletedAt' | 'Customer' | 'Details'> & {
    Details: Omit<QuotationDetail, 'QuotationDetailID' | 'QuotationID' | 'Product'>[];
};
