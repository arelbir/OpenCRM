import React, { forwardRef } from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    ref={ref}
                    className={`
                        h-4 w-4 rounded border-gray-300 text-primary-600 
                        focus:ring-primary-500 disabled:cursor-not-allowed 
                        disabled:opacity-50
                        ${error ? 'border-red-300' : ''}
                        ${className}
                    `}
                    {...props}
                />
                {label && (
                    <label className="text-sm text-gray-700">
                        {label}
                    </label>
                )}
                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
            </div>
        );
    }
);
