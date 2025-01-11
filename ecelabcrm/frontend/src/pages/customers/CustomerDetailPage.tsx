import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { customerService } from '../../services/customerService';
import { Card } from '../../components/common';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export const CustomerDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: customer, isLoading } = useQuery({
        queryKey: ['customer', id],
        queryFn: () => customerService.getById(Number(id)),
        enabled: !!id,
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!customer) {
        return <div>Customer not found</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-1" />
                    Back
                </button>
                <h1 className="text-2xl font-semibold text-gray-900">
                    {customer.CompanyName}
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card title="Contact Information">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Contact Name</dt>
                            <dd className="mt-1 text-sm text-gray-900">{customer.ContactName}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Contact Title</dt>
                            <dd className="mt-1 text-sm text-gray-900">{customer.ContactTitle}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Phone</dt>
                            <dd className="mt-1 text-sm text-gray-900">{customer.Phone}</dd>
                        </div>
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Fax</dt>
                            <dd className="mt-1 text-sm text-gray-900">{customer.Fax}</dd>
                        </div>
                    </dl>
                </Card>

                <Card title="Address">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
                        <div>
                            <dt className="text-sm font-medium text-gray-500">Street</dt>
                            <dd className="mt-1 text-sm text-gray-900">{customer.Address}</dd>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">City</dt>
                                <dd className="mt-1 text-sm text-gray-900">{customer.City}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Region</dt>
                                <dd className="mt-1 text-sm text-gray-900">{customer.Region}</dd>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Postal Code</dt>
                                <dd className="mt-1 text-sm text-gray-900">{customer.PostalCode}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Country</dt>
                                <dd className="mt-1 text-sm text-gray-900">{customer.Country}</dd>
                            </div>
                        </div>
                    </dl>
                </Card>
            </div>
        </div>
    );
};
