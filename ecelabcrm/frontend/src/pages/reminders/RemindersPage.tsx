import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reminderService, customerService } from '../../services';
import { Reminder, ReminderFormData, Customer } from '../../types';
import { PageHeader, Button, Modal } from '../../components/common';
import { ReminderList, ReminderForm } from '../../components/reminders';
import { useInvalidateQueries } from '../../hooks/useInvalidateQueries';
import { PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export const RemindersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<ReminderFormData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const invalidateQueries = useInvalidateQueries();

  // Hatırlatmaları getir
  const { data: reminders = [] } = useQuery({
    queryKey: ['reminders'],
    queryFn: () => reminderService.getAllReminders()
  });

  // Müşterileri getir
  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => customerService.getAllCustomers()
  });

  // Yeni hatırlatma oluştur
  const createMutation = useMutation({
    mutationFn: (data: ReminderFormData) => reminderService.createReminder(data),
    onSuccess: () => {
      invalidateQueries(['reminders']);
      setIsModalOpen(false);
      setSelectedReminder(null);
      toast.success('Hatırlatma başarıyla oluşturuldu');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Bir hata oluştu');
    }
  });

  // Hatırlatma güncelle
  const updateMutation = useMutation({
    mutationFn: (data: ReminderFormData) => reminderService.updateReminder(selectedReminder?.ReminderID!, data),
    onSuccess: () => {
      invalidateQueries(['reminders']);
      setIsModalOpen(false);
      setSelectedReminder(null);
      toast.success('Hatırlatma başarıyla güncellendi');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Bir hata oluştu');
    }
  });

  // Hatırlatma sil
  const deleteMutation = useMutation({
    mutationFn: (id: number) => reminderService.deleteReminder(id),
    onSuccess: () => {
      invalidateQueries(['reminders']);
      setIsDeleteModalOpen(false);
      setSelectedReminder(null);
      toast.success('Hatırlatma başarıyla silindi');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Bir hata oluştu');
    }
  });

  // Hatırlatma tamamlandı olarak işaretle
  const completeMutation = useMutation({
    mutationFn: (id: number) => reminderService.completeReminder(id),
    onSuccess: () => {
      invalidateQueries(['reminders']);
      toast.success('Hatırlatma tamamlandı olarak işaretlendi');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Bir hata oluştu');
    }
  });

  const handleSubmit = (data: ReminderFormData) => {
    if (selectedReminder) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (reminder: Reminder) => {
    setSelectedReminder({
      ...reminder,
      DueDate: new Date(reminder.DueDate).toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleDelete = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setIsDeleteModalOpen(true);
  };

  const handleComplete = (reminder: Reminder) => {
    completeMutation.mutate(reminder.ReminderID!);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReminder(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hatırlatmalar"
        description="Hatırlatma listesi ve yönetimi"
        actions={
          <Button
            onClick={() => {
              setSelectedReminder(null);
              setIsModalOpen(true);
            }}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Yeni Hatırlatma
          </Button>
        }
      />

      <ReminderList
        reminders={reminders}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onComplete={handleComplete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedReminder ? 'Hatırlatma Düzenle' : 'Yeni Hatırlatma'}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={handleCloseModal}
            >
              İptal
            </Button>
            <Button
              variant="primary"
              onClick={() => document.forms[0].requestSubmit()}
              isLoading={createMutation.isLoading || updateMutation.isLoading}
            >
              {selectedReminder ? 'Güncelle' : 'Oluştur'}
            </Button>
          </>
        }
      >
        <ReminderForm
          initialData={selectedReminder || undefined}
          onSubmit={handleSubmit}
          isLoading={createMutation.isLoading || updateMutation.isLoading}
          customers={customers}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Hatırlatmayı Sil"
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
              onClick={() => deleteMutation.mutate(selectedReminder!.ReminderID!)}
              isLoading={deleteMutation.isLoading}
            >
              Sil
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-500">
          Bu hatırlatmayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
        </p>
      </Modal>
    </div>
  );
};
