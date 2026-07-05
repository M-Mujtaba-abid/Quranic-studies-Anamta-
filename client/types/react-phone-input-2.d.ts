declare module 'react-phone-input-2' {
  import type { ComponentType, CSSProperties, InputHTMLAttributes } from 'react';

  interface PhoneInputProps {
    country?: string;
    value?: string;
    onChange?: (value: string) => void;
    disableDropdown?: boolean;
    onlyCountries?: string[];
    inputStyle?: CSSProperties;
    buttonStyle?: CSSProperties;
    dropdownStyle?: CSSProperties;
    containerClass?: string;
    inputProps?: InputHTMLAttributes<HTMLInputElement>;
  }

  const PhoneInput: ComponentType<PhoneInputProps>;
  export default PhoneInput;
}
