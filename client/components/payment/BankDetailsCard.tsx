'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentSetting {
  bankName?: string | null;
  accountTitle?: string | null;
  accountNumber?: string | null;
  iban?: string | null;
  jazzCashNumber?: string | null;
  jazzCashTitle?: string | null;
  easyPaisaNumber?: string | null;
  easyPaisaTitle?: string | null;
  instructions?: string | null;
}

interface BankDetailsCardProps {
  paymentSetting: PaymentSetting | null | undefined;
  loading?: boolean;
}

// Shared "where to send the money" display — used by both the enrollment payment flow
// (app/payment/page.tsx) and the donation flow (app/sponsor-a-student/page.tsx), both of
// which read the same admin-configured PaymentSetting record.
export function BankDetailsCard({ paymentSetting, loading }: BankDetailsCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (loading) {
    return <p className="text-xs text-text-secondary">Loading account details...</p>;
  }

  if (!paymentSetting) {
    return <p className="text-xs text-text-secondary">Account details are not configured yet. Please contact support.</p>;
  }

  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(paymentSetting.bankName || paymentSetting.accountNumber) && (
          <div className="bg-bg/50 border border-border/40 p-3.5 rounded-xl space-y-2 relative">
            <span className="font-semibold text-text uppercase tracking-wider text-[10px] text-gold">Bank Account</span>
            <div className="space-y-1 text-text-secondary text-[11px]">
              <p><span className="font-medium text-text">Bank:</span> {paymentSetting.bankName}</p>
              <p><span className="font-medium text-text">Title:</span> {paymentSetting.accountTitle}</p>
              <div className="flex items-center gap-1.5">
                <span><span className="font-medium text-text">A/C:</span> {paymentSetting.accountNumber}</span>
                <button
                  onClick={() => handleCopy(paymentSetting.accountNumber || '', 'acct')}
                  className="hover:text-gold transition-colors cursor-pointer"
                >
                  {copiedField === 'acct' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <span><span className="font-medium text-text">IBAN:</span> {paymentSetting.iban}</span>
                <button
                  onClick={() => handleCopy(paymentSetting.iban || '', 'iban')}
                  className="hover:text-gold transition-colors cursor-pointer"
                >
                  {copiedField === 'iban' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                </button>
              </div>
            </div>
          </div>
        )}

        {(paymentSetting.easyPaisaNumber || paymentSetting.jazzCashNumber) && (
          <div className="bg-bg/50 border border-border/40 p-3.5 rounded-xl space-y-2">
            <span className="font-semibold text-text uppercase tracking-wider text-[10px] text-gold">Mobile Wallets</span>
            <div className="space-y-2 text-text-secondary text-[15px]">
              {paymentSetting.easyPaisaNumber && (
                <div className="flex items-center justify-between border-b border-border/20 pb-1.5">
                  <div>
                    <span className="block font-medium text-text">EasyPaisa</span>
                    {paymentSetting.easyPaisaTitle && (
                      <span className="block text-[12px] text-text-secondary/80 mt-0.5">Title: {paymentSetting.easyPaisaTitle}</span>
                    )}
                    <span>No: {paymentSetting.easyPaisaNumber}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(paymentSetting.easyPaisaNumber || '', 'easypaisa')}
                    className="p-1 hover:text-gold transition-colors cursor-pointer"
                  >
                    {copiedField === 'easypaisa' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  </button>
                </div>
              )}
              {paymentSetting.jazzCashNumber && (
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block font-medium text-text">JazzCash</span>
                    {paymentSetting.jazzCashTitle && (
                      <span className="block text-[12px] text-text-secondary/80 mt-0.5">Title: {paymentSetting.jazzCashTitle}</span>
                    )}
                    <span>No: {paymentSetting.jazzCashNumber}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(paymentSetting.jazzCashNumber || '', 'jazzcash')}
                    className="p-1 hover:text-gold transition-colors cursor-pointer"
                  >
                    {copiedField === 'jazzcash' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {paymentSetting.instructions && (
        <div className="bg-primary/5 border border-primary/10 p-3 rounded-xl">
          <span className="block font-semibold text-text text-[10px] uppercase tracking-wider mb-1">Instructions:</span>
          <p className="text-[11px] leading-relaxed text-text-secondary whitespace-pre-wrap">{paymentSetting.instructions}</p>
        </div>
      )}
    </div>
  );
}
