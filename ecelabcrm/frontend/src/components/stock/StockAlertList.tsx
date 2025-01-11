import React from 'react';
import { Table, Badge } from '../common';

interface StockAlert {
    ProductID: number;
    Brand: string;
    Code: string;
    Description: string;
    Stock: number;
    MinimumStock: number;
    shortage: number;
}

interface StockAlertListProps {
    alerts: StockAlert[];
    isLoading?: boolean;
    onUpdateMinimumStock?: (productId: number) => void;
}

export const StockAlertList: React.FC<StockAlertListProps> = ({
    alerts,
    isLoading,
    onUpdateMinimumStock,
}) => {
    const columns = [
        {
            header: 'Ürün',
            cell: (row: StockAlert) => (
                <div>
                    <div className="font-medium">{row.Brand}</div>
                    <div className="text-sm text-gray-500">{row.Code}</div>
                </div>
            ),
        },
        {
            header: 'Mevcut Stok',
            cell: (row: StockAlert) => (
                <span className={row.Stock === 0 ? 'text-red-600 font-medium' : ''}>
                    {row.Stock}
                </span>
            ),
        },
        {
            header: 'Minimum Stok',
            cell: (row: StockAlert) => row.MinimumStock,
        },
        {
            header: 'Eksik Miktar',
            cell: (row: StockAlert) => (
                <Badge variant="error">
                    {row.shortage}
                </Badge>
            ),
        },
        {
            header: 'İşlemler',
            cell: (row: StockAlert) => (
                <button
                    onClick={() => onUpdateMinimumStock?.(row.ProductID)}
                    className="text-sm text-primary-600 hover:text-primary-900"
                >
                    Minimum Stok Güncelle
                </button>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            data={alerts}
            isLoading={isLoading}
            emptyMessage="Stok alarmı bulunamadı"
        />
    );
};
