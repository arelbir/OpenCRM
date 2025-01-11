import React, { forwardRef } from 'react';
import clsx from 'clsx';

export interface SelectOption {
    value: string | number;
    label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    label?: string;
    error?: string;
    options: SelectOption[];
    size?: 'sm' | 'md' | 'lg';
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, size = 'md', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    className={clsx(
                        'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
                        {
                            'px-2.5 py-1.5 text-sm': size === 'sm',
                            'px-3 py-2 text-base': size === 'md',
                            'px-4 py-2.5 text-lg': size === 'lg',
                        },
                        error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
                        className
                    )}
                    aria-invalid={error ? true : undefined}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
        );
    }
);
