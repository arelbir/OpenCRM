import React from 'react';
import { useForm } from 'react-hook-form';
import { Customer } from '../../types';
import { Input, Button, Textarea } from '../common';

interface CustomerFormData {
    CompanyName: string;
    ContactName: string;
    Email: string;
    Phone: string;
    Address: string;
    TaxOffice?: string;
    TaxNumber?: string;
    Notes?: string;
    IsActive: boolean;
}

interface CustomerFormProps {
    initialValues?: Customer | null;
    onSubmit: (data: CustomerFormData) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
    initialValues,
    onSubmit,
    onCancel,
    isSubmitting = false
}) => {
    const { register, handleSubmit, formState: { errors } } = useForm<CustomerFormData>({
        defaultValues: initialValues ? {
            CompanyName: initialValues.CompanyName,
            ContactName: initialValues.ContactName,
            Email: initialValues.Email,
            Phone: initialValues.Phone,
            Address: initialValues.Address,
            TaxOffice: initialValues.TaxOffice || '',
            TaxNumber: initialValues.TaxNumber || '',
            Notes: initialValues.Notes || '',
            IsActive: initialValues.IsActive
        } : {
            IsActive: true
        }
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {initialValues && (
                    <Input
                        label="Müşteri Kodu"
                        value={initialValues.CustomerCode}
                        disabled
                    />
                )}
                <Input
                    label="Firma Adı"
                    {...register('CompanyName', { required: 'Firma adı zorunludur' })}
                    error={errors.CompanyName?.message}
                    disabled={isSubmitting}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="İletişim Kişisi"
                    {...register('ContactName', { required: 'İletişim kişisi zorunludur' })}
                    error={errors.ContactName?.message}
                    disabled={isSubmitting}
                />

                <Input
                    label="Telefon"
                    {...register('Phone', { required: 'Telefon zorunludur' })}
                    error={errors.Phone?.message}
                    disabled={isSubmitting}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="E-posta"
                    type="email"
                    {...register('Email', {
                        required: 'E-posta zorunludur',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Geçerli bir e-posta adresi giriniz'
                        }
                    })}
                    error={errors.Email?.message}
                    disabled={isSubmitting}
                />

                <Input
                    label="Adres"
                    {...register('Address', { required: 'Adres zorunludur' })}
                    error={errors.Address?.message}
                    disabled={isSubmitting}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Vergi Dairesi"
                    {...register('TaxOffice')}
                    disabled={isSubmitting}
                />

                <Input
                    label="Vergi No"
                    {...register('TaxNumber')}
                    disabled={isSubmitting}
                />
            </div>

            <Textarea
                label="Notlar"
                {...register('Notes')}
                disabled={isSubmitting}
                rows={3}
            />

            <div className="flex items-center space-x-2 mt-2">
                <input
                    type="checkbox"
                    {...register('IsActive')}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    disabled={isSubmitting}
                />
                <label className="text-sm text-gray-700">
                    Aktif
                </label>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
                <Button
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    İptal
                </Button>
                <Button
                    type="submit"
                    isLoading={isSubmitting}
                >
                    {initialValues ? 'Güncelle' : 'Oluştur'}
                </Button>
            </div>
        </form>
    );
};
