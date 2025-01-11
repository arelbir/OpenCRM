import React from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
    type ColumnDef,
    type SortingState,
} from '@tanstack/react-table';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface TableProps<TData> {
    data: TData[];
    columns: ColumnDef<TData, unknown>[];
    pageSize?: number;
    isLoading?: boolean;
    onRowClick?: (row: TData) => void;
}

export function Table<TData>({
    data,
    columns,
    pageSize = 10,
    isLoading,
    onRowClick,
}: TableProps<TData>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        initialState: {
            pagination: {
                pageSize,
            },
        },
    });

    if (isLoading) {
        return (
            <div className="animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="h-12 bg-gray-100 dark:bg-gray-800 rounded mb-2"
                    ></div>
                ))}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    scope="col"
                                    className="group px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                    onClick={header.column.getToggleSortingHandler()}
                                    style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                                        <span className="relative flex items-center">
                                            {header.column.getIsSorted() && (
                                                <span
                                                    className={`ml-2 flex-none rounded ${
                                                        header.column.getIsSorted() === 'desc'
                                                            ? 'rotate-180'
                                                            : ''
                                                    }`}
                                                >
                                                    ▲
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {table.getRowModel().rows.map((row) => (
                        <tr
                            key={row.id}
                            onClick={() => onRowClick?.(row.original)}
                            className={clsx(
                                'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200',
                                onRowClick && 'cursor-pointer'
                            )}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td
                                    key={cell.id}
                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300"
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                    <button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Showing{' '}
                            <span className="font-medium">{table.getState().pagination.pageIndex * pageSize + 1}</span>
                            {' to '}
                            <span className="font-medium">
                                {Math.min((table.getState().pagination.pageIndex + 1) * pageSize, data.length)}
                            </span>
                            {' of '}
                            <span className="font-medium">{data.length}</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                            >
                                <span className="sr-only">Previous</span>
                                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
                            >
                                <span className="sr-only">Next</span>
                                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
            {data.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Veri bulunamadı
                </div>
            )}
        </div>
    );
}
