import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { customerService, productService, quotationService, reminderService } from '../../services';
import { Card } from '../../components/common';
import { UserGroupIcon, CubeIcon, DocumentTextIcon, BellIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export const DashboardPage: React.FC = () => {
    // Verileri getir
    const { data: customers } = useQuery({
        queryKey: ['customers'],
        queryFn: () => customerService.getAll()
    });

    const { data: products } = useQuery({
        queryKey: ['products'],
        queryFn: () => productService.getAll()
    });

    const { data: quotations } = useQuery({
        queryKey: ['quotations'],
        queryFn: () => quotationService.getAll()
    });

    const { data: reminders } = useQuery({
        queryKey: ['reminders'],
        queryFn: () => reminderService.getAll()
    });

    // İstatistikleri hesapla
    const stats = [
        {
            name: 'Toplam Müşteri',
            value: customers?.length || 0,
            icon: UserGroupIcon,
            color: 'bg-blue-500'
        },
        {
            name: 'Toplam Ürün',
            value: products?.length || 0,
            icon: CubeIcon,
            color: 'bg-green-500'
        },
        {
            name: 'Toplam Teklif',
            value: quotations?.length || 0,
            icon: DocumentTextIcon,
            color: 'bg-purple-500'
        },
        {
            name: 'Aktif Hatırlatıcı',
            value: reminders?.length || 0,
            icon: BellIcon,
            color: 'bg-yellow-500'
        }
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.name} className="relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                            <stat.icon className={`h-8 w-8 text-white rounded-lg p-1.5 ${stat.color}`} />
                        </div>
                        <div className="p-6">
                            <p className="text-sm font-medium text-gray-600 truncate">
                                {stat.name}
                            </p>
                            <p className="mt-1 text-3xl font-semibold text-gray-900">
                                {stat.value}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card title="Son Teklifler">
                    <div className="divide-y divide-gray-200">
                        {quotations?.slice(0, 5).map((quotation) => (
                            <div key={quotation.QuotationID} className="py-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {quotation.Customer?.CompanyName}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(quotation.CreatedAt || '').toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Intl.NumberFormat('tr-TR', {
                                            style: 'currency',
                                            currency: 'TRY'
                                        }).format(quotation.TotalAmount)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Yaklaşan Hatırlatmalar">
                    <div className="divide-y divide-gray-200">
                        {reminders?.slice(0, 5).map((reminder) => (
                            <div key={reminder.ReminderID} className="py-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {reminder.Title}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(reminder.DueDate).toLocaleDateString('tr-TR')}
                                        </p>
                                    </div>
                                    <span className={clsx(
                                        'px-2 py-1 text-xs font-medium rounded-full',
                                        reminder.Status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                        reminder.Status === 'Completed' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                    )}>
                                        {reminder.Status === 'Pending' ? 'Bekliyor' :
                                        reminder.Status === 'Completed' ? 'Tamamlandı' :
                                        'Gecikmiş'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};
