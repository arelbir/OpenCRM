import React from 'react';
import { Modal, Input, Button, Checkbox } from '../common';
import { UseFormReturn } from 'react-hook-form';
import { Customer } from '../../types';

interface CustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
    form: UseFormReturn<any>;
    onSubmit: (data: any) => void;
    isSubmitting?: boolean;
    selectedCustomer?: Customer;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
    isOpen,
    onClose,
    form,
    onSubmit,
    isSubmitting,
    selectedCustomer
}) => {
    const { register, handleSubmit, formState: { errors } } = form;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={selectedCustomer ? 'Müşteri Düzenle' : 'Yeni Müşteri'}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    label="Firma Adı *"
                    {...register('Name', { required: 'Firma adı zorunludur' })}
                    error={errors.Name?.message?.toString()}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Vergi Numarası"
                        {...register('TaxNumber', {
                            pattern: {
                                value: /^\d{10,11}$/,
                                message: 'Vergi numarası 10 veya 11 haneli olmalıdır'
                            }
                        })}
                        error={errors.TaxNumber?.message?.toString()}
                    />

                    <Input
                        label="Vergi Dairesi"
                        {...register('TaxOffice')}
                        error={errors.TaxOffice?.message?.toString()}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Telefon"
                        {...register('Phone')}
                        error={errors.Phone?.message?.toString()}
                    />

                    <Input
                        label="E-posta"
                        {...register('Email', {
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: 'Geçerli bir e-posta adresi giriniz'
                            }
                        })}
                        error={errors.Email?.message?.toString()}
                    />
                </div>

                <Input
                    label="Adres"
                    {...register('Address')}
                    error={errors.Address?.message?.toString()}
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="İlgili Kişi"
                        {...register('ContactPerson')}
                        error={errors.ContactPerson?.message?.toString()}
                    />

                    <Input
                        label="İlgili Kişi Telefonu"
                        {...register('ContactPhone')}
                        error={errors.ContactPhone?.message?.toString()}
                    />
                </div>

                <Input
                    label="Notlar"
                    {...register('Notes')}
                    error={errors.Notes?.message?.toString()}
                />

                <div className="flex items-center">
                    <Checkbox
                        label="Aktif"
                        {...register('IsActive')}
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                    >
                        İptal
                    </Button>
                    <Button
                        type="submit"
                        loading={isSubmitting}
                    >
                        {selectedCustomer ? 'Güncelle' : 'Kaydet'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
