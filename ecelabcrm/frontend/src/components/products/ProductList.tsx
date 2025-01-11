import React from 'react';
import { Product } from '../../types';
import { Table, Button, Badge } from '../common';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ProductListProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
    products,
    onEdit,
    onDelete
}) => {
    const columns = React.useMemo(
        () => [
            {
                header: 'Ürün Kodu',
                accessorKey: 'Code',
                id: 'code'
            },
            {
                header: 'Marka',
                accessorKey: 'Brand',
                id: 'brand'
            },
            {
                header: 'Açıklama',
                accessorKey: 'Description',
                id: 'description'
            },
            {
                header: 'Stok',
                accessorKey: 'Stock',
                id: 'stock',
                cell: ({ row }) => {
                    const { Stock, MinimumStock } = row.original;
                    const variant = Stock <= MinimumStock ? 'danger' : 'success';
                    return (
                        <Badge variant={variant}>
                            {Stock}
                        </Badge>
                    );
                },
            },
            {
                header: 'Fiyat',
                accessorKey: 'Price',
                id: 'price',
                cell: ({ getValue }) => (
                    new Intl.NumberFormat('tr-TR', {
                        style: 'currency',
                        currency: 'TRY'
                    }).format(getValue())
                ),
            },
            {
                header: 'Son Kullanma',
                accessorKey: 'ExpiryDate',
                id: 'expiryDate',
                cell: ({ getValue }) => {
                    const value = getValue();
                    return value ? format(new Date(value), 'dd MMM yyyy', { locale: tr }) : '-';
                },
            },
            {
                header: 'Durum',
                accessorKey: 'IsActive',
                id: 'status',
                cell: ({ getValue }) => {
                    const value = getValue();
                    return (
                        <Badge variant={value ? 'success' : 'danger'}>
                            {value ? 'Aktif' : 'Pasif'}
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
                            onClick={() => onEdit(row.original)}
                        >
                            <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onDelete(row.original)}
                        >
                            <TrashIcon className="h-4 w-4" />
                        </Button>
                    </div>
                ),
            },
        ],
        [onEdit, onDelete]
    );

    return <Table columns={columns} data={products} />;
};
