import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Input, Select, Button } from '../common';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Quotation, QuotationFormData, Customer, Product } from '../../types';

interface QuotationFormProps {
    customers: Customer[];
    products: Product[];
    initialData?: Quotation;
    onSubmit: (data: QuotationFormData) => void;
    isLoading?: boolean;
}

export const QuotationForm: React.FC<QuotationFormProps> = ({
    customers,
    products,
    initialData,
    onSubmit,
    isLoading
}) => {
    const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<QuotationFormData>({
        defaultValues: {
            ...initialData,
            Details: initialData?.Details || [{ ProductID: 0, Quantity: 1, UnitPrice: 0, TotalPrice: 0 }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "Details"
    });

    // Toplam tutarı hesapla
    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name?.includes('Details')) {
                const details = value.Details || [];
                const total = details.reduce((sum, detail) => {
                    return sum + (detail.Quantity * detail.UnitPrice);
                }, 0);
                setValue('TotalAmount', total);
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, setValue]);

    // Seçilen ürünün fiyatını otomatik doldur
    const handleProductChange = (index: number, productId: number) => {
        const product = products.find(p => p.ProductID === Number(productId));
        if (product) {
            setValue(`Details.${index}.UnitPrice`, product.Price);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Teklif Numarası"
                    {...register('QuotationNumber', { required: 'Teklif numarası zorunludur' })}
                    error={errors.QuotationNumber?.message}
                    disabled={isLoading}
                />

                <Select
                    label="Müşteri"
                    options={customers.map(customer => ({
                        value: customer.CustomerID!,
                        label: `${customer.CompanyName} (${customer.CustomerCode})`
                    }))}
                    {...register('CustomerID', { required: 'Müşteri seçimi zorunludur' })}
                    error={errors.CustomerID?.message}
                    disabled={isLoading}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Teklif Tarihi"
                    type="date"
                    {...register('QuotationDate', { required: 'Teklif tarihi zorunludur' })}
                    error={errors.QuotationDate?.message}
                    disabled={isLoading}
                />

                <Input
                    label="Geçerlilik Tarihi"
                    type="date"
                    {...register('ValidUntil', { required: 'Geçerlilik tarihi zorunludur' })}
                    error={errors.ValidUntil?.message}
                    disabled={isLoading}
                />
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Ürünler</h3>
                    <Button
                        type="button"
                        onClick={() => append({ ProductID: 0, Quantity: 1, UnitPrice: 0, TotalPrice: 0 })}
                        disabled={isLoading}
                    >
                        <PlusIcon className="h-5 w-5 mr-1" />
                        Ürün Ekle
                    </Button>
                </div>

                {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-12 gap-4 items-start">
                        <div className="col-span-4">
                            <Select
                                options={products.map(product => ({
                                    value: product.ProductID!,
                                    label: `${product.Brand} - ${product.Code}`
                                }))}
                                {...register(`Details.${index}.ProductID`, {
                                    required: 'Ürün seçimi zorunludur',
                                    onChange: (e) => handleProductChange(index, Number(e.target.value))
                                })}
                                error={errors.Details?.[index]?.ProductID?.message}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="col-span-2">
                            <Input
                                type="number"
                                min="1"
                                {...register(`Details.${index}.Quantity`, {
                                    required: 'Miktar zorunludur',
                                    min: { value: 1, message: 'Miktar 1\'den küçük olamaz' }
                                })}
                                error={errors.Details?.[index]?.Quantity?.message}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="col-span-3">
                            <Input
                                type="number"
                                step="0.01"
                                {...register(`Details.${index}.UnitPrice`, {
                                    required: 'Birim fiyat zorunludur',
                                    min: { value: 0, message: 'Birim fiyat 0\'dan küçük olamaz' }
                                })}
                                error={errors.Details?.[index]?.UnitPrice?.message}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="col-span-2">
                            <Input
                                type="number"
                                step="0.01"
                                value={
                                    watch(`Details.${index}.Quantity`) * watch(`Details.${index}.UnitPrice`)
                                }
                                disabled
                            />
                        </div>
                        <div className="col-span-1">
                            <Button
                                type="button"
                                variant="danger"
                                onClick={() => remove(index)}
                                disabled={isLoading || fields.length === 1}
                            >
                                <TrashIcon className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                    label="Durum"
                    options={[
                        { value: 'Draft', label: 'Taslak' },
                        { value: 'Sent', label: 'Gönderildi' },
                        { value: 'Accepted', label: 'Kabul Edildi' },
                        { value: 'Rejected', label: 'Reddedildi' }
                    ]}
                    {...register('Status', { required: 'Durum seçimi zorunludur' })}
                    error={errors.Status?.message}
                    disabled={isLoading}
                />

                <Input
                    label="Toplam Tutar"
                    type="number"
                    step="0.01"
                    {...register('TotalAmount')}
                    disabled
                />
            </div>

            <Input
                label="Notlar"
                {...register('Notes')}
                disabled={isLoading}
                as="textarea"
                rows={3}
            />
        </form>
    );
};
