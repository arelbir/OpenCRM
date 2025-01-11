import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Input, Button } from '../common';

interface MinimumStockInput {
    minimumStock: number;
}

interface MinimumStockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: MinimumStockInput) => void;
    isSubmitting?: boolean;
    currentMinimumStock?: number;
}

export const MinimumStockModal: React.FC<MinimumStockModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
    currentMinimumStock = 0,
}) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<MinimumStockInput>({
        defaultValues: {
            minimumStock: currentMinimumStock,
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
            title="Minimum Stok Güncelle"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Minimum Stok *"
                    type="number"
                    {...register('minimumStock', {
                        required: 'Minimum stok giriniz',
                        min: { value: 0, message: 'Minimum stok 0 veya daha büyük olmalıdır' },
                    })}
                    error={errors.minimumStock?.message}
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
                        Güncelle
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
