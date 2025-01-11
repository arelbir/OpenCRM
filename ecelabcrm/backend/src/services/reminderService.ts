import { Op, WhereOptions } from 'sequelize';
import { Reminder, Customer } from '../models';
import { ReminderAttributes } from '../models/ReminderModel';

// Hatırlatıcı oluşturma için gerekli alanları tanımla
type CreateReminderInput = Omit<ReminderAttributes, 'ReminderID' | 'CreatedAt' | 'UpdatedAt' | 'IsActive'> & {
    CustomerID: number;
    Title: string;
    DueDate: Date;
    Status: 'Pending' | 'Completed' | 'Cancelled';
    Priority: 'Low' | 'Medium' | 'High';
};

// Hatırlatıcı güncelleme için gerekli alanları tanımla
type UpdateReminderInput = Partial<Omit<ReminderAttributes, 'ReminderID' | 'CustomerID' | 'CreatedAt' | 'UpdatedAt' | 'IsActive'>>;

class ReminderService {
    // Hatırlatıcı oluştur
    async createReminder(data: CreateReminderInput): Promise<ReminderAttributes> {
        try {
            // Müşteri var mı kontrol et
            if (data.CustomerID) {
                const customer = await Customer.findByPk(data.CustomerID);
                if (!customer) {
                    throw new Error('Belirtilen müşteri bulunamadı');
                }
            }

            const reminder = await Reminder.create({
                ...data,
                IsActive: true,
                CreatedAt: new Date(),
                UpdatedAt: new Date()
            } as ReminderAttributes);
            return reminder.get({ plain: true });
        } catch (error) {
            console.error('Hatırlatıcı eklenirken hata:', error);
            throw error;
        }
    }

    // Hatırlatıcı detayını getir
    async getReminderById(id: number): Promise<ReminderAttributes | null> {
        try {
            if (!id || isNaN(id)) {
                throw new Error('Geçersiz hatırlatıcı ID');
            }

            const reminder = await Reminder.findOne({
                where: {
                    ReminderID: id,
                    IsActive: true
                } as WhereOptions<ReminderAttributes>,
                include: [{ model: Customer }]
            });
            return reminder ? reminder.get({ plain: true }) : null;
        } catch (error) {
            console.error(`Hatırlatıcı (ID: ${id}) getirilirken hata:`, error);
            throw error;
        }
    }

    // Tüm hatırlatıcıları getir
    async getAllReminders(): Promise<ReminderAttributes[]> {
        try {
            const reminders = await Reminder.findAll({
                where: { IsActive: true } as WhereOptions<ReminderAttributes>,
                include: [{ model: Customer }],
                order: [['DueDate', 'ASC']]
            });
            return reminders.map(reminder => reminder.get({ plain: true }));
        } catch (error) {
            console.error('Hatırlatıcılar getirilirken hata:', error);
            throw error;
        }
    }

    // Hatırlatıcı güncelle
    async updateReminder(id: number, data: UpdateReminderInput): Promise<ReminderAttributes | null> {
        try {
            if (!id || isNaN(id)) {
                throw new Error('Geçersiz hatırlatıcı ID');
            }

            // Status değerini kontrol et ve düzelt
            if (data.Status) {
                const validStatuses = ['Pending', 'Completed', 'Cancelled'] as const;
                const normalizedStatus = data.Status.charAt(0).toUpperCase() + data.Status.slice(1).toLowerCase();
                
                if (!validStatuses.includes(normalizedStatus as typeof validStatuses[number])) {
                    throw new Error(`Geçersiz status değeri. Geçerli değerler: ${validStatuses.join(', ')}`);
                }
                data.Status = normalizedStatus as ReminderAttributes['Status'];
            }

            // Priority değerini kontrol et ve düzelt
            if (data.Priority) {
                const validPriorities = ['Low', 'Medium', 'High'] as const;
                const normalizedPriority = data.Priority.charAt(0).toUpperCase() + data.Priority.slice(1).toLowerCase();
                
                if (!validPriorities.includes(normalizedPriority as typeof validPriorities[number])) {
                    throw new Error(`Geçersiz priority değeri. Geçerli değerler: ${validPriorities.join(', ')}`);
                }
                data.Priority = normalizedPriority as ReminderAttributes['Priority'];
            }

            const reminder = await Reminder.findOne({
                where: {
                    ReminderID: id,
                    IsActive: true
                } as WhereOptions<ReminderAttributes>
            });

            if (!reminder) {
                return null;
            }

            await reminder.update({
                ...data,
                UpdatedAt: new Date()
            });

            return reminder.get({ plain: true });
        } catch (error) {
            console.error(`Hatırlatıcı (ID: ${id}) güncellenirken hata:`, error);
            throw error;
        }
    }

    // Hatırlatıcı sil (soft delete)
    async deleteReminder(id: number): Promise<boolean> {
        try {
            if (!id || isNaN(id)) {
                throw new Error('Geçersiz hatırlatıcı ID');
            }

            const reminder = await Reminder.findOne({
                where: {
                    ReminderID: id,
                    IsActive: true
                } as WhereOptions<ReminderAttributes>
            });

            if (!reminder) {
                return false;
            }

            await reminder.update({
                IsActive: false,
                UpdatedAt: new Date()
            });

            return true;
        } catch (error) {
            console.error(`Hatırlatıcı (ID: ${id}) silinirken hata:`, error);
            throw error;
        }
    }

    // Yaklaşan hatırlatıcıları getir
    async getUpcomingReminders(days: number = 7): Promise<ReminderAttributes[]> {
        try {
            const thresholdDate = new Date();
            thresholdDate.setDate(thresholdDate.getDate() + days);

            const reminders = await Reminder.findAll({
                where: {
                    DueDate: {
                        [Op.gte]: new Date(),
                        [Op.lte]: thresholdDate
                    },
                    Status: 'Pending',
                    IsActive: true
                } as WhereOptions<ReminderAttributes>,
                include: [{ model: Customer }],
                order: [['DueDate', 'ASC']]
            });

            return reminders.map(reminder => reminder.get({ plain: true }));
        } catch (error) {
            console.error('Yaklaşan hatırlatıcılar getirilirken hata:', error);
            throw error;
        }
    }

    // Gecikmiş hatırlatıcıları getir
    async getOverdueReminders(): Promise<ReminderAttributes[]> {
        try {
            const reminders = await Reminder.findAll({
                where: {
                    DueDate: {
                        [Op.lt]: new Date()
                    },
                    Status: 'Pending',
                    IsActive: true
                } as WhereOptions<ReminderAttributes>,
                include: [{ model: Customer }],
                order: [['DueDate', 'ASC']]
            });

            return reminders.map(reminder => reminder.get({ plain: true }));
        } catch (error) {
            console.error('Gecikmiş hatırlatıcılar getirilirken hata:', error);
            throw error;
        }
    }

    // Müşterinin hatırlatıcılarını getir
    async getCustomerReminders(customerId: number): Promise<ReminderAttributes[]> {
        try {
            if (!customerId || isNaN(customerId)) {
                throw new Error('Geçersiz müşteri ID');
            }

            const reminders = await Reminder.findAll({
                where: {
                    CustomerID: customerId,
                    IsActive: true
                } as WhereOptions<ReminderAttributes>,
                include: [{ model: Customer }],
                order: [['DueDate', 'ASC']]
            });

            return reminders.map(reminder => reminder.get({ plain: true }));
        } catch (error) {
            console.error(`Müşteri (ID: ${customerId}) hatırlatıcıları getirilirken hata:`, error);
            throw error;
        }
    }

    // Hatırlatmayı tamamla
    async completeReminder(id: number): Promise<ReminderAttributes | null> {
        try {
            const reminder = await Reminder.findOne({
                where: {
                    ReminderID: id,
                    IsActive: true
                } as WhereOptions<ReminderAttributes>
            });

            if (!reminder) {
                return null;
            }

            await reminder.update({
                Status: 'Completed',
                UpdatedAt: new Date()
            });

            return reminder.get({ plain: true });
        } catch (error) {
            console.error(`Hatırlatıcı (ID: ${id}) tamamlanırken hata:`, error);
            throw error;
        }
    }
}

export default new ReminderService();
