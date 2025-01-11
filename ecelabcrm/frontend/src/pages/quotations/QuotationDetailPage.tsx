import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quotationService } from '../../services';
import { Quotation } from '../../types';
import { PageHeader, Button } from '../../components/common';
import { QuotationDetail } from '../../components/quotations';
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export const QuotationDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Teklif detaylarını getir
    const { data: quotation } = useQuery({
        queryKey: ['quotations', id],
        queryFn: () => quotationService.getQuotationById(Number(id))
    });

    // Teklif durumunu güncelle
    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: Quotation['Status'] }) =>
            quotationService.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries(['quotations', id]);
            toast.success('Teklif durumu güncellendi');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Bir hata oluştu');
        }
    });

    if (!quotation?.data) {
        return null;
    }

    const handleStatusChange = (status: Quotation['Status']) => {
        updateStatusMutation.mutate({ id: Number(id), status });
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title={`Teklif #${quotation.data.QuotationNumber}`}
                description={`${quotation.data.Customer?.CompanyName} firması için teklif detayları`}
                actions={
                    <div className="flex space-x-2">
                        <Button
                            variant="secondary"
                            onClick={() => navigate('/quotations')}
                        >
                            <ArrowLeftIcon className="h-5 w-5 mr-2" />
                            Geri Dön
                        </Button>
                        {quotation.data.Status === 'Draft' && (
                            <Button
                                onClick={() => navigate(`/quotations/${id}/edit`)}
                            >
                                <PencilIcon className="h-5 w-5 mr-2" />
                                Düzenle
                            </Button>
                        )}
                        {quotation.data.Status === 'Draft' && (
                            <Button
                                variant="success"
                                onClick={() => handleStatusChange('Sent')}
                                isLoading={updateStatusMutation.isLoading}
                            >
                                Teklifi Gönder
                            </Button>
                        )}
                        {quotation.data.Status === 'Sent' && (
                            <>
                                <Button
                                    variant="success"
                                    onClick={() => handleStatusChange('Accepted')}
                                    isLoading={updateStatusMutation.isLoading}
                                >
                                    Kabul Edildi
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={() => handleStatusChange('Rejected')}
                                    isLoading={updateStatusMutation.isLoading}
                                >
                                    Reddedildi
                                </Button>
                            </>
                        )}
                    </div>
                }
            />

            <QuotationDetail quotation={quotation.data} />
        </div>
    );
};
