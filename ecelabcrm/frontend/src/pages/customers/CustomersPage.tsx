import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CustomerList } from '../../components/customers/CustomerList';
import { CustomerModal } from '../../components/customers/CustomerModal';
import { Button } from '../../components/common';
import { Customer } from '../../types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { downloadExcel, importExcel } from '../../services/excelService';
import { customerService } from '../../services/customerService';
import { toast } from 'react-hot-toast';

export const CustomersPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const queryClient = useQueryClient();

    const form = useForm({
        defaultValues: {
            Name: '',
            TaxNumber: '',
            TaxOffice: '',
            Phone: '',
            Email: '',
            Address: '',
            ContactPerson: '',
            ContactPhone: '',
            Notes: '',
            IsActive: true
        }
    });

    // Müşteri listesini getir
    const { data: customers = [], isLoading } = useQuery<Customer[]>({
        queryKey: ['customers'],
        queryFn: () => customerService.getAll(),
    });

    // Müşteri oluştur/güncelle
    const mutation = useMutation({
        mutationFn: async (data: any) => {
            if (selectedCustomer) {
                return customerService.update(selectedCustomer.CustomerID, data);
            }
            return customerService.create(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            setIsModalOpen(false);
            setSelectedCustomer(undefined);
            form.reset();
            toast.success(selectedCustomer ? 'Müşteri güncellendi' : 'Müşteri oluşturuldu');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Bir hata oluştu');
        }
    });

    // Excel şablonu indir
    const handleDownloadTemplate = async () => {
        try {
            await downloadExcel();
            toast.success('Excel şablonu indirildi');
        } catch (error: any) {
            toast.error(error.message || 'Excel şablonu indirilirken bir hata oluştu');
        }
    };

    // Excel dosyası yükle
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            try {
                await importExcel(file);
                queryClient.invalidateQueries({ queryKey: ['customers'] });
                toast.success('Müşteriler başarıyla içe aktarıldı');
            } catch (error: any) {
                toast.error(error.message || 'Excel yüklenirken bir hata oluştu');
            }
            event.target.value = '';
        }
    };

    const handleEditCustomer = (customer: Customer) => {
        // Form verilerini ayarla
        form.reset({
            Name: customer.Name,
            TaxNumber: customer.TaxNumber || '',
            TaxOffice: customer.TaxOffice || '',
            Phone: customer.Phone || '',
            Email: customer.Email || '',
            Address: customer.Address || '',
            ContactPerson: customer.ContactPerson || '',
            ContactPhone: customer.ContactPhone || '',
            Notes: customer.Notes || '',
            IsActive: customer.IsActive
        });
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const handleDelete = async (customer: Customer) => {
        if (window.confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) {
            try {
                await customerService.delete(customer.CustomerID);
                queryClient.invalidateQueries({ queryKey: ['customers'] });
                toast.success('Müşteri silindi');
            } catch (error: any) {
                toast.error(error.message || 'Müşteri silinirken bir hata oluştu');
            }
        }
    };

    const handleSubmit = (data: any) => {
        mutation.mutate(data);
    };

    return (
        <div className="space-y-4">
            {/* Üst toolbar */}
            <div className="flex justify-between items-center">
                <div className="space-x-2">
                    <Button onClick={() => setIsModalOpen(true)}>
                        Yeni Müşteri
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={handleDownloadTemplate}
                    >
                        Excel Şablonu İndir
                    </Button>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="excel-upload"
                    />
                    <Button
                        variant="secondary"
                        onClick={() => document.getElementById('excel-upload')?.click()}
                    >
                        Excel Yükle
                    </Button>
                </div>
            </div>

            {/* Müşteri listesi */}
            <CustomerList
                customers={customers}
                onEdit={handleEditCustomer}
                onDelete={handleDelete}
            />

            {/* Müşteri modalı */}
            <CustomerModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedCustomer(undefined);
                    form.reset();
                }}
                form={form}
                onSubmit={handleSubmit}
                isSubmitting={mutation.isPending}
                selectedCustomer={selectedCustomer}
            />
        </div>
    );
};
