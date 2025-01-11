import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    HomeIcon,
    UserGroupIcon,
    CubeIcon,
    DocumentTextIcon,
    BellIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import { ThemeToggle } from '../common';
import clsx from 'clsx';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Müşteriler', href: '/customers', icon: UserGroupIcon },
    { name: 'Ürünler', href: '/products', icon: CubeIcon },
    { name: 'Teklifler', href: '/quotations', icon: DocumentTextIcon },
    { name: 'Hatırlatıcılar', href: '/reminders', icon: BellIcon },
];

interface MainLayoutProps {
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        {/* Logo ve Navigasyon */}
                        <div className="flex">
                            <div className="flex flex-shrink-0 items-center">
                                <img
                                    className="h-8 w-auto"
                                    src="/logo.png"
                                    alt="Logo"
                                />
                            </div>
                            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                {navigation.map((item) => {
                                    const isActive = location.pathname === item.href;
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className={clsx(
                                                'inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2',
                                                isActive
                                                    ? 'border-primary-500 text-gray-900 dark:text-white'
                                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300'
                                            )}
                                        >
                                            <item.icon className="mr-2 h-5 w-5" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Sağ Taraf - Kullanıcı ve Tema */}
                        <div className="flex items-center space-x-4">
                            {/* Tema Değiştirme */}
                            <ThemeToggle />

                            {/* Kullanıcı Menüsü */}
                            <div className="relative">
                                <button
                                    type="button"
                                    className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                >
                                    <span className="sr-only">Kullanıcı menüsü</span>
                                    <UserCircleIcon className="h-8 w-8" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Ana İçerik */}
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
};
