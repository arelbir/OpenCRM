import React from 'react';
import { Quotation } from '../../types';
import { Table, Badge, Button } from '../common';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

interface QuotationListProps {
    quotations: Quotation[];
    onView?: (quotation: Quotation) => void;
    onEdit?: (quotation: Quotation) => void;
    onDelete?: (quotation: Quotation) => void;
}

export const QuotationList: React.FC<QuotationListProps> = ({
    quotations,
    onView,
    onEdit,
    onDelete,
}) => {
    const columns = React.useMemo(
        () => [
            {
                header: 'Teklif No',
                accessorKey: 'QuotationNumber',
                id: 'quotationNumber'
            },
            {
                header: 'Müşteri',
                accessorKey: 'Customer.CompanyName',
                id: 'customerName'
            },
            {
                header: 'Tarih',
                accessorKey: 'CreatedAt',
                id: 'createdAt',
                cell: ({ getValue }) => {
                    const value = getValue();
                    return format(new Date(value), 'dd MMM yyyy', { locale: tr });
                },
            },
            {
                header: 'Toplam',
                accessorKey: 'TotalAmount',
                id: 'totalAmount',
                cell: ({ getValue }) => {
                    const value = getValue();
                    return new Intl.NumberFormat('tr-TR', {
                        style: 'currency',
                        currency: 'TRY'
                    }).format(value);
                },
            },
            {
                header: 'Durum',
                accessorKey: 'Status',
                id: 'status',
                cell: ({ getValue }) => {
                    const value = getValue();
                    const variant = 
                        value === 'Accepted' ? 'success' :
                        value === 'Rejected' ? 'danger' :
                        value === 'Pending' ? 'warning' :
                        'info';
                    
                    const label =
                        value === 'Accepted' ? 'Onaylandı' :
                        value === 'Rejected' ? 'Reddedildi' :
                        value === 'Pending' ? 'Bekliyor' :
                        'Taslak';

                    return (
                        <Badge variant={variant}>
                            {label}
                        </Badge>
                    );
                },
            },
            {
                header: 'İşlemler',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onView?.(row.original)}
                        >
                            <EyeIcon className="h-4 w-4" />
                        </Button>
                        {row.original.Status === 'Draft' && (
                            <>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => onEdit?.(row.original)}
                                >
                                    <PencilIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => onDelete?.(row.original)}
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </Button>
                            </>
                        )}
                    </div>
                ),
            },
        ],
        [onView, onEdit, onDelete]
    );

    return <Table columns={columns} data={quotations} />;
};
