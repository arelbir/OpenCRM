import { Customer } from '../models';
import { CustomerAttributes } from '../models/CustomerModel';
import { Op } from 'sequelize';

// Müşteri oluşturma için gerekli alanları tanımla
type CreateCustomerInput = Omit<CustomerAttributes, 'CustomerID' | 'CustomerCode' | 'IsActive' | 'CreatedAt' | 'UpdatedAt'>;

// Müşteri güncelleme için gerekli alanları tanımla
type UpdateCustomerInput = Partial<Omit<CustomerAttributes, 'CustomerID' | 'CustomerCode' | 'CreatedAt' | 'UpdatedAt' | 'IsActive'>>;

class CustomerService {
    async getAllCustomers(): Promise<Customer[]> {
        try {
            const customers = await Customer.findAll({
                where: { IsActive: true },
                order: [['CreatedAt', 'DESC']]
            });
            return customers;
        } catch (error) {
            console.error('Müşteriler getirilirken hata:', error);
            throw new Error('Müşteriler getirilirken bir hata oluştu');
        }
    }

    async getCustomerById(id: number): Promise<Customer | null> {
        try {
            const customer = await Customer.findOne({
                where: {
                    CustomerID: id,
                    IsActive: true
                }
            });

            if (!customer) {
                throw new Error('Müşteri bulunamadı');
            }

            return customer;
        } catch (error) {
            console.error(`Müşteri (ID: ${id}) getirilirken hata:`, error);
            throw error instanceof Error ? error : new Error('Beklenmeyen bir hata oluştu');
        }
    }

    async createCustomer(customerData: CreateCustomerInput): Promise<Customer> {
        try {
            // Son müşteri kodunu bul
            const lastCustomer = await Customer.findOne({
                order: [['CustomerCode', 'DESC']],
                where: {
                    CustomerCode: {
                        [Op.like]: `MÜŞ-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}%`
                    }
                }
            });

            // Yeni müşteri kodu oluştur (MÜŞ-YYYYMMXXX formatında)
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const lastNumber = lastCustomer
                ? parseInt(lastCustomer.CustomerCode.slice(-3))
                : 0;
            const newNumber = String(lastNumber + 1).padStart(3, '0');
            const customerCode = `MÜŞ-${year}${month}${newNumber}`;

            const customer = await Customer.create({
                ...customerData,
                CustomerCode: customerCode,
                IsActive: true
            });

            return customer;
        } catch (error) {
            console.error('Müşteri eklenirken hata:', error);
            if (error instanceof Error) {
                throw new Error(`Müşteri eklenirken hata oluştu: ${error.message}`);
            }
            throw new Error('Müşteri eklenirken beklenmeyen bir hata oluştu');
        }
    }

    async updateCustomer(id: number, customerData: UpdateCustomerInput): Promise<Customer | null> {
        try {
            const customer = await this.getCustomerById(id);

            if (!customer) {
                throw new Error('Güncellenecek müşteri bulunamadı');
            }

            await customer.update({
                ...customerData
            });

            return customer;
        } catch (error) {
            console.error(`Müşteri (ID: ${id}) güncellenirken hata:`, error);
            throw error instanceof Error ? error : new Error('Beklenmeyen bir hata oluştu');
        }
    }

    async deleteCustomer(id: number): Promise<boolean> {
        try {
            const customer = await this.getCustomerById(id);

            if (!customer) {
                throw new Error('Silinecek müşteri bulunamadı');
            }

            await customer.update({
                IsActive: false
            });

            return true;
        } catch (error) {
            console.error(`Müşteri (ID: ${id}) silinirken hata:`, error);
            throw error instanceof Error ? error : new Error('Beklenmeyen bir hata oluştu');
        }
    }

    async getCustomerByCode(code: string): Promise<Customer | null> {
        try {
            const customer = await Customer.findOne({
                where: {
                    CustomerCode: code,
                    IsActive: true
                }
            });
            return customer;
        } catch (error) {
            console.error(`Müşteri (Kod: ${code}) getirilirken hata:`, error);
            throw error instanceof Error ? error : new Error('Beklenmeyen bir hata oluştu');
        }
    }
}

export default new CustomerService();
