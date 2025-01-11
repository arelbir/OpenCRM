import React from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Table, Badge } from '../common';

interface StockMovement {
    MovementID: number;
    ProductID: number;
    Type: 'IN' | 'OUT';
    Quantity: number;
    PreviousStock: number;
    NewStock: number;
    Description: string;
    CreatedAt: string;
    CreatedBy?: string;
    Product: {
        Brand: string;
        Code: string;
        Description: string;
    };
}

interface StockMovementListProps {
    movements: StockMovement[];
    isLoading?: boolean;
}

export const StockMovementList: React.FC<StockMovementListProps> = ({ movements, isLoading }) => {
    const columns = [
        {
            header: 'Tarih',
            cell: (row: StockMovement) => format(new Date(row.CreatedAt), 'dd MMMM yyyy HH:mm', { locale: tr }),
        },
        {
            header: 'Ürün',
            cell: (row: StockMovement) => (
                <div>
                    <div className="font-medium">{row.Product.Brand}</div>
                    <div className="text-sm text-gray-500">{row.Product.Code}</div>
                </div>
            ),
        },
        {
            header: 'İşlem',
            cell: (row: StockMovement) => (
                <Badge
                    variant={row.Type === 'IN' ? 'success' : 'error'}
                >
                    {row.Type === 'IN' ? 'Giriş' : 'Çıkış'}
                </Badge>
            ),
        },
        {
            header: 'Miktar',
            cell: (row: StockMovement) => row.Quantity,
        },
        {
            header: 'Önceki Stok',
            cell: (row: StockMovement) => row.PreviousStock,
        },
        {
            header: 'Yeni Stok',
            cell: (row: StockMovement) => row.NewStock,
        },
        {
            header: 'Açıklama',
            cell: (row: StockMovement) => row.Description,
        },
        {
            header: 'İşlemi Yapan',
            cell: (row: StockMovement) => row.CreatedBy || '-',
        },
    ];

    return (
        <Table
            columns={columns}
            data={movements}
            isLoading={isLoading}
            emptyMessage="Stok hareketi bulunamadı"
        />
    );
};
