import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quotationService, customerService, productService } from '../../services';
import { QuotationFormData } from '../../types';
import { PageHeader, Button } from '../../components/common';
import { QuotationForm } from '../../components/quotations';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export const QuotationFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();
    const isEdit = Boolean(id);

    // Müşteri listesini getir
    const { data: customers } = useQuery({
        queryKey: ['customers'],
        queryFn: () => customerService.getAllCustomers()
    });

    // Ürün listesini getir
    const { data: products } = useQuery({
        queryKey: ['products'],
        queryFn: () => productService.getAllProducts()
    });

    // Düzenleme ise teklif detaylarını getir
    const { data: quotation } = useQuery({
        queryKey: ['quotations', id],
        queryFn: () => quotationService.getQuotationById(Number(id)),
        enabled: isEdit
    });

    // Teklif oluştur
    const createMutation = useMutation({
        mutationFn: (data: QuotationFormData) => quotationService.createQuotation(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['quotations']);
            navigate('/quotations');
            toast.success('Teklif başarıyla oluşturuldu');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Bir hata oluştu');
        }
    });

    // Teklif güncelle
    const updateMutation = useMutation({
        mutationFn: (data: QuotationFormData) => quotationService.updateQuotation(Number(id), data),
        onSuccess: () => {
            queryClient.invalidateQueries(['quotations']);
            navigate('/quotations');
            toast.success('Teklif başarıyla güncellendi');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Bir hata oluştu');
        }
    });

    const handleSubmit = (data: QuotationFormData) => {
        if (isEdit) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title={isEdit ? 'Teklif Düzenle' : 'Yeni Teklif'}
                description={isEdit ? 'Mevcut teklifi düzenleyin' : 'Yeni bir teklif oluşturun'}
                actions={
                    <Button
                        variant="secondary"
                        onClick={() => navigate('/quotations')}
                    >
                        <ArrowLeftIcon className="h-5 w-5 mr-2" />
                        Geri Dön
                    </Button>
                }
            />

            <QuotationForm
                initialData={quotation?.data}
                customers={customers?.data || []}
                products={products?.data || []}
                onSubmit={handleSubmit}
                isLoading={createMutation.isLoading || updateMutation.isLoading}
                defaultCustomerId={location.state?.customerId}
            />
        </div>
    );
};
