'use client';

import React, { useEffect, useRef } from 'react';
import { Controller, type Control, type FieldErrors, type UseFormRegister } from 'react-hook-form';
import PhoneInput, { type CountryData } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { User, Mail, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import type { StudentInfoValues } from './enrollment.types';

interface StudentInfoFieldsProps {
  control: Control<StudentInfoValues>;
  register: UseFormRegister<StudentInfoValues>;
  errors: FieldErrors<StudentInfoValues>;
  phoneCountryCode: string;
  lockPhoneCountry?: boolean;
}

// react-phone-input-2 doesn't pick up Tailwind classes, so it's themed to match the
// app's dark palette (see app/globals.css) via its own style props instead.
const phoneInputStyle: React.CSSProperties = {
  width: '100%',
  height: '44px',
  background: '#070b0e',
  borderColor: '#16222f',
  color: '#f3f4f6',
};
const phoneButtonStyle: React.CSSProperties = {
  background: '#0d131a',
  borderColor: '#16222f',
};
const phoneDropdownStyle: React.CSSProperties = {
  background: '#0d131a',
  color: '#f3f4f6',
};

export function StudentInfoFields({
  control,
  register,
  errors,
  phoneCountryCode,
  lockPhoneCountry,
}: StudentInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name *"
          placeholder="Anas"
          leftIcon={<User size={14} />}
          {...register('firstName', { required: 'First name is required.' })}
          error={errors.firstName?.message}
        />
        <Input
          label="Last Name *"
          placeholder="Ahmed"
          {...register('lastName', { required: 'Last name is required.' })}
          error={errors.lastName?.message}
        />
      </div>

      <Input
        label="Email Address *"
        type="email"
        placeholder="student@gmail.com"
        leftIcon={<Mail size={14} />}
        {...register('email', {
          required: 'Email is required.',
          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address.' },
        })}
        error={errors.email?.message}
      />

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Phone / WhatsApp *
        </label>
        <Controller
          name="phone"
          control={control}
          rules={{ required: 'Phone number is required.' }}
          render={({ field }) => (
            <PhoneInput
              country={phoneCountryCode}
              value={field.value}
              onChange={field.onChange}
              disableDropdown={lockPhoneCountry}
              onlyCountries={lockPhoneCountry ? [phoneCountryCode] : undefined}
              inputStyle={phoneInputStyle}
              buttonStyle={phoneButtonStyle}
              dropdownStyle={phoneDropdownStyle}
              containerClass="w-full"
              inputProps={{ name: 'phone', required: true }}
            />
          )}
        />
        {errors.phone?.message && <span className="text-xs text-red-500">{String(errors.phone.message)}</span>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="City" placeholder="Karachi" {...register('city')} />
        <Input label="Address" placeholder="Street, area" leftIcon={<MapPin size={14} />} {...register('address')} />
      </div>
    </div>
  );
}
