import React from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Table } from '../common';

interface PriceHistory {
    PriceHistoryID: number;
    ProductID: number;
    OldPrice: number;
    NewPrice: number;
    ChangeDate: string;
    ChangedBy?: string;
    Reason?: string;
}

interface PriceHistoryListProps {
    history: PriceHistory[];
    isLoading?: boolean;
}

export const PriceHistoryList: React.FC<PriceHistoryListProps> = ({
    history,
    isLoading,
}) => {
    const columns = [
        {
            header: 'Tarih',
            cell: (row: PriceHistory) => format(new Date(row.ChangeDate), 'dd MMMM yyyy HH:mm', { locale: tr }),
        },
        {
            header: 'Eski Fiyat',
            cell: (row: PriceHistory) => (
                <span className="text-gray-600">
                    {row.OldPrice.toFixed(2)} ₺
                </span>
            ),
        },
        {
            header: 'Yeni Fiyat',
            cell: (row: PriceHistory) => (
                <span className="font-medium">
                    {row.NewPrice.toFixed(2)} ₺
                </span>
            ),
        },
        {
            header: 'Değişim',
            cell: (row: PriceHistory) => {
                const diff = row.NewPrice - row.OldPrice;
                const percentage = ((diff / row.OldPrice) * 100).toFixed(2);
                const isIncrease = diff > 0;

                return (
                    <span className={isIncrease ? 'text-red-600' : 'text-green-600'}>
                        {isIncrease ? '+' : ''}{percentage}%
                    </span>
                );
            },
        },
        {
            header: 'Değiştiren',
            cell: (row: PriceHistory) => row.ChangedBy || '-',
        },
        {
            header: 'Neden',
            cell: (row: PriceHistory) => row.Reason || '-',
        },
    ];

    return (
        <Table
            columns={columns}
            data={history}
            isLoading={isLoading}
            emptyMessage="Fiyat geçmişi bulunamadı"
        />
    );
};
