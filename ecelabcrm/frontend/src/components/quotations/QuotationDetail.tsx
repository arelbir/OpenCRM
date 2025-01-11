import React from 'react';
import { Quotation } from '../../types';
import { Card, Badge } from '../common';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface QuotationDetailProps {
    quotation: Quotation;
}

export const QuotationDetail: React.FC<QuotationDetailProps> = ({ quotation }) => {
    const getStatusBadge = (status: Quotation['Status']) => {
        const variants = {
            Draft: 'warning',
            Sent: 'primary',
            Accepted: 'success',
            Rejected: 'danger'
        } as const;

        const labels = {
            Draft: 'Taslak',
            Sent: 'Gönderildi',
            Accepted: 'Kabul Edildi',
            Rejected: 'Reddedildi'
        };

        return (
            <Badge variant={variants[status]}>
                {labels[status]}
            </Badge>
        );
    };

    return (
        <div className="space-y-6">
            <Card>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Teklif No</h3>
                        <p className="mt-1 text-sm text-gray-900">{quotation.QuotationNumber}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Durum</h3>
                        <div className="mt-1">{getStatusBadge(quotation.Status)}</div>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Teklif Tarihi</h3>
                        <p className="mt-1 text-sm text-gray-900">
                            {format(new Date(quotation.QuotationDate), 'dd MMMM yyyy', { locale: tr })}
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Geçerlilik Tarihi</h3>
                        <p className="mt-1 text-sm text-gray-900">
                            {format(new Date(quotation.ValidUntil), 'dd MMMM yyyy', { locale: tr })}
                        </p>
                    </div>
                </div>
            </Card>

            <Card title="Müşteri Bilgileri">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Firma Adı</h3>
                        <p className="mt-1 text-sm text-gray-900">{quotation.Customer?.CompanyName}</p>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-gray-500">Müşteri Kodu</h3>
                        <p className="mt-1 text-sm text-gray-900">{quotation.Customer?.CustomerCode}</p>
                    </div>
                    {quotation.Customer?.ContactName && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">İletişim Kişisi</h3>
                            <p className="mt-1 text-sm text-gray-900">{quotation.Customer.ContactName}</p>
                        </div>
                    )}
                    {quotation.Customer?.Email && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">E-posta</h3>
                            <p className="mt-1 text-sm text-gray-900">{quotation.Customer.Email}</p>
                        </div>
                    )}
                </div>
            </Card>

            <Card title="Ürünler">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ürün
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Miktar
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Birim Fiyat
                                </th>
                                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Toplam
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {quotation.Details?.map((detail, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {detail.Product?.Brand} - {detail.Product?.Code}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                        {detail.Quantity}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                        {new Intl.NumberFormat('tr-TR', {
                                            style: 'currency',
                                            currency: 'TRY'
                                        }).format(detail.UnitPrice)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                        {new Intl.NumberFormat('tr-TR', {
                                            style: 'currency',
                                            currency: 'TRY'
                                        }).format(detail.TotalPrice)}
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-gray-50">
                                <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                    Toplam Tutar
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                    {new Intl.NumberFormat('tr-TR', {
                                        style: 'currency',
                                        currency: 'TRY'
                                    }).format(quotation.TotalAmount)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>

            {quotation.Notes && (
                <Card title="Notlar">
                    <p className="text-sm text-gray-900">{quotation.Notes}</p>
                </Card>
            )}
        </div>
    );
};
