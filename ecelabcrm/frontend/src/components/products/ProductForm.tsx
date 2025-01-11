import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../common';
import { Product, ProductFormData } from '../../types';

interface ProductFormProps {
    initialData?: Product;
    onSubmit: (data: ProductFormData) => void;
    isLoading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    onSubmit,
    isLoading
}) => {
    const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
        defaultValues: initialData
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Marka"
                    {...register('Brand', { required: 'Marka zorunludur' })}
                    error={errors.Brand?.message}
                    disabled={isLoading}
                />

                <Input
                    label="Ürün Kodu"
                    {...register('Code', { required: 'Ürün kodu zorunludur' })}
                    error={errors.Code?.message}
                    disabled={isLoading}
                />
            </div>

            <Input
                label="Açıklama"
                {...register('Description', { required: 'Açıklama zorunludur' })}
                error={errors.Description?.message}
                disabled={isLoading}
                as="textarea"
                rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Stok Miktarı"
                    type="number"
                    {...register('Stock', {
                        required: 'Stok miktarı zorunludur',
                        min: { value: 0, message: 'Stok miktarı 0\'dan küçük olamaz' }
                    })}
                    error={errors.Stock?.message}
                    disabled={isLoading}
                />

                <Input
                    label="Minimum Stok"
                    type="number"
                    {...register('MinimumStock', {
                        required: 'Minimum stok zorunludur',
                        min: { value: 0, message: 'Minimum stok 0\'dan küçük olamaz' }
                    })}
                    error={errors.MinimumStock?.message}
                    disabled={isLoading}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Fiyat"
                    type="number"
                    step="0.01"
                    {...register('Price', {
                        required: 'Fiyat zorunludur',
                        min: { value: 0, message: 'Fiyat 0\'dan küçük olamaz' }
                    })}
                    error={errors.Price?.message}
                    disabled={isLoading}
                />

                <Input
                    label="Son Kullanma Tarihi"
                    type="date"
                    {...register('ExpiryDate')}
                    disabled={isLoading}
                />
            </div>
        </form>
    );
};
