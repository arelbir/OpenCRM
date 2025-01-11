import React from 'react';
import { Table, Badge, Button } from '../common';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { PencilIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Reminder } from '../../types';

interface ReminderListProps {
    reminders: Reminder[];
    isLoading?: boolean;
    onEdit?: (reminder: Reminder) => void;
    onDelete?: (reminder: Reminder) => void;
    onComplete?: (reminder: Reminder) => void;
}

export const ReminderList: React.FC<ReminderListProps> = ({
    reminders,
    isLoading,
    onEdit,
    onDelete,
    onComplete,
}) => {
    const getPriorityBadge = (priority: number) => {
        const variants = {
            1: 'danger',
            2: 'warning',
            3: 'primary'
        } as const;

        const labels = {
            1: 'Yüksek',
            2: 'Orta',
            3: 'Düşük'
        };

        return (
            <Badge variant={variants[priority as keyof typeof variants]}>
                {labels[priority as keyof typeof labels]}
            </Badge>
        );
    };

    const columns = React.useMemo(
        () => [
            {
                header: 'Başlık',
                accessorKey: 'Title',
                id: 'title'
            },
            {
                header: 'Müşteri',
                accessorKey: 'Customer.CompanyName',
                id: 'customerName'
            },
            {
                header: 'Tarih',
                accessorKey: 'DueDate',
                id: 'dueDate',
                cell: ({ getValue }) => {
                    const value = getValue();
                    return format(new Date(value), 'dd MMM yyyy HH:mm', { locale: tr });
                },
            },
            {
                header: 'Öncelik',
                accessorKey: 'Priority',
                id: 'priority',
                cell: ({ getValue }) => {
                    const value = getValue();
                    const variant = 
                        value === 1 ? 'danger' :
                        value === 2 ? 'warning' :
                        'primary';
                    return (
                        <Badge variant={variant}>
                            {value === 1 ? 'Yüksek' : value === 2 ? 'Orta' : 'Düşük'}
                        </Badge>
                    );
                },
            },
            {
                header: 'Durum',
                accessorKey: 'IsCompleted',
                id: 'status',
                cell: ({ getValue }) => {
                    const value = getValue();
                    const variant = 
                        value ? 'success' :
                        'warning';
                    return (
                        <Badge variant={variant}>
                            {value ? 'Tamamlandı' : 'Bekliyor'}
                        </Badge>
                    );
                },
            },
            {
                header: 'İşlemler',
                id: 'actions',
                cell: ({ row }) => (
                    <div className="flex space-x-2">
                        {!row.original.IsCompleted && (
                            <>
                                <Button
                                    variant="success"
                                    size="sm"
                                    onClick={() => onComplete?.(row.original)}
                                    leftIcon={<CheckIcon className="h-4 w-4" />}
                                >
                                    Tamamla
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => onEdit?.(row.original)}
                                    leftIcon={<PencilIcon className="h-4 w-4" />}
                                >
                                    Düzenle
                                </Button>
                            </>
                        )}
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onDelete?.(row.original)}
                            leftIcon={<TrashIcon className="h-4 w-4" />}
                        >
                            Sil
                        </Button>
                    </div>
                ),
            },
        ],
        [onEdit, onDelete, onComplete]
    );

    return (
        <Table
            data={reminders}
            columns={columns}
            isLoading={isLoading}
        />
    );
};
