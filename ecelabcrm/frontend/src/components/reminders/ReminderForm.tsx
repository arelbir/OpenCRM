import React from 'react';
import { useForm } from 'react-hook-form';
import { Input, Select } from '../common';
import { Customer, ReminderFormData } from '../../types';

interface ReminderFormProps {
  initialData?: ReminderFormData;
  onSubmit: (data: ReminderFormData) => void;
  isLoading?: boolean;
  customers: Customer[];
}

export const ReminderForm: React.FC<ReminderFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  customers
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ReminderFormData>({
    defaultValues: initialData || {
      CustomerID: 0,
      Title: '',
      Description: '',
      DueDate: new Date().toISOString().split('T')[0],
      Priority: 'Medium',
      IsCompleted: false
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="Müşteri"
        options={customers.map(customer => ({
          value: customer.CustomerID,
          label: `${customer.CompanyName}`
        }))}
        error={errors.CustomerID?.message}
        {...register('CustomerID', { required: 'Müşteri seçiniz' })}
      />

      <Input
        label="Başlık"
        error={errors.Title?.message}
        {...register('Title', { required: 'Başlık giriniz' })}
      />

      <Input
        label="Açıklama"
        type="textarea"
        rows={3}
        error={errors.Description?.message}
        {...register('Description')}
      />

      <Input
        label="Tarih"
        type="date"
        error={errors.DueDate?.message}
        {...register('DueDate', { required: 'Tarih giriniz' })}
      />

      <Select
        label="Öncelik"
        options={[
          { value: 'Low', label: 'Düşük' },
          { value: 'Medium', label: 'Orta' },
          { value: 'High', label: 'Yüksek' }
        ]}
        error={errors.Priority?.message}
        {...register('Priority', { required: 'Öncelik seçiniz' })}
      />

      <div className="flex justify-end space-x-2">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </form>
  );
};
