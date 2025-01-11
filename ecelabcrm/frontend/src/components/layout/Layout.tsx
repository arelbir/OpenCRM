import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    HomeIcon,
    UserGroupIcon,
    CubeIcon,
    DocumentTextIcon,
    BellIcon,
} from '@heroicons/react/24/outline';
import { ThemeToggle } from '../common';
import clsx from 'clsx';

const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Müşteriler', href: '/customers', icon: UserGroupIcon },
    { name: 'Ürünler', href: '/products', icon: CubeIcon },
    { name: 'Teklifler', href: '/quotations', icon: DocumentTextIcon },
    { name: 'Hatırlatıcılar', href: '/reminders', icon: BellIcon },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex flex-shrink-0 items-center">
                                <img
                                    className="h-8 w-auto"
                                    src="/logo.png"
                                    alt="Logo"
                                />
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                {navigation.map((item) => {
                                    const isActive = location.pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={clsx(
                                                'inline-flex items-center px-1 pt-1 text-sm font-medium',
                                                isActive
                                                    ? 'border-b-2 border-primary-500 text-gray-900 dark:text-white'
                                                    : 'border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
                                            )}
                                        >
                                            <item.icon className="mr-2 h-5 w-5" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex items-center">
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};
