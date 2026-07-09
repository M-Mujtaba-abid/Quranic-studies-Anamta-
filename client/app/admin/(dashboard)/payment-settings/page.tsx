'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import { 
  GET_ALL_PAYMENT_SETTINGS,
  CREATE_PAYMENT_SETTING,
  UPDATE_PAYMENT_SETTING,
  DELETE_PAYMENT_SETTING
} from '@/graphql';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Settings2,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  CreditCard,
  Building,
  Wallet
} from 'lucide-react';

interface PaymentSettingForm {
  id?: string;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  jazzCashNumber: string;
  jazzCashTitle: string;
  easyPaisaNumber: string;
  easyPaisaTitle: string;
  instructions: string;
  isActive: boolean;
}

const initialFormState: PaymentSettingForm = {
  bankName: '',
  accountTitle: '',
  accountNumber: '',
  iban: '',
  jazzCashNumber: '',
  jazzCashTitle: '',
  easyPaisaNumber: '',
  easyPaisaTitle: '',
  instructions: '',
  isActive: false
};

export default function AdminPaymentSettings() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formState, setFormState] = useState<PaymentSettingForm>(initialFormState);

  // Queries
  const { data, loading, error, refetch } = useQuery<any>(GET_ALL_PAYMENT_SETTINGS, {
    fetchPolicy: 'network-only'
  });

  // Mutations
  const [createSetting, { loading: isCreating }] = useMutation(CREATE_PAYMENT_SETTING, {
    onCompleted: () => {
      toast.success('Payment setting created successfully');
      setIsModalOpen(false);
      setFormState(initialFormState);
      refetch();
    },
    onError: (err) => {
      toast.error('Failed to create payment setting', { description: err.message });
    }
  });

  const [updateSetting, { loading: isUpdating }] = useMutation(UPDATE_PAYMENT_SETTING, {
    onCompleted: () => {
      toast.success('Payment setting updated successfully');
      setIsModalOpen(false);
      setFormState(initialFormState);
      refetch();
    },
    onError: (err) => {
      toast.error('Failed to update payment setting', { description: err.message });
    }
  });

  const [deleteSetting, { loading: isDeleting }] = useMutation(DELETE_PAYMENT_SETTING, {
    onCompleted: () => {
      toast.success('Payment setting deleted successfully');
      refetch();
    },
    onError: (err) => {
      toast.error('Failed to delete payment setting', { description: err.message });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormState(prev => ({ ...prev, [name]: checked }));
  };

  const openCreateModal = () => {
    setFormState(initialFormState);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (setting: any) => {
    setFormState({
      id: setting.id,
      bankName: setting.bankName,
      accountTitle: setting.accountTitle,
      accountNumber: setting.accountNumber,
      iban: setting.iban,
      jazzCashNumber: setting.jazzCashNumber,
      jazzCashTitle: setting.jazzCashTitle || '',
      easyPaisaNumber: setting.easyPaisaNumber,
      easyPaisaTitle: setting.easyPaisaTitle || '',
      instructions: setting.instructions,
      isActive: setting.isActive
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleActivate = async (id: string) => {
    await updateSetting({
      variables: {
        updatePaymentSettingInput: { id, isActive: true }
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this payment configuration?')) {
      await deleteSetting({ variables: { id } });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (
      !formState.bankName.trim() || 
      !formState.accountTitle.trim() || 
      !formState.accountNumber.trim() || 
      !formState.iban.trim() || 
      !formState.jazzCashNumber.trim() || 
      !formState.jazzCashTitle.trim() || 
      !formState.easyPaisaNumber.trim() || 
      !formState.easyPaisaTitle.trim() || 
      !formState.instructions.trim()
    ) {
      toast.warning('Please fill out all required fields.');
      return;
    }

    const payload = {
      bankName: formState.bankName.trim(),
      accountTitle: formState.accountTitle.trim(),
      accountNumber: formState.accountNumber.trim(),
      iban: formState.iban.trim(),
      jazzCashNumber: formState.jazzCashNumber.trim(),
      jazzCashTitle: formState.jazzCashTitle.trim(),
      easyPaisaNumber: formState.easyPaisaNumber.trim(),
      easyPaisaTitle: formState.easyPaisaTitle.trim(),
      instructions: formState.instructions.trim(),
      isActive: formState.isActive
    };

    if (isEditMode && formState.id) {
      await updateSetting({
        variables: {
          updatePaymentSettingInput: {
            id: formState.id,
            ...payload
          }
        }
      });
    } else {
      await createSetting({
        variables: {
          createPaymentSettingInput: payload
        }
      });
    }
  };

  if (loading && !data) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <RefreshCw className="h-10 w-10 text-gold animate-spin" />
        <p className="text-text-secondary font-medium animate-pulse">Loading settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
          <Settings2 size={32} />
        </div>
        <h3 className="text-xl font-bold font-display">Failed to load configurations</h3>
        <p className="text-text-secondary max-w-md">{error.message}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw size={16} />}>
          Try Again
        </Button>
      </div>
    );
  }

  const settings = data?.paymentSettings || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-surface border border-border p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold font-display tracking-tight text-text">Payment Gateway Settings</h2>
          <p className="text-sm text-text-secondary mt-1">
            Configure the bank accounts, mobile wallet numbers (JazzCash/EasyPaisa), and checkout instructions shown to students.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw size={14} />} />
          <Button variant="gold" size="sm" onClick={openCreateModal} leftIcon={<Plus size={14} />}>
            New Setting
          </Button>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {settings.length === 0 ? (
          <div className="col-span-full py-20 text-center text-text-secondary bg-surface border border-border rounded-2xl shadow-sm">
            <Settings2 size={48} className="mx-auto text-text-secondary/35 mb-4" />
            <p className="font-semibold">No payment settings configured.</p>
            <p className="text-xs text-text-secondary mt-1">Click the button above to add your first gateway configuration.</p>
          </div>
        ) : (
          settings.map((setting: any) => (
            <div 
              key={setting.id} 
              className={`bg-surface border p-6 rounded-2xl space-y-6 shadow-sm transition-all duration-300 relative ${
                setting.isActive 
                  ? 'border-gold/60 shadow-[0_0_20px_rgba(197,168,128,0.06)]' 
                  : 'border-border hover:border-border/80'
              }`}
            >
              {/* Badge & Quick toggler */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                  setting.isActive
                    ? 'bg-gold/15 text-gold border border-gold/30'
                    : 'bg-text-secondary/10 text-text-secondary border border-border'
                }`}>
                  {setting.isActive ? 'Active Configuration' : 'Inactive'}
                </span>
                
                <div className="flex items-center gap-2">
                  {!setting.isActive && (
                    <button
                      onClick={() => handleActivate(setting.id)}
                      disabled={isUpdating}
                      className="text-xs text-gold hover:text-gold-light font-bold flex items-center gap-1 p-1"
                    >
                      <CheckCircle size={14} />
                      <span>Set Active</span>
                    </button>
                  )}
                  <button
                    onClick={() => openEditModal(setting)}
                    className="p-1.5 rounded bg-primary/10 border border-primary/20 text-text hover:border-gold hover:text-gold transition-all"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(setting.id)}
                    disabled={isDeleting}
                    className="p-1.5 rounded bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Main content split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                {/* Bank Account */}
                <div className="bg-bg/40 border border-border/70 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    <Building size={14} className="text-gold" />
                    <span>Bank Transfer</span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div>Bank: <strong className="text-text">{setting.bankName}</strong></div>
                    <div>Title: <strong className="text-text">{setting.accountTitle}</strong></div>
                    <div>A/C #: <strong className="text-text">{setting.accountNumber}</strong></div>
                    <div>IBAN: <strong className="text-text">{setting.iban}</strong></div>
                  </div>
                </div>

                {/* Mobile Wallets */}
                <div className="bg-bg/40 border border-border/70 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    <Wallet size={14} className="text-gold" />
                    <span>Mobile Wallets</span>
                  </div>
                  <div className="text-xs space-y-2">
                    <div>
                      <span className="text-text-secondary font-medium block">JazzCash</span>
                      <div>Title: <strong className="text-text">{setting.jazzCashTitle}</strong></div>
                      <div>No: <strong className="text-text">{setting.jazzCashNumber}</strong></div>
                    </div>
                    <div className="border-t border-border/20 pt-2">
                      <span className="text-text-secondary font-medium block">EasyPaisa</span>
                      <div>Title: <strong className="text-text">{setting.easyPaisaTitle}</strong></div>
                      <div>No: <strong className="text-text">{setting.easyPaisaNumber}</strong></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions summary */}
              <div className="border-t border-border/40 pt-4 text-xs">
                <span className="font-semibold text-text-secondary uppercase tracking-wider text-[10px]">Instructions</span>
                <p className="text-text-secondary mt-1.5 leading-relaxed bg-bg/20 p-3 rounded-lg border border-border/40">
                  {setting.instructions}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal create/edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          
          <form 
            onSubmit={handleSubmit}
            className="glass max-w-lg w-full p-6 sm:p-8 rounded-2xl border border-gold/30 glow-gold relative space-y-5 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-gold p-1"
            >
              <X size={20} />
            </button>

            <div className="text-center">
              <h3 className="text-xl font-bold font-display text-text">
                {isEditMode ? 'Edit Payment Setting' : 'New Payment Setting'}
              </h3>
              <p className="text-xs text-text-secondary mt-1">
                Configure payment receiving details.
              </p>
            </div>

            <div className="space-y-4">
              {/* Bank Account Fields */}
              <div className="border border-border p-4 rounded-xl space-y-3 bg-bg/20">
                <h4 className="text-[10px] font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
                  <Building size={12} />
                  <span>Bank Account Details</span>
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Bank Name *"
                    name="bankName"
                    value={formState.bankName}
                    onChange={handleInputChange}
                    placeholder="e.g. Meezan Bank"
                    required
                  />
                  <Input
                    label="Account Title *"
                    name="accountTitle"
                    value={formState.accountTitle}
                    onChange={handleInputChange}
                    placeholder="e.g. Anamta Institute"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Account Number *"
                    name="accountNumber"
                    value={formState.accountNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. 023401052345"
                    required
                  />
                  <Input
                    label="IBAN Number *"
                    name="iban"
                    value={formState.iban}
                    onChange={handleInputChange}
                    placeholder="PK50MEZN..."
                    required
                  />
                </div>
              </div>

              {/* Mobile Wallet Fields */}
              <div className="border border-border p-4 rounded-xl space-y-3 bg-bg/20">
                <h4 className="text-[10px] font-bold text-gold uppercase tracking-wider flex items-center gap-1.5">
                  <Wallet size={12} />
                  <span>Mobile Wallets</span>
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="JazzCash Number *"
                    name="jazzCashNumber"
                    value={formState.jazzCashNumber}
                    onChange={handleInputChange}
                    placeholder="03001234567"
                    required
                  />
                  <Input
                    label="JazzCash Account Title *"
                    name="jazzCashTitle"
                    value={formState.jazzCashTitle}
                    onChange={handleInputChange}
                    placeholder="e.g. Anamta Institute"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="EasyPaisa Number *"
                    name="easyPaisaNumber"
                    value={formState.easyPaisaNumber}
                    onChange={handleInputChange}
                    placeholder="03001234567"
                    required
                  />
                  <Input
                    label="EasyPaisa Account Title *"
                    name="easyPaisaTitle"
                    value={formState.easyPaisaTitle}
                    onChange={handleInputChange}
                    placeholder="e.g. Anamta Institute"
                    required
                  />
                </div>
              </div>

              {/* Instructions Textarea */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Payment Instructions *
                </label>
                <textarea
                  name="instructions"
                  value={formState.instructions}
                  onChange={handleInputChange}
                  rows={3}
                  required
                  placeholder="e.g. Send transfer proof or receipt screenshot showing transaction ID."
                  className="w-full bg-bg border border-border rounded-xl p-3 text-sm text-text focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold resize-none leading-relaxed placeholder:text-text-secondary/30"
                />
              </div>

              {/* Active Toggle Checkbox */}
              <div className="flex items-center gap-2 py-1 select-none">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formState.isActive}
                  onChange={handleCheckboxChange}
                  className="rounded border-border text-gold focus:ring-gold h-4 w-4 bg-bg cursor-pointer"
                />
                <label htmlFor="isActive" className="text-xs font-semibold text-text hover:text-gold transition-colors cursor-pointer">
                  Activate this configuration immediately (deactivates others)
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 py-3 text-xs uppercase font-bold tracking-wider"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gold"
                className="flex-1 py-3 text-xs uppercase font-bold tracking-wider"
                isLoading={isCreating || isUpdating}
              >
                {isEditMode ? 'Save Changes' : 'Create'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
