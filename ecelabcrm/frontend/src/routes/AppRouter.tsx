import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import {
    DashboardPage,
    CustomersPage,
    CustomerDetailPage,
    ProductsPage,
    QuotationsPage,
    QuotationDetailPage,
    QuotationFormPage,
    RemindersPage
} from '../pages';

export const AppRouter: React.FC = () => {
    return (
        <Routes>
            <Route element={<MainLayout><Outlet /></MainLayout>}>
                {/* Dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<DashboardPage />} />

                {/* Customers */}
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/customers/:id" element={<CustomerDetailPage />} />

                {/* Products */}
                <Route path="/products" element={<ProductsPage />} />

                {/* Quotations */}
                <Route path="/quotations" element={<QuotationsPage />} />
                <Route path="/quotations/new" element={<QuotationFormPage />} />
                <Route path="/quotations/:id" element={<QuotationDetailPage />} />
                <Route path="/quotations/:id/edit" element={<QuotationFormPage />} />

                {/* Reminders */}
                <Route path="/reminders" element={<RemindersPage />} />

                {/* 404 - Not Found */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
        </Routes>
    );
};
