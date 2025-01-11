import React, { forwardRef } from 'react';
import clsx from 'clsx';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    label?: string;
    error?: string;
    size?: InputSize;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, size = 'md', type = 'text', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    type={type}
                    className={clsx(
                        'block w-full rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
                        {
                            'px-2.5 py-1.5 text-sm': size === 'sm',
                            'px-3 py-2 text-base': size === 'md',
                            'px-4 py-2.5 text-lg': size === 'lg',
                        },
                        error
                            ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 dark:bg-gray-700',
                        className
                    )}
                    aria-invalid={error ? true : undefined}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
            </div>
        );
    }
);
