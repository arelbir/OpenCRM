import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Input, Button } from '../common';

interface StockMovementInput {
    ProductID: number;
    Type: 'IN' | 'OUT';
    Quantity: number;
    Description: string;
}

interface StockMovementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: StockMovementInput) => void;
    isSubmitting?: boolean;
    productId?: number;
}

export const StockMovementModal: React.FC<StockMovementModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
    productId,
}) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<StockMovementInput>({
        defaultValues: {
            ProductID: productId,
            Type: 'IN',
            Quantity: 0,
            Description: '',
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
            title="Stok Hareketi Ekle"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        İşlem Tipi
                    </label>
                    <select
                        {...register('Type', { required: 'İşlem tipi seçiniz' })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                        <option value="IN">Stok Girişi</option>
                        <option value="OUT">Stok Çıkışı</option>
                    </select>
                    {errors.Type && (
                        <p className="mt-1 text-sm text-red-600">{errors.Type.message}</p>
                    )}
                </div>

                <Input
                    label="Miktar *"
                    type="number"
                    {...register('Quantity', {
                        required: 'Miktar giriniz',
                        min: { value: 1, message: 'Miktar 1 veya daha büyük olmalıdır' },
                    })}
                    error={errors.Quantity?.message}
                />

                <Input
                    label="Açıklama *"
                    {...register('Description', { required: 'Açıklama giriniz' })}
                    error={errors.Description?.message}
                />

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
                        Kaydet
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
