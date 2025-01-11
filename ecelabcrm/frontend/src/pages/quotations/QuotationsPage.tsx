import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { quotationService } from '../../services';
import { Quotation } from '../../types';
import { PageHeader, Button, Modal } from '../../components/common';
import { QuotationList } from '../../components/quotations';
import { PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export const QuotationsPage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedQuotation, setSelectedQuotation] = React.useState<Quotation | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const queryClient = useQueryClient();

    // Teklif listesini getir
    const { data: quotations } = useQuery({
        queryKey: ['quotations'],
        queryFn: () => quotationService.getAllQuotations()
    });

    // Teklif sil
    const deleteMutation = useMutation({
        mutationFn: (id: number) => quotationService.deleteQuotation(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['quotations']);
            setIsDeleteModalOpen(false);
            setSelectedQuotation(null);
            toast.success('Teklif başarıyla silindi');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Bir hata oluştu');
        }
    });

    const handleView = (quotation: Quotation) => {
        navigate(`/quotations/${quotation.QuotationID}`);
    };

    const handleEdit = (quotation: Quotation) => {
        navigate(`/quotations/${quotation.QuotationID}/edit`);
    };

    const handleDelete = (quotation: Quotation) => {
        setSelectedQuotation(quotation);
        setIsDeleteModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Teklifler"
                description="Teklif listesi ve yönetimi"
                actions={
                    <Button
                        onClick={() => navigate('/quotations/new')}
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Yeni Teklif
                    </Button>
                }
            />

            <QuotationList
                quotations={quotations?.data || []}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Silme Onay Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Teklifi Sil"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => setIsDeleteModalOpen(false)}
                        >
                            İptal
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => deleteMutation.mutate(selectedQuotation!.QuotationID!)}
                            isLoading={deleteMutation.isLoading}
                        >
                            Sil
                        </Button>
                    </>
                }
            >
                <p className="text-sm text-gray-500">
                    Bu teklifi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                </p>
            </Modal>
        </div>
    );
};
