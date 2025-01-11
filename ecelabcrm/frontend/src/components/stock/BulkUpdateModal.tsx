import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Input, Button } from '../common';

interface BulkUpdateInput {
    type: 'stock' | 'price';
    value: number;
    reason?: string;
}

interface BulkUpdateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: BulkUpdateInput) => void;
    isSubmitting?: boolean;
    type: 'stock' | 'price';
    selectedProducts: { id: number; name: string }[];
}

export const BulkUpdateModal: React.FC<BulkUpdateModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
    type,
    selectedProducts,
}) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<BulkUpdateInput>({
        defaultValues: {
            type,
            value: 0,
            reason: '',
        },
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={type === 'stock' ? 'Toplu Stok Güncelle' : 'Toplu Fiyat Güncelle'}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700">Seçili Ürünler</h3>
                    <div className="mt-1 max-h-32 overflow-y-auto">
                        {selectedProducts.map(product => (
                            <div key={product.id} className="text-sm text-gray-600">
                                {product.name}
                            </div>
                        ))}
                    </div>
                </div>

                <Input
                    label={type === 'stock' ? 'Yeni Stok *' : 'Yeni Fiyat *'}
                    type="number"
                    {...register('value', {
                        required: type === 'stock' ? 'Stok giriniz' : 'Fiyat giriniz',
                        min: { 
                            value: type === 'stock' ? 0 : 0.01,
                            message: type === 'stock' ? 'Stok 0 veya daha büyük olmalıdır' : 'Fiyat 0.01 veya daha büyük olmalıdır'
                        },
                    })}
                    error={errors.value?.message}
                />

                {type === 'price' && (
                    <Input
                        label="Güncelleme Nedeni"
                        {...register('reason')}
                        error={errors.reason?.message}
                    />
                )}

                <div className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                    >
                        İptal
                    </Button>
                    <Button
                        type="submit"
                        loading={isSubmitting}
                    >
                        Güncelle
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
