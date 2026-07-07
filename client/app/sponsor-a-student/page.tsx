'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMutation, useQuery } from '@apollo/client/react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { CheckCircle, CreditCard, HandCoins, Mail, Upload, User } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUploadField } from '@/components/admin/courses/ImageUploadField';
import { BankDetailsCard } from '@/components/payment/BankDetailsCard';
import { SUBMIT_DONATION_MUTATION, GET_ACTIVE_PAYMENT_SETTING } from '@/graphql';

const DONATION_CURRENCY = 'PKR';

const DONATION_TYPES: { value: string; label: string }[] = [
  { value: 'LILLAH', label: 'Fii Sabiilillah (Unconditional/Pure Charity)' },
  { value: 'SADAQAH_JARIYAH', label: 'Sadaqah Jariyah (Ongoing/Continuous Charity)' },
  { value: 'SADAQAH_NAFILLAH', label: 'Sadaqah Nafillah (General Voluntary Charity)' },
  { value: 'ZAKAT', label: 'Zakat (Obligatory Charity)' },
];

interface DonationFormValues {
  type: string;
  amount: number;
  donorName: string;
  email: string;
  description: string;
}

export default function SponsorAStudentPage() {
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [screenshotPublicId, setScreenshotPublicId] = useState('');
  const [donationSuccess, setDonationSuccess] = useState<any | null>(null);

  const { data: settingsData, loading: loadingSettings } = useQuery<any>(GET_ACTIVE_PAYMENT_SETTING);
  const paymentSetting = settingsData?.activePaymentSetting;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DonationFormValues>({
    defaultValues: { type: '', amount: 0, donorName: '', email: '', description: '' },
  });

  const [submitDonation, { loading: isSubmitting }] = useMutation<any, any>(SUBMIT_DONATION_MUTATION, {
    onCompleted: (res) => {
      setDonationSuccess(res?.createDonation ?? null);
      toast.success('JazakAllahu Khairan! Your donation has been submitted.');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to submit donation. Please try again.');
    },
  });

  const resetAll = () => {
    setDonationSuccess(null);
    setScreenshotUrl('');
    setScreenshotPublicId('');
    reset();
  };

  const onSubmit = async (values: DonationFormValues) => {
    if (!screenshotUrl || !screenshotPublicId) {
      toast.warning('Please upload a screenshot of your transfer before submitting.');
      return;
    }

    await submitDonation({
      variables: {
        createDonationInput: {
          type: values.type,
          donorName: values.donorName.trim() || undefined,
          email: values.email.trim() || undefined,
          description: values.description.trim() || undefined,
          amount: Number(values.amount),
          currency: DONATION_CURRENCY,
          screenshotUrl,
          screenshotPublicId,
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-bg text-text pb-20 relative overflow-x-hidden">
      <Navbar />

      {/* Page-wide background image, matching /courses, /about, /contact, /enrollement */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Image
          src="/images/about/contact_bg.png"
          alt=""
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/10 via-bg/70 to-bg" />
      </div>

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[30vh] left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 lg:px-10 mt-8 space-y-8 relative z-10">
        <div className="max-w-xl mx-auto text-center space-y-2">
          <span className="inline-flex px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[10px] font-bold uppercase tracking-wider">
            Sponsor a Student
          </span>
          <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-text">
            Support a Student&apos;s Quran Journey
          </h1>
          <p className="text-text-secondary text-sm md:text-base">
            Your Lillah, Sadaqah, or Zakat helps cover tuition for students who cannot afford it. Transfer your donation and submit the receipt below.
          </p>
        </div>

        {donationSuccess ? (
          <div className="max-w-xl mx-auto relative z-10 space-y-6 rounded-2xl border border-border bg-surface p-8 text-left shadow-md animate-fade-in">
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle size={36} />
            </div>
            <div className="space-y-2 text-center">
              <h3 className="font-display text-xl font-bold text-text">Donation Submitted!</h3>
              <p className="text-xs leading-relaxed text-text-secondary">
                Alhamdulillah, your donation has been received and is pending verification by our team.
              </p>
            </div>

            <div className="space-y-1.5 rounded-xl border border-border/40 bg-bg/50 p-4 text-xs text-text-secondary">
              <p>
                <span className="font-medium text-text">Type:</span>{' '}
                {DONATION_TYPES.find((t) => t.value === donationSuccess.type)?.label ?? donationSuccess.type}
              </p>
              <p>
                <span className="font-medium text-text">Amount:</span> {donationSuccess.currency} {donationSuccess.amount}
              </p>
            </div>

            <div className="space-y-3">
              <Button type="button" variant="gold" className="w-full py-3 rounded-xl text-sm" onClick={resetAll}>
                Make Another Donation
              </Button>
              <Link href="/" className="block w-full">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start relative z-10">
            <div className="bg-surface border border-border p-6 rounded-2xl shadow-md space-y-4">
              <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                <CreditCard className="text-gold h-5 w-5" />
                <h3 className="text-sm font-bold font-display text-text uppercase tracking-wider">
                  Step 1: Transfer Your Donation
                </h3>
              </div>
              <p className="text-text-secondary leading-relaxed text-xs">
                Send your donation using any of the methods below, then upload a screenshot of the confirmation in the form.
              </p>
              <BankDetailsCard paymentSetting={paymentSetting} loading={loadingSettings} />
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-surface border border-border p-6 md:p-8 rounded-2xl shadow-md space-y-5"
            >
              <div className="flex items-center gap-2 border-b border-border/50 pb-3">
                <Upload className="text-gold h-5 w-5" />
                <h3 className="text-sm font-bold font-display text-text uppercase tracking-wider">
                  Step 2: Submit Your Details
                </h3>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Donation Type *
                </label>
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: 'Please select a donation type.' }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a donation type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {DONATION_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type?.message && <span className="text-xs text-red-500">{errors.type.message}</span>}
              </div>

              <Input
                label="Amount (PKR) *"
                type="number"
                min="1"
                step="0.01"
                leftIcon={<HandCoins size={14} />}
                {...register('amount', {
                  required: 'Amount is required.',
                  min: { value: 1, message: 'Amount must be greater than 0.' },
                  valueAsNumber: true,
                })}
                error={errors.amount?.message}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  placeholder="Anas Ahmed"
                  leftIcon={<User size={14} />}
                  {...register('donorName')}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="donor@gmail.com"
                  leftIcon={<Mail size={14} />}
                  {...register('email', {
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address.' },
                  })}
                  error={errors.email?.message}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Message (optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Dedicate this donation or leave a note..."
                  {...register('description')}
                  className="w-full bg-bg border border-border rounded-xl p-3 text-sm text-text focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold placeholder:text-text-secondary/40"
                />
              </div>

              <ImageUploadField
                label="Transfer Screenshot *"
                value={screenshotUrl}
                onChange={(url, publicId) => {
                  setScreenshotUrl(url);
                  setScreenshotPublicId(publicId);
                }}
                folder="donations"
                inputId="donation-screenshot-upload"
              />

              <Button type="submit" variant="gold" className="w-full py-3.5 rounded-xl text-sm shadow-md" isLoading={isSubmitting}>
                Submit Donation
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
