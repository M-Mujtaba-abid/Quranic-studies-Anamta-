import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-text-secondary select-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={`w-full rounded-lg border bg-surface py-2.5 px-3 text-text transition-all duration-200 focus:outline-none focus:ring-2 placeholder:text-text-secondary/50
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${
                error
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-950/30'
                  : 'border-border focus:border-primary focus:ring-primary/20'
              }
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-text-secondary select-none">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
