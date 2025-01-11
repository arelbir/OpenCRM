import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Badge } from '../common';
import { Customer } from '../../types';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { createColumnHelper } from '@tanstack/react-table';

interface CustomerListProps {
    customers: Customer[];
    isLoading?: boolean;
    onEdit?: (customer: Customer) => void;
    onDelete?: (customer: Customer) => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({
    customers,
    isLoading,
    onEdit,
    onDelete,
}) => {
    const navigate = useNavigate();
    const columnHelper = createColumnHelper<Customer>();
    const [visibleColumns, setVisibleColumns] = React.useState<string[]>([
        'customerCode',
        'name',
        'contactPerson',
        'phone',
        'status',
        'actions'
    ]);

    const toggleColumnVisibility = (columnId: string) => {
        setVisibleColumns(prev => 
            prev.includes(columnId)
                ? prev.filter(id => id !== columnId)
                : [...prev, columnId]
        );
    };

    const columns = React.useMemo(
        () => [
            // Ana kolonlar (her zaman görünür)
            columnHelper.accessor('CustomerCode', {
                header: 'Müşteri Kodu',
                id: 'customerCode',
                size: 120,
            }),
            columnHelper.accessor('Name', {
                header: 'Firma Adı',
                id: 'name',
                size: 200,
            }),
            columnHelper.accessor('ContactPerson', {
                header: 'Yetkili',
                id: 'contactPerson',
                cell: ({ getValue }) => getValue() || '-',
                size: 150,
            }),
            columnHelper.accessor('Phone', {
                header: 'Telefon',
                id: 'phone',
                size: 120,
            }),
            // İsteğe bağlı kolonlar
            columnHelper.accessor('ContactPhone', {
                header: 'Yetkili Telefon',
                id: 'contactPhone',
                cell: ({ getValue }) => getValue() || '-',
                size: 120,
            }),
            columnHelper.accessor('Email', {
                header: 'E-posta',
                id: 'email',
                size: 200,
            }),
            columnHelper.accessor('TaxOffice', {
                header: 'Vergi Dairesi',
                id: 'taxOffice',
                cell: ({ getValue }) => getValue() || '-',
                size: 150,
            }),
            columnHelper.accessor('TaxNumber', {
                header: 'Vergi No',
                id: 'taxNumber',
                cell: ({ getValue }) => getValue() || '-',
                size: 120,
            }),
            columnHelper.accessor('IsActive', {
                header: 'Durum',
                id: 'status',
                cell: ({ getValue }) => {
                    const value = getValue();
                    return (
                        <Badge variant={value ? 'success' : 'danger'}>
                            {value ? 'Aktif' : 'Pasif'}
                        </Badge>
                    );
                },
                size: 100,
            }),
            columnHelper.accessor('CreatedAt', {
                header: 'Kayıt Tarihi',
                id: 'createdAt',
                cell: (info) => {
                    const value = info.getValue();
                    if (!value) return '-';
                    try {
                        return format(new Date(value), 'dd MMM yyyy', { locale: tr });
                    } catch (error) {
                        console.error('Tarih formatı hatası:', error);
                        return '-';
                    }
                },
                size: 120,
            }),
            columnHelper.display({
                id: 'actions',
                header: 'İşlemler',
                cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit?.(row.original);
                            }}
                        >
                            <PencilIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.(row.original);
                            }}
                        >
                            <TrashIcon className="h-4 w-4" />
                        </Button>
                    </div>
                ),
                size: 100,
            }),
        ],
        [onEdit, onDelete]
    ).filter(column => visibleColumns.includes(column.id as string));

    return (
        <div className="space-y-4">
            {/* Kolon Görünürlük Kontrolü */}
            <div className="flex flex-wrap gap-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <span className="text-sm text-gray-500 dark:text-gray-400">Görünür Kolonlar:</span>
                {[
                    { id: 'customerCode', name: 'Müşteri Kodu' },
                    { id: 'name', name: 'Firma Adı' },
                    { id: 'contactPerson', name: 'Yetkili' },
                    { id: 'phone', name: 'Telefon' },
                    { id: 'contactPhone', name: 'Yetkili Telefon' },
                    { id: 'email', name: 'E-posta' },
                    { id: 'taxOffice', name: 'Vergi Dairesi' },
                    { id: 'taxNumber', name: 'Vergi No' },
                    { id: 'status', name: 'Durum' },
                    { id: 'createdAt', name: 'Kayıt Tarihi' },
                ].map(column => (
                    <Button
                        key={column.id}
                        variant={visibleColumns.includes(column.id) ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => toggleColumnVisibility(column.id)}
                    >
                        {visibleColumns.includes(column.id) ? (
                            <EyeIcon className="h-4 w-4 mr-1" />
                        ) : (
                            <EyeSlashIcon className="h-4 w-4 mr-1" />
                        )}
                        {column.name}
                    </Button>
                ))}
            </div>

            {/* Müşteri Tablosu */}
            <div className="border dark:border-gray-700 rounded-lg shadow">
                <Table
                    data={customers}
                    columns={columns}
                    isLoading={isLoading}
                    onRowClick={(row) => navigate(`/customers/${row.original.CustomerID}`)}
                />
            </div>
        </div>
    );
};
