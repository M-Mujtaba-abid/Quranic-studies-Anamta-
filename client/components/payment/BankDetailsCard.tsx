'use client';

import React, { useState } from 'react';
import { Check, Copy, Building2, Smartphone } from 'lucide-react';
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">

        {/* ── Bank Account ── */}
        {(paymentSetting.bankName || paymentSetting.accountNumber) && (
          <div className="bg-bg/60 border border-border/50 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/40 bg-gold/5">
              <Building2 size={12} className="text-gold shrink-0" />
              <span className="font-semibold text-gold uppercase tracking-widest text-[10px]">Bank Account</span>
            </div>

            {/* Rows — label fixed width, value takes remaining space, no wrap */}
            <div className="divide-y divide-border/30">
              {paymentSetting.bankName && (
                <div className="flex items-center px-4 py-2.5 gap-2">
                  <span className="text-[10px] text-text-secondary shrink-0 w-14">Bank</span>
                  <span className="text-[11px] font-medium text-text truncate">{paymentSetting.bankName}</span>
                </div>
              )}

              {paymentSetting.accountTitle && (
                <div className="flex items-center px-4 py-2.5 gap-2">
                  <span className="text-[10px] text-text-secondary shrink-0 w-14">Name</span>
                  <span className="text-[11px] font-medium text-text truncate">{paymentSetting.accountTitle}</span>
                </div>
              )}

              {paymentSetting.accountNumber && (
                <div className="flex items-center px-4 py-2.5 gap-2">
                  <span className="text-[10px] text-text-secondary shrink-0 w-14">A/C No.</span>
                  <span className="text-[11px] font-mono font-semibold text-text tracking-wide flex-1 min-w-0 truncate">{paymentSetting.accountNumber}</span>
                  <button
                    onClick={() => handleCopy(paymentSetting.accountNumber || '', 'acct')}
                    className="p-1 rounded-md hover:bg-gold/10 hover:text-gold transition-all cursor-pointer text-text-secondary shrink-0"
                  >
                    {copiedField === 'acct' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                  </button>
                </div>
              )}

              {paymentSetting.iban && (
                <div className="flex items-center px-4 py-2.5 gap-2">
                  <span className="text-[10px] text-text-secondary shrink-0 w-14">IBAN</span>
                  <span className="text-[10px] font-mono font-semibold text-text tracking-wide flex-1 min-w-0 truncate">{paymentSetting.iban}</span>
                  <button
                    onClick={() => handleCopy(paymentSetting.iban || '', 'iban')}
                    className="p-1 rounded-md hover:bg-gold/10 hover:text-gold transition-all cursor-pointer text-text-secondary shrink-0"
                  >
                    {copiedField === 'iban' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                  </button>
                </div>
              )}

              {/* Swift Code — hardcoded, shown only when IBAN is present */}
              {paymentSetting.iban && (
                <div className="flex items-center px-4 py-2.5 gap-2">
                  <span className="text-[10px] text-text-secondary shrink-0 w-14">Swift</span>
                  <span className="text-[10px] font-mono font-semibold text-text tracking-wide flex-1 min-w-0 truncate">MEZNPKKA</span>
                  <button
                    onClick={() => handleCopy('MEZNPKKA', 'swift')}
                    className="p-1 rounded-md hover:bg-gold/10 hover:text-gold transition-all cursor-pointer text-text-secondary shrink-0"
                  >
                    {copiedField === 'swift' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ── Mobile Wallets ── */}
        {(paymentSetting.easyPaisaNumber || paymentSetting.jazzCashNumber) && (
          <div className="bg-bg/60 border border-border/50 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/40 bg-gold/5">
              <Smartphone size={12} className="text-gold shrink-0" />
              <span className="font-semibold text-gold uppercase tracking-widest text-[10px]">Mobile Wallets</span>
            </div>

            <div className="divide-y divide-border/30">
              {/* EasyPaisa */}
              {paymentSetting.easyPaisaNumber && (
                <div className="px-4 py-2.5 space-y-1.5">
                  <span className="text-[10px] font-semibold text-gold/80 uppercase tracking-wider">EasyPaisa</span>

                  {paymentSetting.easyPaisaTitle && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-text-secondary shrink-0 w-14">Name</span>
                      <span className="text-[11px] font-medium text-text truncate">{paymentSetting.easyPaisaTitle}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-text-secondary shrink-0 w-14">Number</span>
                    <span className="text-[11px] font-mono font-semibold text-text tracking-wide flex-1 min-w-0 truncate">{paymentSetting.easyPaisaNumber}</span>
                    <button
                      onClick={() => handleCopy(paymentSetting.easyPaisaNumber || '', 'easypaisa')}
                      className="p-1 rounded-md hover:bg-gold/10 hover:text-gold transition-all cursor-pointer text-text-secondary shrink-0"
                    >
                      {copiedField === 'easypaisa' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                    </button>
                  </div>
                </div>
              )}

              {/* JazzCash */}
              {paymentSetting.jazzCashNumber && (
                <div className="px-4 py-2.5 space-y-1.5">
                  <span className="text-[10px] font-semibold text-gold/80 uppercase tracking-wider">JazzCash</span>

                  {paymentSetting.jazzCashTitle && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-text-secondary shrink-0 w-14">Name</span>
                      <span className="text-[11px] font-medium text-text truncate">{paymentSetting.jazzCashTitle}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-text-secondary shrink-0 w-14">Number</span>
                    <span className="text-[11px] font-mono font-semibold text-text tracking-wide flex-1 min-w-0 truncate">{paymentSetting.jazzCashNumber}</span>
                    <button
                      onClick={() => handleCopy(paymentSetting.jazzCashNumber || '', 'jazzcash')}
                      className="p-1 rounded-md hover:bg-gold/10 hover:text-gold transition-all cursor-pointer text-text-secondary shrink-0"
                    >
                      {copiedField === 'jazzcash' ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {paymentSetting.instructions && (
        <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl">
          <span className="block font-semibold text-text text-[10px] uppercase tracking-widest mb-2">Instructions</span>
          <p className="text-[11px] leading-relaxed text-text-secondary whitespace-pre-wrap">{paymentSetting.instructions}</p>
        </div>
      )}

      <div className="w-full h-[1px] bg-border"></div>
      <p className="text-[14px] font-mono font-semibold text-emerald-500 text-center tracking-wide flex-1 min-w-0 truncate">Verified Account <span className="">✓</span></p>
    </div>
  );
}
