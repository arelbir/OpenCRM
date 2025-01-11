import React from 'react';
import clsx from 'clsx';

type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
};

export const Badge: React.FC<BadgeProps> = ({
    variant = 'primary',
    className,
    children,
    ...props
}) => {
    return (
        <span
            className={clsx(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                variantClasses[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};
