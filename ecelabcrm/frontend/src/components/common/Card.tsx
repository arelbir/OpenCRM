import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
    title,
    actions,
    children,
    className,
    ...props
}) => {
    return (
        <div
            className={clsx(
                'bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden',
                className
            )}
            {...props}
        >
            {(title || actions) && (
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    {title && (
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                            {title}
                        </h3>
                    )}
                    {actions && (
                        <div className="flex items-center space-x-2">
                            {actions}
                        </div>
                    )}
                </div>
            )}
            <div className="px-4 py-5 sm:p-6">{children}</div>
        </div>
    );
};
