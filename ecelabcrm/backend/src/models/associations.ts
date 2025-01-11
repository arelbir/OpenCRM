import { Customer } from './CustomerModel';
import { Product } from './ProductModel';
import { Quotation } from './QuotationModel';
import { QuotationDetail } from './QuotationDetailModel';
import { Reminder } from './ReminderModel';
import { StockMovement } from './StockMovementModel';
import { PriceHistory } from './PriceHistoryModel';

// İlişkileri başlat
// Product Associations
Product.hasMany(StockMovement, {
    foreignKey: 'ProductID',
    as: 'StockMovementProduct'
});

Product.hasMany(QuotationDetail, {
    foreignKey: 'ProductID',
    as: 'QuotationProduct'
});

Product.hasMany(PriceHistory, {
    foreignKey: 'ProductID',
    as: 'PriceHistoryProduct'
});

// StockMovement Associations
StockMovement.belongsTo(Product, {
    foreignKey: 'ProductID',
    as: 'StockMovementProduct'
});

// Quotation Associations
Quotation.belongsTo(Customer, {
    foreignKey: 'CustomerID',
    as: 'Customer'
});

Quotation.hasMany(QuotationDetail, {
    foreignKey: 'QuotationID',
    as: 'Details'
});

// QuotationDetail Associations
QuotationDetail.belongsTo(Quotation, {
    foreignKey: 'QuotationID',
    as: 'Quotation'
});

QuotationDetail.belongsTo(Product, {
    foreignKey: 'ProductID',
    as: 'QuotationProduct'
});

// PriceHistory Associations
PriceHistory.belongsTo(Product, {
    foreignKey: 'ProductID',
    as: 'PriceHistoryProduct'
});

// Customer Associations
Customer.hasMany(Quotation, { 
    foreignKey: 'CustomerID',
    as: 'Quotations'
});

Customer.hasMany(Reminder, { 
    foreignKey: 'CustomerID',
    as: 'Reminders'
});

// Reminder Associations
Reminder.belongsTo(Customer, { 
    foreignKey: 'CustomerID',
    as: 'Customer'
});

Reminder.belongsTo(Product, { 
    foreignKey: 'ProductID',
    as: 'ReminderProduct'
});
