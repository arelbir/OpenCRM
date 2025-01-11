import { Customer } from './CustomerModel';
import { Product } from './ProductModel';
import { Quotation } from './QuotationModel';
import { QuotationDetail } from './QuotationDetailModel';
import { Reminder } from './ReminderModel';
import { StockMovement } from './StockMovementModel';
import { PriceHistory } from './PriceHistoryModel';

// İlişkileri başlat
import './associations';

export {
    Customer,
    Product,
    Quotation,
    QuotationDetail,
    Reminder,
    StockMovement,
    PriceHistory,
};
