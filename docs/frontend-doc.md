# Frontend Dokümantasyonu

## Proje Yapısı

```
src/
├── components/
│   ├── common/              # Ortak kullanılan bileşenler
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Table.tsx
│   │   ├── Modal.tsx
│   │   └── Loading.tsx
│   ├── customers/           # Müşteri ile ilgili bileşenler
│   │   ├── CustomerList.tsx
│   │   ├── CustomerForm.tsx
│   │   └── CustomerCard.tsx
│   ├── stock/              # Stok ile ilgili bileşenler
│   │   ├── StockList.tsx
│   │   ├── ExcelUpload.tsx
│   │   └── StockAlert.tsx
│   └── quotations/         # Teklif ile ilgili bileşenler
│       ├── QuotationForm.tsx
│       └── QuotationPDF.tsx
├── hooks/                  # Custom React hooks
│   ├── useCustomers.ts
│   ├── useStock.ts
│   └── useQuotations.ts
├── services/              # API servisleri
│   ├── api.ts
│   ├── customerService.ts
│   └── stockService.ts
├── utils/                 # Yardımcı fonksiyonlar
│   ├── formatters.ts
│   └── validators.ts
└── pages/                 # Sayfa bileşenleri
    ├── Dashboard.tsx
    ├── Customers.tsx
    └── Stock.tsx
```

## Temel Bileşenler

### 1. Layout Bileşenleri
```typescript
// components/common/Layout.tsx
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export const Layout: React.FC = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};
```

### 2. Veri Tablosu
```typescript
// components/common/Table.tsx
import React from 'react';
import {
    useTable,
    usePagination,
    useSortBy
} from '@tanstack/react-table';

interface TableProps {
    columns: any[];
    data: any[];
    onRowClick?: (row: any) => void;
}

export const Table: React.FC<TableProps> = ({
    columns,
    data,
    onRowClick
}) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow
    } = useTable(
        {
            columns,
            data,
        },
        useSortBy,
        usePagination
    );

    return (
        <div className="overflow-x-auto">
            <table {...getTableProps()} className="min-w-full">
                {/* Table içeriği */}
            </table>
        </div>
    );
};
```

## Sayfa Örnekleri

### 1. Müşteri Listesi
```typescript
// pages/Customers.tsx
import React from 'react';
import { CustomerList } from '../components/customers/CustomerList';
import { useCustomers } from '../hooks/useCustomers';

export const CustomersPage: React.FC = () => {
    const { customers, loading, error } = useCustomers();

    if (loading) return <div>Yükleniyor...</div>;
    if (error) return <div>Hata: {error}</div>;

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Müşteriler</h1>
            <CustomerList customers={customers} />
        </div>
    );
};
```

## Custom Hooks

### 1. Müşteri Hook'u
```typescript
// hooks/useCustomers.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { customerService } from '../services/customerService';

export const useCustomers = () => {
    const query = useQuery({
        queryKey: ['customers'],
        queryFn: customerService.getCustomers
    });

    const createMutation = useMutation({
        mutationFn: customerService.createCustomer
    });

    return {
        customers: query.data,
        loading: query.isLoading,
        error: query.error,
        createCustomer: createMutation.mutate
    };
};
```

## Form Yönetimi

### 1. Müşteri Formu
```typescript
// components/customers/CustomerForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { Customer } from '../../types';

interface CustomerFormProps {
    onSubmit: (data: Customer) => void;
    initialData?: Customer;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
    onSubmit,
    initialData
}) => {
    const { register, handleSubmit, errors } = useForm({
        defaultValues: initialData
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Form alanları */}
        </form>
    );
};
```

## Excel İşlemleri

### 1. Excel Upload
```typescript
// components/stock/ExcelUpload.tsx
import React from 'react';
import * as XLSX from 'xlsx';

export const ExcelUpload: React.FC = () => {
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'array' });
                // Excel işlemleri
            };
            reader.readAsArrayBuffer(file);
        }
    };

    return (
        <div>
            <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
            />
        </div>
    );
};
```

## PDF Oluşturma

### 1. Teklif PDF'i
```typescript
// components/quotations/QuotationPDF.tsx
import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet
} from '@react-pdf/renderer';

export const QuotationPDF: React.FC<{ data: any }> = ({ data }) => {
    return (
        <Document>
            <Page size="A4">
                {/* PDF içeriği */}
            </Page>
        </Document>
    );
};
```

## Bildirim Sistemi

```typescript
// components/common/Notification.tsx
import React from 'react';
import { Transition } from '@headlessui/react';

interface NotificationProps {
    message: string;
    type: 'success' | 'error' | 'warning';
    isVisible: boolean;
}

export const Notification: React.FC<NotificationProps> = ({
    message,
    type,
    isVisible
}) => {
    return (
        <Transition
            show={isVisible}
            enter="transform ease-out duration-300"
            enterFrom="translate-y-2 opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className={`notification ${type}`}>
                {message}
            </div>
        </Transition>
    );
};
```

## Stil Yönetimi

### Tailwind Konfigürasyonu
```javascript
// tailwind.config.js
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#1e40af',
                secondary: '#1e293b',
            },
            spacing: {
                '72': '18rem',
                '84': '21rem',
                '96': '24rem',
            }
        }
    },
    plugins: [
        require('@tailwindcss/forms')
    ]
};
```
